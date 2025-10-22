import "../styles/SharePageStyle.css";

import type { JSX } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Header from "../components/HeaderComponent";
import { createShareableData, createVerificationUrl } from "../API";
import { useAuth } from "../providers/AuthenticationProvider";

/**
 * SharePage component displays credential sharing options.
 * @author tintun - Implementation of credential sharing functionality
 * @returns {JSX.Element} The rendered share page component.
 */
export default function SharePage(): JSX.Element {
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const { student } = useAuth();

  // State for sharing
  const [verificationUrl, setVerificationUrl] = useState<string>("");
  const [accessDuration, setAccessDuration] = useState<string>("24h");
  const [expirationTime, setExpirationTime] = useState<Date | null>(null);

  // Calculate expiration time based on duration
  const calculateExpirationTime = (duration: string): Date => {
    const now = new Date();
    switch (duration) {
      case "1h":
        return new Date(now.getTime() + 60 * 60 * 1000);
      case "24h":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case "7d":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case "30d":
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  };

  // Generate verification URL when student data or duration changes
  useEffect(() => {
    if (student) {
      const expiresAt = calculateExpirationTime(accessDuration);
      setExpirationTime(expiresAt);

      const shareData = createShareableData(student, [], expiresAt);

      // Generate verification URL
      const { url } = createVerificationUrl(shareData);
      setVerificationUrl(url);
    }
  }, [student, accessDuration]);

  // Generate QR code when verification URL changes
  useEffect(() => {
    if (qrCodeRef.current && verificationUrl) {
      QRCode.toCanvas(
        qrCodeRef.current,
        verificationUrl,
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
  }, [verificationUrl]);

  const handleCopyLink = () => {
    if (verificationUrl) {
      navigator.clipboard.writeText(verificationUrl);
    }
  };

  return (
    <>
      <Header title="Share" />
      <Container className="main-content-container">
        <Row className="mb-4">
          <Col>
            <p className="text-light">
              Share your academic credentials with employers through a
              downloadable PDF
            </p>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Label className="text-light">Access Duration</Form.Label>
            <Form.Select
              value={accessDuration}
              onChange={(e) => setAccessDuration(e.target.value)}
              className="share-input"
            >
              <option value="1h">1 Hour</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            {expirationTime && (
              <div className="text-light mt-4">
                <small>
                  <strong>Expires:</strong> {expirationTime.toLocaleString()}
                </small>
              </div>
            )}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button className="copy-button" onClick={handleCopyLink}>
              Copy Download Link
            </Button>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Button className="share-option-button w-100 d-flex justify-content-between align-items-center">
              <span>Send credential</span>
              <i className="fas fa-paper-plane text-purple"></i>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-light mb-3">
              Share your download link by having employers scan this QR code
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
