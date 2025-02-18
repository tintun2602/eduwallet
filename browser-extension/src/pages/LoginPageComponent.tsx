import "../styles/LoginPageStyle.css";

import { Col, Container, Image, Row } from "react-bootstrap";
import Form from 'react-bootstrap/Form';

function LoginPage() {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }
    };

    return (
        <>
            <Container className="h-100 d-flex flex-column justify-content-center">
                <Row>
                    <Col>
                        <span id='main-logo'>Edu<span className='purple-text'>Wallet</span></span>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <Image fluid alt="EduWallet logo" src="/images/icons/icon.svg" width="37" height="37" />
                    </Col>
                </Row>
                <Row className="medium-text">
                    <Col>
                        Log in with your id and password
                    </Col>
                </Row>
                <Form className="w-100">
                    <Form.Group controlId="exampleForm.ControlInput1" className="floating-label">
                        <Form.Label className="form-input-label">ID</Form.Label>
                        <Form.Control className="form-input no-arrows" type="number" inputMode="numeric" pattern="[1-9][0-9]*" required onKeyDown={handleKeyDown} />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1" className="floating-label">
                        <Form.Label className="form-input-label">Password</Form.Label>
                        <Form.Control className="form-input" type="password" required />
                    </Form.Group>
                </Form>
            </Container>
        </>
    )
}

export default LoginPage
