-- Database initialization script for DSEU Grievance Project 2025

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS PersonalInfo CASCADE;
DROP TABLE IF EXISTS AcademicInfo CASCADE;
DROP TABLE IF EXISTS Attachment CASCADE;
DROP TABLE IF EXISTS AdminInfo CASCADE;
DROP TABLE IF EXISTS GrievanceHistory CASCADE;
DROP TABLE IF EXISTS Grievance CASCADE;
DROP TABLE IF EXISTS Response CASCADE;


-- Create PersonalInfo table
CREATE TABLE PersonalInfo (
    id SERIAL PRIMARY KEY,
    RollNo VARCHAR(50) UNIQUE NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Father VARCHAR(255),
    Mother VARCHAR(255),
    Abc VARCHAR(100),
    DOB DATE,
    Category VARCHAR(50),
    Gender VARCHAR(10),
    Pwd BOOLEAN DEFAULT FALSE,
    Phone VARCHAR(15),
    Email VARCHAR(255),
    Password VARCHAR(255),
    IsVerified BOOLEAN DEFAULT FALSE,
    AdmissionYear INTEGER,
    LE BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    UpdatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
);

-- Create AcademicInfo table
CREATE TABLE AcademicInfo (
    Id SERIAL PRIMARY KEY,
    RollNo VARCHAR(50) NOT NULL,
    ProgramId INTEGER NOT NULL,
    AcademicYear VARCHAR(20) NOT NULL,
    Term INTEGER NOT NULL,
    CampusId INTEGER NOT NULL,
    Batch INTEGER NOT NULL,
    Status VARCHAR(50) DEFAULT 'active',
    CreatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    UpdatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    CONSTRAINT fk_academicinfo_rollno FOREIGN KEY (RollNo) REFERENCES PersonalInfo(RollNo) ON DELETE CASCADE,
    CONSTRAINT fk_academicinfo_program FOREIGN KEY (ProgramId) REFERENCES ProgramInfo(ProgramId) ON DELETE CASCADE,
    CONSTRAINT fk_academicinfo_campus FOREIGN KEY (CampusId) REFERENCES CampusInfo(CampusId) ON DELETE CASCADE,
    CONSTRAINT unique_rollno_academicyear_term UNIQUE (RollNo, AcademicYear, Term)
);

-- Create Admin table
CREATE TABLE Admin (
    id SERIAL PRIMARY KEY,
    AdminId VARCHAR(50) UNIQUE NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255),
    Role VARCHAR(50) DEFAULT 'admin',
    IsActive BOOLEAN DEFAULT TRUE,
    LastLogin TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    UpdatedAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata')
);

-- create Grievance table
CREATE TABLE Grievance (
   id SERIAL PRIMARY KEY,
   Issuse_Id VARCHAR(50) NOT NULL,
   RollNo VARCHAR(50) NOT NULL,
   Campus VARCHAR(50) NOT NULL,
   Subject VARCHAR(255) NOT NULL,
   Description TEXT NOT NULL,
   Issuse_type VARCHAR(50) NOT NULL,
    Status VARCHAR(50) DEFAULT 'pending',
    Attachment TEXT, --it can be null
    Date TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),   
    CONSTRAINT fk_grievance_rollno FOREIGN KEY (RollNo) REFERENCES PersonalInfo(RollNo) ON DELETE CASCADE 
);

--create Response table
CREATE TABLE Response (
    id SERIAL PRIMARY KEY,
    Issuse_Id INTEGER NOT NULL,
    ResponseText TEXT NOT NULL,
    ResponseBy VARCHAR(50) NOT NULL,
    ResponseAt TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    Status VARCHAR(50) DEFAULT 'pending',
    Stage VARCHAR(50) NOT NULL,
    attachment TEXT, --it can be null
    redirect VARCHAR(50),
    Date TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Kolkata'),
    CONSTRAINT fk_response_grievance FOREIGN KEY (Issuse_Id) REFERENCES Grievance(id) ON DELETE CASCADE
);

--Create GrievanceHistory table
CREATE TABLE GrievanceHistory (
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

-- Create Attachment table
CREATE TABLE Attachment (
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





