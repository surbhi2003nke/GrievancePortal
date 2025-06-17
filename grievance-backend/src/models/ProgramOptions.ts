export interface ProgramOptions {
  Id?: number;
  ProgramId: number;
  Term: number;
  Batch: number;
  GradingType: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateProgramOptionsData {
  ProgramId: number;
  Term: number;
  Batch: number;
  GradingType: string;
}

export interface UpdateProgramOptionsData {
  Batch?: number;
  GradingType?: string;
}
