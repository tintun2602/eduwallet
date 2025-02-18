import "../styles/HomePageStyle.css"

import { Col, Container, Image, Row } from "react-bootstrap";
import { Result, User } from "../models/user";
import { Dispatch, SetStateAction, useState } from "react";
import University from "../models/university";
import Footer from "../components/FooterComponent";
import { useNavigate } from "react-router-dom";

function Homepage(props: HomepageProps) {
    const user = props.user;
    const universities = props.universities;
    const creditNumber: number = user.getResults().filter(r => r.grade != "").reduce((a, v) => a + v.ects, 0);
    const [activeUniversity, setActiveUniversity] = useState<number>(universities[0].getId());
    const navigate = useNavigate();

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <strong className="text-24">Wallet</strong>
                    </Col>
                    <Col className="text-end">
                        <Image src="images/icons/user.svg" alt="User icon" className="cursor-pointer" onClick={() => navigate("/user")} />
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row className="mb-3">
                    <Col className="text-20">
                        Hello <strong>{user.getName()}</strong>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col className="image-container mx-3">
                        <Image src="images/mashUserCredits.svg" fluid />
                        <div className="overlay-text">
                            <p className="text-16 mb-3">Total credits ballance</p>
                            <strong className="text-24">{creditNumber} ECTS</strong>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row className="mt-3 mb-2">
                    {universities.map(u => <UniversityButton key={u.getId()} university={u} activeUniversity={activeUniversity} setActiveUniversity={setActiveUniversity} />)}
                </Row>
                <Container className="p-0 main-content">
                    <UniversityResults results={user.getResultsByUniversityGroupedByCourseDegree(activeUniversity)} />
                </Container>
            </Container>
            <Footer />
        </>
    );
}

interface HomepageProps {
    user: User;
    universities: University[];
}

function UniversityButton(props: UniversityButtonProps) {
    const university = props.university;
    const activeUniversity = props.activeUniversity;
    const setActiveUniversity = props.setActiveUniversity;

    return (
        <>
            <Col className={"text-center" + " " + (activeUniversity === university.getId() ? "underline" : "")}>
                <div className="menu-option" onClick={() => setActiveUniversity(university.getId())}>{university.getShortName()}</div>
            </Col>
        </>
    );
}

interface UniversityButtonProps {
    university: University,
    activeUniversity: number,
    setActiveUniversity: Dispatch<SetStateAction<number>>,
}

function UniversityResults(props: UniversityResultsProps) {
    const results: { [key: string]: Result[]; } = props.results;
    const degreeCourses: string[] = Object.keys(results);

    return (
        <>
            {degreeCourses.map(d => <DegreeCourseResults key={d} course={d} results={results[d]} />)}
        </>
    );
}

interface UniversityResultsProps {
    results: { [key: string]: Result[]; },
}

function DegreeCourseResults(props: DegreeCourseResultsProps) {
    const results: Result[] = props.results;
    const course: string = props.course;

    return (
        <>
            <Row className="my-2 degree-course">
                <Col className="">
                    {course}
                </Col>
            </Row>
            <Row>
                <Container>
                    {results.map(r => <DegreeCourseResult key={r.code} result={r} />)}
                </Container>
            </Row>
        </>
    );
}

interface DegreeCourseResultsProps {
    results: Result[],
    course: string,
}

function DegreeCourseResult(props: DegreeCourseResultProps) {
    const result: Result = props.result;
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/wallet/" + result.code, { state: { result } });
    }

    return (
        <>
            <Row className="ps-2 cursor-pointer" onClick={handleClick}>
                <Col className="p-0">
                    <Container className="text-14">
                        <Row>
                            <Col className="course-name">
                                {result.name}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="course-code">
                                {result.code}
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col xs={3} className="p-0 text-center course-info course-grade align-self-center">
                    {result.grade ? result.grade : ""}
                </Col>
                <Col xs={3} className="p-0 text-center course-info align-self-center">
                    {result.ects ? result.ects : ""}
                </Col>
            </Row>
        </>
    );
}

interface DegreeCourseResultProps {
    result: Result,
}

export default Homepage;
