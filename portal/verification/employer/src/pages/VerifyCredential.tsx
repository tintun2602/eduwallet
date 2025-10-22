import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import UniversityBranding from "../components/UniversityBranding";
import CredentialDisplay from "../components/CredentialDisplay";
import VerificationStatus from "../components/VerificationStatus";
import AcademicRecord from "../components/AcademicRecord";
import { getStudentFromBlockchain } from "../services/blockchainService";

interface CredentialData {
  student: {
    name: string;
    surname: string;
    birthDate: string;
    birthPlace: string;
    country: string;
    studentId: string;
    walletAddress: string;
  };
  academicResults: Array<{
    courseName: string;
    courseCode: string;
    university: string;
    degreeCourse: string;
    grade: string;
    date: string;
    ects: number;
    certificateCid: string;
  }>;
  verification: {
    blockchainAddress: string;
    timestamp: string;
    expiresAt: string | null;
    dataHash: string;
    version: string;
  };
}

function VerifyCredential() {
  const { credentialId } = useParams<{ credentialId: string }>();
  const [searchParams] = useSearchParams();
  const studentAddress = searchParams.get("address");

  const [credentialData, setCredentialData] = useState<CredentialData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        setLoading(true);

        // Validate required parameters
        if (!credentialId) {
          setError("Invalid credential ID");
          return;
        }

        if (!studentAddress) {
          setError("Student blockchain address not provided");
          return;
        }

        // Fetch student data directly from blockchain
        const student = await getStudentFromBlockchain(studentAddress);

        if (!student) {
          setError("Student not found on blockchain");
          return;
        }

        // Transform blockchain data to credential format
        const credentialData: CredentialData = {
          student: {
            name: student.name,
            surname: student.surname,
            birthDate: student.birthDate,
            birthPlace: student.birthPlace,
            country: student.country,
            studentId: student.id,
            walletAddress: student.contractAddress,
          },
          academicResults: student.results.map((result: any) => ({
            courseName: result.name,
            courseCode: result.code,
            university: result.university,
            degreeCourse: result.degreeCourse,
            grade: result.grade,
            date: result.date,
            ects: result.ects,
            certificateCid: result.certificateCid,
          })),
          verification: {
            blockchainAddress: student.contractAddress,
            timestamp: new Date().toISOString(),
            expiresAt: null, // Blockchain data doesn't expire
            dataHash: "TODO: Calculate hash of the data",
            version: "1.0",
          },
        };

        setCredentialData(credentialData);
      } catch (err) {
        setError("Failed to load credential data from blockchain");
        console.error("Error fetching credential:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCredential();
  }, [credentialId, studentAddress]);

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
                <p className="mt-3">Verifying credential...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error || !credentialData) {
    return (
      <Container className="verification-container">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="verification-card">
              <Card.Body>
                <Alert variant="danger">
                  <Alert.Heading>Verification Failed</Alert.Heading>
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
        <Col md={10} lg={8}>
          <Card className="verification-card">
            <Card.Header className="verification-header">
              <UniversityBranding
                university={credentialData.academicResults[0]?.university}
              />
            </Card.Header>

            <Card.Body>
              <VerificationStatus
                isValid={true}
                expiresAt={credentialData.verification.expiresAt}
                blockchainAddress={
                  credentialData.verification.blockchainAddress
                }
              />

              <CredentialDisplay student={credentialData.student} />

              <AcademicRecord results={credentialData.academicResults} />
            </Card.Body>

            <Card.Footer className="verification-footer">
              <small className="text-muted">
                Verified on blockchain • {credentialData.verification.version}
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VerifyCredential;
