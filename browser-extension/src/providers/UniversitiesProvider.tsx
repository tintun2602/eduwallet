import { createContext, useContext, useEffect, useState } from "react";
import type { JSX } from "react";
import { useAuth } from "./AuthenticationProvider";
import UniversityModel from "../models/university";
import { getUniversities } from "../API";

interface UniversitiesProviderProps {
    universities: UniversityModel[];
    fetchUniversities(): void;
}

const UniversitiesContext = createContext<UniversitiesProviderProps>({
    universities: [],
    fetchUniversities: () => { }
});

/**
 * Provider component for universities data.
 * Manages the state of universities and provides methods to update it.
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be wrapped
 */
export default function UniversitiesProvider({ children }: { children: React.ReactNode }): JSX.Element {
    // Get authenticated student from context
    const student = useAuth().student;

    // State for storing universities data
    const [universities, setUniversities] = useState<UniversityModel[]>([]);

    /**
     * Fetches universities data and updates state.
     * Uses the authenticated student to retrieve relevant universities.
     */
    const fetchUniversities = async () => {
        try {
            const universitiesTmp = await getUniversities(student);
            setUniversities(universitiesTmp);
        } catch (error) {
            setUniversities([]);
        }
    };
    useEffect(() => {
        const loadUniversities = async () => {
            fetchUniversities()
        };
        loadUniversities();
    }, [student]);

    // Provide universities data and fetch method to children
    return (
        <UniversitiesContext.Provider value={{ universities, fetchUniversities }}>
            {children}
        </UniversitiesContext.Provider>
    );
}

export const useUniversities = () => {
    return useContext(UniversitiesContext);
};
