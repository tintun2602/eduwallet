import "../styles/CoursePageStyle.css"

import { useLocation, useNavigate } from "react-router-dom";
import { Result } from "../models/user";
import { Col, Container, Image, Row } from "react-bootstrap";
import List from "../components/ListComponent";

export default function CoursePage() {
    const location = useLocation();
    const result: Result = location.state.result;
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col className="my-auto">
                        <Image src="images/icons/arrow.svg" alt="Arrow icon" className="cursor-pointer" onClick={goBack} />
                    </Col>
                    <Col className="text-end">
                        <Image src="images/icons/user.svg" alt="User icon" className="cursor-pointer" onClick={() => navigate("/user")} />
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row id="course-title" className="mb-3">
                    <Col>
                        {result.name}
                    </Col>
                </Row>
                <Row>
                    <List object={result} />
                </Row>
            </Container>
        </>
    );
}