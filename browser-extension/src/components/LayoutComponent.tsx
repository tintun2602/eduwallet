import { Col, Container, Image, Row } from "react-bootstrap";

export default function Layout(props: LayoutProps) {
    const children = props.children;

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col className="">
                        <strong className="text-24">Wallet</strong>
                    </Col>
                    <Col className="text-end">
                        <Image src="images/icons/user.svg" alt="User icon" />
                    </Col>
                </Row>
            </Container>
            {children}
            <footer className="container-fluid py-2">
                <Row>
                    <Col>
                        <Container className="text-center">
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
                        <Container className="text-center">
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

interface LayoutProps {
    children: React.ReactNode;
}
