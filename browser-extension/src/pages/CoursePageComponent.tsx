import "../styles/CoursePageStyle.css";

import { useLocation, useNavigate } from "react-router-dom";
import { Result } from "../models/student";
import { Col, Container, Image, Row } from "react-bootstrap";
import List from "../components/ListComponent";
import { JSX } from "react";

/**
 * CoursePage component renders the detailed page for a specific course.
 * @author Diego Da Giau
 * @returns {JSX.Element} The rendered course page component.
 */
export default function CoursePage(): JSX.Element {
    const location = useLocation();
    const result: Result = location.state.result;
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }

    return (
        <>
            {/* Header */}
            <Container>
                <Row className="mb-3">
                    <Col className="my-auto">
                        <Image src="images/icons/arrow.svg" alt="Arrow icon" className="cursor-pointer" onClick={goBack} />
                    </Col>
                    <Col className="text-end">
                        <Image src="images/icons/student.svg" alt="StudentModel icon" className="cursor-pointer" onClick={() => navigate("/student")} />
                    </Col>
                </Row>
            </Container>

            {/* Course title */}
            <Container>
                <Row id="course-title" className="mb-3">
                    <Col>
                        {result.name}
                    </Col>
                </Row>

                {/* Course details */}
                <Row>
                    <List object={result} />
                </Row>
            </Container>
        </>
    );
}