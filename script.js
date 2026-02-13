// Stored Procedures Data
const procedures = [
    {
        name: 'SP_Report_GetAllExams',
        params: 'No Parameters',
        type: 'select',
        category: 'Select & Search',
        description: 'Returns complete list of all exams in the system for parameter dropdown population. Includes exam ID, title, and associated course name.',
        returns: 'Id (INT), Title (NVARCHAR), CourseName (NVARCHAR)',
        usage: 'Used by: Report_ExamQuestions.rdl'
    },
    {
        name: 'SP_Report_ExamQuestions',
        params: '@ExamId INT',
        type: 'select',
        category: 'Select & Search',
        description: 'Retrieves comprehensive exam details including all questions, multiple-choice options, question types, points, duration, and total score. Returns denormalized result set with one row per choice.',
        returns: 'ExamId, ExamTitle, CourseName, DurationInMinutes, TotalPoints, QuestionId, QuestionNumber, QuestionText, QuestionType, QuestionPoints, ChoiceId, ChoiceLetter, ChoiceText',
        usage: 'Used by: Report_ExamQuestions.rdl',
        example: 'EXEC SP_Report_ExamQuestions @ExamId = 1'
    },
    {
        name: 'SP_Report_GetAllStudents',
        params: 'No Parameters',
        type: 'select',
        category: 'Select & Search',
        description: 'Returns complete list of all students enrolled in the ITI system for parameter dropdown population. Provides student ID and full name for selection.',
        returns: 'Id (INT), FullName (NVARCHAR)',
        usage: 'Used by: Report_StudentGrades.rdl, Report_StudentExamComparison.rdl'
    },
    {
        name: 'SP_Report_StudentGrades',
        params: '@StudentId INT',
        type: 'select',
        category: 'Select & Search',
        description: 'Retrieves all exam results for a specific student including scores, percentages, and course information. Calculates grade percentage as (StudentScore / MaxPoints * 100).',
        returns: 'StudentId, StudentName, CourseName, ExamName, MaxPoints, StudentScore, GradePercentage',
        usage: 'Used by: Report_StudentGrades.rdl',
        example: 'EXEC SP_Report_StudentGrades @StudentId = 5'
    },
    {
        name: 'SP_Report_GetExamsByStudent',
        params: '@StudentId INT',
        type: 'select',
        category: 'Select & Search',
        description: 'Returns list of exams taken by a specific student for cascading parameter filtering. Used to populate the exam dropdown after student selection.',
        returns: 'Id (INT), Title (NVARCHAR)',
        usage: 'Used by: Report_StudentExamComparison.rdl (cascading parameter)',
        example: 'EXEC SP_Report_GetExamsByStudent @StudentId = 5'
    },
    {
        name: 'SP_Report_StudentExamComparison',
        params: '@StudentId INT, @ExamId INT',
        type: 'select',
        category: 'Select & Search',
        description: 'Performs detailed question-by-question comparison between student answers and model answers. Returns answer status (Correct/Incorrect/Unanswered), points earned, and submission timestamp.',
        returns: 'StudentId, StudentName, ExamId, ExamTitle, CourseName, SubmittedAt, QuestionNumber, QuestionText, QuestionType, QuestionPoints, ModelAnswerLetters, ModelAnswerText, StudentAnswerLetter, StudentAnswerText, AnswerStatus, PointsEarned',
        usage: 'Used by: Report_StudentExamComparison.rdl',
        example: 'EXEC SP_Report_StudentExamComparison @StudentId = 5, @ExamId = 1'
    },
    {
        name: 'SP_Report_GetAllBranches',
        params: 'No Parameters',
        type: 'select',
        category: 'Select & Search',
        description: 'Returns complete list of all ITI branches for parameter dropdown population. Includes branch ID, name, and city location.',
        returns: 'Id (INT), Name (NVARCHAR), City (NVARCHAR)',
        usage: 'Used by: Report_StudentsByBranch.rdl'
    },
    {
        name: 'SP_Report_StudentsByBranch',
        params: '@BranchId INT',
        type: 'select',
        category: 'Select & Search',
        description: 'Retrieves all students enrolled in a specific ITI branch including enrollment details, gender, track information, and current status.',
        returns: 'StudentId, StudentName, Gender, EnrollmentDate, TrackName, Status, BranchName, BranchCity',
        usage: 'Used by: Report_StudentsByBranch.rdl',
        example: 'EXEC SP_Report_StudentsByBranch @BranchId = 2'
    },
    {
        name: 'SP_Report_GetAllInstructors',
        params: 'No Parameters',
        type: 'select',
        category: 'Select & Search',
        description: 'Returns complete list of all instructors in the ITI system for parameter dropdown population. Provides instructor ID and full name.',
        returns: 'Id (INT), FullName (NVARCHAR)',
        usage: 'Used by: Report_StudentsByInstructor.rdl'
    },
    {
        name: 'SP_Report_StudentsByInstructor',
        params: '@InstructorId INT',
        type: 'select',
        category: 'Select & Search',
        description: 'Retrieves all students taught by a specific instructor, organized by course. Includes enrollment dates, course status, and final grades.',
        returns: 'InstructorId, InstructorName, CourseName, StudentId, StudentName, EnrollmentDate, CourseStatus, FinalGrade',
        usage: 'Used by: Report_StudentsByInstructor.rdl',
        example: 'EXEC SP_Report_StudentsByInstructor @InstructorId = 3'
    },
    {
        name: 'SP_Report_GetAllCourses',
        params: 'No Parameters',
        type: 'select',
        category: 'Select & Search',
        description: 'Returns complete list of all courses offered by ITI for parameter dropdown population. Includes course ID and title.',
        returns: 'Id (INT), Title (NVARCHAR)',
        usage: 'Used by: Report_TopicsByCourse.rdl'
    },
    {
        name: 'SP_Report_TopicsByCourse',
        params: '@CourseId INT',
        type: 'select',
        category: 'Select & Search',
        description: 'Retrieves complete curriculum structure for a specific course including all topics in sequential order. Shows course metadata and topic requirements.',
        returns: 'CourseId, CourseName, CourseCode, CourseDescription, DurationDays, TopicId, TopicName, TopicOrder, IsRequired',
        usage: 'Used by: Report_TopicsByCourse.rdl',
        example: 'EXEC SP_Report_TopicsByCourse @CourseId = 4'
    }
];

// Render Procedures
function renderProcedures(filteredProcedures = procedures) {
    const container = document.getElementById('proceduresContainer');
    const noResults = document.getElementById('noResults');
    
    if (filteredProcedures.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    container.innerHTML = filteredProcedures.map(proc => `
        <div class="procedure-card" onclick="showProcedureDetails(this)">
            <div class="procedure-name">${proc.name}</div>
            <div class="procedure-params">${proc.params}</div>
            <div class="procedure-type">${proc.category}</div>
            <div class="procedure-desc">${proc.description}</div>
            
            <div class="details-content" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><strong style="color: var(--burgundy-light);">Returns:</strong> ${proc.returns}</p>
                <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><strong style="color: var(--burgundy-light);">Used By:</strong> ${proc.usage}</p>
                ${proc.example ? `<p style="color: var(--text-secondary);"><strong style="color: var(--burgundy-light);">Example:</strong><br><code style="background: var(--medium-gray); padding: 0.5rem; display: block; margin-top: 0.5rem; border-radius: 4px; color: var(--blue);">${proc.example}</code></p>` : ''}
            </div>
        </div>
    `).join('');
}

// Show Procedure Details
function showProcedureDetails(element) {
    const details = element.querySelector('.details-content');
    const isVisible = details.style.display === 'block';
    
    // Close all other open details
    document.querySelectorAll('.procedure-card .details-content').forEach(d => {
        d.style.display = 'none';
    });
    
    // Toggle current details
    details.style.display = isVisible ? 'none' : 'block';
}

// Toggle Report Details
function toggleDetails(button) {
    const content = button.nextElementSibling;
    const isOpen = content.classList.contains('open');
    
    // Close all other details
    document.querySelectorAll('.details-content').forEach(detail => {
        detail.classList.remove('open');
    });
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.textContent = 'View Details ▼';
    });
    
    // Toggle current detail
    if (!isOpen) {
        content.classList.add('open');
        button.textContent = 'Hide Details ▲';
    } else {
        content.classList.remove('open');
        button.textContent = 'View Details ▼';
    }
}

// Search Functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Search in reports
    const reportCards = document.querySelectorAll('.report-card');
    reportCards.forEach(card => {
        const title = card.querySelector('.report-title').textContent.toLowerCase();
        const desc = card.querySelector('.report-desc').textContent.toLowerCase();
        const file = card.querySelector('.report-file').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || desc.includes(searchTerm) || file.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Search in procedures
    const filtered = procedures.filter(proc => {
        return proc.name.toLowerCase().includes(searchTerm) ||
               proc.description.toLowerCase().includes(searchTerm) ||
               proc.params.toLowerCase().includes(searchTerm);
    });
    renderProcedures(filtered);
});

// Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        
        // Filter procedures
        if (filter === 'all') {
            renderProcedures(procedures);
        } else {
            const filtered = procedures.filter(proc => {
                if (filter === 'insert') return proc.type === 'insert';
                if (filter === 'select') return proc.type === 'select';
                if (filter === 'update') return proc.type === 'update';
                if (filter === 'delete') return proc.type === 'delete';
                return true;
            });
            renderProcedures(filtered);
        }
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProcedures();
    
    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.report-card, .procedure-card, .deployment-card').forEach(card => {
        observer.observe(card);
    });
});
