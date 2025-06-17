-- CampusInfo table
CREATE TABLE IF NOT EXISTS CampusInfo (
    CampusId SERIAL PRIMARY KEY,
    UpdatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
);

-- ProgramInfo table
CREATE TABLE IF NOT EXISTS ProgramInfo (
    ProgramId SERIAL PRIMARY KEY,
    UpdatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
);

-- ProgramOptions table
CREATE TABLE IF NOT EXISTS ProgramOptions (
    Id SERIAL PRIMARY KEY,
    ProgramId INTEGER,
    Term INTEGER,
    Batch INTEGER,
    GradingType VARCHAR(50),
    CONSTRAINT unique_program_term_batch UNIQUE (ProgramId, Term, Batch)
);

-- CampusProgram table
CREATE TABLE IF NOT EXISTS CampusProgram (
    Id SERIAL PRIMARY KEY,
    CampusId INTEGER,
    ProgramId INTEGER,
    Batch INTEGER,
    CONSTRAINT unique_campus_program_batch UNIQUE (CampusId, ProgramId, Batch)
);

-- Course table
CREATE TABLE IF NOT EXISTS Course (
    CourseId SERIAL UNIQUE PRIMARY KEY,
    CourseCode VARCHAR(50),
    CourseName VARCHAR(255),
    Term INTEGER,
    CourseType VARCHAR(50),
    Credit INTEGER,
    UpdatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
);

-- CourseEval table
CREATE TABLE IF NOT EXISTS CourseEval (
    Id SERIAL PRIMARY KEY,
    CourseId INTEGER,
    Lect INTEGER,
    Tut INTEGER,
    Pract INTEGER,
    CompTypes VARCHAR(50),
    CONSTRAINT fk_course_eval_course FOREIGN KEY (CourseId) REFERENCES Course(CourseId) ON DELETE CASCADE
);

-- CourseProgram table
CREATE TABLE IF NOT EXISTS CourseProgram (
    Id SERIAL PRIMARY KEY,
    ProgramId INTEGER,
    CourseId INTEGER,
    Batch INTEGER,
    IsActive BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_program_course_batch UNIQUE (ProgramId, CourseId, Batch)
);

-- PersonalInfo table
CREATE TABLE IF NOT EXISTS PersonalInfo (
    RollNo VARCHAR(50) PRIMARY KEY,
    Name VARCHAR(255),
    Father VARCHAR(255),
    Mother VARCHAR(255),
    Abc VARCHAR(50),
    DOB DATE,
    Category VARCHAR(50),
    Gender VARCHAR(10),
    Pwd BOOLEAN,
    Phone VARCHAR(20),
    Email VARCHAR(255),
    Password VARCHAR(255),
    IsVerified BOOLEAN DEFAULT FALSE,
    AdmissionYear INTEGER,
    LE BOOLEAN,
    CreatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    UpdatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
);

-- Admin table
CREATE TABLE IF NOT EXISTS Admin (
    AdminId VARCHAR(50) PRIMARY KEY,
    Name VARCHAR(255),
    Email VARCHAR(255),
    Password VARCHAR(255),
    Role VARCHAR(50)
);

-- OTP table
CREATE TABLE IF NOT EXISTS OTP (
    Id SERIAL PRIMARY KEY,
    RollNo VARCHAR(50),
    Otp VARCHAR(10),
    Email VARCHAR(255),
    Attempt INTEGER,
    CreatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
);

-- AdminOTP table
CREATE TABLE IF NOT EXISTS AdminOTP (
    Id SERIAL PRIMARY KEY,
    AdminId VARCHAR(50),
    Otp VARCHAR(10),
    Email VARCHAR(255),
    Attempt INTEGER,
    CreatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
);

-- AcademicInfo table
CREATE TABLE IF NOT EXISTS AcademicInfo (
    Id SERIAL PRIMARY KEY,
    RollNo VARCHAR(50),
    ProgramId INTEGER,
    AcademicYear INTEGER,
    Term INTEGER,
    CampusId INTEGER,
    Batch INTEGER
);

-- Grievance table
CREATE TABLE IF NOT EXISTS Grievance (
   id SERIAL PRIMARY KEY,
   Issuse_Id VARCHAR(50) NOT NULL,
   RollNo VARCHAR(50) NOT NULL,
   Campus VARCHAR(50) NOT NULL,
   Subject VARCHAR(255) NOT NULL,
   Description TEXT NOT NULL,
   Issuse_type VARCHAR(50) NOT NULL,
   Status VARCHAR(50) DEFAULT 'pending',
   Attachment TEXT,
   Date TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),   
   CONSTRAINT fk_grievance_rollno FOREIGN KEY (RollNo) REFERENCES PersonalInfo(RollNo) ON DELETE CASCADE 
);

-- Response table
CREATE TABLE IF NOT EXISTS Response (
    id SERIAL PRIMARY KEY,
    Issuse_Id INTEGER NOT NULL,
    ResponseText TEXT NOT NULL,
    ResponseBy VARCHAR(50) NOT NULL,
    ResponseAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    Status VARCHAR(50) DEFAULT 'pending',
    Stage VARCHAR(50) NOT NULL,
    attachment TEXT,
    redirect VARCHAR(50),
    Date TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    CONSTRAINT fk_response_grievance FOREIGN KEY (Issuse_Id) REFERENCES Grievance(id) ON DELETE CASCADE
);

-- GrievanceHistory table
CREATE TABLE IF NOT EXISTS GrievanceHistory (
    Id SERIAL PRIMARY KEY,
    Issuse_Id INTEGER NOT NULL,
    from_status VARCHAR(50) NOT NULL,
    to_status VARCHAR(50) NOT NULL,
    action_by VARCHAR(50) NOT NULL,
    stage_type VARCHAR(50) NOT NULL,
    Note TEXT,
    DATE TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    CONSTRAINT fk_history_grievance FOREIGN KEY (Issuse_Id) REFERENCES Grievance(id) ON DELETE CASCADE
);

-- Attachment table
CREATE TABLE IF NOT EXISTS Attachment (
    id SERIAL PRIMARY KEY,
    Issuse_Id INTEGER NOT NULL,
    FileName VARCHAR(255) NOT NULL,
    FilePath VARCHAR(255) NOT NULL,
    UploadedBy VARCHAR(50) NOT NULL,
    UploadedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    CreatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    UpdatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    CONSTRAINT fk_attachment_grievance FOREIGN KEY (Issuse_Id) REFERENCES Grievance(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_grievance_rollno ON Grievance(RollNo);
CREATE INDEX IF NOT EXISTS idx_grievance_status ON Grievance(Status);
CREATE INDEX IF NOT EXISTS idx_grievance_date ON Grievance(Date);
CREATE INDEX IF NOT EXISTS idx_response_issueid ON Response(Issuse_Id);
CREATE INDEX IF NOT EXISTS idx_history_issueid ON GrievanceHistory(Issuse_Id);
CREATE INDEX IF NOT EXISTS idx_attachment_issueid ON Attachment(Issuse_Id);