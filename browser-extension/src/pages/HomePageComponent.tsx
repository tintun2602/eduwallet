import "../styles/HomePageStyle.css";
import { Col, Container, Image, Row } from "react-bootstrap";
import { Result } from "../models/student";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import University from "../models/university";
import Footer from "../components/FooterComponent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthenticationProvider";

/**
 * Homepage component renders the main page of the application.
 * @author Diego Da Giau
 * @param {HomepageProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered homepage component.
 */
export default function Homepage(props: HomepageProps): JSX.Element {
    const student = useAuth().student;
    const universities = props.universities;
    const creditNumber = student.getResults().filter(r => r.grade != "").reduce((a, v) => a + v.ects, 0);
    const [activeUniversity, setActiveUniversity] = useState<number>(universities[0].id);
    const navigate = useNavigate();

    return (
        <>
            {/* Header */}
            <Container>
                <Row className="mb-3">
                    <Col>
                        <strong className="text-24">Wallet</strong>
                    </Col>
                    <Col className="text-end">
                        <Image src="images/icons/student.svg" alt="Student icon" className="cursor-pointer" onClick={() => navigate("/student")} />
                    </Col>
                </Row>
            </Container>
            {/* Student's general data */}
            <Container>
                <Row className="mb-3">
                    <Col className="text-20">
                        Hello <strong>{student.name}</strong>
                    </Col>
                </Row>
                {/* Credits ballance */}
                <Row className="my-3">
                    <Col className="image-container mx-3">
                        <Image src="images/mashUserCredits.svg" fluid />
                        <div className="overlay-text">
                            <p className="text-16 mb-3">Total credits balance</p>
                            <strong className="text-24">{creditNumber} ECTS</strong>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Results part */}
            <Container>
                <Row className="mt-3 mb-2">
                    {universities.map(u => <UniversityButton key={u.id} university={u} activeUniversity={activeUniversity} setActiveUniversity={setActiveUniversity} />)}
                </Row>
                <Container className="p-0 main-content">
                    <UniversityResults results={student.getResultsByUniversityGroupedByCourseDegree(activeUniversity)} />
                </Container>
            </Container>
            <Footer />
        </>
    );
}

/**
 * Properties for the Homepage component.
 * @author Diego Da Giau
 */
interface HomepageProps {
    universities: University[];
}

/**
 * UniversityButton component renders a button for each university.
 * @author Diego Da Giau
 * @param {UniversityButtonProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered university button component.
 */
function UniversityButton(props: UniversityButtonProps): JSX.Element {
    const university = props.university;
    const activeUniversity = props.activeUniversity;
    const setActiveUniversity = props.setActiveUniversity;

    return (
        <Col className={"text-center" + " " + (activeUniversity === university.id ? "underline" : "")}>
            <div className="menu-option" onClick={() => setActiveUniversity(university.id)}>{university.shortName}</div>
        </Col>
    );
}

/**
 * Properties for the UniversityButton component.
 * @author Diego Da Giau
 */
interface UniversityButtonProps {
    university: University;
    activeUniversity: number;
    setActiveUniversity: Dispatch<SetStateAction<number>>;
}

/**
 * UniversityResults component renders the results for a university.
 * @author Diego Da Giau
 * @param {UniversityResultsProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered university results component.
 */
function UniversityResults(props: UniversityResultsProps): JSX.Element {
    const results: { [key: string]: Result[] } = props.results;
    const degreeCourses: string[] = Object.keys(results);

    return (
        <>
            {/* Courses results for a single university */}
            {degreeCourses.map(d => <DegreeCourseResults key={d} course={d} results={results[d]} />)}
        </>
    );
}

/**
 * Properties for the UniversityResults component.
 * @author Diego Da Giau
 */
interface UniversityResultsProps {
    results: { [key: string]: Result[] };
}

/**
 * DegreeCourseResults component renders the results for a degree course.
 * @author Diego Da Giau
 * @param {DegreeCourseResultsProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered degree course results component.
 */
function DegreeCourseResults(props: DegreeCourseResultsProps): JSX.Element {
    const results = props.results;
    const course = props.course;

    return (
        <>
            {/* Courses results groupped by degree course */}
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

/**
 * Properties for the DegreeCourseResults component.
 * @author Diego Da Giau
 */
interface DegreeCourseResultsProps {
    results: Result[];
    course: string;
}

/**
 * DegreeCourseResult component renders a single result for a degree course.
 * @author Diego Da Giau
 * @param {DegreeCourseResultProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered degree course result component.
 */
function DegreeCourseResult(props: DegreeCourseResultProps): JSX.Element {
    const result = props.result;
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/wallet/" + result.code, { state: { result } });
    }

    return (
        <>
            {/* Single course result */}
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

/**
 * Properties for the DegreeCourseResult component.
 */
interface DegreeCourseResultProps {
    result: Result;
}
