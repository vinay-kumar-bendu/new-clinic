# MySQL Database Setup

## Prerequisites
- MySQL server installed and running
- Node.js and npm installed

## Setup Instructions

### 1. Create Database
Run the SQL script to create the database and tables:

```bash
mysql -u root -p < server/init-db.sql
```

Or manually:
```sql
source server/init-db.sql
```

### 2. Configure Database Connection
Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dental_clinic
PORT=3000
```

### 3. Start the Server
```bash
# Start only the API server
npm run start:server

# Or start both Angular and API server together
npm run start:dev
```

### 4. Test Connection
Visit: http://localhost:3000/api/health

## Default Credentials
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Patients
- GET `/api/patients` - Get all patients
- GET `/api/patients/:id` - Get patient by ID
- POST `/api/patients` - Create patient
- PUT `/api/patients/:id` - Update patient
- DELETE `/api/patients/:id` - Delete patient

### Appointments
- GET `/api/appointments` - Get all appointments
- POST `/api/appointments` - Create appointment
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Delete appointment

### Treatments
- GET `/api/treatments` - Get all treatments
- POST `/api/treatments` - Create treatment
- PUT `/api/treatments/:id` - Update treatment
- DELETE `/api/treatments/:id` - Delete treatment

### Payments
- GET `/api/payments` - Get all payments
- POST `/api/payments` - Create payment
- PUT `/api/payments/:id` - Update payment
- DELETE `/api/payments/:id` - Delete payment

### Authentication
- POST `/api/auth/login` - Login
- PUT `/api/auth/password` - Change password
- POST `/api/auth/user` - Add/Update user



