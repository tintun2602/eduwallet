import "../styles/UserPageStyle.css"

import { User } from "../models/user"
import { Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import List from "../components/ListComponent";

export default function UserPage(props: UserPageProps) {
    const user = props.user;
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col xs={1} className="my-auto">
                        <Image src="images/icons/arrow.svg" alt="Arrow icon" className="cursor-pointer" onClick={goBack} />
                    </Col>
                    <Col className="text-start ">
                        <strong className="text-24">Your profile</strong>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <List object={user.toObject()} />
                </Row>
            </Container>
        </>
    );
}

interface UserPageProps {
    user: User,
}
