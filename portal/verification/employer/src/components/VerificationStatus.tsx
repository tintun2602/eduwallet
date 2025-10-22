import { Row, Col, Card } from "react-bootstrap";

interface VerificationStatusProps {
  isValid: boolean;
  expiresAt: string | null;
  blockchainAddress: string;
}

function VerificationStatus({
  isValid,
  expiresAt,
  blockchainAddress,
}: VerificationStatusProps) {
  const formatExpirationDate = (expiresAt: string | null) => {
    if (!expiresAt) return "No expiration";
    return new Date(expiresAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = () => {
    if (!isValid) return "danger";
    if (expiresAt && new Date(expiresAt) < new Date()) return "warning";
    return "success";
  };

  const getStatusText = () => {
    if (!isValid) return "Invalid Credential";
    if (expiresAt && new Date(expiresAt) < new Date()) return "Expired";
    return "Valid Credential";
  };

  return (
    <Card className="verification-status-card mb-4">
      <Card.Body>
        <Row>
          <Col md={6}>
            <div className="verification-status">
              <h6 className="mb-2">Verification Status</h6>
              <div className={`status-indicator status-${getStatusVariant()}`}>
                <span className="status-dot"></span>
                <span className="status-text">{getStatusText()}</span>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="verification-details">
              <h6 className="mb-2">Details</h6>
              <div className="detail-item">
                <strong>Expires:</strong> {formatExpirationDate(expiresAt)}
              </div>
              <div className="detail-item">
                <strong>Blockchain:</strong>
                <code className="ms-1">
                  {blockchainAddress.slice(0, 10)}...
                  {blockchainAddress.slice(-8)}
                </code>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default VerificationStatus;
