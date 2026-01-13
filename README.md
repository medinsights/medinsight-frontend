# MedInsights+ Frontend

Modern healthcare management system frontend built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Doctor, Secretary, User)
- **Patient Management**: Comprehensive CRUD operations for patient records
- **Kong API Gateway Integration**: All API requests routed through Kong Gateway with JWT validation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Search & Filtering**: Fast patient search with multiple filter options
- **Medical Records**: Blood type, allergies, chronic diseases tracking
- **Emergency Contacts**: Quick access to emergency contact information

## 📋 Prerequisites

- Node.js 20 or higher
- npm or yarn
- Kong Gateway running on `localhost:8000`
- Auth Service running on `localhost:8001`
- Patient Service running on `localhost:8080`

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   cd medinsight-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```env
   VITE_KONG_GATEWAY_URL=http://localhost:8000
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t medinsights-frontend:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

The containerized frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx    # Main layout with sidebar
│   ├── AdminRoute.tsx              # Admin-only route guard
│   ├── ProtectedRoute.tsx          # Authentication guard
│   └── RoleRoute.tsx               # Role-based route guard
├── contexts/
│   └── AuthContext.tsx             # Authentication context
├── pages/
│   ├── patient/
│   │   ├── PatientsListPage.tsx   # Patient list with search/filter
│   │   └── PatientDetailPage.tsx  # Patient details/edit/delete
│   ├── DashboardPage.tsx           # Admin dashboard
│   ├── HomePage.tsx                # Landing page
│   ├── LoginPage.tsx               # Login form
│   ├── PatientProfilePage.tsx     # User profile
│   └── RegisterPage.tsx            # Registration form
├── services/
│   ├── auth.ts                     # Authentication API calls
│   ├── axios.ts                    # Axios instance with interceptors
│   └── patients.ts                 # Patient management API calls
├── config/
│   └── api.ts                      # API endpoints configuration
└── App.tsx                         # Main app with routing
```

## 🔐 User Roles & Permissions

| Role      | Dashboard | Patients | Profile |
|-----------|-----------|----------|---------|
| Admin     | ✅        | ✅       | ✅      |
| Doctor    | ❌        | ✅       | ✅      |
| Secretary | ❌        | ✅       | ✅      |
| User      | ❌        | ❌       | ✅      |

## 🔌 API Integration

All API requests go through Kong Gateway at `localhost:8000`:

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout

### Patient Management Endpoints
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient by ID
- `GET /api/patients/search?query=` - Search patients
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `PATCH /api/patients/:id/deactivate` - Deactivate patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/stats/count` - Get active patient count

## 🧪 Testing the Application

### 1. Start all services

```bash
# Terminal 1: Auth Service
cd medinsight-auth-service
python manage.py runserver 8001

# Terminal 2: Patient Service
cd medinsight-patient-service
mvn spring-boot:run

# Terminal 3: Kong Gateway
cd medinsight-gateway
docker-compose up -d

# Terminal 4: Frontend
cd medinsight-frontend
npm run dev
```

### 2. Test Complete Flow

1. **Register**: Navigate to `http://localhost:5173/register`, create doctor/secretary account
2. **Login**: Login with credentials, JWT stored in localStorage
3. **Patients List**: Navigate to `/patients`, view statistics
4. **Create Patient**: Click "New Patient", fill form with all details
5. **View Details**: Click "View Details" on patient row
6. **Edit Patient**: Click "Edit Patient", modify fields, save
7. **Deactivate**: Click "Deactivate" to soft-delete
8. **Delete**: Click "Delete Patient" to permanently remove

### 3. Verify Kong Integration

Check browser DevTools Network tab - responses should include:
- `X-Kong-Request-Id`
- `X-Correlation-ID`
- `X-Kong-Proxy-Latency`

## 🏗️ Build for Production

```bash
npm run build
```

Production build will be in `dist/` directory.

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Cannot connect to Kong Gateway
- Verify Kong is running: `docker ps | grep kong`
- Test Kong: `curl http://localhost:8000`

### JWT Token Invalid (401)
- Check token in localStorage
- Token expires in 15 minutes - logout and login again

### Patient Service Not Reachable (502)
- Verify service: `curl http://localhost:8080/api/patients`
- Check Kong configuration

### CORS Errors
- Verify Kong CORS plugin allows `http://localhost:5173`

## 📝 License

MIT

## 👥 Contributors

MedInsights Team
