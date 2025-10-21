import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import UniversityTitle from "../components/UniversityTitle";
import SearchSection from "../components/SearchSection";
import StudentsTable from "../components/StudentsTable";
import AddStudentModal from "../components/AddStudentModal";
import "../styles/pages/DashboardPage.css";

interface Student {
  id: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    surname: "",
    dateOfBirth: "",
    placeOfBirth: "",
    country: "",
  });

  // Mock data - replace with actual data
  useEffect(() => {
    setStudents([
      {
        id: "1",
        name: "John",
        surname: "Dee",
        dateOfBirth: "22/05/2001",
        placeOfBirth: "Pieve di Cadore",
        country: "Italy",
      },
    ]);
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.id.includes(searchTerm) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    // TODO: Implement actual student creation via SDK
    const student: Student = {
      id: (students.length + 1).toString(),
      ...newStudent,
    };
    setStudents([...students, student]);
    setNewStudent({
      name: "",
      surname: "",
      dateOfBirth: "",
      placeOfBirth: "",
      country: "",
    });
    setShowAddModal(false);
  };

  return (
    <div className="university-portal">
      <DashboardHeader />
      <main className="portal-main">
        <UniversityTitle />
        <SearchSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <StudentsTable
          students={filteredStudents}
          onStudentClick={(studentId) => navigate(`/student/${studentId}`)}
        />
        <div className="add-student-button">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-add-student"
          >
            Add a student
          </button>
        </div>
      </main>
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newStudent={newStudent}
        onStudentChange={setNewStudent}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
};

export default DashboardPage;
