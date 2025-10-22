import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { getStudentFromBlockchain } from "../services/blockchainService";

function DownloadCredential() {
  const { credentialId } = useParams<{ credentialId: string }>();
  const [searchParams] = useSearchParams();
  const studentAddress = searchParams.get("address");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);

        if (!studentAddress) {
          setError("Student address not provided");
          return;
        }

        const student = await getStudentFromBlockchain(studentAddress);

        if (!student) {
          setError("Student not found");
          return;
        }

        setStudentData(student);
      } catch (err) {
        setError("Failed to load student data");
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentAddress]);

  const generatePDF = () => {
    if (!studentData) return;

    // Simple PDF generation using browser's print functionality
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Academic Credential - ${studentData.name} ${
        studentData.surname
      }</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .university { font-size: 24px; font-weight: bold; color: #1e3a8a; }
            .student-info { margin-bottom: 30px; }
            .info-row { margin-bottom: 10px; }
            .label { font-weight: bold; display: inline-block; width: 150px; }
            .results { margin-top: 30px; }
            .result-row { border-bottom: 1px solid #ddd; padding: 10px 0; }
            .course-name { font-weight: bold; }
            .course-code { color: #666; font-size: 14px; }
            .grade { font-weight: bold; color: #28a745; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="university">${
              studentData.results[0]?.university || "University"
            }</div>
            <h2>Academic Credential</h2>
          </div>
          
          <div class="student-info">
            <div class="info-row"><span class="label">Name:</span> ${
              studentData.name
            } ${studentData.surname}</div>
            <div class="info-row"><span class="label">Student ID:</span> ${
              studentData.id
            }</div>
            <div class="info-row"><span class="label">Date of Birth:</span> ${
              studentData.birthDate
            }</div>
            <div class="info-row"><span class="label">Place of Birth:</span> ${
              studentData.birthPlace
            }</div>
            <div class="info-row"><span class="label">Country:</span> ${
              studentData.country
            }</div>
          </div>

          <div class="results">
            <h3>Academic Results</h3>
            ${studentData.results
              .map(
                (result: any) => `
              <div class="result-row">
                <div class="course-name">${result.name}</div>
                <div class="course-code">${result.code} - ${result.degreeCourse}</div>
                <div>Grade: <span class="grade">${result.grade}</span> | ECTS: ${result.ects} | Date: ${result.date}</div>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="footer">
            <p>This credential was generated on ${new Date().toLocaleDateString()}</p>
            <p>Blockchain Address: ${studentData.contractAddress}</p>
            <p>Credential ID: ${credentialId}</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <Container className="verification-container">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="verification-card">
              <Card.Body className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Preparing credential download...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error || !studentData) {
    return (
      <Container className="verification-container">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="verification-card">
              <Card.Body>
                <Alert variant="danger">
                  <Alert.Heading>Download Failed</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="verification-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="verification-card">
            <Card.Header className="text-center">
              <h4>Academic Credential Ready</h4>
              <p className="mb-0">
                {studentData.name} {studentData.surname}
              </p>
            </Card.Header>

            <Card.Body className="text-center">
              <p>
                Click the button below to download the academic credential as a
                PDF.
              </p>

              <Button
                variant="primary"
                size="lg"
                onClick={generatePDF}
                className="mb-3"
              >
                Download PDF Credential
              </Button>

              <div className="mt-4">
                <small className="text-muted">
                  This link expires based on the student's settings.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DownloadCredential;
