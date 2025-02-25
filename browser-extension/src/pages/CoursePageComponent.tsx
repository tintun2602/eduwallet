import "../styles/CoursePageStyle.css";

import { useLocation, useNavigate } from "react-router-dom";
import { Result } from "../models/student";
import { Col, Container, Image, Row } from "react-bootstrap";
import List from "../components/ListComponent";
import { JSX } from "react";
import { useUniversities } from "../providers/UniversitiesProvider";

/**
 * CoursePage component renders the detailed page for a specific course.
 * @author Diego Da Giau
 * @returns {JSX.Element} The rendered course page component.
 */
export default function CoursePage(): JSX.Element {
    // Get route state and navigation utilities
    const location = useLocation();
    const navigate = useNavigate();

    // Extract course result from route state
    const result: Result = location.state.result;

    // Get universities from context
    const universities = useUniversities().universities;

    // Create formatted result object for display
    const resultObj = {
        code: result.code,
        ects: result.ects,
        // Map university address to name, fallback to 'Unknown' if not found
        university: universities.find(u =>
            u.universityAddress === result.university
        )?.name || 'Unknown University',
        degreeCourse: result.degreeCourse,
        grade: result.grade,
        date: result.date,
    };

    // Navigation handler for back button
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
                    <List object={resultObj} />
                </Row>
            </Container>
        </>
    );
}
