import { Badge } from "react-bootstrap";

interface UniversityBrandingProps {
  university?: string;
}

function UniversityBranding({ university }: UniversityBrandingProps) {
  const getUniversityLogo = (universityName?: string) => {
    // Map university names to their logos
    switch (universityName?.toLowerCase()) {
      case "ntnu":
      case "norwegian university of science and technology":
        return "/images/ntnu-logo.svg";
      default:
        return "/images/default-university-logo.svg";
    }
  };

  const getUniversityColors = (universityName?: string) => {
    switch (universityName?.toLowerCase()) {
      case "ntnu":
      case "norwegian university of science and technology":
        return { primary: "#1e3a8a", secondary: "#3b82f6" };
      default:
        return { primary: "#6b7280", secondary: "#9ca3af" };
    }
  };

  const colors = getUniversityColors(university);

  return (
    <div className="university-branding" style={{ color: colors.primary }}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src={getUniversityLogo(university)}
            alt={`${university} logo`}
            className="university-logo me-3"
            style={{ height: "40px" }}
          />
          <div>
            <h4 className="mb-0" style={{ color: colors.primary }}>
              {university || "University"}
            </h4>
            <small className="text-muted">
              Academic Credential Verification
            </small>
          </div>
        </div>
        <Badge bg="success" className="verification-badge">
          Verified
        </Badge>
      </div>
    </div>
  );
}

export default UniversityBranding;
