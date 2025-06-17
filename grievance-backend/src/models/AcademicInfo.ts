export interface AcademicInfo {
  Id?: number;
  RollNo: string;
  ProgramId: number;
  AcademicYear: string;
  Term: number;
  CampusId: number;
  Batch: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateAcademicInfoData {
  RollNo: string;
  ProgramId: number;
  AcademicYear: string;
  Term: number;
  CampusId: number;
  Batch: number;
}

export interface UpdateAcademicInfoData {
  RollNo?: string;
  ProgramId?: number;
  AcademicYear?: string;
  Term?: number;
  CampusId?: number;
  Batch?: number;
}

