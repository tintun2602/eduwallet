declare module "eduwallet-sdk" {
  import type { Wallet } from "ethers";
  export enum PermissionType {
    Read,
    Write,
  }
  export interface CourseInfo {
    code: string;
    name: string;
    degreeCourse: string;
    ects: number;
  }
  export interface Evaluation {
    code: string;
    grade: string;
    evaluationDate: string;
    certificate?: Buffer | string;
  }
  export interface StudentData {
    name: string;
    surname: string;
    birthDate: string;
    birthPlace: string;
    country: string;
  }
  export interface Student {
    name: string;
    surname: string;
    birthDate: string;
    birthPlace: string;
    country: string;
    results?: any[];
  }
  export interface StudentCredentials {
    id: string;
    password: string;
    academicWalletAddress: string;
    ethWallet: any;
  }
  export function getStudentsRegister(): any;
  export function registerStudent(
    universityWallet: Wallet,
    student: StudentData
  ): Promise<StudentCredentials>;
  export function enrollStudent(
    universityWallet: Wallet,
    walletAddress: string,
    courses: CourseInfo[]
  ): Promise<any>;
  export function evaluateStudent(
    universityWallet: Wallet,
    walletAddress: string,
    evaluations: Evaluation[]
  ): Promise<any>;
  export function getStudentInfo(
    universityWallet: Wallet,
    walletAddress: string
  ): Promise<Student>;
  export function getStudentWithResult(
    universityWallet: Wallet,
    walletAddress: string
  ): Promise<Student>;
  export function askForPermission(
    universityWallet: Wallet,
    walletAddress: string,
    type: PermissionType
  ): Promise<any>;
  export function verifyPermission(
    universityWallet: Wallet,
    walletAddress: string
  ): Promise<PermissionType | null>;
}
