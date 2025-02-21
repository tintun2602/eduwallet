import { createContext, useContext, useState } from "react";
import { Credentials, User } from "../models/user";
import { logIn } from "../API"
import { useNavigate } from "react-router-dom";

interface AuthenticationProviderProps {
    user: User,
    login(credentials: Credentials): void,
    updateUser(user: User): void,
}

const AuthContext = createContext<AuthenticationProviderProps>({ user: User.emptyUser(), login: () => { }, updateUser: () => { } });

export default function AuthenticationProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(User.emptyUser());
    const navigate = useNavigate();
    const login = async (credentials: Credentials) => {
        try {
            const userTmp = await logIn(credentials);
            setUser(userTmp);
            navigate("/wallet");
        } catch (err) {
        }
    };

    const updateUser = async (user: User) => {
        try {
            setUser(user);
        } catch (err) {

        }
    };

    return (
        <AuthContext.Provider value={{ user, login, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
