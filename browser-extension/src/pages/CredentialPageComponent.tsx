import "../styles/CredentialPageStyle.css";

import type { JSX } from "react";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useState } from "react";
import Header from "../components/HeaderComponent";

/**
 * CredentialPage component displays and manages academic credentials.
 * @author tintun - Implementation of credential management interface
 * @returns {JSX.Element} The rendered credential page component.
 */
export default function CredentialPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<
    "degrees" | "certificates" | "transcripts"
  >("degrees");

  // Mock credential data
  const credentials = {
    degrees: [
      {
        id: 1,
        type: "Bachelor's Degree",
        institution: "Norwegian University of Science and Technology",
        program: "Computer Science",
        issueDate: "2023-06-15",
        status: "verified",
        gpa: "3.8",
      },
    ],
    certificates: [
      {
        id: 2,
        type: "Professional Certificate",
        institution: "Coursera",
        program: "Machine Learning Specialization",
        issueDate: "2024-01-20",
        status: "verified",
        grade: "A+",
      },
      {
        id: 3,
        type: "Industry Certification",
        institution: "AWS",
        program: "Solutions Architect Associate",
        issueDate: "2024-03-10",
        status: "verified",
        score: "850/1000",
      },
    ],
    transcripts: [
      {
        id: 4,
        type: "Academic Transcript",
        institution: "Norwegian University of Science and Technology",
        program: "Bachelor's in Computer Science",
        issueDate: "2023-06-15",
        status: "verified",
        credits: "180 ECTS",
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge bg="success">Verified</Badge>;
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "expired":
        return <Badge bg="danger">Expired</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <>
      {/* Header */}
      <Header title="Credential" />

      <Container>
        {/* Page Description */}
        <Row className="mb-4">
          <Col>
            <p className="text-light">
              View and manage your verified academic records stored securely in
              EduWallet
            </p>
          </Col>
        </Row>

        {/* Tab Navigation */}
        <Row className="mb-4">
          <Col>
            <div className="credential-tabs">
              <Button
                className={`tab-button ${
                  activeTab === "degrees" ? "active" : ""
                }`}
                onClick={() => setActiveTab("degrees")}
              >
                Degrees
              </Button>
              <Button
                className={`tab-button ${
                  activeTab === "certificates" ? "active" : ""
                }`}
                onClick={() => setActiveTab("certificates")}
              >
                Certificates
              </Button>
              <Button
                className={`tab-button ${
                  activeTab === "transcripts" ? "active" : ""
                }`}
                onClick={() => setActiveTab("transcripts")}
              >
                Transcripts
              </Button>
            </div>
          </Col>
        </Row>

        {/* Credential Cards */}
        <Row>
          {credentials[activeTab].map((credential) => (
            <Col md={6} lg={4} key={credential.id} className="mb-3">
              <Card className="credential-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="credential-type">{credential.type}</h6>
                    {getStatusBadge(credential.status)}
                  </div>

                  <h5 className="institution-name mb-2">
                    {credential.institution}
                  </h5>
                  <p className="program-name mb-2">{credential.program}</p>

                  <div className="credential-details mb-3">
                    <small className="text-muted d-block">
                      Issued: {credential.issueDate}
                    </small>
                    {credential.gpa && (
                      <small className="text-muted d-block">
                        GPA: {credential.gpa}
                      </small>
                    )}
                    {credential.grade && (
                      <small className="text-muted d-block">
                        Grade: {credential.grade}
                      </small>
                    )}
                    {credential.score && (
                      <small className="text-muted d-block">
                        Score: {credential.score}
                      </small>
                    )}
                    {credential.credits && (
                      <small className="text-muted d-block">
                        Credits: {credential.credits}
                      </small>
                    )}
                  </div>

                  <div className="credential-actions">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      className="me-2"
                    >
                      Share
                    </Button>
                    <Button size="sm" variant="outline-secondary">
                      Download
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {credentials[activeTab].length === 0 && (
          <Row>
            <Col className="text-center">
              <div className="empty-state">
                <h5 className="text-muted">No {activeTab} found</h5>
                <p className="text-muted">
                  Your {activeTab} will appear here once they are verified and
                  added to your EduWallet.
                </p>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}
