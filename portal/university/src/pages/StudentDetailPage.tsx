import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import StudentInfoCard from "../components/StudentInfoCard";
import AcademicResultsCard from "../components/AcademicResultsCard";
import AddResultModal from "../components/AddResultModal";
import EditStudentModal from "../components/EditStudentModal";
import {
  BlockchainService,
  Student,
  AcademicResult,
} from "../services/blockchainService";
import "../styles/pages/StudentDetailPage.css";

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [academicResults, setAcademicResults] = useState<AcademicResult[]>([]);
  const [showAddResultModal, setShowAddResultModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [newResult, setNewResult] = useState({
    courseCode: "",
    courseName: "",
    degreeCourse: "",
    ects: 0,
    grade: "",
    date: "",
  });
  const [editStudent, setEditStudent] = useState({
    name: "",
    surname: "",
    dateOfBirth: "",
    placeOfBirth: "",
    country: "",
  });

  // Load student data from blockchain
  useEffect(() => {
    const loadStudentData = async () => {
      if (!id) return;

      try {
        const { student: studentData, results } =
          await BlockchainService.getStudentWithResults(id);
        if (studentData) {
          setStudent(studentData);
          setAcademicResults(results);
        }
      } catch (error) {
        console.error("Failed to load student data:", error);
        // Show error state instead of fallback data
        setStudent(null);
      }
    };

    loadStudentData();
  }, [id]);

  const handleAddResult = async () => {
    if (!student) return;

    try {
      const result = await BlockchainService.addAcademicResult(
        student.walletAddress,
        newResult
      );

      if (result.success) {
        // Add the new result to local state
        const newResultData: AcademicResult = {
          id: (academicResults.length + 1).toString(),
          ...newResult,
          certificateHash: `QmHash${Date.now()}...`,
        };
        setAcademicResults([...academicResults, newResultData]);

        // Reset form
        setNewResult({
          courseCode: "",
          courseName: "",
          degreeCourse: "",
          ects: 0,
          grade: "",
          date: "",
        });
        setShowAddResultModal(false);
      } else {
        console.error("Failed to add academic result:", result.error);
        alert(`Failed to add academic result: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding academic result:", error);
      alert("An error occurred while adding the academic result");
    }
  };

  const handleEditStudent = async () => {
    if (!student) return;

    try {
      // TODO: Implement actual student update via SDK
      setStudent({ ...student, ...editStudent });
      setShowEditStudentModal(false);
    } catch (error) {
      console.error("Error updating student:", error);
      alert("An error occurred while updating the student");
    }
  };

  const handleDeleteResult = async (resultId: string) => {
    if (!student) return;

    try {
      const result = await BlockchainService.deleteAcademicResult(
        student.walletAddress,
        resultId
      );

      if (result.success) {
        setAcademicResults(
          academicResults.filter((result) => result.id !== resultId)
        );
      } else {
        console.error("Failed to delete academic result:", result.error);
        alert(`Failed to delete academic result: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting academic result:", error);
      alert("An error occurred while deleting the academic result");
    }
  };

  if (!student) {
    return (
      <div className="student-detail">
        <div className="loading">Loading student data...</div>
      </div>
    );
  }

  return (
    <div className="student-detail">
      <DashboardHeader />

      <main className="detail-main">
        <div className="detail-columns">
          {/* Left Column - Personal Data */}
          <section className="col-left">
            <StudentInfoCard
              student={student}
              onEditStudent={() => {
                setEditStudent({
                  name: student.name,
                  surname: student.surname,
                  dateOfBirth: student.dateOfBirth,
                  placeOfBirth: student.placeOfBirth,
                  country: student.country,
                });
                setShowEditStudentModal(true);
              }}
            />
          </section>

          {/* Right Column - Academic Results */}
          <section className="col-right">
            <AcademicResultsCard
              academicResults={academicResults}
              onDeleteResult={handleDeleteResult}
            />
          </section>
        </div>
      </main>

      {/* Add Record Button */}
      <button
        className="btn-add-record"
        onClick={() => setShowAddResultModal(true)}
      >
        Add a record
      </button>

      {/* Modals */}
      <AddResultModal
        isOpen={showAddResultModal}
        onClose={() => setShowAddResultModal(false)}
        newResult={newResult}
        onResultChange={setNewResult}
        onAddResult={handleAddResult}
      />

      <EditStudentModal
        isOpen={showEditStudentModal}
        onClose={() => setShowEditStudentModal(false)}
        editStudent={editStudent}
        onStudentChange={setEditStudent}
        onSaveStudent={handleEditStudent}
      />
    </div>
  );
};

export default StudentDetailPage;
