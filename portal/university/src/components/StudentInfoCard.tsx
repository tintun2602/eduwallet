interface Student {
  id: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
  walletAddress: string;
}

interface StudentInfoCardProps {
  student: Student;
  onEditStudent: () => void;
}

export default function StudentInfoCard({ student }: StudentInfoCardProps) {
  return (
    <>
      <div className="student-info-card">
        <div className="student-details">
          <h1 className="section-title">Personal data</h1>
          <div className="detail-row">
            <span className="detail-label">ID</span>
            <span className="detail-value">{student.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">{student.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Surname</span>
            <span className="detail-value">{student.surname}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of birth</span>
            <span className="detail-value">{student.dateOfBirth}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Place of birth</span>
            <span className="detail-value">{student.placeOfBirth}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Country</span>
            <span className="detail-value">{student.country}</span>
          </div>
        </div>
      </div>

      <div className="permission-section">
        <h2 className="permission-title">Permission</h2>
        <div className="permission-list">
          <div className="permission-item">Read</div>
          <div className="permission-item">Write</div>
        </div>
      </div>
    </>
  );
}
