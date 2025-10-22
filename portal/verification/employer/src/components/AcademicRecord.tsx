import { Table, Card, Badge, Row, Col } from "react-bootstrap";

interface AcademicResult {
  courseName: string;
  courseCode: string;
  university: string;
  degreeCourse: string;
  grade: string;
  date: string;
  ects: number;
  certificateCid: string;
}

interface AcademicRecordProps {
  results: AcademicResult[];
}

function AcademicRecord({ results }: AcademicRecordProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGradeColor = (grade: string) => {
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 4.0) return "success";
    if (numericGrade >= 3.0) return "warning";
    return "danger";
  };

  return (
    <Card className="academic-record-card">
      <Card.Header>
        <h5 className="mb-0">Academic Record</h5>
      </Card.Header>
      <Card.Body>
        {results.length === 0 ? (
          <p className="text-muted">No academic results available</p>
        ) : (
          <div className="table-responsive">
            <Table hover className="academic-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Code</th>
                  <th>Grade</th>
                  <th>ECTS</th>
                  <th>Date</th>
                  <th>Degree Course</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>
                      <div className="course-name">{result.courseName}</div>
                    </td>
                    <td>
                      <code className="course-code">{result.courseCode}</code>
                    </td>
                    <td>
                      <Badge
                        bg={getGradeColor(result.grade)}
                        className="grade-badge"
                      >
                        {result.grade}
                      </Badge>
                    </td>
                    <td>
                      <span className="ects-points">{result.ects}</span>
                    </td>
                    <td>
                      <span className="course-date">
                        {formatDate(result.date)}
                      </span>
                    </td>
                    <td>
                      <span className="degree-course">
                        {result.degreeCourse}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {results.length > 0 && (
          <div className="academic-summary mt-3">
            <Row>
              <Col md={6}>
                <div className="summary-item">
                  <strong>Total Courses:</strong> {results.length}
                </div>
              </Col>
              <Col md={6}>
                <div className="summary-item">
                  <strong>Total ECTS:</strong>{" "}
                  {results.reduce((sum, result) => sum + result.ects, 0)}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default AcademicRecord;
