# API Connection Architecture & Examples

## 🏗️ System Architecture

### Three-Tier Architecture
```
Presentation Layer (Frontend)
    ↓ (REST API - JSON)
Application Layer (Backend)
    ↓ (SQL - Connection Pool)
Data Layer (Oracle Database)
```

## 📡 Frontend-Backend Communication Flow

### Request Lifecycle
```
User Action (React Component)
    ↓
HospitalContext (State Management)
    ↓
API Service (src/services/api.js)
    ↓
Express Route Handler
    ↓
Business Logic Controller
    ↓
Database Query
    ↓
Oracle Response
    ↓
JSON Response
    ↓
React Component Update
```

## 🔌 Connection Pattern Examples

### Pattern 1: Simple Query (Get All Patients)

**Frontend:**
```jsx
// src/pages/Patients.jsx
import { useEffect, useState } from 'react';
import { patientsAPI } from '../services/api';

export function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientsAPI.getAll();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Patients</h1>
      {patients.map(patient => (
        <div key={patient.id}>
          <h3>{patient.name}</h3>
          <p>Age: {patient.age}</p>
        </div>
      ))}
    </div>
  );
}
```

**Backend (Controller):**
```javascript
// backend/controllers/patientController.js
import { getConnection } from '../config/database.js';

export async function getAllPatients(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute('SELECT * FROM patients');
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
```

**API Flow:**
```
GET http://localhost:5000/api/patients
    ↓
Express Router
    ↓
patientController.getAllPatients()
    ↓
SELECT * FROM patients
    ↓
Oracle Database Connection Pool
    ↓
[{ id: 1, name: 'John Doe', ... }, ...]
    ↓
JSON Response
```

---

### Pattern 2: Create with Validation (Add Patient)

**Frontend:**
```jsx
// Adding validation on the frontend
const handleAddPatient = async (formData) => {
  // Client-side validation
  if (!formData.name || formData.name.trim() === '') {
    alert('Patient name is required');
    return;
  }
  if (formData.age < 0 || formData.age > 150) {
    alert('Invalid age');
    return;
  }

  try {
    const newPatient = await patientsAPI.add({
      id: Date.now(), // Generate unique ID
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      medical_history: formData.medical_history
    });
    
    setPatients([...patients, newPatient]);
    alert('Patient added successfully!');
  } catch (err) {
    alert('Error adding patient: ' + err.message);
  }
};
```

**Backend (Enhanced Controller with Transaction):**
```javascript
// backend/controllers/patientController.js
export async function addPatient(req, res) {
  const conn = await getConnection();
  try {
    const {
      id, name, age, gender, email, phone, address, medical_history
    } = req.body;

    // Server-side validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Patient name is required' });
    }
    if (age < 0 || age > 150) {
      return res.status(400).json({ error: 'Invalid age' });
    }

    const query = `
      INSERT INTO patients (id, name, age, gender, email, phone, address, medical_history)
      VALUES (:id, :name, :age, :gender, :email, :phone, :address, :medical_history)
    `;

    const result = await conn.execute(query, {
      id: id || Math.floor(Math.random() * 1000000),
      name,
      age,
      gender: gender || 'Not specified',
      email: email || null,
      phone: phone || null,
      address: address || null,
      medical_history: medical_history || null
    });

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Patient added successfully',
      data: { id, name, age, gender, email, phone, address, medical_history }
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
```

**Request/Response:**
```
POST http://localhost:5000/api/patients
Content-Type: application/json

REQUEST:
{
  "id": 1234567890,
  "name": "Jane Smith",
  "age": 32,
  "gender": "Female",
  "email": "jane@email.com",
  "phone": "555-1234",
  "address": "789 Elm St",
  "medical_history": "Diabetes"
}

RESPONSE (201 Created):
{
  "success": true,
  "message": "Patient added successfully",
  "data": {
    "id": 1234567890,
    "name": "Jane Smith",
    "age": 32,
    "gender": "Female",
    "email": "jane@email.com",
    "phone": "555-1234",
    "address": "789 Elm St",
    "medical_history": "Diabetes"
  }
}

ERROR RESPONSE (400 Bad Request):
{
  "error": "Patient name is required"
}
```

---

### Pattern 3: Complex Query with JOINs (Get Patient with Appointments)

**Backend:**
```javascript
// backend/controllers/appointmentController.js
export async function getAppointmentsByPatient(req, res) {
  const conn = await getConnection();
  try {
    const patientId = req.params.patientId;

    const query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        d.name as doctor_name,
        d.specialization,
        dept.name as department_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN departments dept ON d.department = dept.id
      WHERE a.patient_id = :patientId
      ORDER BY a.appointment_date DESC
    `;

    const result = await conn.execute(query, { patientId });

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row[0],
        appointment_date: row[1],
        appointment_time: row[2],
        reason: row[3],
        status: row[4],
        doctor_name: row[5],
        specialization: row[6],
        department_name: row[7]
      })),
      count: result.rows.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
```

---

### Pattern 4: Aggregation Query (Dashboard Statistics)

**Backend:**
```javascript
// backend/controllers/dashboardController.js
export async function getDashboardStats(req, res) {
  const conn = await getConnection();
  try {
    // Get total patients
    const patientCount = await conn.execute('SELECT COUNT(*) FROM patients');
    
    // Get total doctors
    const doctorCount = await conn.execute('SELECT COUNT(*) FROM doctors');
    
    // Get today's appointments
    const todayAppts = await conn.execute(`
      SELECT COUNT(*) FROM appointments 
      WHERE TRUNC(appointment_date) = TRUNC(SYSDATE)
    `);

    // Get appointments by status
    const apptByStatus = await conn.execute(`
      SELECT status, COUNT(*) as count
      FROM appointments
      GROUP BY status
    `);

    res.json({
      success: true,
      stats: {
        total_patients: patientCount.rows[0][0],
        total_doctors: doctorCount.rows[0][0],
        today_appointments: todayAppts.rows[0][0],
        appointments_by_status: apptByStatus.rows.map(row => ({
          status: row[0],
          count: row[1]
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
```

**Frontend Usage:**
```jsx
export function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await apiCall('/dashboard/stats');
      setStats(response.stats);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stat-cards">
        <div className="card">
          <h3>Total Patients</h3>
          <p>{stats?.total_patients}</p>
        </div>
        <div className="card">
          <h3>Total Doctors</h3>
          <p>{stats?.total_doctors}</p>
        </div>
        <div className="card">
          <h3>Today's Appointments</h3>
          <p>{stats?.today_appointments}</p>
        </div>
      </div>
    </div>
  );
}
```

---

### Pattern 5: Update with Concurrency Control

**Backend:**
```javascript
export async function updatePatient(req, res) {
  const conn = await getConnection();
  try {
    const { id } = req.params;
    const { name, age, gender, email, phone, address, medical_history } = req.body;

    const query = `
      UPDATE patients
      SET name = :name,
          age = :age,
          gender = :gender,
          email = :email,
          phone = :phone,
          address = :address,
          medical_history = :medical_history
      WHERE id = :id
    `;

    const result = await conn.execute(query, {
      id,
      name,
      age,
      gender,
      email,
      phone,
      address,
      medical_history
    });

    await conn.commit();

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully'
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
```

---

### Pattern 6: Delete with Cascade Check

**Backend:**
```javascript
export async function deletePatient(req, res) {
  const conn = await getConnection();
  try {
    const { id } = req.params;

    // Check for related appointments
    const apptCheck = await conn.execute(
      'SELECT COUNT(*) FROM appointments WHERE patient_id = :id',
      { id }
    );

    if (apptCheck.rows[0][0] > 0) {
      return res.status(400).json({
        error: 'Cannot delete patient with existing appointments. Delete appointments first.'
      });
    }

    const result = await conn.execute(
      'DELETE FROM patients WHERE id = :id',
      { id }
    );

    await conn.commit();

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
```

---

## 🔒 Error Handling Standards

### Standardized Error Response
```javascript
// backend/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
}
```

### Common HTTP Status Codes
```
200 OK - Request successful
201 Created - Resource created
204 No Content - Request successful, no content to return
400 Bad Request - Invalid input
401 Unauthorized - Authentication required
403 Forbidden - Access denied
404 Not Found - Resource not found
500 Internal Server Error - Server error
503 Service Unavailable - Database connection failed
```

---

## 🧪 Testing the API Connection

### Using Postman/Insomnia

#### 1. Health Check
```
GET http://localhost:5000/api/health
```

#### 2. Get All Patients
```
GET http://localhost:5000/api/patients
```

#### 3. Add Patient
```
POST http://localhost:5000/api/patients
Content-Type: application/json

{
  "name": "Test Patient",
  "age": 35,
  "gender": "Male",
  "email": "test@email.com"
}
```

#### 4. Get Specific Patient
```
GET http://localhost:5000/api/patients/1
```

#### 5. Update Patient
```
PUT http://localhost:5000/api/patients/1
Content-Type: application/json

{
  "name": "Updated Name",
  "age": 36
}
```

#### 6. Delete Patient
```
DELETE http://localhost:5000/api/patients/1
```

---

## 📊 Performance Optimization

### Query Optimization Tips

1. **Add Database Indexes**
```sql
-- Frequently queried columns
CREATE INDEX idx_patient_email ON patients(email);
CREATE INDEX idx_doctor_specialization ON doctors(specialization);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_patient_appointments ON appointments(patient_id);
```

2. **Use Connection Pooling** (Already configured)
```javascript
{
  poolMin: 5,
  poolMax: 30,
  poolIncrement: 2
}
```

3. **Implement Caching** (Frontend)
```javascript
const cache = {};

export async function getCachedPatients() {
  if (cache['patients']) {
    return cache['patients'];
  }
  const patients = await patientsAPI.getAll();
  cache['patients'] = patients;
  return patients;
}
```

4. **Paginate Large Result Sets**
```javascript
export async function getPatientsWithPagination(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const query = `
    SELECT * FROM patients
    ORDER BY id
    OFFSET :offset ROWS
    FETCH NEXT :limit ROWS ONLY
  `;
  return conn.execute(query, { offset, limit });
}
```

---

**Last Updated:** May 23, 2026
