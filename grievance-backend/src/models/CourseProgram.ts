export interface CourseProgram {
  Id?: number;
  ProgramId: number;
  CourseId: number;
  Batch: number;
  IsActive?: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateCourseProgramData {
  ProgramId: number;
  CourseId: number;
  Batch: number;
  IsActive?: boolean;
}

export interface UpdateCourseProgramData {
  IsActive?: boolean;
}
