import "../styles/ListComponentStyle.css"

import { Col, Container, Row } from "react-bootstrap";

function formatCamelCaseString(str: string) {
    const spacedString = str.replace(/([A-Z])/g, ' $1').toLowerCase();
    const formattedString = spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
    
    return formattedString;
}

export default function List(props: ListProps) {
    const obj = props.object;
    const list = [];
    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; ++i) {
        list.push(
            <Container key={i} className="list">
                <Row>
                    <Col className="purple-text text-13 list-title">
                        {formatCamelCaseString(keys[i])}
                    </Col>
                </Row>
                <Row>
                    <Col className="text-16 list-content">
                        {obj[keys[i]]}
                    </Col>
                </Row>
                {i === (keys.length-1)? <></> : <hr className="my-2" />}
            </Container>
        );
    }

    return (
        <>
            {list}
        </>
    );
}

interface ListProps {
    object: { [key: string]: any },
}
