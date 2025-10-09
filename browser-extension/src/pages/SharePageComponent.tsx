import "../styles/SharePageStyle.css";

import type { JSX } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import Header from "../components/HeaderComponent";

/**
 * SharePage component displays credential sharing options.
 * @author tintun - Implementation of credential sharing functionality
 * @returns {JSX.Element} The rendered share page component.
 */
export default function SharePage(): JSX.Element {
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const shareUrl = "https://eduwallet.org/";

  useEffect(() => {
    if (qrCodeRef.current) {
      QRCode.toCanvas(
        qrCodeRef.current,
        shareUrl,
        {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("QR Code generation failed:", error);
        }
      );
    }
  }, [shareUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // You could add a toast notification here
  };

  return (
    <>
      {/* Header */}
      <Header title="Share" />

      {/* Instructions */}
      <Container>
        <Row className="mb-4">
          <Col>
            <p className="text-light">
              Public link created - Copy the link to share, add to your LinkedIn
              profile or send a json copy
            </p>
          </Col>
        </Row>

        {/* Public Link */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex">
              <Form.Control
                type="text"
                value={shareUrl}
                readOnly
                className="share-input me-2"
              />
              <Button className="copy-button" onClick={handleCopyLink}>
                copy
              </Button>
            </div>
          </Col>
        </Row>

        {/* Add to LinkedIn Profile */}
        <Row className="mb-3">
          <Col>
            <Button className="share-option-button w-100 d-flex justify-content-between align-items-center">
              <span>Add to LinkedIn Profile</span>
              <div className="linkedin-icon">in</div>
            </Button>
          </Col>
        </Row>

        {/* Send Credential */}
        <Row className="mb-4">
          <Col>
            <Button className="share-option-button w-100 d-flex justify-content-between align-items-center">
              <span>Send credential</span>
              <i className="fas fa-paper-plane text-purple"></i>
            </Button>
          </Col>
        </Row>

        {/* QR Code Section */}
        <Row>
          <Col>
            <p className="text-light mb-3">
              You may also share the public link by having another person scan
              this QR code
            </p>
            <div className="qr-code-container">
              <div className="qr-code-placeholder">
                <canvas ref={qrCodeRef} className="qr-canvas" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
