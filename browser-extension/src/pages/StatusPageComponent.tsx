import "../styles/StatusPageStyle.css";

import type { JSX } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import Header from "../components/HeaderComponent";

/**
 * StatusPage component displays credential verification status.
 * @author tintun - Implementation of credential verification status display
 * @returns {JSX.Element} The rendered status page component.
 */
export default function StatusPage(): JSX.Element {
  return (
    <>
      {/* Header */}
      <Header title="Status" />

      {/* Credential verified card */}
      <Container>
        <Row className="mb-3">
          <Col>
            <div className="verification-card">
              <div className="d-flex align-items-center">
                <Image
                  src="/images/icons/check.svg"
                  alt="Check"
                  className="me-3"
                  width="24"
                  height="24"
                />
                <div>
                  <h5 className="mb-1">Credential verified</h5>
                  <small className="text-muted">
                    Last checked Oct 10, 2025
                  </small>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Issuer card */}
        <Row className="mb-3">
          <Col>
            <div className="verification-card">
              <h5 className="mb-2">Issuer</h5>
              <p className="mb-1">Is verified in</p>
              <div className="d-flex align-items-center">
                <Image
                  src="/images/icons/check.svg"
                  alt="Check"
                  className="me-2"
                  width="20"
                  height="20"
                />
                <span>Eduwallet</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Credential card */}
        <Row className="mb-4">
          <Col>
            <div className="verification-card">
              <h5 className="mb-2">Credential</h5>
              <div className="d-flex align-items-center mb-2">
                <Image
                  src="/images/icons/check.svg"
                  alt="Check"
                  className="me-2"
                  width="20"
                  height="20"
                />
                <span>Has a valid digital signature</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <Image
                  src="/images/icons/check.svg"
                  alt="Check"
                  className="me-2"
                  width="20"
                  height="20"
                />
                <span>Has not expired</span>
              </div>
              <div className="d-flex align-items-center">
                <Image
                  src="/images/icons/check.svg"
                  alt="Check"
                  className="me-2"
                  width="20"
                  height="20"
                />
                <span>Has not been revoked by issuer</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Information text */}
        <Row>
          <Col>
            <p className="text-light small">
              Eduwallet will periodically check the verification status of your
              credential. Please make sure you have connected to a network
              recently to ensure your credential can be verified. If you are
              still having problems. Please contact your issuing organization.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
