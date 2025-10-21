// Browser-compatible version of the SDK
// Re-exports all functions except those that require Node.js modules

export {
  registerStudent,
  enrollStudent,
  evaluateStudent,
  getStudentInfo,
  getStudentWithResult,
  askForPermission,
  verifyPermission,
} from "./index";

export type {
  StudentCredentials,
  StudentData,
  CourseInfo,
  Evaluation,
  Student,
} from "./types";

export { PermissionType } from "./types";
export { getStudentsRegister } from "./index";

// Note: publishCertificate is not available in browser environments
// as it requires AWS SDK which uses Node.js modules
