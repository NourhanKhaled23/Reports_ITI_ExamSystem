# ITI Reporting System – SSRS Reports  
**Executive Summary  for ITI Exams & Student Management**
https://iti-docs-kxs99omt4-nourhans-projects-cf866dc5.vercel.app/

<img width="251" height="252" alt="image" src="https://github.com/user-attachments/assets/3b9a4f94-d410-48e6-adb4-e1241f1fd51d" />
<p align="center">
  <em>Comprehensive SQL Server Reporting Services (SSRS) solution delivering actionable insights into student performance, exam structures, and organizational metrics at the Information Technology Institute (ITI).</em>
</p>

## ✨ Key Features
- Comprehensive exam question analysis (with multiple-choice support)
- Student performance tracking & grade visualization
- Detailed student-exam answer comparison & validation
- Branch-wise and instructor-wise student distribution
- Course topics organization & curriculum overview
- Professional ITI branding (burgundy color scheme `#800020`)

## 🛠 Technology Stack
| Component              | Technology / Version          |
|------------------------|-------------------------------|
| Reporting Platform     | SQL Server Reporting Services 2016 (SSRS 2016) |
| Database               | ITIExamDB (SQL Server)        |
| Development Environment| Visual Studio 2022            |
| Report Definition      | RDL 2016 format               |
| Data Access            | Stored Procedures             |

## 📊 Project Overview
- **Purpose**: Provide stakeholders (instructors, students, branch managers, curriculum developers) with clear, printable, and parameterized reports.
- **Scope**: 6 dynamic SSRS reports with parameters, KPIs, conditional formatting, and professional layout.
- **Solution Structure**:
  - `ITI_Report.sln`
  - `ITI_Report.rptproj`
  - `ITIExamDB.rds` (shared data source)
  - 6 × `.rdl` report files

### System Architecture
Three-tier design:
1. **Presentation** → SSRS Report Rendering Engine
2. **Business Logic** → SQL Server Stored Procedures
3. **Data** → ITIExamDB database

## 🔐 Security & Data Source Configuration
- **Connection String Settings**:
  - `Encrypt=True`
  - `TrustServerCertificate=True` (development)
  - `MultipleActiveResultSets=True`
- **Data Source**: Shared `ITIExamDB.rds`
  - Type: SQL Server
  - Authentication: Dedicated DB credentials (not Windows integrated in production)

## 📑 Report Catalog

| # | Report Name                        | File Name                        | Target Audience                  | Main Purpose                              | Key Parameters          |
|---|------------------------------------|----------------------------------|----------------------------------|-------------------------------------------|--------------------------|
| 1 | **Offline Exam Paper**             | Report_ExamQuestions.rdl         | Instructors, Exam Controllers    | Printable exam paper / reference sheet    | ExamId                  |
| 2 | **Student Grades Executive Summary**| Report_StudentGrades.rdl        | Students, Academic Advisors      | High-level student performance overview   | StudentId               |
| 3 | **Exam Answer Comparison**         | Report_StudentExamComparison.rdl | Students (feedback), Instructors | Question-by-question answer validation    | StudentId, ExamId       |
| 4 | **Students by Branch**             | Report_StudentsByBranch.rdl      | Branch Managers, Admins          | Demographic & status overview per branch  | BranchId                |
| 5 | **Students by Instructor**         | Report_StudentsByInstructor.rdl  | Instructors, Academic Managers   | Consolidated student list per instructor  | InstructorId            |
| 6 | **Course Topics Outline**          | Report_TopicsByCourse.rdl        | Curriculum Developers, Instructors | Curriculum sequence & mandatory topics   | CourseId                |

### 📋 Report Highlights

#### 1. **Exam Questions Report** (`Report_ExamQuestions.rdl`)
- **KPIs**: Duration • Total Points • Question Count
- **Key Features**: Dynamic rendering of questions with multiple-choice options
- **Visuals**: Professional exam header with ITI logo and branding
- **Data Sources**: `SP_Report_GetAllExams`, `SP_Report_ExamQuestions`

#### 2. **Student Grades Executive Summary** (`Report_StudentGrades.rdl`)
- **KPIs**: Total Exams • Average Score (%) • Performance Status
- **Key Features**: Color-coded performance (Green ≥85%, Light Green ≥70%, Orange ≥50%, Red <50%)
- **Visuals**: Executive dashboard style with conditional formatting
- **Data Sources**: `SP_Report_GetAllStudents`, `SP_Report_StudentGrades`

#### 3. **Student Exam Comparison** (`Report_StudentExamComparison.rdl`)
- **KPIs**: Questions • Your Score • Total Points
- **Key Features**: Side-by-side answer comparison with status indicators
- **Visuals**: 
  - Correct answers → **Bold Green**
  - Incorrect → Light Red background
  - Not Answered → Light Grey background
- **Data Sources**: `SP_Report_GetExamsByStudent`, `SP_Report_StudentExamComparison`

#### 4. **Students by Branch** (`Report_StudentsByBranch.rdl`)
- **KPIs**: Total Students • Active • Graduated
- **Key Features**: Demographic & status overview per branch
- **Visuals**: Status color coding (Active=Green, Graduated=Blue, Other=Grey)
- **Data Sources**: `SP_Report_GetAllBranches`, `SP_Report_StudentsByBranch`

#### 5. **Students by Instructor** (`Report_StudentsByInstructor.rdl`)
- **KPIs**: Total Students • Number of Courses • Average Grade
- **Key Features**: Consolidated roster across all courses taught
- **Visuals**: Green highlighting for completed courses
- **Data Sources**: `SP_Report_GetAllInstructors`, `SP_Report_StudentsByInstructor`

#### 6. **Course Topics Outline** (`Report_TopicsByCourse.rdl`)
- **KPIs**: Total Topics • Course Duration • Required Topics
- **Key Features**: Sequential curriculum outline with requirement status
- **Visuals**: Required topics in **Green**, Optional in Grey
- **Data Sources**: `SP_Report_GetAllCourses`, `SP_Report_TopicsByCourse`)

## 🔗 Stored Procedures (Reporting Layer)
- SP_Report_GetAllExams  
- SP_Report_ExamQuestions  
- SP_Report_GetAllStudents  
- SP_Report_StudentGrades  
- SP_Report_GetExamsByStudent  
- SP_Report_StudentExamComparison  
- SP_Report_GetAllBranches  
- SP_Report_StudentsByBranch  
- SP_Report_GetAllInstructors  
- SP_Report_StudentsByInstructor  
- SP_Report_GetAllCourses  
- SP_Report_TopicsByCourse
- <img width="686" height="438" alt="Screenshot 2026-02-01 202543" src="https://github.com/user-attachments/assets/6ae4605e-8ac9-4d8d-999f-618c0ca2be05" />
<img width="1919" height="982" alt="image" src="https://github.com/user-attachments/assets/76541c4c-6483-4be8-b7f4-d23e8812a313" />

  <img width="1918" height="941" alt="Screenshot 2026-02-01 210542" src="https://github.com/user-attachments/assets/b580d401-d0b0-4850-8183-deada11f40ca" />
<img width="1832" height="985" alt="image" src="https://github.com/user-attachments/assets/7f0dfae6-5182-41ec-a036-f9b5f9a3705b" />

<img width="1917" height="987" alt="image" src="https://github.com/user-attachments/assets/8a0a8bd1-3694-428b-a293-c8c7d02a6e05" />

<img width="1919" height="941" alt="Screenshot 2026-02-01 205310" src="https://github.com/user-attachments/assets/9bfec2e7-9231-4e32-9450-13a50c1b4464" />

## 🚀 Deployment Guide
1. Open solution in **Visual Studio 2022**
2. Right-click project → **Properties** → Set **TargetServerURL**
3. Update **ITIExamDB.rds** connection string to point to the target database
4. **Build** → **Deploy** (or manually upload `.rdl` files via Report Manager)
5. Test reports → Verify parameters, formatting, and data rendering

