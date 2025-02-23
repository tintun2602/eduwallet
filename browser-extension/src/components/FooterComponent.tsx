import "../styles/FooterStyle.css";
import { JSX, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { NavigateFunction, useNavigate } from "react-router-dom";

/**
 * Footer component renders the footer navigation menu.
 * @author Diego Da Giau
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer(): JSX.Element {
    const [menuOption, setMenuOption] = useState<string>("wallet");
    const navigate: NavigateFunction = useNavigate();
    const changeMenu = (option: string) => {
        setMenuOption(option);
        navigate("/" + option);
    }

    return (
        <>
            <footer className="container-fluid py-2">
                <Row>
                    {/* Wallet menu option */}
                    <Col>
                        <Container className={"text-center" + " " + (menuOption === "wallet" ? "selected-option" : "not-selected-option")} onClick={() => changeMenu("wallet")}>
                            <Row>
                                <Col>
                                    <Image src="images/icons/wallet.svg" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    Wallet
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    {/* Permissions menu option */}
                    <Col>
                        <Container className={"text-center" + " " + (menuOption === "permissions" ? "selected-option" : "not-selected-option")} onClick={() => changeMenu("permissions")}>
                            <Row>
                                <Col>
                                    <Image src="images/icons/permissions.svg" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    Permissions
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </footer>
        </>
    );
}