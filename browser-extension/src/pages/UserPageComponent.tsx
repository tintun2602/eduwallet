import { User } from "../models/user"
import "../styles/UserPageStyle.css"

export default function UserPage(props: UserPageProps) {
    const user = props.user;

    return (
        <>
        </>
    );
}

interface UserPageProps {
    user: User,
}
