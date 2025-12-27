# Migration from localStorage to MySQL Database

## Summary

The dental clinic application has been successfully migrated from using `localStorage` to a MySQL database backend. All data is now persisted in a MySQL database with proper relationships and foreign key constraints.

## Database Tables Created

1. **patients** - Stores patient information
   - Primary key: `id`
   - Fields: firstName, lastName, dateOfBirth, gender, phone, email, address, emergencyContact, emergencyPhone, medicalHistory, allergies, insuranceProvider, insuranceNumber, createdAt, lastVisit

2. **appointments** - Stores appointment records
   - Primary key: `id`
   - Foreign key: `patientId` → patients(id)
   - Fields: patientId, appointmentDate, appointmentTime, duration, type, status, notes, createdAt

3. **treatments** - Stores treatment records
   - Primary key: `id`
   - Foreign keys: `patientId` → patients(id), `appointmentId` → appointments(id)
   - Fields: patientId, appointmentId, treatmentDate, toothNumber, treatmentType, description, diagnosis, procedureDetails, notes, nextVisitDate, createdAt

4. **payments** - Stores payment records
   - Primary key: `id`
   - Foreign keys: `patientId` → patients(id), `treatmentId` → treatments(id), `appointmentId` → appointments(id)
   - Fields: patientId, treatmentId, appointmentId, paymentDate, amount, paymentMethod, paymentType, description, status, invoiceNumber, createdAt

5. **users** - Stores user authentication credentials
   - Primary key: `id`
   - Fields: username, password, createdAt, updatedAt

## Services Updated

All Angular services have been updated to use HTTP API calls instead of localStorage:

1. **PatientService** - Now uses `HttpClient` to communicate with `/api/patients` endpoints
2. **AppointmentService** - Now uses `HttpClient` to communicate with `/api/appointments` endpoints
3. **TreatmentService** - Now uses `HttpClient` to communicate with `/api/treatments` endpoints
4. **PaymentService** - Now uses `HttpClient` to communicate with `/api/payments` endpoints
5. **AuthService** - Now uses `HttpClient` to communicate with `/api/auth` endpoints

## Components Updated

All components have been updated to handle Observables instead of synchronous method calls:

- `PatientListComponent`
- `PatientFormComponent`
- `AppointmentsComponent`
- `TreatmentsComponent`
- `BillingComponent`
- `DashboardComponent`
- `LoginComponent`
- `SettingsComponent`

## API Endpoints

The Express.js backend provides the following REST API endpoints:

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments (with patient info)
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Treatments
- `GET /api/treatments` - Get all treatments (with patient info)
- `POST /api/treatments` - Create new treatment
- `PUT /api/treatments/:id` - Update treatment
- `DELETE /api/treatments/:id` - Delete treatment

### Payments
- `GET /api/payments` - Get all payments (with patient info)
- `POST /api/payments` - Create new payment (auto-generates invoice number)
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Authentication
- `POST /api/auth/login` - Login user
- `PUT /api/auth/password` - Change password
- `POST /api/auth/user` - Add/update user

## Database Configuration

The application uses environment variables for database configuration (stored in `.env`):

```
DB_HOST=localhost
DB_USER=smiles
DB_PASSWORD=Vicky@1433
DB_NAME=dental_clinic
PORT=3000
```

## Starting the Application

1. **Start MySQL Server** (if not already running)

2. **Start the Backend Server**:
   ```bash
   cd server
   node server.js
   ```
   Or use the npm script:
   ```bash
   npm run server
   ```

3. **Start the Angular Frontend**:
   ```bash
   npm start
   ```

The backend API will be available at `http://localhost:3000/api` and the Angular app will be available at `http://localhost:4200`.

## Default User Credentials

- Username: `admin`
- Password: `admin123`

## Notes

- All foreign key relationships are properly configured with CASCADE deletes where appropriate
- The API automatically joins related tables (patients) when returning appointments, treatments, and payments
- Invoice numbers are auto-generated in the format: `INV-YYYYMM-####`
- All date fields are stored as DATE/TIME types in MySQL
- The application maintains backward compatibility with the existing UI/UX


