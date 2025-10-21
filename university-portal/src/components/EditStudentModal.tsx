interface EditStudent {
  name: string;
  surname: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editStudent: EditStudent;
  onStudentChange: (student: EditStudent) => void;
  onSaveStudent: () => void;
}

export default function EditStudentModal({
  isOpen,
  onClose,
  editStudent,
  onStudentChange,
  onSaveStudent,
}: EditStudentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Edit Student Information</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={editStudent.name}
              onChange={(e) =>
                onStudentChange({ ...editStudent, name: e.target.value })
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Surname</label>
            <input
              type="text"
              value={editStudent.surname}
              onChange={(e) =>
                onStudentChange({ ...editStudent, surname: e.target.value })
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="text"
              value={editStudent.dateOfBirth}
              onChange={(e) =>
                onStudentChange({
                  ...editStudent,
                  dateOfBirth: e.target.value,
                })
              }
              placeholder="DD/MM/YYYY"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Place of Birth</label>
            <input
              type="text"
              value={editStudent.placeOfBirth}
              onChange={(e) =>
                onStudentChange({
                  ...editStudent,
                  placeOfBirth: e.target.value,
                })
              }
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              value={editStudent.country}
              onChange={(e) =>
                onStudentChange({ ...editStudent, country: e.target.value })
              }
              className="form-input"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-add" onClick={onSaveStudent}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
