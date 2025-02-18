import "../styles/FooterStyle.css";

import { useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function Footer() {
    const [menuOption, setMenuOption] = useState<number>(1);
    const navigate: NavigateFunction = useNavigate();
    const changeMenu = (option: number) => {
        setMenuOption(option);
    }

    return (
        <>
            <footer className="container-fluid py-2">
                <Row>
                    <Col>
                        <Container className={"text-center" + " " + (menuOption == 1? "selected-option" : "not-selected-option")} onClick={() => {changeMenu(1); navigate("/")}}>
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
                    <Col>
                        <Container className={"text-center" + " " + (menuOption == 2? "selected-option" : "not-selected-option")} onClick={() => {changeMenu(2); navigate("/permissions")}}>
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