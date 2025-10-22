import { Container, Row, Col, Card, Alert } from "react-bootstrap";

function CredentialNotFound() {
  return (
    <Container className="verification-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="verification-card">
            <Card.Body>
              <Alert variant="warning">
                <Alert.Heading>Credential Not Found</Alert.Heading>
                <p>
                  The credential you're looking for doesn't exist or has been
                  removed.
                </p>
                <hr />
                <p className="mb-0">
                  Please verify the link and try again, or request a new
                  credential from the student.
                </p>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CredentialNotFound;
