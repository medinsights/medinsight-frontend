# MedInsights Frontend - Architecture & Features Guide

> **For Collaborators**: This document provides a complete overview of the MedInsights application architecture, existing features, and what needs to be implemented.

---

## 📋 Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Application Flow Examples](#application-flow-examples)
3. [Frontend Pages (Implemented)](#frontend-pages-implemented)
4. [Frontend Services (Available)](#frontend-services-available)
5. [Backend Microservices APIs](#backend-microservices-apis)
6. [Missing Implementations](#missing-implementations)
7. [Technology Stack](#technology-stack)

---

## 🏗️ System Architecture Overview

MedInsights is a **microservices-based medical platform** with the following architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 5173)                    │
│  TypeScript + React Router + TailwindCSS + Axios               │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP Requests (JWT in Header)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Kong API Gateway (Port 8000)                        │
│  • JWT Validation (RS256)                                       │
│  • Request Routing                                              │
│  • Rate Limiting & Security                                     │
└───┬───────────────────┬────────────────────┬───────────────────┘
    │                   │                    │
    │ /auth/*          │ /patients/*        │ /chatbot/*
    ▼                   ▼                    ▼
┌─────────────┐   ┌──────────────────┐   ┌─────────────────┐
│   Auth      │   │    Patient       │   │    Chatbot      │
│  Service    │   │   Service        │   │    Service      │
│ (Django)    │   │ (Spring Boot)    │   │   (FastAPI)     │
│ Port 8001   │   │  Port 8003       │   │   Port 8002     │
└─────┬───────┘   └────────┬─────────┘   └────────┬────────┘
      │                    │                       │
      ▼                    ▼                       ▼
  PostgreSQL          PostgreSQL              No DB
  (auth_db)         (patient_db)          (Stateless)
```

### Key Architecture Principles:
- **Stateless Frontend**: No business logic in React, pure UI layer
- **JWT Authentication**: All requests authenticated via Kong Gateway
- **Microservices**: Independent, scalable services with single responsibility
- **API Gateway Pattern**: Centralized routing, security, and monitoring

---

## 🔄 Application Flow Examples

### 1️⃣ **User Authentication Flow**

```
┌──────────────┐
│ User enters  │
│ credentials  │
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────────────────────┐
│ Frontend: POST /api/auth/login                     │
│ {                                                  │
│   "email": "doctor1@medinsights.com",             │
│   "password": "Doctor123!"                        │
│ }                                                  │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│ Kong Gateway validates request → Routes to         │
│ Auth Service (Django) Port 8001                    │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│ Auth Service:                                      │
│ 1. Validates credentials (Django)                  │
│ 2. Generates JWT (RS256 with private key)         │
│ 3. Returns tokens + user info                     │
│                                                    │
│ Response:                                          │
│ {                                                  │
│   "access": "eyJhbGc...",  // 15 min expiry       │
│   "refresh": "eyJhbGc...", // 24 hours expiry     │
│   "user": {                                        │
│     "id": "uuid",                                  │
│     "email": "doctor1@medinsights.com",           │
│     "first_name": "John",                         │
│     "role": "doctor"                              │
│   }                                                │
│ }                                                  │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│ Frontend stores tokens in:                         │
│ - localStorage (access token)                      │
│ - httpOnly cookie (refresh token - future)        │
│ - AuthContext state                                │
└────────────────────────────────────────────────────┘
```

### 2️⃣ **Patient Data Retrieval Flow**

```
┌──────────────────┐
│ Doctor views     │
│ Patients List    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ Frontend: GET /api/patients?page=1&size=10           │
│ Headers: Authorization: Bearer eyJhbGc...            │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Kong Gateway:                                         │
│ 1. Validates JWT signature (public key)              │
│ 2. Extracts user_id from token                       │
│ 3. Adds X-User-ID header                             │
│ 4. Routes to Patient Service                         │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Patient Service (Spring Boot):                       │
│ 1. Reads X-User-ID from header                       │
│ 2. Filters patients by created_by = user_id          │
│ 3. Returns paginated patient list                    │
│                                                       │
│ Response:                                             │
│ {                                                     │
│   "content": [                                        │
│     {                                                 │
│       "id": "patient-uuid",                          │
│       "firstName": "John",                           │
│       "lastName": "Doe",                             │
│       "dateOfBirth": "1985-05-15",                   │
│       "gender": "MALE",                              │
│       "bloodGroup": "A+",                            │
│       "chronicDiseases": "Hypertension, Diabetes"    │
│     }                                                 │
│   ],                                                  │
│   "totalElements": 25,                               │
│   "totalPages": 3,                                   │
│   "currentPage": 0                                   │
│ }                                                     │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Frontend renders PatientsListPage with:              │
│ - Patient cards/table                                │
│ - Pagination controls                                │
│ - Search/filter UI                                   │
└──────────────────────────────────────────────────────┘
```

### 3️⃣ **AI Medical Document Analysis Flow**

```
┌──────────────────┐
│ Doctor uploads   │
│ medical PDF      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ Frontend: POST /api/chatbot/analyze-document         │
│ Headers: Authorization: Bearer eyJhbGc...            │
│ Body: FormData with PDF file + patient_id            │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Kong Gateway validates JWT → Routes to Chatbot       │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Chatbot Service (FastAPI):                           │
│ 1. Extracts text from PDF (PyPDF2 + OCR)            │
│ 2. Uses RAG (ChromaDB + medical guidelines)         │
│ 3. Analyzes with Groq LLM (Llama 3.1 70B)          │
│ 4. Generates structured report                       │
│                                                       │
│ 5. Calls Patient Service to save consultation:       │
│    POST http://patient-service:8003/api/consultations│
│                                                       │
│ Response:                                             │
│ {                                                     │
│   "analysis": "Detailed medical analysis...",        │
│   "keyFindings": [...],                             │
│   "recommendations": [...],                          │
│   "savedToPatient": true                            │
│ }                                                     │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Frontend displays analysis results in chat UI        │
└──────────────────────────────────────────────────────┘
```

---

## 📱 Frontend Pages (Implemented)

### ✅ **Public Pages** (No Authentication Required)

#### 1. **HomePage** (`/`)
- **Description**: Landing page with platform overview
- **Features**: 
  - Hero section with call-to-action
  - Feature highlights
  - Links to login/register
- **Status**: ✅ Implemented

#### 2. **LoginPage** (`/login`)
- **Description**: User authentication page
- **Features**: 
  - Email/password form
  - Form validation
  - Error handling (invalid credentials, server errors)
  - Redirect to dashboard after successful login
- **Services Used**: `auth.ts` → `POST /api/auth/login`
- **Status**: ✅ Implemented

#### 3. **RegisterPage** (`/register`)
- **Description**: New user registration
- **Features**: 
  - Multi-field registration form (name, email, password, role)
  - Password strength validation
  - Role selection (doctor, secretary, patient)
  - Success/error messages
- **Services Used**: `auth.ts` → `POST /api/auth/register`
- **Status**: ✅ Implemented

---

### 🔐 **Protected Pages** (Authentication Required)

#### 4. **DashboardPage** (`/dashboard`) - **Admin Only**
- **Description**: Admin dashboard with system statistics
- **Features**: 
  - User management overview
  - System health metrics
  - Quick actions panel
- **Role Restriction**: Admin only (`AdminRoute` wrapper)
- **Status**: ✅ Implemented (Basic)
- **Needs Enhancement**: 
  - Real-time statistics from backend
  - User activity logs
  - Service health monitoring

#### 5. **PatientsListPage** (`/patients`) - **Doctor, Admin, Secretary**
- **Description**: List all patients with search/filter
- **Features**: 
  - Paginated patient table/cards
  - Search by name, email, phone
  - Filter by blood group, chronic diseases
  - Quick view patient details
  - Add new patient button
  - Export to CSV/PDF (planned)
- **Services Used**: `patients.ts` → `GET /api/patients`
- **Role Restriction**: Admin, Doctor, Secretary
- **Status**: ✅ Implemented

#### 6. **PatientDetailPage** (`/patients/:id`) - **Doctor, Admin, Secretary**
- **Description**: Comprehensive patient profile with medical records
- **Features Implemented**: 
  - ✅ Patient demographics (name, DOB, gender, blood group)
  - ✅ Contact information
  - ✅ Medical history (allergies, chronic diseases)
  - ✅ Vital signs history (blood pressure, heart rate, temperature)
  - ✅ Consultations list
  - ✅ Active treatments
  - ✅ Medical analyses results
  - ✅ Cardiovascular exams
- **Services Used**: 
  - `patient.ts` → `GET /api/patients/{id}`
  - `vitalSigns.ts` → `GET /api/vital-signs/patients/{id}`
  - `consultations.ts` → `GET /api/consultations/patients/{id}`
  - `treatments.ts` → `GET /api/treatments/patients/{id}`
  - `medicalAnalyses.ts` → `GET /api/medical-analyses/patients/{id}`
  - `cardiovascularExams.ts` → `GET /api/cardiovascular-exams/patients/{id}`
- **Status**: ✅ Implemented
- **Missing Features**: 
  - Add new vital signs form
  - Add new consultation form
  - Prescribe treatment UI
  - Schedule new exam UI
  - Edit patient information

#### 7. **PatientProfilePageNew** (`/profile`) - **All Authenticated Users**
- **Description**: Current user's personal profile
- **Features**: 
  - View personal information
  - Edit profile (future)
  - Change password (future)
  - View medical history (if patient role)
- **Status**: ✅ Implemented (Basic)
- **Needs Enhancement**: 
  - Edit form
  - Profile picture upload
  - Security settings

#### 8. **AIAssistantPage** (`/ai-assistant`) - **All Authenticated Users**
- **Description**: AI-powered medical chatbot interface
- **Features Implemented**: 
  - ✅ Chat interface with message history
  - ✅ Send medical questions
  - ✅ Upload medical documents (PDF analysis)
  - ✅ AI recommendations based on patient data
  - ✅ Context-aware responses using RAG
- **Services Used**: 
  - `chatbot.ts` → `POST /api/chatbot/chat`
  - `chatbot.ts` → `POST /api/chatbot/analyze-document`
  - `chatbot.ts` → `GET /api/chatbot/patients/{id}/recommandations`
- **Status**: ✅ Implemented
- **Missing Features**: 
  - Chat history persistence
  - Export conversation to PDF
  - Voice input/output
  - Multi-language support

---

## 🔌 Frontend Services (Available)

All services are located in `/src/services/` and use Axios with JWT authentication:

### 1. **auth.ts** - Authentication Service
```typescript
✅ login(email, password)           // POST /api/auth/login
✅ register(userData)               // POST /api/auth/register  
✅ logout()                         // POST /api/auth/logout
✅ refreshToken()                   // POST /api/auth/refresh
✅ getCurrentUser()                 // GET /api/auth/user
```

### 2. **patients.ts** - Patient Management Service
```typescript
✅ getPatients(page, size, search)  // GET /api/patients
✅ getPatient(id)                   // GET /api/patients/{id}
✅ createPatient(patientData)       // POST /api/patients
✅ updatePatient(id, patientData)   // PUT /api/patients/{id}
✅ deletePatient(id)                // DELETE /api/patients/{id}
✅ searchPatients(query)            // GET /api/patients/search
✅ getPatientCount()                // GET /api/patients/stats/count
```

### 3. **vitalSigns.ts** - Vital Signs Service
```typescript
✅ getVitalSigns(patientId)         // GET /api/vital-signs/patients/{id}
✅ getLatestVitalSigns(patientId)   // GET /api/vital-signs/patients/{id}/latest
✅ createVitalSigns(patientId, data)// POST /api/vital-signs/patients/{id}
✅ deleteVitalSigns(id)             // DELETE /api/vital-signs/{id}
```

### 4. **consultations.ts** - Consultations Service
```typescript
✅ getConsultations(patientId)      // GET /api/consultations/patients/{id}
✅ getConsultation(id)              // GET /api/consultations/{id}
✅ createConsultation(patientId, data) // POST /api/consultations/patients/{id}
✅ updateConsultation(id, data)     // PUT /api/consultations/{id}
✅ deleteConsultation(id)           // DELETE /api/consultations/{id}
✅ getLatestConsultation(patientId) // GET /api/consultations/patients/{id}/latest
```

### 5. **treatments.ts** - Treatments Service
```typescript
✅ getTreatments(patientId)         // GET /api/treatments/patients/{id}
✅ getActiveTreatments(patientId)   // GET /api/treatments/patients/{id}/active
✅ createTreatment(patientId, data) // POST /api/treatments/patients/{id}
✅ updateTreatment(id, data)        // PUT /api/treatments/{id}
✅ completeTreatment(id)            // PUT /api/treatments/{id}/complete
✅ deleteTreatment(id)              // DELETE /api/treatments/{id}
```

### 6. **medicalAnalyses.ts** - Medical Analyses Service
```typescript
✅ getMedicalAnalyses(patientId)    // GET /api/medical-analyses/patients/{id}
✅ getMedicalAnalysis(id)           // GET /api/medical-analyses/{id}
✅ createMedicalAnalysis(patientId, data) // POST /api/medical-analyses/patients/{id}
✅ updateMedicalAnalysis(id, data)  // PUT /api/medical-analyses/{id}
✅ deleteMedicalAnalysis(id)        // DELETE /api/medical-analyses/{id}
```

### 7. **cardiovascularExams.ts** - Cardiovascular Exams Service
```typescript
✅ getCardiovascularExams(patientId) // GET /api/cardiovascular-exams/patients/{id}
✅ getCardiovascularExam(id)        // GET /api/cardiovascular-exams/{id}
✅ createCardiovascularExam(patientId, data) // POST /api/cardiovascular-exams/patients/{id}
✅ updateCardiovascularExam(id, data) // PUT /api/cardiovascular-exams/{id}
✅ deleteCardiovascularExam(id)     // DELETE /api/cardiovascular-exams/{id}
```

### 8. **chatbot.ts** - AI Chatbot Service
```typescript
✅ sendMessage(message, patientId?) // POST /api/chatbot/chat
✅ analyzeDocument(file, patientId) // POST /api/chatbot/analyze-document
✅ getRecommendations(patientId)    // GET /api/chatbot/patients/{id}/recommandations
✅ healthCheck()                    // GET /api/chatbot/health
```

---

## 🖥️ Backend Microservices APIs

### 1️⃣ **Auth Service** (Django - Port 8001)
**Base URL**: `http://localhost:8000/api/auth` (via Kong)

#### Endpoints:
```
✅ POST   /register              - Register new user
✅ POST   /login                 - Login with credentials
✅ POST   /logout                - Invalidate current token
✅ POST   /refresh               - Refresh access token
✅ GET    /user                  - Get current user info
✅ PUT    /user/update           - Update user profile
✅ POST   /change-password       - Change password
✅ POST   /reset-password        - Request password reset
```

**Authentication**: RS256 JWT with 15-minute access token, 24-hour refresh token

---

### 2️⃣ **Patient Service** (Spring Boot - Port 8003)
**Base URL**: `http://localhost:8000/api/patients` (via Kong)

#### Patient Management:
```
✅ POST   /                      - Create new patient
✅ GET    /                      - List all patients (paginated, filtered by user)
✅ GET    /{id}                  - Get patient by ID
✅ PUT    /{id}                  - Update patient
✅ DELETE /{id}                  - Soft delete patient
✅ GET    /search?q={query}      - Search patients by name/email/phone
✅ GET    /stats/count           - Get total patient count
```

#### Vital Signs:
```
✅ POST   /vital-signs/patients/{patientId}              - Record vital signs
✅ GET    /vital-signs/{id}                              - Get vital sign record
✅ GET    /vital-signs/patients/{patientId}              - List all vital signs
✅ GET    /vital-signs/patients/{patientId}/latest       - Get latest vital signs
✅ GET    /vital-signs/patients/{patientId}/date-range   - Filter by date range
✅ DELETE /vital-signs/{id}                              - Delete vital sign record
```

#### Consultations:
```
✅ POST   /consultations/patients/{patientId}            - Create consultation
✅ GET    /consultations/{id}                            - Get consultation details
✅ GET    /consultations/patients/{patientId}            - List consultations
✅ GET    /consultations/patients/{patientId}/latest     - Get latest consultation
✅ GET    /consultations/patients/{patientId}/date-range - Filter by date
✅ PUT    /consultations/{id}                            - Update consultation
✅ DELETE /consultations/{id}                            - Delete consultation
✅ GET    /consultations/patients/{patientId}/count      - Count consultations
```

#### Treatments:
```
✅ POST   /treatments/patients/{patientId}               - Prescribe treatment
✅ GET    /treatments/patients/{patientId}               - List all treatments
✅ GET    /treatments/patients/{patientId}/active        - Get active treatments
✅ PUT    /treatments/{id}                               - Update treatment
✅ PUT    /treatments/{id}/complete                      - Mark as completed
✅ DELETE /treatments/{id}                               - Delete treatment
```

#### Medical Analyses:
```
✅ POST   /medical-analyses/patients/{patientId}         - Add medical analysis
✅ GET    /medical-analyses/{id}                         - Get analysis details
✅ GET    /medical-analyses/patients/{patientId}         - List all analyses
✅ PUT    /medical-analyses/{id}                         - Update analysis
✅ DELETE /medical-analyses/{id}                         - Delete analysis
```

#### Cardiovascular Exams:
```
✅ POST   /cardiovascular-exams/patients/{patientId}     - Add exam result
✅ GET    /cardiovascular-exams/{id}                     - Get exam details
✅ GET    /cardiovascular-exams/patients/{patientId}     - List all exams
✅ PUT    /cardiovascular-exams/{id}                     - Update exam
✅ DELETE /cardiovascular-exams/{id}                     - Delete exam
```

---

### 3️⃣ **Chatbot Service** (FastAPI - Port 8002)
**Base URL**: `http://localhost:8000/api/chatbot` (via Kong)

#### AI Endpoints:
```
✅ GET    /health                                        - Service health check
✅ POST   /chat                                          - Send chat message
          Body: { "message": string, "patient_id"?: string }
          Response: AI response with medical context

✅ POST   /analyze-document                              - Upload & analyze PDF
          Body: FormData with file + patient_id
          Features:
          - PDF text extraction (PyPDF2)
          - OCR for scanned documents (Tesseract)
          - RAG-based analysis (ChromaDB + medical guidelines)
          - Groq LLM processing (Llama 3.1 70B)
          Response: Structured medical analysis

✅ GET    /patients/{id}/recommandations                 - Get AI recommendations
          Features:
          - Fetches patient data from Patient Service
          - Analyzes medical history, vital signs, treatments
          - Generates personalized health recommendations
```

**AI Capabilities**:
- Medical document analysis (lab reports, prescriptions, imaging reports)
- Natural language medical queries
- Context-aware responses using 5.2 MB medical guidelines (HAS/ANSM)
- Personalized health recommendations
- Multi-language support (French/English)

---

## ❌ Missing Implementations

### 🔴 **High Priority - Frontend Pages Needed**

#### 1. **Add Patient Page** (`/patients/new`)
- **Purpose**: Form to create new patient
- **Backend**: ✅ Ready (`POST /api/patients`)
- **Frontend**: ❌ Not implemented
- **Required Fields**: 
  - firstName, lastName, dateOfBirth, gender
  - phone, email, address, city, country
  - bloodGroup, allergies, chronicDiseases
  - attendingPhysician, emergencyContact

#### 2. **Edit Patient Page** (`/patients/:id/edit`)
- **Purpose**: Update patient information
- **Backend**: ✅ Ready (`PUT /api/patients/{id}`)
- **Frontend**: ❌ Not implemented
- **Should Include**: Pre-filled form with current data

#### 3. **Add Vital Signs Modal/Form** (In PatientDetailPage)
- **Purpose**: Record new vital signs
- **Backend**: ✅ Ready (`POST /api/vital-signs/patients/{id}`)
- **Frontend**: ❌ Not implemented
- **Required Fields**: 
  - bloodPressureSystolic, bloodPressureDiastolic
  - heartRate, temperature, weight, height
  - oxygenSaturation, respiratoryRate

#### 4. **Add Consultation Modal/Form** (In PatientDetailPage)
- **Purpose**: Create new consultation record
- **Backend**: ✅ Ready (`POST /api/consultations/patients/{id}`)
- **Frontend**: ❌ Not implemented
- **Required Fields**: 
  - consultationType, chiefComplaint, diagnosis
  - prescription, notes, followUpDate

#### 5. **Prescribe Treatment Modal/Form** (In PatientDetailPage)
- **Purpose**: Add new treatment/medication
- **Backend**: ✅ Ready (`POST /api/treatments/patients/{id}`)
- **Frontend**: ❌ Not implemented
- **Required Fields**: 
  - medicationName, dosage, frequency, duration
  - startDate, notes, active status

#### 6. **Add Medical Analysis Form** (In PatientDetailPage)
- **Purpose**: Record lab test results
- **Backend**: ✅ Ready (`POST /api/medical-analyses/patients/{id}`)
- **Frontend**: ❌ Not implemented
- **Required Fields**: 
  - analysisType, laboratoryName, testDate
  - results, referenceValues, isAbnormal, doctorNotes

#### 7. **Add Cardiovascular Exam Form** (In PatientDetailPage)
- **Purpose**: Record ECG/Echo results
- **Backend**: ✅ Ready (`POST /api/cardiovascular-exams/patients/{id}`)
- **Frontend**: ❌ Not implemented
- **Required Fields**: 
  - examType, examDate, findings
  - interpretation, recommendations

---

### 🟡 **Medium Priority - Feature Enhancements**

#### 8. **Dashboard Statistics**
- **Purpose**: Show real-time system metrics
- **Backend**: ✅ Partially ready (patient count endpoint exists)
- **Frontend**: ❌ Static UI only
- **Needed APIs**:
  - Total users count
  - Total consultations today/week/month
  - Active treatments count
  - Recent activity feed

#### 9. **User Management Page** (Admin only)
- **Purpose**: Manage system users (doctors, secretaries)
- **Backend**: ❌ Missing endpoints
  - `GET /api/auth/users` - List all users
  - `PUT /api/auth/users/{id}` - Update user
  - `DELETE /api/auth/users/{id}` - Deactivate user
  - `POST /api/auth/users/{id}/reset-password` - Force password reset
- **Frontend**: ❌ Not implemented

#### 10. **Chat History Persistence**
- **Purpose**: Save chat conversations
- **Backend**: ❌ Missing endpoints & database
  - Need new `ChatHistory` entity
  - `POST /api/chatbot/conversations` - Save conversation
  - `GET /api/chatbot/conversations/{userId}` - Get user's chats
- **Frontend**: ❌ Not implemented

#### 11. **Export Features**
- **Purpose**: Export patient data, reports to PDF/CSV
- **Backend**: ❌ Missing endpoints
  - `GET /api/patients/{id}/export/pdf` - Patient medical report
  - `GET /api/patients/export/csv` - All patients CSV
  - `GET /api/consultations/{id}/export/pdf` - Consultation report
- **Frontend**: ❌ Not implemented

---

### 🟢 **Low Priority - Nice to Have**

#### 12. **Appointment Scheduling System**
- **Backend**: ❌ Not implemented (new service needed)
- **Frontend**: ❌ Not implemented
- **Required**: 
  - New `Appointment` entity
  - Calendar integration
  - Email/SMS notifications

#### 13. **Notifications System**
- **Backend**: ❌ Not implemented
- **Frontend**: ❌ Not implemented
- **Features**:
  - Real-time notifications (WebSocket)
  - Appointment reminders
  - Treatment reminders
  - Lab results ready alerts

#### 14. **Multi-language Support**
- **Backend**: ✅ Chatbot supports FR/EN
- **Frontend**: ❌ Only English UI
- **Needed**: i18n library (react-i18next)

#### 15. **Profile Picture Upload**
- **Backend**: ❌ Missing endpoints
  - `POST /api/auth/profile/avatar` - Upload avatar
  - File storage (AWS S3 or local)
- **Frontend**: ❌ Not implemented

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: TailwindCSS 3
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Forms**: React Hook Form (recommended for new forms)
- **UI Components**: Custom components + Heroicons

### **Backend Microservices**

#### Auth Service
- **Framework**: Django 5.0 + Django REST Framework
- **Database**: PostgreSQL 16
- **Authentication**: djangorestframework-simplejwt (RS256)
- **Password Hashing**: Argon2

#### Patient Service
- **Framework**: Spring Boot 3.2 (Java 21)
- **Database**: PostgreSQL 16
- **ORM**: Hibernate/JPA
- **Validation**: Spring Validation
- **API Docs**: SpringDoc OpenAPI

#### Chatbot Service
- **Framework**: FastAPI 0.109
- **AI Model**: Groq (Llama 3.1 70B)
- **RAG**: ChromaDB + Sentence Transformers
- **Document Processing**: PyPDF2, Tesseract OCR, pdf2image
- **Medical Knowledge**: 5.2 MB HAS/ANSM guidelines

### **Infrastructure**
- **API Gateway**: Kong 3.5
- **Database**: PostgreSQL 16
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Kong (JWT validation, rate limiting)

---

## 📝 Development Workflow for Collaborators

### **Adding a New Page**

1. **Create the page component**:
   ```bash
   src/pages/MyNewPage.tsx
   ```

2. **Add the route in App.tsx**:
   ```typescript
   <Route path="/my-new-page" element={<MyNewPage />} />
   ```

3. **Use existing services**:
   ```typescript
   import { getPatients } from '../services/patients';
   ```

4. **Follow the existing page structure**:
   - Use TailwindCSS for styling
   - Handle loading states
   - Handle errors with try/catch
   - Use AuthContext for user info

### **Adding a New API Endpoint**

1. **Backend**: Implement the endpoint in the respective service
2. **Frontend**: Add the function to the corresponding service file
3. **Test**: Use Postman/Thunder Client to verify
4. **Document**: Update this file with the new endpoint

---

## 🎯 Immediate Next Steps for Collaborators

### **Week 1-2: Critical Forms**
1. ✅ Add Patient Form (Create + Edit)
2. ✅ Add Vital Signs Form (Modal in Patient Detail)
3. ✅ Add Consultation Form (Modal in Patient Detail)

### **Week 3-4: Medical Records**
4. ✅ Add Treatment Prescription Form
5. ✅ Add Medical Analysis Form
6. ✅ Add Cardiovascular Exam Form

### **Week 5-6: Dashboard & Reports**
7. ✅ Enhance Dashboard with real statistics
8. ✅ Implement PDF export for patient reports
9. ✅ Add user management page (admin only)

### **Future Enhancements**
- Appointment scheduling system
- Real-time notifications (WebSocket)
- Chat history persistence
- Multi-language UI
- Advanced search and filters

---

## 🔗 Useful Links

- **Frontend Dev Server**: http://localhost:5173
- **Kong Gateway**: http://localhost:8000
- **Auth Service**: http://localhost:8001 (internal)
- **Chatbot Service**: http://localhost:8002 (internal)
- **Patient Service**: http://localhost:8003 (internal)
- **API Documentation**: 
  - Patient Service: http://localhost:8003/swagger-ui.html
  - Auth Service: http://localhost:8001/api/docs/

---

## 📞 Questions?

If you have questions about the architecture or need clarification on any feature:
1. Check the `ARCHITECTURE_ANALYSIS.md` in the root directory
2. Review the existing code in similar features
3. Test the endpoints with the provided test user credentials:
   - **Admin**: admin@medinsights.com / Admin123!
   - **Doctor**: doctor1@medinsights.com / Doctor123!
   - **Test User UUID**: cb73662b-cd84-4872-8220-5d09051d756e

---

**Last Updated**: February 6, 2026  
**Version**: 1.0.0  
**Status**: Active Development
