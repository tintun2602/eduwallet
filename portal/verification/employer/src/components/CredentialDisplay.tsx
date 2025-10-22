import { Row, Col, Card } from "react-bootstrap";

interface Student {
  name: string;
  surname: string;
  birthDate: string;
  birthPlace: string;
  country: string;
  studentId: string;
  walletAddress: string;
}

interface CredentialDisplayProps {
  student: Student;
}

function CredentialDisplay({ student }: CredentialDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="credential-display-card mb-4">
      <Card.Header>
        <h5 className="mb-0">Student Information</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <div className="student-info">
              <div className="info-item">
                <strong>Name:</strong> {student.name} {student.surname}
              </div>
              <div className="info-item">
                <strong>Student ID:</strong> {student.studentId}
              </div>
              <div className="info-item">
                <strong>Date of Birth:</strong> {formatDate(student.birthDate)}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="student-info">
              <div className="info-item">
                <strong>Place of Birth:</strong> {student.birthPlace}
              </div>
              <div className="info-item">
                <strong>Country:</strong> {student.country}
              </div>
              <div className="info-item">
                <strong>Wallet Address:</strong>
                <code className="ms-1">
                  {student.walletAddress.slice(0, 10)}...
                  {student.walletAddress.slice(-8)}
                </code>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CredentialDisplay;
