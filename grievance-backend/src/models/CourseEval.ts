export interface CourseEval {
  Id?: number;
  CourseId: number;
  Lect?: number;
  Pract?: number;
  CompTypes?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateCourseEvalData {
  CourseId: number;
  Lect?: number;
  Pract?: number;
  CompTypes?: string;
}

export interface UpdateCourseEvalData {
  Lect?: number;
  Pract?: number;
  CompTypes?: string;
}
