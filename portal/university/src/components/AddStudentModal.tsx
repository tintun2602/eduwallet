interface NewStudent {
  name: string;
  surname: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  newStudent: NewStudent;
  onStudentChange: (student: NewStudent) => void;
  onAddStudent: () => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  newStudent,
  onStudentChange,
  onAddStudent,
}: AddStudentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Add a student</h3>
          <button className="modal-close" onClick={onClose}>
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
                onStudentChange({ ...newStudent, name: e.target.value })
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
                onStudentChange({ ...newStudent, surname: e.target.value })
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
                onStudentChange({
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
                onStudentChange({
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
                onStudentChange({ ...newStudent, country: e.target.value })
              }
              placeholder="Enter country"
              className="form-input"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-add" onClick={onAddStudent}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
