-- ============================================
-- ITI Examination System - Report Stored Procedures
-- Production-safe / Rerunnable / SSRS-ready
-- ============================================

USE ITIExamintaionSystem8;
GO

/*============================================================
  Report 1: Students by Branch
============================================================*/
CREATE OR ALTER PROCEDURE dbo.SP_Report_StudentsByBranch
    @BranchId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        s.Id AS StudentId,
        CONCAT(s.FirstName, ' ', s.LastName) AS StudentName,
        s.Gender,
        s.DateOfBirth,
        s.EnrollmentDate,
        s.Status,
        s.GraduationDate,
        t.Title AS TrackName,
        b.Name AS BranchName,
        b.City AS BranchCity
    FROM Students s
    INNER JOIN Branches b ON s.BranchId = b.Id
    LEFT JOIN Tracks t ON s.TrackId = t.Id
    WHERE s.BranchId = @BranchId
    ORDER BY s.LastName, s.FirstName;
END
GO

/*============================================================
  Report 2: Student Grades by Exam (Latest Submission)
============================================================*/
CREATE OR ALTER PROCEDURE dbo.SP_Report_StudentGrades
    @StudentId INT
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH LatestSubmissions AS (
        SELECT *,
               ROW_NUMBER() OVER (
                   PARTITION BY StudentId, ExamId
                   ORDER BY SubmittedAt DESC, Id DESC
               ) AS rn
        FROM Submissions
        WHERE StudentId = @StudentId
    ),
    ExamScores AS (
        SELECT 
            sa.SubmissionId,
            SUM(ISNULL(sa.Point, 0)) AS TotalScore
        FROM StudentAnswers sa
        GROUP BY sa.SubmissionId
    )
    SELECT 
        s.Id AS StudentId,
        CONCAT(s.FirstName, ' ', s.LastName) AS StudentName,
        c.Id AS CourseId,
        c.Title AS CourseName,
        c.CourseCode,
        e.Id AS ExamId,
        e.Title AS ExamName,
        e.TotalPoints AS MaxPoints,
        ISNULL(es.TotalScore, 0) AS StudentScore,
        CASE 
            WHEN e.TotalPoints > 0
            THEN CAST(ROUND(ISNULL(es.TotalScore, 0) * 100.0 / e.TotalPoints, 2) AS DECIMAL(5,2))
            ELSE 0
        END AS GradePercentage
    FROM LatestSubmissions ls
    INNER JOIN Students s ON s.Id = ls.StudentId
    INNER JOIN Exams e ON e.Id = ls.ExamId
    INNER JOIN Courses c ON c.Id = e.CourseId
    LEFT JOIN ExamScores es ON es.SubmissionId = ls.Id
    WHERE ls.rn = 1
    ORDER BY c.Title, e.Title;
END
GO

/*============================================================
  Report 3: Students by Instructor
============================================================*/
CREATE OR ALTER PROCEDURE dbo.SP_Report_StudentsByInstructor
    @InstructorId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        i.Id AS InstructorId,
        CONCAT(i.FirstName, ' ', i.LastName) AS InstructorName,
        i.JobTitles,
        c.Id AS CourseId,
        c.Title AS CourseName,
        c.CourseCode,
        s.Id AS StudentId,
        CONCAT(s.FirstName, ' ', s.LastName) AS StudentName,
        s.Gender,
        sc.StartDate AS EnrollmentDate,
        sc.Status AS CourseStatus,
        sc.FinalGrade
    FROM Instructors i
    INNER JOIN CourseInstructors ci ON i.Id = ci.InstructorId
    INNER JOIN Courses c ON ci.CourseId = c.Id
    INNER JOIN StudentCourses sc ON c.Id = sc.CourseId
    INNER JOIN Students s ON sc.StudentId = s.Id
    WHERE i.Id = @InstructorId
      AND ci.HadLeft = 0
    ORDER BY
        c.Title,
        s.LastName,
        s.FirstName;
END
GO


/*============================================================
  Report 4: Topics by Course
============================================================*/
CREATE OR ALTER PROCEDURE dbo.SP_Report_TopicsByCourse
    @CourseId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.Id AS CourseId,
        c.Title AS CourseName,
        c.CourseCode,
        c.Description AS CourseDescription,
        c.DurationDays,
        t.Id AS TopicId,
        t.Title AS TopicName,
        t.[Order] AS TopicOrder,
        t.IsRequired,
        t.IsActive AS TopicIsActive
    FROM Courses c
    LEFT JOIN Topics t ON c.Id = t.CourseId
    WHERE c.Id = @CourseId
    ORDER BY ISNULL(t.[Order], 9999), t.Title;
END
GO

/*============================================================
  Report 5: Exam Questions with Choices
============================================================*/
CREATE OR ALTER PROCEDURE dbo.SP_Report_ExamQuestions
    @ExamId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.Id AS ExamId,
        e.Title AS ExamTitle,
        c.Title AS CourseName,
        e.DurationInMinutes,
        e.TotalPoints,
        q.Id AS QuestionId,
        ROW_NUMBER() OVER (ORDER BY q.Id) AS QuestionNumber,
        q.Body AS QuestionText,
        q.[Type] AS QuestionType,
        q.Points AS QuestionPoints,
        ch.Id AS ChoiceId,
        ch.ChoiceLetter,
        ch.Body AS ChoiceText,
        ch.DisplayOrder
    FROM Exams e
    INNER JOIN Courses c ON e.CourseId = c.Id
    INNER JOIN Questions q ON e.Id = q.ExamId
    LEFT JOIN Choices ch ON q.Id = ch.QuestionId
    WHERE e.Id = @ExamId
    ORDER BY q.Id, ch.DisplayOrder;
END
GO

/*============================================================
  Report 6: Student Exam Comparison (Latest Submission)
============================================================*/
CREATE OR ALTER PROCEDURE dbo.SP_Report_StudentExamComparison 
    @StudentId INT,
    @ExamId INT
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH LatestSubmission AS (
        SELECT *,
               ROW_NUMBER() OVER (
                   ORDER BY SubmittedAt DESC, Id DESC
               ) AS rn
        FROM Submissions
        WHERE StudentId = @StudentId
          AND ExamId = @ExamId
    )
    SELECT 
        s.Id AS StudentId,
        CONCAT(s.FirstName, ' ', s.LastName) AS StudentName,
        e.Id AS ExamId,
        e.Title AS ExamTitle,
        c.Title AS CourseName,
        sub.SubmittedAt,
        q.Id AS QuestionId,
        ROW_NUMBER() OVER (ORDER BY q.Id) AS QuestionNumber,
        ISNULL(q.Body, 'N/A') AS QuestionText,
        ISNULL(q.[Type], 'N/A') AS QuestionType,
        ISNULL(q.Points, 0) AS QuestionPoints,

        ISNULL(STRING_AGG(mc.ChoiceLetter, ', '), 'N/A') AS ModelAnswerLetters,
        ISNULL(STRING_AGG(mc.Body, ', '), 'N/A') AS ModelAnswerText,
        ISNULL(sc.ChoiceLetter, '-') AS StudentAnswerLetter,
        ISNULL(sc.Body, '(No Answer)') AS StudentAnswerText,

        CASE 
            WHEN q.[Type] IN ('MCQ', 'TF') THEN
                CASE 
                    WHEN sa.SelectedChoiceId IS NULL THEN 'Not Answered'
                    WHEN EXISTS (
                        SELECT 1
                        FROM Choices cc
                        WHERE cc.QuestionId = q.Id
                          AND cc.IsCorrect = 1
                          AND cc.Id = sa.SelectedChoiceId
                    )
                    THEN 'Correct'
                    ELSE 'Incorrect'
                END
            ELSE 'Manual Review'
        END AS AnswerStatus,

        ISNULL(sa.Point, 0) AS PointsEarned
    FROM LatestSubmission sub
    INNER JOIN Students s ON s.Id = sub.StudentId
    INNER JOIN Exams e ON e.Id = sub.ExamId
    INNER JOIN Courses c ON c.Id = e.CourseId
    INNER JOIN Questions q ON q.ExamId = e.Id
    LEFT JOIN StudentAnswers sa 
           ON sa.SubmissionId = sub.Id
          AND sa.QuestionId = q.Id
    LEFT JOIN Choices sc ON sc.Id = sa.SelectedChoiceId
    LEFT JOIN Choices mc 
           ON mc.QuestionId = q.Id
          AND mc.IsCorrect = 1
    WHERE sub.rn = 1
    GROUP BY
        s.Id, s.FirstName, s.LastName,
        e.Id, e.Title,
        c.Title,
        sub.SubmittedAt,
        q.Id, q.Body, q.[Type], q.Points,
        sc.ChoiceLetter, sc.Body,
        sa.SelectedChoiceId,
        sa.Point
    ORDER BY q.Id;
END
GO

/*============================================================
  Dropdown / Helper Procedures
============================================================*/
CREATE OR ALTER PROCEDURE dbo.SP_Report_GetAllBranches
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Name, City
    FROM Branches
    WHERE IsActive = 1
    ORDER BY Name;
END
GO

CREATE OR ALTER PROCEDURE dbo.SP_Report_GetAllStudents
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, CONCAT(FirstName, ' ', LastName) AS FullName
    FROM Students
    ORDER BY LastName, FirstName;
END
GO

CREATE OR ALTER PROCEDURE dbo.SP_Report_GetAllInstructors
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, CONCAT(FirstName, ' ', LastName) AS FullName, JobTitles
    FROM Instructors
    ORDER BY LastName, FirstName;
END
GO

CREATE OR ALTER PROCEDURE dbo.SP_Report_GetAllCourses
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Title, CourseCode
    FROM Courses
    WHERE IsActive = 1
    ORDER BY Title;
END
GO

CREATE OR ALTER PROCEDURE dbo.SP_Report_GetAllExams
AS
BEGIN
    SET NOCOUNT ON;
    SELECT e.Id, e.Title, c.Title AS CourseName
    FROM Exams e
    INNER JOIN Courses c ON e.CourseId = c.Id
    WHERE e.IsPublished = 1
    ORDER BY c.Title, e.Title;
END
GO

CREATE OR ALTER PROCEDURE dbo.SP_Report_GetExamsByStudent
    @StudentId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT
        e.Id,
        e.Title,
        c.Title AS CourseName
    FROM Exams e
    INNER JOIN Courses c ON e.CourseId = c.Id
    INNER JOIN Submissions sub ON sub.ExamId = e.Id
    WHERE sub.StudentId = @StudentId
    ORDER BY c.Title, e.Title;
END
GO

PRINT 'All report stored procedures created successfully.';
GO
