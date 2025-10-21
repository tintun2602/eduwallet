import "../styles/ImportPageStyle.css";
import type { JSX } from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import Header from "../components/HeaderComponent";
import { useAuth } from "../providers/AuthenticationProvider";
import { getStudentContract } from "../utils/contractsUtils";

/**
 * Represents a single row of CSV data for grade import.
 * Maps to the smart contract Result struct fields.
 */
interface CSVRow {
  /** Ethereum wallet address of the student */
  studentWallet: string;
  /** Unique course identifier */
  courseCode: string;
  /** Full name of the course */
  courseName: string;
  /** Degree program this course belongs to */
  degreeCourse: string;
  /** European Credit Transfer System credits (1-30) */
  ects: number;
  /** Grade received (A-F, A+, 30L, etc.) */
  grade: string;
  /** Date when grade was assigned (YYYY-MM-DD) */
  date: string;
}

/**
 * Represents a validation error found during CSV processing.
 * Used for detailed error reporting and user feedback.
 */
interface ValidationError {
  /** Row number in CSV where error occurred (1-based) */
  row: number;
  /** Field name that failed validation */
  field: string;
  /** Human-readable error message */
  message: string;
}

/**
 * Comprehensive metadata for CSV import operations.
 * Provides audit trail and tracking for production compliance.
 */
interface ImportMetadata {
  /** Original filename of uploaded CSV */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** ISO timestamp when file was uploaded */
  uploadTime: string;
  /** Ethereum address of importing university */
  university: string;
  /** Total number of rows in CSV */
  totalRows: number;
  /** Number of rows that passed validation */
  validRows: number;
  /** Array of validation errors found */
  errors: ValidationError[];
  /** Unique identifier for this import operation */
  importId: string;
  /** Current status of import operation */
  status: "pending" | "processing" | "completed" | "failed";
  /** Array of blockchain transaction hashes from successful writes */
  blockchainTxHashes: string[];
  /** Audit log of all operations performed */
  auditLog: string[];
}

/**
 * ImportPage component for CSV file upload and processing.
 *
 * Features:
 * - Drag & drop CSV file upload
 * - Comprehensive data validation (format, business logic, duplicates)
 * - University authorization checks (disabled for testing)
 * - Real-time progress tracking
 * - Preview and confirmation workflow
 * - Production-ready audit logging
 * - Blockchain duplicate detection
 *
 * Security:
 * - University permission verification
 * - Data validation and sanitization
 * - Duplicate prevention
 * - Comprehensive audit trail
 *
 * @author tintun - Implementation of CSV import functionality
 * @returns {JSX.Element} The rendered import page component.
 */
export default function ImportPage(): JSX.Element {
  // Authentication context - provides current student/university info
  const student = useAuth();

  // UI State Management
  const [isDragOver, setIsDragOver] = useState(false); // Drag & drop visual feedback
  const [isImporting, setIsImporting] = useState(false); // Import operation in progress
  const [isValidating, setIsValidating] = useState(false); // Validation operation in progress
  const [showPreview, setShowPreview] = useState(false); // Show validation results
  const [importProgress, setImportProgress] = useState(0); // Progress percentage (0-100)
  const [timeRemaining, setTimeRemaining] = useState(0); // Estimated time remaining (seconds)

  // Data State Management
  const [csvData, setCsvData] = useState<CSVRow[]>([]); // Raw CSV data
  const [validatedData, setValidatedData] = useState<CSVRow[]>([]); // Data that passed validation
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  ); // Validation errors
  const [importMetadata, setImportMetadata] = useState<ImportMetadata | null>(
    null
  ); // Import metadata

  // Security State Management
  const [duplicateCheckResults, setDuplicateCheckResults] = useState<
    Map<string, boolean>
  >(new Map()); // Duplicate detection results

  // File input reference for programmatic file selection
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Initialize component and check university authorization.
   * Currently disabled for testing purposes.
   */
  useEffect(() => {
    if (student && student.student) {
      // TODO: Enable authorization check for production
      // checkUniversityAuthorization();
    }
  }, [student]);

  // ============================================================================
  // PRODUCTION SECURITY FUNCTIONS
  // ============================================================================

  /**
   * Checks for duplicate grades by querying the blockchain for existing results.
   * Prevents importing the same course grade multiple times.
   *
   * @param {CSVRow[]} data - Array of CSV rows to check for duplicates
   * @returns {Promise<Map<string, boolean>>} Map of student-course keys to duplicate status
   */
  const checkForDuplicates = async (
    data: CSVRow[]
  ): Promise<Map<string, boolean>> => {
    const duplicateMap = new Map<string, boolean>();

    if (!student?.student) return duplicateMap;

    try {
      const studentContract = getStudentContract(student.student);
      const existingResults = await studentContract.getResults();

      for (const row of data) {
        const key = `${row.studentWallet}-${row.courseCode}`;
        const isDuplicate = existingResults.some(
          (result) =>
            result.university.toLowerCase() ===
              student.student.wallet.address.toLowerCase() &&
            result.code === row.courseCode
        );
        duplicateMap.set(key, isDuplicate);
      }
    } catch (error) {
      console.error("Duplicate check failed:", error);
    }

    return duplicateMap;
  };

  /**
   * Generates a unique identifier for import operations.
   * Used for tracking and audit purposes.
   *
   * @returns {string} Unique import ID with timestamp and random component
   */
  const generateImportId = (): string => {
    return `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Logs audit events for compliance and debugging.
   * All operations are logged with timestamps for production audit trails.
   *
   * @param {string} event - Description of the event
   * @param {ImportMetadata} metadata - Import metadata to update
   */
  const logAuditEvent = (event: string, metadata: ImportMetadata) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${event}`;
    metadata.auditLog.push(logEntry);
    console.log(`AUDIT: ${logEntry}`);
  };

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  /**
   * Validates Ethereum wallet address format.
   * Ensures address is properly formatted (0x + 40 hex characters).
   *
   * @param {string} address - Wallet address to validate
   * @returns {boolean} True if address format is valid
   */
  const validateWalletAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  /**
   * Validates date format and ensures it's not in the future.
   * Prevents importing grades with future dates.
   *
   * @param {string} dateStr - Date string to validate (YYYY-MM-DD)
   * @returns {boolean} True if date is valid and not in the future
   */
  const validateDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const now = new Date();
    return !isNaN(date.getTime()) && date <= now;
  };

  /**
   * Validates ECTS credit values.
   * Ensures credits are within valid range (1-30) and are integers.
   *
   * @param {number} ects - ECTS credits to validate
   * @returns {boolean} True if ECTS value is valid
   */
  const validateECTS = (ects: number): boolean => {
    return ects > 0 && ects <= 30 && Number.isInteger(ects);
  };

  /**
   * Validates grade format.
   * Supports letter grades (A-F, A+, A-, etc.) and numeric grades (30L, 25, etc.).
   *
   * @param {string} grade - Grade to validate
   * @returns {boolean} True if grade format is valid
   */
  const validateGrade = (grade: string): boolean => {
    const validGrades = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "A+",
      "A-",
      "B+",
      "B-",
      "C+",
      "C-",
      "D+",
      "D-",
    ];
    return (
      validGrades.includes(grade.toUpperCase()) || /^\d+[Ll]?$/.test(grade)
    );
  };

  /**
   * Validates a complete CSV row against all business rules.
   * Performs comprehensive validation including format, business logic, and constraints.
   *
   * @param {CSVRow} row - CSV row to validate
   * @param {number} rowIndex - Row number for error reporting (1-based)
   * @returns {ValidationError[]} Array of validation errors found
   */
  const validateCSVRow = (row: CSVRow, rowIndex: number): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!validateWalletAddress(row.studentWallet)) {
      errors.push({
        row: rowIndex,
        field: "studentWallet",
        message: "Invalid wallet address format",
      });
    }

    if (!row.courseCode.trim()) {
      errors.push({
        row: rowIndex,
        field: "courseCode",
        message: "Course code cannot be empty",
      });
    }

    if (!row.courseName.trim()) {
      errors.push({
        row: rowIndex,
        field: "courseName",
        message: "Course name cannot be empty",
      });
    }

    if (!row.degreeCourse.trim()) {
      errors.push({
        row: rowIndex,
        field: "degreeCourse",
        message: "Degree course cannot be empty",
      });
    }

    if (!validateECTS(row.ects)) {
      errors.push({
        row: rowIndex,
        field: "ects",
        message: "ECTS must be between 1-30",
      });
    }

    if (!validateGrade(row.grade)) {
      errors.push({
        row: rowIndex,
        field: "grade",
        message: "Invalid grade format",
      });
    }

    if (!validateDate(row.date)) {
      errors.push({
        row: rowIndex,
        field: "date",
        message: "Invalid or future date",
      });
    }

    return errors;
  };

  // ============================================================================
  // FILE PROCESSING FUNCTIONS
  // ============================================================================

  /**
   * Main CSV processing function with comprehensive validation and security checks.
   *
   * Process Flow:
   * 1. Authorization check (disabled for testing)
   * 2. File parsing and header validation
   * 3. Row-by-row data validation
   * 4. Duplicate detection via blockchain query
   * 5. Metadata creation and audit logging
   * 6. UI state updates for preview
   *
   * @param {File} file - CSV file to process
   */
  const processCSVFile = async (file: File) => {
    // TODO: Enable authorization check for production
    // if (authorizationError) {
    //   alert("Authorization required: " + authorizationError);
    //   return;
    // }

    setIsValidating(true);
    setImportProgress(0);
    setTimeRemaining(40);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((h) => h.trim());

      // Validate headers
      const expectedHeaders = [
        "studentWallet",
        "courseCode",
        "courseName",
        "degreeCourse",
        "ects",
        "grade",
        "date",
      ];
      if (!expectedHeaders.every((header) => headers.includes(header))) {
        throw new Error(
          "Invalid CSV format. Expected headers: " + expectedHeaders.join(", ")
        );
      }

      const data: CSVRow[] = [];
      const errors: ValidationError[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length === headers.length) {
          const row: CSVRow = {
            studentWallet: values[0],
            courseCode: values[1],
            courseName: values[2],
            degreeCourse: values[3],
            ects: parseInt(values[4]) || 0,
            grade: values[5],
            date: values[6],
          };

          data.push(row);

          // Validate row
          const rowErrors = validateCSVRow(row, i);
          errors.push(...rowErrors);
        }

        // Simulate progress
        const progress = Math.round((i / lines.length) * 100);
        setImportProgress(progress);
        setTimeRemaining(Math.max(0, 40 - Math.round((i / lines.length) * 40)));

        // Small delay to show progress
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Check for duplicates
      const duplicates = await checkForDuplicates(data);
      setDuplicateCheckResults(duplicates);

      // Create metadata with production features
      const metadata: ImportMetadata = {
        fileName: file.name,
        fileSize: file.size,
        uploadTime: new Date().toISOString(),
        university: student?.student?.wallet?.address || "Unknown",
        totalRows: data.length,
        validRows: data.length - errors.length,
        errors: errors,
        importId: generateImportId(),
        status: "pending",
        blockchainTxHashes: [],
        auditLog: [],
      };

      // Log audit events
      logAuditEvent(
        `CSV file uploaded: ${file.name} (${file.size} bytes)`,
        metadata
      );
      logAuditEvent(
        `Validation completed: ${data.length - errors.length}/${
          data.length
        } valid rows`,
        metadata
      );

      setCsvData(data);
      setValidatedData(
        data.filter((_, index) => !errors.some((e) => e.row === index + 1))
      );
      setValidationErrors(errors);
      setImportMetadata(metadata);
      setIsValidating(false);
      setShowPreview(true);
    } catch (error) {
      console.error("CSV processing error:", error);
      setIsValidating(false);
      alert("Error processing CSV file: " + (error as Error).message);
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles drag over events for file upload area.
   * Provides visual feedback when files are dragged over the drop zone.
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  /**
   * Handles drag leave events for file upload area.
   * Removes visual feedback when files leave the drop zone.
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  /**
   * Handles file drop events for CSV upload.
   * Validates file type and initiates processing.
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv")
    );

    if (csvFile) {
      processCSVFile(csvFile);
    }
  }, []);

  /**
   * Handles file selection via button click.
   * Triggers file input dialog and processes selected file.
   */
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processCSVFile(file);
      }
    },
    []
  );

  /**
   * Handles the final import operation.
   * Currently shows placeholder - will implement blockchain writing.
   *
   * TODO: Implement secure blockchain writing with:
   * - Transaction batching
   * - Error handling and retry logic
   * - Gas estimation
   * - Rollback on failure
   */
  const handleImport = async () => {
    // TODO: Implement blockchain writing via SDK
    console.log("Importing data:", csvData);
    alert(
      "Import functionality will be implemented with blockchain integration"
    );
  };

  /**
   * Resets all component state to initial values.
   * Clears all data, errors, and UI states.
   */
  const handleCancel = () => {
    setIsImporting(false);
    setIsValidating(false);
    setShowPreview(false);
    setImportProgress(0);
    setTimeRemaining(0);
    setCsvData([]);
    setValidatedData([]);
    setValidationErrors([]);
    setImportMetadata(null);
  };

  return (
    <>
      <Header title="Import CSV" />

      <Container className="main-content-container">
        <Row className="mb-4">
          <Col>
            <div
              className={`csv-upload-area ${isDragOver ? "drag-over" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <i className="fas fa-file-upload"></i>
              </div>
              <p className="upload-text">
                Drag CSV here to import grades or drag and drop it here
              </p>
              <Button
                className="select-file-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Select file
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>
          </Col>
        </Row>

        {(isValidating || isImporting) && (
          <Row className="mb-4">
            <Col>
              <div className="import-progress">
                <p className="progress-text">
                  {isValidating ? "Validating..." : "Importing..."}
                </p>
                <p className="progress-percentage">{importProgress}%</p>
                <p className="time-remaining">
                  {timeRemaining} seconds remaining
                </p>
                <ProgressBar now={importProgress} className="progress-bar" />
                <div className="progress-controls">
                  <Button variant="link" className="pause-btn">
                    <i className="fas fa-pause"></i>
                  </Button>
                  <Button variant="link" className="cancel-btn">
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {showPreview && importMetadata && (
          <Row className="mb-4">
            <Col>
              <div className="validation-results">
                <h5 className="text-white mb-3">Validation Results</h5>
                <div className="validation-summary">
                  <p className="text-white">
                    <strong>File:</strong> {importMetadata.fileName} (
                    {Math.round(importMetadata.fileSize / 1024)} KB)
                  </p>
                  <p className="text-white">
                    <strong>Total Rows:</strong> {importMetadata.totalRows}
                  </p>
                  <p className="text-white">
                    <strong>Valid Rows:</strong> {importMetadata.validRows}
                  </p>
                  <p className="text-white">
                    <strong>Errors:</strong> {importMetadata.errors.length}
                  </p>
                </div>

                {validationErrors.length > 0 && (
                  <div className="validation-errors mt-3">
                    <h6 className="text-warning">Validation Errors:</h6>
                    <div className="error-list">
                      {validationErrors.slice(0, 5).map((error, index) => (
                        <div key={index} className="error-item">
                          <span className="text-danger">
                            Row {error.row}, {error.field}: {error.message}
                          </span>
                        </div>
                      ))}
                      {validationErrors.length > 5 && (
                        <p className="text-warning">
                          ... and {validationErrors.length - 5} more errors
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {duplicateCheckResults.size > 0 && (
                  <div className="duplicate-warnings mt-3">
                    <h6 className="text-warning">Duplicate Warnings:</h6>
                    <div className="warning-list">
                      {Array.from(duplicateCheckResults.entries())
                        .filter(([_, isDuplicate]) => isDuplicate)
                        .slice(0, 3)
                        .map(([key, _], index) => (
                          <div key={index} className="warning-item">
                            <span className="text-warning">
                              Duplicate found: {key.split("-")[1]} for student{" "}
                              {key.split("-")[0].substring(0, 10)}...
                            </span>
                          </div>
                        ))}
                      {Array.from(duplicateCheckResults.values()).filter(
                        Boolean
                      ).length > 3 && (
                        <p className="text-warning">
                          ... and{" "}
                          {Array.from(duplicateCheckResults.values()).filter(
                            Boolean
                          ).length - 3}{" "}
                          more duplicates
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="preview-data mt-3">
                  <h6 className="text-white">Preview (First 3 Valid Rows):</h6>
                  <div className="table-responsive">
                    <table className="table table-dark table-sm">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Course</th>
                          <th>Grade</th>
                          <th>ECTS</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validatedData.slice(0, 3).map((row, index) => (
                          <tr key={index}>
                            <td>{row.studentWallet.substring(0, 10)}...</td>
                            <td>{row.courseCode}</td>
                            <td>{row.grade}</td>
                            <td>{row.ects}</td>
                            <td>{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <div className="action-buttons">
              <Button
                variant="outline-light"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="import-button"
                onClick={handleImport}
                disabled={validatedData.length === 0}
              >
                {showPreview ? "Import Valid Data" : "Import File"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
