import "../styles/FooterStyle.css";
import type { JSX } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";

/**
 * Footer component renders the footer navigation menu.
 * @author Diego Da Giau - Original implementation
 * @author tintun - Added Share, Status, Credential, Import menu options
 * @returns {JSX.Element} The rendered footer component.
 */

export default function Footer(): JSX.Element {
  const location = useLocation();
  const menuOption = location.pathname.substring(1);

  const navigate: NavigateFunction = useNavigate();
  const changeMenu = (option: string) => {
    navigate("/" + option);
  };

  return (
    <>
      <footer className="container-fluid py-2">
        {/* First row: Wallet, Share, Status */}
        <Row className="mb-1">
          <Col>
            <Container
              className={
                "text-center" +
                " " +
                (menuOption === "wallet"
                  ? "selected-option"
                  : "not-selected-option")
              }
              onClick={() => changeMenu("wallet")}
            >
              <Row>
                <Col>
                  <Image src="images/icons/wallet.svg" />
                </Col>
              </Row>
              <Row>
                <Col>Wallet</Col>
              </Row>
            </Container>
          </Col>
          <Col>
            <Container
              className={
                "text-center" +
                " " +
                (menuOption === "share"
                  ? "selected-option"
                  : "not-selected-option")
              }
              onClick={() => changeMenu("share")}
            >
              <Row>
                <Col>
                  <Image src="images/icons/share.svg" />
                </Col>
              </Row>
              <Row>
                <Col>Share</Col>
              </Row>
            </Container>
          </Col>
          <Col>
            <Container
              className={
                "text-center" +
                " " +
                (menuOption === "status"
                  ? "selected-option"
                  : "not-selected-option")
              }
              onClick={() => changeMenu("status")}
            >
              <Row>
                <Col>
                  <Image src="images/icons/status.svg" />
                </Col>
              </Row>
              <Row>
                <Col>Status</Col>
              </Row>
            </Container>
          </Col>
        </Row>

        {/* Second row: Credential, Import, Permissions */}
        <Row>
          <Col>
            <Container
              className={
                "text-center" +
                " " +
                (menuOption === "credential"
                  ? "selected-option"
                  : "not-selected-option")
              }
              onClick={() => changeMenu("credential")}
            >
              <Row>
                <Col>
                  <Image src="images/icons/credential.svg" />
                </Col>
              </Row>
              <Row>
                <Col>Credential</Col>
              </Row>
            </Container>
          </Col>
          <Col>
            <Container
              className={
                "text-center" +
                " " +
                (menuOption === "import"
                  ? "selected-option"
                  : "not-selected-option")
              }
              onClick={() => changeMenu("import")}
            >
              <Row>
                <Col>
                  <Image src="images/icons/import.svg" />
                </Col>
              </Row>
              <Row>
                <Col>Import</Col>
              </Row>
            </Container>
          </Col>
          <Col>
            <Container
              className={
                "text-center" +
                " " +
                (menuOption === "permissions"
                  ? "selected-option"
                  : "not-selected-option")
              }
              onClick={() => changeMenu("permissions")}
            >
              <Row>
                <Col>
                  <Image src="images/icons/permissions.svg" />
                </Col>
              </Row>
              <Row>
                <Col>Permissions</Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </footer>
    </>
  );
}
