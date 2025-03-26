import { createContext, useContext, useState } from "react";
import type { JSX } from "react";
import { Credentials, StudentModel } from "../models/student";
import { logIn } from "../API"
import { useNavigate } from "react-router-dom";

interface AuthenticationProviderProps {
    student: StudentModel,
    login(credentials: Credentials): void
}

const AuthContext = createContext<AuthenticationProviderProps>({ student: StudentModel.createEmpty(), login: () => { } });

/**
 * AuthenticationProvider component that provides authentication context to its children.
 * @author Diego Da Giau
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthContext provider with the authentication state and functions.
 */
export default function AuthenticationProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [student, setStudent] = useState<StudentModel>(StudentModel.createEmpty());
    const navigate = useNavigate();
    const login = async (credentials: Credentials) => {
        try {
            const studentTemp = await logIn(credentials);
            setStudent(studentTemp);
            navigate("/wallet");
        } catch (err) {
        }
    };

    return (
        <AuthContext.Provider value={{ student, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
