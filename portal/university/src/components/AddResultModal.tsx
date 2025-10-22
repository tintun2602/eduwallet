interface NewResult {
  courseCode: string;
  courseName: string;
  degreeCourse: string;
  ects: number;
  grade: string;
  date: string;
}

interface AddResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  newResult: NewResult;
  onResultChange: (result: NewResult) => void;
  onAddResult: () => void;
}

export default function AddResultModal({
  isOpen,
  onClose,
  newResult,
  onResultChange,
  onAddResult,
}: AddResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Add Academic Result</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Course Code</label>
            <input
              type="text"
              value={newResult.courseCode}
              onChange={(e) =>
                onResultChange({ ...newResult, courseCode: e.target.value })
              }
              placeholder="e.g., CS101"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              value={newResult.courseName}
              onChange={(e) =>
                onResultChange({ ...newResult, courseName: e.target.value })
              }
              placeholder="e.g., Introduction to Computer Science"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Degree Course</label>
            <input
              type="text"
              value={newResult.degreeCourse}
              onChange={(e) =>
                onResultChange({ ...newResult, degreeCourse: e.target.value })
              }
              placeholder="e.g., Computer Science"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>ECTS</label>
            <input
              type="number"
              value={newResult.ects}
              onChange={(e) =>
                onResultChange({
                  ...newResult,
                  ects: parseInt(e.target.value),
                })
              }
              placeholder="e.g., 6"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Grade</label>
            <input
              type="text"
              value={newResult.grade}
              onChange={(e) =>
                onResultChange({ ...newResult, grade: e.target.value })
              }
              placeholder="e.g., A, B+, 30L"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="text"
              value={newResult.date}
              onChange={(e) =>
                onResultChange({ ...newResult, date: e.target.value })
              }
              placeholder="DD/MM/YYYY"
              className="form-input"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-add" onClick={onAddResult}>
            Add Result
          </button>
        </div>
      </div>
    </div>
  );
}
