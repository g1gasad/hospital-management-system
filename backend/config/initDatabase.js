import { getConnection } from '../config/database.js';

// Helper function to check if table exists
async function tableExists(conn, tableName) {
  try {
    const result = await conn.execute(
      `SELECT table_name FROM user_tables WHERE table_name = :tbl`,
      { tbl: tableName.toUpperCase() }
    );
    return result.rows && result.rows.length > 0;
  } catch (err) {
    return false;
  }
}

// Create tables if they don't exist
export async function initializeTables() {
  const conn = await getConnection();
  try {
    // Departments table
    if (!(await tableExists(conn, 'departments'))) {
      await conn.execute(`
        CREATE TABLE departments (
          id NUMBER PRIMARY KEY,
          name VARCHAR2(100) NOT NULL,
          head VARCHAR2(100)
        )
      `);
      console.log('  ✓ Created DEPARTMENTS table');
    }

    // Doctors table
    if (!(await tableExists(conn, 'doctors'))) {
      await conn.execute(`
        CREATE TABLE doctors (
          id NUMBER PRIMARY KEY,
          name VARCHAR2(100) NOT NULL,
          specialization VARCHAR2(100),
          department NUMBER,
          email VARCHAR2(100),
          phone VARCHAR2(20),
          availability VARCHAR2(200),
          CONSTRAINT doc_dept_fk FOREIGN KEY (department) REFERENCES departments(id)
        )
      `);
      console.log('  ✓ Created DOCTORS table');
    }

    // Patients table
    if (!(await tableExists(conn, 'patients'))) {
      await conn.execute(`
        CREATE TABLE patients (
          id NUMBER PRIMARY KEY,
          name VARCHAR2(100) NOT NULL,
          age NUMBER,
          gender VARCHAR2(20),
          email VARCHAR2(100),
          phone VARCHAR2(20),
          address VARCHAR2(200),
          medical_history VARCHAR2(500),
          registration_date DATE DEFAULT SYSDATE
        )
      `);
      console.log('  ✓ Created PATIENTS table');
    }

    // Appointments table
    if (!(await tableExists(conn, 'appointments'))) {
      await conn.execute(`
        CREATE TABLE appointments (
          id NUMBER PRIMARY KEY,
          patient_id NUMBER NOT NULL,
          doctor_id NUMBER NOT NULL,
          appointment_date DATE,
          appointment_time VARCHAR2(5),
          reason VARCHAR2(200),
          status VARCHAR2(20),
          CONSTRAINT appt_pat_fk FOREIGN KEY (patient_id) REFERENCES patients(id),
          CONSTRAINT appt_doc_fk FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        )
      `);
      console.log('  ✓ Created APPOINTMENTS table');
    }

    // Medical Records table
    if (!(await tableExists(conn, 'medical_records'))) {
      await conn.execute(`
        CREATE TABLE medical_records (
          id NUMBER PRIMARY KEY,
          patient_id NUMBER NOT NULL,
          doctor_id NUMBER NOT NULL,
          record_date DATE DEFAULT SYSDATE,
          diagnosis VARCHAR2(200) NOT NULL,
          treatment VARCHAR2(200),
          notes VARCHAR2(500),
          CONSTRAINT med_pat_fk FOREIGN KEY (patient_id) REFERENCES patients(id),
          CONSTRAINT med_doc_fk FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        )
      `);
      console.log('  ✓ Created MEDICAL_RECORDS table');
    }

    console.log('✓ All tables created/verified successfully');
    await conn.commit();
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    await conn.close();
  }
}

// Insert sample data
export async function insertSampleData() {
  const conn = await getConnection();
  try {
    // Check if data already exists
    let dataExists = false;
    try {
      const result = await conn.execute('SELECT COUNT(*) as count FROM departments');
      if (result.rows && result.rows[0][0] > 0) {
        dataExists = true;
      }
    } catch (err) {
      // Table might not exist, continue with insertion
      dataExists = false;
    }

    if (dataExists) {
      console.log('✓ Sample data already exists');
      return;
    }

    // Insert departments
    const deptInsert = `
      INSERT INTO departments (id, name, head) VALUES (:id, :name, :head)
    `;
    const departments = [
      { id: 1, name: 'Cardiology', head: 'Dr. Smith' },
      { id: 2, name: 'Neurology', head: 'Dr. Johnson' },
      { id: 3, name: 'Orthopedics', head: 'Dr. Williams' },
      { id: 4, name: 'Pediatrics', head: 'Dr. Brown' },
      { id: 5, name: 'General Surgery', head: 'Dr. Davis' }
    ];

    for (const dept of departments) {
      await conn.execute(deptInsert, dept);
    }
    console.log('  ✓ Inserted 5 departments');

    // Insert doctors
    const docInsert = `
      INSERT INTO doctors (id, name, specialization, department, email, phone, availability) 
      VALUES (:id, :name, :specialization, :department, :email, :phone, :availability)
    `;
    const doctors = [
      { id: 1, name: 'Dr. Sarah Smith', specialization: 'Cardiology', department: 1, email: 'sarah@hospital.com', phone: '555-0101', availability: 'Mon-Fri 9AM-5PM' },
      { id: 2, name: 'Dr. James Johnson', specialization: 'Neurology', department: 2, email: 'james@hospital.com', phone: '555-0102', availability: 'Tue-Sat 10AM-6PM' },
      { id: 3, name: 'Dr. Emily Williams', specialization: 'Orthopedics', department: 3, email: 'emily@hospital.com', phone: '555-0103', availability: 'Mon-Thu 8AM-4PM' },
      { id: 4, name: 'Dr. Michael Brown', specialization: 'Pediatrics', department: 4, email: 'michael@hospital.com', phone: '555-0104', availability: 'Mon-Fri 9AM-5PM' }
    ];

    for (const doctor of doctors) {
      await conn.execute(docInsert, doctor);
    }
    console.log('  ✓ Inserted 4 doctors');

    // Insert patients
    const patInsert = `
      INSERT INTO patients (id, name, age, gender, email, phone, address, medical_history) 
      VALUES (:id, :name, :age, :gender, :email, :phone, :address, :medical_history)
    `;
    const patients = [
      { id: 1, name: 'John Doe', age: 45, gender: 'Male', email: 'john@email.com', phone: '555-1001', address: '123 Main St', medical_history: 'Hypertension' },
      { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', email: 'jane@email.com', phone: '555-1002', address: '456 Oak Ave', medical_history: 'Diabetes' },
      { id: 3, name: 'Robert Johnson', age: 58, gender: 'Male', email: 'robert@email.com', phone: '555-1003', address: '789 Pine Rd', medical_history: 'Arthritis' }
    ];

    for (const patient of patients) {
      await conn.execute(patInsert, patient);
    }
    console.log('  ✓ Inserted 3 patients');

    // Insert appointments
    const apptInsert = `
      INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, reason, status) 
      VALUES (:id, :patient_id, :doctor_id, TO_DATE(:appointment_date, 'YYYY-MM-DD'), :appointment_time, :reason, :status)
    `;
    const appointments = [
      { id: 1, patient_id: 1, doctor_id: 1, appointment_date: '2024-12-20', appointment_time: '10:00', reason: 'Heart Checkup', status: 'Scheduled' },
      { id: 2, patient_id: 2, doctor_id: 4, appointment_date: '2024-12-21', appointment_time: '14:00', reason: 'Regular Checkup', status: 'Scheduled' },
      { id: 3, patient_id: 3, doctor_id: 3, appointment_date: '2024-12-22', appointment_time: '11:00', reason: 'Knee Pain', status: 'Completed' }
    ];

    for (const appt of appointments) {
      await conn.execute(apptInsert, appt);
    }
    console.log('  ✓ Inserted 3 appointments');

    // Insert medical records
    const recInsert = `
      INSERT INTO medical_records (id, patient_id, doctor_id, diagnosis, treatment, notes) 
      VALUES (:id, :patient_id, :doctor_id, :diagnosis, :treatment, :notes)
    `;
    const records = [
      { id: 1, patient_id: 1, doctor_id: 1, diagnosis: 'Hypertension Stage 1', treatment: 'Medication', notes: 'Patient advised to reduce salt intake' },
      { id: 2, patient_id: 2, doctor_id: 4, diagnosis: 'Type 2 Diabetes', treatment: 'Medication & Diet', notes: 'Follow-up in 3 months' }
    ];

    for (const record of records) {
      await conn.execute(recInsert, record);
    }
    console.log('  ✓ Inserted 2 medical records');

    await conn.commit();
    console.log('✓ Sample data inserted successfully');
  } catch (err) {
    console.error('Error inserting sample data:', err.message);
    try {
      await conn.rollback();
    } catch (rollbackErr) {
      // Ignore rollback errors
    }
  } finally {
    await conn.close();
  }
}
