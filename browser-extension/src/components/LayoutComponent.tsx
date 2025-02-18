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
        </>
    );
}

interface LayoutProps {
    children: React.ReactNode;
}
