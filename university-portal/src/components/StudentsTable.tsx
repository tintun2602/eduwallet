interface Student {
  id: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
  university?: string;
}

interface StudentsTableProps {
  students: Student[];
  onStudentClick: (studentId: string) => void;
}

export default function StudentsTable({
  students,
  onStudentClick,
}: StudentsTableProps) {
  return (
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
            <th>University</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="student-row"
              onClick={() => onStudentClick(student.id)}
            >
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>{student.dateOfBirth}</td>
              <td>{student.placeOfBirth}</td>
              <td>{student.country}</td>
              <td>
                {student.university ||
                  "Norwegian University of Science and Technology"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
