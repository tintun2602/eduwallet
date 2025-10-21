interface UniversityTitleProps {
  universityName?: string;
}

export default function UniversityTitle({
  universityName = "Norwegian University of Science and Technology",
}: UniversityTitleProps) {
  return (
    <div className="university-section">
      <h1 className="university-title">{universityName}</h1>
    </div>
  );
}
