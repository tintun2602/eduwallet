import { useState } from "react";

interface AcademicResult {
  id: string;
  courseCode: string;
  courseName: string;
  degreeCourse: string;
  ects: number;
  grade: string;
  date: string;
  certificateHash?: string;
}

interface AcademicResultsCardProps {
  academicResults: AcademicResult[];
  onDeleteResult: (resultId: string) => void;
}

export default function AcademicResultsCard({
  academicResults,
  onDeleteResult,
}: AcademicResultsCardProps) {
  const [activeTab, setActiveTab] = useState(
    "Norwegian University of Science and Technology"
  );

  return (
    <div className="academic-results-card">
      <h2 className="section-title">Academical data</h2>

      {/* University Tabs */}
      <div className="university-tabs">
        <button
          className={`tab-button ${
            activeTab === "Politecnico di Torino" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Politecnico di Torino")}
        >
          Politecnico di Torino
        </button>
        <button
          className={`tab-button ${
            activeTab === "Norwegian University of Science and Technology"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("Norwegian University of Science and Technology")
          }
        >
          Norwegian University of Science and Technology
        </button>
      </div>

      {/* Course Section */}
      <h3 className="course-section-title">Miscellaneous Courses</h3>

      {/* Course Table */}
      <table className="course-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Date</th>
            <th>ECTS</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {academicResults.map((result) => (
            <tr key={result.id}>
              <td>{result.courseCode}</td>
              <td>{result.courseName}</td>
              <td>{result.grade}</td>
              <td>{result.date}</td>
              <td>{result.ects}</td>
              <td>
                <div className="course-actions">
                  <button className="btn-edit" title="Edit">
                    <img src="/create.svg" alt="Edit" className="action-icon" />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDeleteResult(result.id)}
                    title="Delete"
                  >
                    <img
                      src="/delete.svg"
                      alt="Delete"
                      className="action-icon"
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Record Button - Fixed positioning handled by CSS */}
    </div>
  );
}
