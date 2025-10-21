import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

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
      {/* Header */}
      <header className="portal-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-edu">Edu</span>
            <span className="logo-wallet">Wallet</span>
          </div>
          <div className="logo-icon">
            <img src="/logo.svg" alt="EduWallet Logo" className="logo-image" />
          </div>
        </div>
        <div className="header-right">
          <nav className="nav-links">
            <a href="#" className="nav-link">
              Your students
            </a>
            <a href="#" className="nav-link active">
              All students
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-main">
        {/* University Title */}
        <div className="university-section">
          <h1 className="university-title">
            Norwegian University of Science and Technology
          </h1>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="John Dee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <p className="search-hint">
            Search your students by ID or name and surname
          </p>
        </div>

        {/* Students Table */}
        <div className="table-section">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Date of birth</th>
                <th>Place of birth</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="student-row"
                  onClick={() => navigate(`/student/${student.id}`)}
                >
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.surname}</td>
                  <td>{student.dateOfBirth}</td>
                  <td>{student.placeOfBirth}</td>
                  <td>{student.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Student Button */}
        <div className="add-student-button">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-add-student"
          >
            Add a student
          </button>
        </div>
      </main>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add a student</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Surname</label>
                <input
                  type="text"
                  value={newStudent.surname}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, surname: e.target.value })
                  }
                  placeholder="Enter surname"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Date of birth</label>
                <input
                  type="text"
                  value={newStudent.dateOfBirth}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      dateOfBirth: e.target.value,
                    })
                  }
                  placeholder="DD/MM/YYYY"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Place of birth</label>
                <input
                  type="text"
                  value={newStudent.placeOfBirth}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      placeOfBirth: e.target.value,
                    })
                  }
                  placeholder="Enter place of birth"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={newStudent.country}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, country: e.target.value })
                  }
                  placeholder="Enter country"
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="btn-add" onClick={handleAddStudent}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
