export interface ProgramInfo {
  ProgramId?: number;
  ProgramCode: string;
  ProgramName: string;
  ProgramType: string;
  TermType: string;
  Specialisation?: boolean;
  SpecialCode?: string;
  SpecialName?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateProgramInfoData {
  ProgramId?: number; // Optional for creation, will be set by the database
  ProgramCode: string;
  ProgramName: string;
  ProgramType: string;
  TermType: string;
  Specialisation?: boolean;
  SpecialCode?: string;
  SpecialName?: string;
}

export interface UpdateProgramInfoData {
  ProgramCode?: string;
  ProgramName?: string;
  ProgramType?: string;
  TermType?: string;
  Specialisation?: boolean;
  SpecialCode?: string;
  SpecialName?: string;
}
