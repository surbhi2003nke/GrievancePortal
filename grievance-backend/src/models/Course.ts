export interface Course {
  CourseId?: number;
  CourseCode: string;
  CourseName: string;
  Term: number;
  CourseType: string;
  Credit: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateCourseData {
  CourseCode: string;
  CourseName: string;
  Term: number;
  CourseType: string;
  Credit: number;
}

export interface UpdateCourseData {
  CourseCode?: string;
  CourseName?: string;
  Term?: number;
  CourseType?: string;
  Credit?: number;
}
