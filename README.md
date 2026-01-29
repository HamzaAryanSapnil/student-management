# Student Management System API

A comprehensive RESTful API for managing students, classes, and user authentication in an educational institution. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 🚀 Postman Testing Guide

### Step 1: Import Collections
1. **Open Postman**
2. Click **Import** button (top left)
3. Select **Upload Files**
4. Import both files:
   - `Student-Management-API.postman_collection.json`
   - `Student-Management-Environment.postman_environment.json`

### Step 2: Set Environment
1. Go to **Environments** tab (left sidebar)
2. Select **"Student Management Environment"**
3. Make sure it's activated (top right dropdown)

### Step 3: Start Testing
1. **Start your server** first: `npm run dev`
2. **Login as Admin** → Cookies will be automatically set
3. **Test all endpoints** → Authentication handled via cookies

## 📋 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/v1/auth/signup` | Register new user (default: STUDENT role) | Public |
| `POST` | `/api/v1/auth/login` | User login | Public |
| `GET` | `/api/v1/auth/me` | Get current user profile | Authenticated |
| `POST` | `/api/v1/auth/refresh-token` | Refresh access token | Public |
| `POST` | `/api/v1/auth/logout` | User logout | Public |

### Student Management Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/v1/students` | Create new student | Admin Only |
| `GET` | `/api/v1/students` | Get all students with pagination | Admin, Teacher |
| `GET` | `/api/v1/students/:id` | Get student by ID | Admin, Teacher, Own Student |

### Class Management Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/v1/classes` | Create new class | Admin Only |
| `POST` | `/api/v1/classes/:id/enroll` | Enroll student in class | Admin, Teacher |
| `GET` | `/api/v1/classes/:id/students` | Get students of a class | Admin, Teacher |

## 🔐 Authentication System

### Cookie-Based Authentication
- **No Bearer tokens required** - Authentication handled via HTTP-only cookies
- **Automatic cookie management** - Login sets cookies, logout clears them
- **Secure implementation** - HttpOnly, SameSite, and Secure flags

### User Roles
- **ADMIN**: Full system access
- **TEACHER**: Limited access to assigned classes
- **STUDENT**: Access to own profile only

### Default Credentials
```
Admin:   admin@school.com   / Admin@123
Teacher: teacher@school.com / Teacher@123
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Bun or npm package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd student-management-system
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/student_management"
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="90d"
PORT=5000
NODE_ENV="development"
```

4. **Database Setup**
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start the server
npm run dev
```

5. **Verify Installation**
- Server should start on `http://localhost:5000`
- Default admin and teacher accounts will be created automatically
- Check console for confirmation messages

## 📊 Database Schema

### User Model
```prisma
model User {
  id           String     @id @default(uuid())
  email        String     @unique
  passwordHash String
  role         UserRole   @default(STUDENT)
  name         String
  profileImage String?
  bio          String?
  location     String?
  isVerified   Boolean    @default(false)
  status       UserStatus @default(ACTIVE)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}
```

### Student Model
```prisma
model Student {
  id      Int    @id @default(autoincrement())
  name    String
  age     Int
  classId Int?
  userId  String
}
```

### Class Model
```prisma
model Class {
  id        Int    @id @default(autoincrement())
  name      String
  section   String
  teacherId String
}
```

## 🔧 API Usage Examples

### Authentication Flow
```javascript
// 1. Login (sets cookies automatically)
POST /api/v1/auth/login
{
  "email": "admin@school.com",
  "password": "Admin@123"
}

// 2. Make authenticated requests (cookies sent automatically)
GET /api/v1/students

// 3. Logout (clears cookies)
POST /api/v1/auth/logout
```

### Student Management
```javascript
// Create student (Admin only)
POST /api/v1/students
{
  "email": "student@example.com",
  "password": "Student@123",
  "name": "John Doe",
  "age": 20
}

// Get all students with pagination
GET /api/v1/students?page=1&limit=10&sortBy=name&sortOrder=asc

// Search students
GET /api/v1/students?searchTerm=john&page=1&limit=5
```

### Class Management
```javascript
// Create class (Admin only)
POST /api/v1/classes
{
  "name": "Mathematics",
  "section": "A",
  "teacherId": "teacher-uuid-here"
}

// Enroll student in class
POST /api/v1/classes/1/enroll
{
  "studentId": 1
}

// Get class students
GET /api/v1/classes/1/students?page=1&limit=10
```

## 📝 Request/Response Examples

### Successful Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🔍 Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (`id`, `name`, `age`)
- `sortOrder`: Sort direction (`asc`, `desc`)

### Search
- `searchTerm`: Search in name and email fields

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Access and refresh token system
- **Input Validation**: Zod schema validation
- **Role-based Access Control**: Granular permissions
- **HTTP-only Cookies**: Secure token storage
- **CORS Protection**: Cross-origin request handling

## 🚦 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm start              # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:format   # Format Prisma schema

# Code Quality
npm run eslint         # Run ESLint
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── config/         # Environment configuration
│   ├── errorHelpers/   # Error handling utilities
│   ├── helper/         # JWT and pagination helpers
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # Express middlewares
│   ├── modules/        # Feature modules
│   │   ├── auth/       # Authentication module
│   │   ├── student/    # Student management
│   │   └── class/      # Class management
│   ├── routes/         # Route definitions
│   └── shared/         # Shared utilities
├── utils/              # Utility functions
└── server.ts           # Application entry point
```

## 🧪 Testing with Postman

### Quick Test Flow
1. **Login as Admin** → `POST /auth/login`
2. **Create Student** → `POST /students`
3. **Create Class** → `POST /classes` (need teacherId)
4. **Enroll Student** → `POST /classes/:id/enroll`
5. **View Class Students** → `GET /classes/:id/students`

### Environment Variables in Postman
- `baseUrl`: http://localhost:5000/api/v1
- `classId`: Auto-set when creating classes
- `teacherId`: Set manually from teacher login response

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the Postman collection examples

---

**Happy Coding! 🚀**