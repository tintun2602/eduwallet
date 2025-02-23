import { JSX } from "react";
import "../styles/ListComponentStyle.css";
import { Col, Container, Row } from "react-bootstrap";
import { formatCamelCaseString } from "../utils/utils";

/**
 * List component renders a list of key-value pairs from an object.
 * @author Diego Da Giau
 * @param {ListProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered list component.
 */
export default function List(props: ListProps): JSX.Element {
    const obj = props.object;
    const list = [];
    const keys = Object.keys(obj);

    // Iterate over the keys of the object and create list items
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
                {i === (keys.length - 1) ? <></> : <hr className="my-2" />}
            </Container>
        );
    }

    return (
        <>
            {list}
        </>
    );
}

/**
 * Properties for the List component.
 * @author Diego Da Giau
 */
interface ListProps {
    object: { [key: string]: any };
}