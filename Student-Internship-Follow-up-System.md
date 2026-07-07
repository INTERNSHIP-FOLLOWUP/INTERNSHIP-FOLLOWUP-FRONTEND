# 🎓 Student Internship Follow-up System

A web-based Internship Management System developed to help internship coordinators, tutors, students, and company representatives efficiently manage internship activities, monitor student progress, and improve communication throughout the internship period.

---

## 📖 Project Overview

The **Student Internship Follow-up System** is designed to simplify internship management by allowing administrators, tutors, students, and company representatives to collaborate in one platform.

The system supports:

- Internship placement management
- Weekly worklog tracking
- Student progress monitoring
- Follow-up meeting records
- Company evaluations
- Internship issue management
- Dashboard and reporting
- Notifications

---

## 🎯 Project Goals

- Improve internship management
- Strengthen communication between students, tutors, and companies
- Monitor internship performance
- Generate internship reports
- Ensure successful internship outcomes

---

# 👥 User Roles

## 👨‍💼 Admin

Admin can:

- Manage users
- Manage companies
- Manage internship batches
- Assign tutors
- Assign students to companies
- Monitor internship activities
- View dashboard reports

---

## 👨‍🏫 Tutor

Tutor can:

- Login
- View assigned students
- Review weekly worklogs
- Add feedback
- Record follow-up meetings
- Track internship issues
- Update internship progress

---

## 👨‍🎓 Student

Student can:

- Login
- View internship information
- Submit weekly worklogs
- Upload supporting documents
- View tutor feedback
- Report internship issues

---

## 🏢 Company Representative

Company representatives can:

- Login
- View assigned students
- Submit evaluations
- Provide feedback
- Communicate with tutors

---

# 🛠 Technology Stack

| Technology | Version |
|------------|----------|
| Frontend | Vue 3 |
| Backend | Laravel 12 |
| Database | MySQL 8 |
| Authentication | Laravel Sanctum |
| API | REST API |
| Methodology | Agile Scrum |

---

# ✨ Main Features

## 🔐 Authentication

- User Registration
- Login
- Logout
- Password Reset
- Update Profile
- Upload Avatar

---

## 🏢 Company Management

- Create Company
- Update Company
- Delete Company
- Search Company
- View Company Profile
- Manage Company Contacts

---

## 🎓 Student Management

- Create Student
- Update Student
- Delete Student
- Assign Tutor
- Assign Company
- Upload Profile Photo
- Update Internship Status

---

## 📅 Batch Management

- Create Batch
- Edit Batch
- Delete Batch
- View Batch Statistics

---

## 💼 Internship Assignment

- Assign Students
- Reassign Students
- Update Assignment Status
- Track Internship Period

Assignment Status:

- Assigned
- In Progress
- Completed
- Terminated

---

## 📝 Weekly Worklogs

Students can:

- Submit worklogs
- Edit worklogs
- Upload supporting documents

Tutors can:

- Review worklogs
- Add feedback

---

## 📆 Follow-up Management

Tutors can:

- Create follow-up records
- Schedule meetings
- Record meeting notes
- Update follow-up information

---

## ⚠️ Issue Management

- Create Issues
- Update Issues
- Assign Issues
- Resolve Issues

Issue Status:

- Open
- In Progress
- Resolved
- Closed

---

## 💬 Comments

- Add comments
- Edit comments
- Delete comments
- Mention tutors

---

## 📁 File Upload

Supported file types:

- PNG
- JPG
- PDF
- DOCX

---

## 🔍 Search & Filter

Search by:

- Student
- Company
- Tutor
- Batch
- Internship Status

---

## 📊 Dashboard

Admin Dashboard includes:

- Total Students
- Total Companies
- Active Internships
- Completed Internships
- Students per Company
- Students per Batch

---

## 🔔 Notifications

The system notifies users when:

- Worklogs are submitted
- Tutors review worklogs
- Follow-ups are scheduled
- Evaluations are submitted
- Internship assignments change
- Issue status changes

---

# 🗄 Database Tables

| Table |
|--------|
| users |
| students |
| companies |
| batches |
| internship_assignments |
| worklogs |
| followups |
| comments |
| attachments |
| evaluations |
| notifications |

---

# 📂 Project Structure

## Backend (Laravel)

```
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
├── Models/
├── Services/
├── Middleware/
routes/
database/
```

---

## Frontend (Vue 3)

```
src/
├── assets/
├── components/
├── layouts/
├── views/
├── router/
├── stores/
├── services/
├── composables/
├── utils/
├── App.vue
└── main.js
```

---

# 🌐 REST API

## Authentication

```
POST   /api/register
POST   /api/login
POST   /api/logout
POST   /api/forgot-password
PUT    /api/profile
```

## Companies

```
GET    /api/companies
POST   /api/companies
PUT    /api/companies/{id}
DELETE /api/companies/{id}
```

## Students

```
GET    /api/students
POST   /api/students
PUT    /api/students/{id}
DELETE /api/students/{id}
```

## Worklogs

```
GET    /api/worklogs
POST   /api/worklogs
PUT    /api/worklogs/{id}
DELETE /api/worklogs/{id}
```

## Follow-ups

```
GET    /api/followups
POST   /api/followups
PUT    /api/followups/{id}
```

## Issues

```
GET    /api/issues
POST   /api/issues
PUT    /api/issues/{id}
```

## Dashboard

```
GET /api/dashboard
GET /api/reports
GET /api/notifications
```

---

# 🚀 Sprint Planning

## Sprint 1

- Laravel Setup
- Vue Setup
- Authentication
- User Roles
- Dashboard Layout

---

## Sprint 2

- Company Management
- Batch Management
- Student Management
- Tutor Assignment
- Internship Assignment

---

## Sprint 3

- Weekly Worklogs
- File Upload
- Comments
- Follow-ups
- Company Evaluation
- Issue Tracking

---

## Sprint 4

- Dashboard
- Reports
- Notifications
- Testing
- Deployment

---

# 🔒 Security

- Laravel Sanctum Authentication
- Role-Based Access Control (RBAC)
- Password Hashing
- Form Validation
- File Validation
- SQL Injection Protection
- CSRF Protection
- XSS Protection

---

# 📈 Future Improvements

- Dashboard Analytics
- Email Notifications
- Calendar View
- PDF & Excel Export
- Attendance Tracking
- Company Portal Dashboard

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/student-internship-followup-system.git
```

---

## Backend Setup

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan storage:link

php artisan serve
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 📌 System Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.x
- Nginx or Apache
- Git

---

# 📄 License

This project is developed for educational purposes at **Passerelles Numeriques Cambodia**.

---

# 👨‍💻 Developers

Developed by the Internship Project Team.

```

### I recommend one improvement

Instead of a simple README like this, create a **GitHub-style professional README** with:
- 📸 Screenshots (Dashboard, Login, Student Page, etc.)
- 🏗️ Architecture Diagram
- 📊 ER Diagram
- 🎨 UI Preview
- 🛣️ Roadmap
- 🤝 Contributing Guide
- 📜 License
- ⭐ Badges (Laravel, Vue, MySQL, GitHub Actions)

That style looks much more professional for internships and portfolios.