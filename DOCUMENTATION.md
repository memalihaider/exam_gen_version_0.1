# Exam Paper Generator - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [System Components](#system-components)
5. [Database Structure](#database-structure)
6. [User Roles & Authentication](#user-roles--authentication)
7. [Features & Modules](#features--modules)
8. [API Endpoints](#api-endpoints)
9. [Installation & Setup](#installation--setup)
10. [Application Flow](#application-flow)
11. [File Structure](#file-structure)
12. [Security Implementation](#security-implementation)

---

## Overview

**Exam Paper Generator** is a comprehensive web-based platform designed to revolutionize the creation and management of educational examination papers. Built by **Largify Solutions**, this system enables educational institutions to:

- Generate custom exam papers for classes 9th through 12th
- Manage question banks across multiple subjects
- Handle multiple user roles (Super Admin, Admin, Teachers)
- Track paper generation history
- Manage teacher accounts and permissions
- Store and retrieve past papers

**Version:** 1.1  
**Platform:** Web-based (Next.js 15.2.1)  
**Database:** MySQL (Hostinger hosted)  
**Status:** Production Ready

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15.2.1 (React 19.0.0)
- **Language:** JavaScript/TypeScript
- **Styling:** 
  - Tailwind CSS 4.0
  - Framer Motion 12.5.0 (Animations)
  - Custom CSS
- **UI Components:**
  - Radix UI (Labels, Slots)
  - Lucide React (Icons)
  - React Icons
  - Class Variance Authority (Component variants)
- **Math Rendering:** 
  - KaTeX 0.16.22
  - React-KaTeX 3.1.0
- **Fonts:**
  - Geist Sans & Geist Mono (Google Fonts)
  - Nastaliq (Urdu/Arabic text)
  - Material Symbols Outlined

### Backend
- **API Layer:** PHP 7.x+
- **Database:** MySQL 2 (mysql2 3.14.0 for Node.js)
- **Authentication:** NextAuth 4.24.11 + Custom PHP Auth
- **Email Service:** EmailJS 4.4.1
- **Session Management:** Browser SessionStorage + Server-side

### Database Connection
- **Host:** edu.largifysolutions.com
- **Database:** u421900954_ecompapgen
- **User:** u421900954_PaperGenerator
- **Connection Pool:** 10 connections (Node.js)

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint 9 with Next.js config
- **Build Tool:** Next.js Turbopack
- **Version Control:** Git

---

## Architecture

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Next.js Frontend (React 19)                │    │
│  │  - Pages & Components                              │    │
│  │  - Client-side State Management                    │    │
│  │  - SessionStorage for Auth                         │    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │ HTTP/HTTPS
                    │
┌───────────────────▼──────────────────────────────────────────┐
│              Next.js Server (Node.js)                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - Server Components                               │    │
│  │  - Middleware (Protected Routes)                   │    │
│  │  - API Routes (Limited)                            │    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │ HTTP POST/GET
                    │
┌───────────────────▼──────────────────────────────────────────┐
│              PHP Backend API (Hostinger)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  - auth.php (User Authentication)                  │    │
│  │  - api-questions.php (Question CRUD)               │    │
│  │  - api-papers.php (Paper Management)               │    │
│  │  - api-teachers.php (Teacher Management)           │    │
│  │  - api-students.php (Student Management)           │    │
│  │  - upload-image.php (Image Uploads)                │    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │ MySQL Queries
                    │
┌───────────────────▼──────────────────────────────────────────┐
│         MySQL Database (Hostinger)                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Tables:                                           │    │
│  │  - users (Admin/Super Admin)                       │    │
│  │  - teachers (Teacher accounts)                     │    │
│  │  - questions (Question bank)                       │    │
│  │  - allpapers (Generated papers)                    │    │
│  │  - user_history (Activity logs)                    │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Deployment Configuration

- **Output Mode:** Static Export (`output: 'export'`)
- **Image Optimization:** Unoptimized (for static hosting)
- **Supported Formats:** AVIF, WebP
- **Hosting:** Can be deployed on Vercel, Netlify, or any static host

---

## System Components

### 1. Authentication System

**Location:** `auth.php`, `src/contexts/AuthContext.jsx`, `src/contexts/UserContext.jsx`

**Features:**
- Multi-role authentication (Super Admin, Admin, Teacher)
- Password hashing (PHP `password_hash()`)
- Session management via SessionStorage
- Protected route middleware
- Automatic session validation

**User Flow:**
1. User enters credentials at `/login`
2. PHP validates against `users` or `teachers` table
3. Password verified using `password_verify()`
4. User data stored in SessionStorage
5. NextAuth middleware protects routes
6. Session persists until logout

### 2. Question Management System

**Location:** `api-questions.php`, `src/app/add-questions/`, `src/app/view-questions/`

**Question Types:**
- **MCQs** (Multiple Choice Questions)
- **Short Questions** (Brief answers)
- **Long Questions** (Detailed answers with parts)
- **Long Questions with Parts** (Subdivided questions)

**Question Structure:**
```javascript
{
  id: "unique-id",
  type: "mcqs|short|long|long-with-parts",
  class: "9th|10th|11th|12th",
  subject: "Biology|Physics|Chemistry|...",
  chapter: "Unit/Chapter name",
  topic: "Specific exercise/topic",
  marks: "1|2|3|4|5",
  text: "Question text with LaTeX support",
  options: ["A", "B", "C", "D"], // For MCQs only
  answer: "Correct answer",
  parts: [{part: "a", question: "...", marks: "2"}], // For long questions
  images: ["url1", "url2"], // Optional
  source: "Book name/source",
  medium: "English|Urdu"
}
```

**Operations:**
- Create question (POST)
- Read questions with filters (GET)
- Update question (PUT/PATCH)
- Delete question (DELETE)
- Image attachment support
- LaTeX math rendering

### 3. Paper Generation System

**Location:** `src/app/generate-paper/`, `api-papers.php`

**Supported Classes & Subjects:**

**9th Class:**
- Biology, Physics, Chemistry
- Computer Science, Mathematics
- English, Urdu, Islamiat
- Pakistan Studies, Quran Translation

**10th Class:**
- Biology, Physics, Chemistry
- Computer Science, Mathematics
- English, Urdu, Pakistan Studies
- Quran Translation

**11th Class:**
- Biology, Physics, Chemistry
- Computer Science, Mathematics
- English, Urdu, Islamiat (Lazmi)
- Quran Translation

**12th Class:**
- Biology, Physics, Chemistry
- Computer Science, Mathematics
- English, Urdu, Pakistan Studies
- Quran Translation

**Paper Generation Process:**
1. Select class (9th-12th)
2. Choose subject
3. Select chapters/units
4. Choose exercises/topics
5. Configure question distribution:
   - Number of MCQs
   - Number of short questions
   - Number of long questions
6. Preview generated paper
7. Save or print paper

**Paper Status:**
- `SAVED` - Stored for future use
- `DELETED` - Soft deleted papers
- `DRAFT` - Work in progress (Coming soon)

### 4. Teacher Management

**Location:** `src/app/teachers/`, `auth.php`

**Teacher Entity:**
```javascript
{
  id: number,
  teacher_name: string,
  father_name: string,
  username: string,
  email: string,
  password: hashed_string,
  class: string,
  subject: JSON array,
  address: string,
  status: "active|inactive",
  created_at: timestamp
}
```

**Operations:**
- Create teacher account
- Assign class and subjects
- Update teacher details
- Delete teacher account
- Change teacher status
- Login as teacher

**Teacher Permissions:**
- Generate papers for assigned subjects
- View question bank
- Add questions
- Save papers
- View past papers
- View profile
- Limited dashboard access (no admin features)

### 5. User Management

**Location:** `src/app/profile/`, `auth.php`

**User Types:**

**Super Admin:**
- Full system access
- User management
- Teacher management
- System statistics
- Login history
- Package management

**Admin:**
- Paper generation
- Question management
- Limited user viewing
- Teacher viewing
- Papers history

**Teacher:**
- Paper generation (assigned subjects)
- Question viewing/adding
- Profile management
- Limited dashboard

**User Schema:**
```javascript
{
  id: number,
  name: string,
  email: string,
  password: hashed_string,
  role: "super_admin|admin|user",
  package: "basic|pro|business|exceptional",
  expiry_date: date,
  school_name: string,
  status: "active|inactive",
  created_at: timestamp
}
```

---

## Database Structure

### Tables Overview

#### 1. `users` Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'user') DEFAULT 'user',
  package ENUM('basic', 'pro', 'business', 'exceptional') DEFAULT 'basic',
  expiry_date DATE,
  school_name VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. `teachers` Table
```sql
CREATE TABLE teachers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  class VARCHAR(50),
  subject JSON,
  address TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. `questions` Table
```sql
CREATE TABLE questions (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('mcqs', 'short', 'long', 'long-with-parts'),
  chapter VARCHAR(255),
  topic VARCHAR(255),
  marks VARCHAR(10),
  text TEXT NOT NULL,
  options JSON,
  parts JSON,
  answer TEXT,
  source VARCHAR(255),
  medium ENUM('English', 'Urdu') DEFAULT 'English',
  class VARCHAR(10),
  subject VARCHAR(100),
  images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. `allpapers` Table
```sql
CREATE TABLE allpapers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paper_data JSON NOT NULL,
  status ENUM('SAVED', 'DELETED', 'DRAFT') DEFAULT 'SAVED',
  user_id INT,
  class VARCHAR(10),
  subject VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 5. `user_history` Table
```sql
CREATE TABLE user_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action ENUM('created', 'updated', 'deleted', 'login') NOT NULL,
  package VARCHAR(50),
  expiry_date DATE,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## User Roles & Authentication

### Role Hierarchy

```
Super Admin (Highest)
    │
    ├─ Complete system control
    ├─ User management (create, update, delete)
    ├─ Teacher management
    ├─ System statistics & analytics
    ├─ Package management
    ├─ Login history access
    └─ All features unlocked
    
Admin (Middle)
    │
    ├─ Paper generation
    ├─ Question management (full CRUD)
    ├─ View users (limited)
    ├─ View teachers
    ├─ Papers history
    └─ Profile management
    
Teacher (Basic)
    │
    ├─ Paper generation (assigned subjects only)
    ├─ View questions (assigned subjects)
    ├─ Add questions (assigned subjects)
    ├─ Save papers
    ├─ View past papers
    └─ Profile view only
```

### Package Levels

**For Non-Teacher Users:**

1. **Basic Package**
   - Basic paper generation
   - Limited question bank access
   - 5 papers per month
   - Single user
   - Access Level: "Basic Access"

2. **Pro Package**
   - Advanced paper generation
   - Full question bank
   - 20 papers per month
   - Up to 3 users
   - Access Level: "Limited Access"

3. **Business Package**
   - Unlimited papers
   - Custom question templates
   - Unlimited users
   - Teacher accounts
   - Access Level: "Full Access"

4. **Exceptional Package**
   - All Business features
   - Priority support
   - Custom branding
   - API access
   - Access Level: "Full Access"

### Authentication Flow

```
1. User visits /login
2. Enters email/username and password
3. Frontend sends POST to auth.php with action: 'login'
4. PHP checks users table first
   ├─ If found: verify password
   │   ├─ Success: return user data
   │   └─ Fail: return error
   └─ If not found: check teachers table
       ├─ If found: verify password
       │   ├─ Success: return teacher data
       │   └─ Fail: return error
       └─ If not found: return "Invalid credentials"
5. Frontend stores user data in SessionStorage
6. Redirect to /dashboard
7. Middleware checks session on protected routes
8. If no session: redirect to /login
```

### Protected Routes (middleware.ts)

```typescript
Protected paths:
- /dashboard/*
- /generate-paper/*
- /saved-papers/*
- /past-papers/*
- /teachers/*
- /papers-history/*
- /login-history/*
- /default-paper-setting/*
```

---

## Features & Modules

### 1. Dashboard (`/dashboard`)

**Components:**
- Welcome banner with user info
- Quick stats cards:
  - Generate Paper (Ready to Generate)
  - Saved Papers (Recently Updated)
  - Past Papers (Archive Available)
  - Teachers (Manage Access)
- Quick links grid:
  - Add Questions
  - View Questions
  - Profile
  - Deleted Saved Papers
  - Paper Generate History
  - Login History
  - Past Papers
  - Teachers
  - Papers History
  - Default Paper Settings
- Coming Soon features:
  - AI Diagram Generator
  - AI Exam Generator
  - Student Management
  - Teacher Management
  - AI Assistant
  - AI Exam Checker
- Statistics panels:
  - Question Statistics (MCQs, Short, Long)
  - Chapter Coverage
- Latest News & Recently Added Books sections

**Role-based Filtering:**
- Teachers don't see: Login History, Teachers management
- Super Admin sees all features

### 2. Generate Paper (`/generate-paper`)

**Navigation:**
```
/generate-paper
  └─ Select Class (9th, 10th, 11th, 12th, 5th-8th coming soon)
      └─ /generate-paper/[class]
          └─ Select Subject
              └─ /generate-paper/[class]/[subject]
                  └─ Configure Paper
                      ├─ Select Units/Chapters (multi-select)
                      ├─ Select Exercises/Topics (multi-select)
                      ├─ Question Distribution:
                      │   ├─ MCQs count
                      │   ├─ Short questions count
                      │   └─ Long questions count
                      ├─ Preview Paper
                      └─ Actions:
                          ├─ Generate Paper
                          ├─ Save Paper
                          ├─ Print Paper
                          └─ Reset
```

**Features:**
- Dynamic chapter/topic loading from classData.js
- Real-time question count display
- Multiple selection for chapters & topics
- Custom marks distribution
- Paper preview with formatting
- Print-friendly layout
- Save to database
- Export functionality

### 3. Add Questions (`/add-questions`)

**Form Fields:**
- **Basic Info:**
  - Class (9th-12th)
  - Subject (dynamic based on class)
  - Chapter/Unit (dynamic based on subject)
  - Exercise/Topic (dynamic based on chapter)
  - Question Type (MCQs, Short, Long, Long with Parts)
  - Marks (1-10)
  - Medium (English/Urdu)
  - Source (Book/Past Paper/Custom)

- **Question Content:**
  - Question Text (with LaTeX support)
  - Math Input Helper (symbols palette)
  - Image Upload (multiple)

- **Type-Specific:**
  - **MCQs:** 4 options + correct answer
  - **Short:** Answer field
  - **Long:** Detailed answer
  - **Long with Parts:** Dynamic parts (a, b, c, d) with individual marks

**LaTeX Support:**
- Inline math: `$...$`
- Block math: `$$...$$`
- Symbol helper with click-to-insert
- Real-time preview
- Common symbols: fractions, powers, roots, Greek letters, operators

**Math Symbols Available:**
- Fractions, Powers, Roots
- Greek letters (α, β, γ, δ, θ, π, λ, μ, σ, φ, ω)
- Operators (±, ×, ÷, ≈, ≠, ≤, ≥)
- Special (∞, °, ∫, ∑, ∏, ∂, ∇)

### 4. View Questions (`/view-questions`)

**Features:**
- Advanced filtering:
  - Class filter
  - Subject filter
  - Chapter/Unit filter
  - Exercise/Topic filter
  - Question Type filter
  - Search text
- Paginated results
- Question cards with:
  - Question text
  - Options (for MCQs)
  - Answer
  - Marks, Source, Medium
  - Edit button
  - Delete button
- Inline editing
- Image preview
- LaTeX rendering
- Export filtered questions

### 5. Saved Papers (`/saved-papers`)

**Features:**
- List of saved papers
- Paper details:
  - Class & Subject
  - Date created
  - Number of questions
  - Total marks
- Actions:
  - View/Print
  - Delete (soft delete → moves to deleted papers)
  - Edit (coming soon)
- Search & filter by class/subject
- Sort by date

### 6. Past Papers (`/past-papers`)

**Features:**
- Archive of previously generated papers
- Organized by year & subject
- Quick access to download
- Print functionality
- Filter by class & exam type

### 7. Teachers Management (`/teachers`)

**Available to:** Super Admin, Admin

**Features:**
- Teacher list table
- Columns: Name, Email, Username, Class, Subjects, Status
- Actions:
  - Add new teacher
  - Edit teacher
  - Delete teacher
  - Change status (Active/Inactive)
- Teacher form:
  - Personal info (Name, Father Name)
  - Contact (Email, Username)
  - Assignment (Class, Subjects array)
  - Address
  - Password setup

### 8. Profile (`/profile`)

**User Information Display:**
- Name & Email
- Role & Package (for admins)
- Class & Subjects (for teachers)
- School Name
- Expiry Date
- Account Status
- Member Since

**Actions:**
- View account details
- Change Password (contact super admin)
- Logout

### 9. Login History (`/login-history`)

**Available to:** Super Admin only

**Features:**
- List of all login attempts
- Columns: User, Email, Timestamp, IP Address, Status
- Filter by:
  - Date range
  - User
  - Status (Success/Failed)
- Export to CSV

### 10. Papers History (`/papers-history`)

**Features:**
- Complete log of all generated papers
- Columns: Paper ID, Class, Subject, User, Date, Actions
- Statistics:
  - Total papers generated
  - Papers by class
  - Papers by subject
  - Most active users
- Filter & search
- Export functionality

### 11. Default Paper Settings (`/default-paper-setting`)

**Features:**
- Set default question distribution
- Configure paper header
- Set school logo & details
- Default time duration
- Default marks distribution
- Paper format preferences

### 12. Delete Papers (`/delete-papers`)

**Features:**
- View soft-deleted papers
- Restore paper
- Permanent delete
- Bulk actions

---

## API Endpoints

### Authentication API (`auth.php`)

**Base URL:** `https://edu.largifysolutions.com/auth.php`

#### POST /auth.php
**Action: login**
```json
Request:
{
  "action": "login",
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin",
    "status": "active",
    "schoolName": "ABC School",
    "package": "pro",
    "expiryDate": "2025-12-31"
  }
}

Response (Failure):
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Action: createUser**
```json
Request:
{
  "action": "createUser",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepass",
  "role": "admin",
  "package": "business",
  "expiryDate": "2026-01-01",
  "schoolName": "XYZ School",
  "status": "active"
}

Response:
{
  "success": true,
  "message": "User created successfully"
}
```

**Action: getAllUsers**
```json
Request:
{
  "action": "getAllUsers"
}

Response:
{
  "success": true,
  "users": [...]
}
```

**Action: updateUser**
```json
Request:
{
  "action": "updateUser",
  "id": 1,
  "name": "Updated Name",
  "package": "exceptional",
  "expiryDate": "2026-12-31"
}
```

**Action: deleteUser**
```json
Request:
{
  "action": "deleteUser",
  "userId": 1
}
```

**Action: getAllTeachers**
```json
Request:
{
  "action": "getAllTeachers"
}

Response:
{
  "success": true,
  "teachers": [
    {
      "id": 1,
      "teacher_name": "Ali Khan",
      "email": "ali@school.com",
      "class": "10th",
      "subject": ["Physics", "Chemistry"],
      "status": "active"
    }
  ]
}
```

**Action: createTeacher**
```json
Request:
{
  "action": "createTeacher",
  "teacher": {
    "teacherName": "Sara Ahmed",
    "fatherName": "Ahmed Ali",
    "username": "sara.ahmed",
    "password": "password123",
    "email": "sara@school.com",
    "class": "9th",
    "subject": ["Biology", "Chemistry"],
    "address": "123 Main St",
    "status": "active"
  }
}
```

### Questions API (`api-questions.php`)

**Base URL:** `https://edu.largifysolutions.com/api-questions.php`

#### GET /api-questions.php
```
Query Parameters:
- class: "9th"|"10th"|"11th"|"12th"
- subject: Subject name
- unit: Chapter/Unit name
- exercise: Exercise/Topic name
- type: "mcqs"|"short"|"long"|"all"
- search: Search text

Example:
GET /api-questions.php?class=10th&subject=Biology&unit=Unit 1&type=mcqs

Response:
[
  {
    "id": "q123",
    "type": "mcqs",
    "class": "10th",
    "subject": "Biology",
    "chapter": "Unit 1",
    "topic": "Exercise 1.1",
    "text": "What is photosynthesis?",
    "options": ["A", "B", "C", "D"],
    "answer": "B",
    "marks": "1",
    "images": []
  }
]
```

#### POST /api-questions.php
```json
Request:
{
  "question": {
    "id": "unique-id",
    "type": "short",
    "class": "10th",
    "subject": "Physics",
    "chapter": "Unit 2",
    "topic": "Exercise 2.1",
    "marks": "2",
    "text": "Define velocity.",
    "answer": "Rate of change of displacement",
    "source": "Textbook",
    "medium": "English",
    "images": []
  }
}

Response:
{
  "success": true,
  "message": "Question added successfully"
}
```

#### PUT /api-questions.php
Update question (similar to POST)

#### DELETE /api-questions.php
```
Query Parameter:
- questionId: ID of question to delete

Example:
DELETE /api-questions.php?questionId=q123
```

**Action: delete (via POST)**
```json
Request:
{
  "action": "delete",
  "questionId": "q123"
}
```

**Action: delete-image (via POST)**
```json
Request:
{
  "action": "delete-image",
  "questionId": "q123",
  "imageIndex": 0
}
```

### Papers API (`api-papers.php`)

**Base URL:** `https://edu.largifysolutions.com/api-papers.php`

#### GET /api-papers.php
```
Query Parameters:
- status: "SAVED"|"DELETED"|"DRAFT"

Example:
GET /api-papers.php?status=SAVED

Response:
[
  {
    "id": 1,
    "paper_data": {...},
    "status": "SAVED",
    "class": "10th",
    "subject": "Biology",
    "created_at": "2025-10-15 10:30:00"
  }
]
```

#### POST /api-papers.php
```json
Save paper:
{
  "paper_data": {
    "class": "10th",
    "subject": "Biology",
    "questions": [...],
    "totalMarks": 75
  },
  "class": "10th",
  "subject": "Biology",
  "userId": 1
}

Update status:
{
  "action": "update_status",
  "paperId": 1,
  "status": "DELETED"
}
```

#### PATCH /api-papers.php
```json
Request:
{
  "paperId": 1,
  "status": "SAVED"
}
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PHP 7.4+ with PDO extension
- MySQL 5.7+ database
- Web server (Apache/Nginx) or Hostinger account

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/memalihaider/mirrors_optimization.git
cd Paper-Generator
```

#### 2. Install Dependencies
```powershell
npm install
```

#### 3. Environment Configuration

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://edu.largifysolutions.com
DATABASE_HOST=edu.largifysolutions.com
DATABASE_NAME=u421900954_ecompapgen
DATABASE_USER=u421900954_PaperGenerator
DATABASE_PASSWORD=PaperGeneratorByAhmad786
```

#### 4. Database Setup

Execute SQL scripts (create tables as defined in Database Structure section):

```sql
-- Create users table
CREATE TABLE users (...);

-- Create teachers table
CREATE TABLE teachers (...);

-- Create questions table
CREATE TABLE questions (...);

-- Create allpapers table
CREATE TABLE allpapers (...);

-- Create user_history table
CREATE TABLE user_history (...);
```

#### 5. PHP Backend Setup

Upload PHP files to Hostinger:
- auth.php
- api-questions.php
- api-papers.php
- api-teachers.php
- api-students.php
- upload-image.php

Configure CORS in PHP files:
```php
header("Access-Control-Allow-Origin: http://localhost:3000");
// or
header("Access-Control-Allow-Origin: https://yourdomain.com");
```

#### 6. Run Development Server
```powershell
npm run dev
```

Application will be available at `http://localhost:3000`

#### 7. Build for Production
```powershell
npm run build
npm run start
```

Or for static export:
```powershell
npm run build
# Output will be in /out directory
```

### Default Admin Account

Create super admin manually in database:

```sql
INSERT INTO users (name, email, password, role, package, status)
VALUES (
  'Super Admin',
  'admin@largify.com',
  '$2y$10$...',  -- bcrypt hash of password
  'super_admin',
  'exceptional',
  'active'
);
```

Or use the application's create user API.

---

## Application Flow

### 1. User Login Flow

```
1. Navigate to http://localhost:3000
2. Click "Login" from homepage
3. Enter credentials:
   - Email/Username
   - Password
4. System validates:
   - Checks users table first
   - Then checks teachers table
   - Verifies password hash
5. On success:
   - User data stored in SessionStorage
   - Redirected to /dashboard
6. On each page load:
   - Middleware checks session
   - Redirects to /login if no session
```

### 2. Paper Generation Flow

```
1. From Dashboard → Click "Generate Paper"
2. Select Class (9th/10th/11th/12th)
3. Select Subject (based on class)
4. Configure paper:
   a. Select chapters (checkboxes)
   b. Select exercises (checkboxes)
   c. Set question counts:
      - MCQs: X questions
      - Short: Y questions
      - Long: Z questions
5. Click "Generate Paper"
6. System:
   - Fetches questions from database
   - Filters by class, subject, chapters, topics
   - Randomly selects questions (respecting counts)
   - Ensures no duplicates
7. Preview generated paper
8. Options:
   - Print (opens print dialog)
   - Save (stores in database)
   - Reset (clear selections)
```

### 3. Question Addition Flow

```
1. Navigate to /add-questions
2. Fill form:
   - Select class → loads subjects
   - Select subject → loads chapters
   - Select chapter → loads exercises
   - Select question type
   - Enter marks
   - Write question text (with LaTeX)
   - Add images (optional)
   - Type-specific fields:
     * MCQs: 4 options + answer
     * Short: answer text
     * Long: detailed answer
     * Long parts: add parts dynamically
3. Preview question
4. Click "Add Question"
5. System:
   - Validates all fields
   - Generates unique ID
   - Processes LaTeX
   - Uploads images
   - Stores in database
6. Success message
7. Form resets for next question
```

### 4. Teacher Management Flow

```
1. Super Admin logs in
2. Navigate to /teachers
3. View teacher list
4. Click "Add Teacher"
5. Fill form:
   - Personal details
   - Username (must be unique)
   - Email (must be unique)
   - Password
   - Assign class
   - Select subjects (multi-select)
   - Address
6. Submit
7. System:
   - Validates uniqueness
   - Hashes password
   - Stores in teachers table
8. Teacher can now login
9. Teacher sees limited dashboard
```

---

## File Structure

```
Paper-Generator/
│
├── public/                    # Static assets
│   ├── images/
│   └── fonts/
│
├── public_html/              # Production PHP files
│   └── auth.php
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── fonts.js          # Font configurations
│   │   ├── globals.css       # Global styles
│   │   ├── layout.jsx        # Root layout
│   │   ├── page.jsx          # Homepage
│   │   │
│   │   ├── add-questions/    # Add questions module
│   │   │   └── page.jsx
│   │   │
│   │   ├── analytics/        # Analytics dashboard
│   │   │   └── page.jsx
│   │   │
│   │   ├── api/              # Next.js API routes
│   │   │   ├── questions/
│   │   │   │   ├── route.js
│   │   │   │   └── get/
│   │   │   └── view-questions/
│   │   │       └── route.js
│   │   │
│   │   ├── books/            # Books management
│   │   │   └── page.jsx
│   │   │
│   │   ├── change-password/  # Password change
│   │   │   └── page.jsx
│   │   │
│   │   ├── dashboard/        # Main dashboard
│   │   │   └── page.jsx
│   │   │
│   │   ├── default-paper-setting/  # Paper settings
│   │   │   └── page.jsx
│   │   │
│   │   ├── delete-papers/    # Deleted papers
│   │   │   └── page.jsx
│   │   │
│   │   ├── diagram-generator/  # AI Diagram (Coming)
│   │   │   └── page.tsx
│   │   │
│   │   ├── draft-papers/     # Draft papers
│   │   │   └── page.jsx
│   │   │
│   │   ├── exam-generator/   # AI Exam Gen (Coming)
│   │   │   └── page.tsx
│   │   │
│   │   ├── generate-paper/   # Paper generation
│   │   │   ├── page.jsx      # Class selection
│   │   │   ├── 9th/
│   │   │   │   ├── page.jsx  # Subject selection
│   │   │   │   ├── biology/
│   │   │   │   │   ├── page.jsx  # Paper config
│   │   │   │   │   └── unitsData.js
│   │   │   │   ├── chemistry/
│   │   │   │   ├── computer-science/
│   │   │   │   ├── english/
│   │   │   │   ├── mathematics/
│   │   │   │   ├── pakistan-studies/
│   │   │   │   ├── physics/
│   │   │   │   ├── quran-translation/
│   │   │   │   └── urdu/
│   │   │   ├── 10th/
│   │   │   │   └── [similar structure]
│   │   │   ├── 11th/
│   │   │   │   └── [similar structure]
│   │   │   └── 12th/
│   │   │       └── [similar structure]
│   │   │
│   │   ├── login/            # Login page
│   │   │   └── page.jsx
│   │   │
│   │   ├── login-history/    # Login logs
│   │   │   └── page.jsx
│   │   │
│   │   ├── papers-history/   # Papers log
│   │   │   └── page.jsx
│   │   │
│   │   ├── past-papers/      # Past papers
│   │   │   └── page.jsx
│   │   │
│   │   ├── payment/          # Payment module
│   │   │   └── basic/
│   │   │
│   │   ├── plagiarism/       # Plagiarism check
│   │   │   └── page.jsx
│   │   │
│   │   ├── profile/          # User profile
│   │   │   └── page.jsx
│   │   │
│   │   ├── role-permissions/ # Role management
│   │   │   └── page.jsx
│   │   │
│   │   ├── saas-package/     # Package selection
│   │   │   └── page.jsx
│   │   │
│   │   ├── saved-papers/     # Saved papers
│   │   │   └── page.jsx
│   │   │
│   │   ├── student-management/  # Student mgmt
│   │   │   └── page.tsx
│   │   │
│   │   ├── syllabus/         # Syllabus mgmt
│   │   │   └── page.jsx
│   │   │
│   │   ├── teachers/         # Teacher viewing
│   │   │   └── page.jsx
│   │   │
│   │   ├── teachers-management/  # Teacher CRUD
│   │   │   └── page.tsx
│   │   │
│   │   └── view-questions/   # Question viewing
│   │       └── page.jsx
│   │
│   ├── components/           # Reusable components
│   │   ├── auth-form.jsx     # Login form
│   │   ├── ClientLayout.jsx  # Client wrapper
│   │   ├── LayoutWrapper.jsx # Layout wrapper
│   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   ├── RootLayoutContent.jsx
│   │   ├── Sidebar.jsx       # Main sidebar
│   │   ├── TeacherProtectedRoute.jsx
│   │   ├── UserSidebar.jsx   # User sidebar
│   │   └── ui/               # UI primitives
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       └── label.jsx
│   │
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.jsx   # Auth state
│   │   ├── UserContext.js    # User state
│   │   └── UserContext.jsx
│   │
│   ├── data/                 # Static data
│   │   ├── classData.js      # Classes/subjects/chapters
│   │   └── dummyQuestions.js # Sample questions
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── use-mounted.js
│   │   └── lib/
│   │       ├── utils.js
│   │       └── utils.ts
│   │
│   └── utils/                # Utility functions
│       ├── db.js             # Database connection
│       └── sessionManager.js # Session management
│
├── Root Files:
│   ├── api-papers.php        # Papers API
│   ├── api-questions.php     # Questions API
│   ├── api-students.php      # Students API
│   ├── api-teachers.php      # Teachers API
│   ├── auth.php              # Auth API
│   ├── upload-image.php      # Image upload
│   ├── .gitignore            # Git ignore
│   ├── .htaccess             # Apache config
│   ├── components.json       # Component config
│   ├── eslint.config.mjs     # ESLint config
│   ├── jsconfig.json         # JS config
│   ├── middleware.ts         # Next.js middleware
│   ├── next.config.js        # Next.js config
│   ├── next.config.mjs       # Next.js config (ESM)
│   ├── package.json          # Dependencies
│   ├── postcss.config.mjs    # PostCSS config
│   ├── README.md             # Basic readme
│   ├── tailwind.config.js    # Tailwind config
│   └── tsconfig.json         # TypeScript config
```

---

## Security Implementation

### 1. Authentication Security

**Password Hashing:**
```php
// PHP Backend
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$isValid = password_verify($inputPassword, $storedHash);
```

**Session Management:**
- SessionStorage (client-side)
- No sensitive data in localStorage
- Session cleared on logout
- Auto-logout on inactivity (optional)

### 2. SQL Injection Prevention

**Prepared Statements:**
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
```

All database queries use PDO prepared statements.

### 3. CORS Configuration

```php
// Whitelist of allowed origins
$allowedOrigins = [
    'https://edu.largifysolutions.com',
    'http://localhost:3000',
    'https://admin-edu.largifysolutions.com'
];

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
```

### 4. XSS Prevention

- React automatically escapes content
- User input sanitized before database storage
- HTML entities encoded in PHP

### 5. Route Protection

**Next.js Middleware:**
```typescript
export default withAuth({
  pages: { signIn: "/login" }
});

export const config = {
  matcher: ["/dashboard/:path*", ...]
};
```

**Component-Level:**
```jsx
<ProtectedRoute adminOnly={true}>
  <AdminComponent />
</ProtectedRoute>
```

### 6. Data Validation

**Frontend:**
- Form validation using controlled components
- Type checking with PropTypes/TypeScript
- Input length restrictions

**Backend:**
- Server-side validation
- Data type checking
- Required field validation
- Email format validation
- Duplicate checking

### 7. Error Handling

```php
try {
    // Database operation
} catch(PDOException $e) {
    error_log($e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Operation failed']);
}
```

### 8. Rate Limiting (Recommended)

Currently not implemented. Recommended to add:
- Login attempt limiting
- API rate limiting
- Captcha for repeated failures

---

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
- Check database credentials in db.js and PHP files
- Verify MySQL server is running
- Check firewall settings
- Verify database user has proper permissions

**2. CORS Errors**
- Add your domain to allowedOrigins in PHP files
- Check browser console for specific CORS errors
- Verify Access-Control-Allow-Origin headers

**3. Login Not Working**
- Check network tab for API response
- Verify password is correctly hashed
- Check user exists in database
- Verify SessionStorage is enabled in browser

**4. Questions Not Loading**
- Check api-questions.php is accessible
- Verify database connection
- Check browser console for errors
- Verify questions exist for selected filters

**5. Paper Generation Fails**
- Ensure questions exist for selected criteria
- Check question distribution totals
- Verify database has sufficient questions
- Check browser console for errors

**6. Images Not Uploading**
- Check upload-image.php permissions
- Verify upload directory exists
- Check file size limits
- Verify image format is supported

### Debug Mode

Enable detailed error logging:

**PHP:**
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

**Next.js:**
```bash
npm run dev  # Development mode shows detailed errors
```

---

## Future Enhancements (Coming Soon)

### 1. AI Diagram Generator
- Automatic diagram creation from descriptions
- Edit and customize diagrams
- Insert into questions

### 2. AI Exam Generator
- Intelligent paper generation based on difficulty
- Bloom's Taxonomy integration
- Auto-balancing question types

### 3. Student Management
- Student accounts and profiles
- Performance tracking
- Assignment submission

### 4. Teacher Management (Enhanced)
- Teacher portal
- Class management
- Grade book

### 5. AI Assistant
- Chatbot for help
- Question suggestions
- Smart search

### 6. AI Exam Checker
- Auto-grading short answers
- MCQ auto-correction
- Plagiarism detection

### 7. Analytics Dashboard
- Detailed usage statistics
- Question popularity metrics
- User activity reports

### 8. Mobile App
- Native iOS/Android apps
- Offline paper generation
- Mobile question bank access

---

## Support & Contact

**Developer:** Largify Solutions Pakistan  
**Website:** https://largifysolutions.com  
**Email:** admin@largifysolutions.com  
**Support:** support@largifysolutions.com  

**Documentation Version:** 1.0  
**Last Updated:** October 19, 2025  
**Application Version:** 1.1

---

## License

Proprietary Software - All Rights Reserved  
© 2025 Largify Solutions Pakistan

---

## Appendix

### A. Database Schema Diagram

```
users                    teachers
├─ id (PK)              ├─ id (PK)
├─ name                 ├─ teacher_name
├─ email (UNIQUE)       ├─ email (UNIQUE)
├─ password             ├─ username (UNIQUE)
├─ role                 ├─ password
├─ package              ├─ class
├─ expiry_date          ├─ subject (JSON)
├─ school_name          ├─ status
└─ status               └─ created_at

questions               allpapers
├─ id (PK)             ├─ id (PK)
├─ type                ├─ paper_data (JSON)
├─ chapter             ├─ status
├─ topic               ├─ user_id (FK → users.id)
├─ marks               ├─ class
├─ text                ├─ subject
├─ options (JSON)      ├─ created_at
├─ parts (JSON)        └─ updated_at
├─ answer
├─ source              user_history
├─ medium              ├─ id (PK)
├─ class               ├─ user_id (FK → users.id)
├─ subject             ├─ action
├─ images (JSON)       ├─ package
└─ created_at          ├─ expiry_date
                       ├─ status
                       └─ created_at
```

### B. API Request Examples (cURL)

**Login:**
```bash
curl -X POST https://edu.largifysolutions.com/auth.php \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"admin@example.com","password":"pass123"}'
```

**Get Questions:**
```bash
curl -X GET "https://edu.largifysolutions.com/api-questions.php?class=10th&subject=Biology"
```

**Add Question:**
```bash
curl -X POST https://edu.largifysolutions.com/api-questions.php \
  -H "Content-Type: application/json" \
  -d '{"question":{"id":"q123","type":"short",...}}'
```

### C. Package Comparison Table

| Feature | Basic | Pro | Business | Exceptional |
|---------|-------|-----|----------|-------------|
| Papers/Month | 5 | 20 | Unlimited | Unlimited |
| Users | 1 | 3 | Unlimited | Unlimited |
| Teacher Accounts | ❌ | ❌ | ✅ | ✅ |
| Custom Templates | ❌ | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ❌ | ✅ |
| Custom Branding | ❌ | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ❌ | ✅ |
| Price | Free | $19/mo | $49/mo | $99/mo |

---

**End of Documentation**
