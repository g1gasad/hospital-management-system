import { getConnection } from '../config/database.js';

// Helper function to convert Oracle UPPERCASE column names to camelCase
function formatPatientData(row) {
  if (!row) return null;
  return {
    id: row.ID,
    name: row.NAME,
    age: row.AGE,
    gender: row.GENDER,
    email: row.EMAIL,
    phone: row.PHONE,
    address: row.ADDRESS,
    medicalHistory: row.MEDICAL_HISTORY,
    registrationDate: row.REGISTRATION_DATE
  };
}

// Get all patients
export async function getAllPatients(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute('SELECT * FROM patients ORDER BY id');
    const formattedRows = (result.rows || []).map(formatPatientData);
    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Get patient by ID
export async function getPatientById(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      'SELECT * FROM patients WHERE id = :id',
      [req.params.id]
    );
    if (result.rows && result.rows.length > 0) {
      res.json(formatPatientData(result.rows[0]));
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Add new patient
export async function addPatient(req, res) {
  const conn = await getConnection();
  try {
    const { name, age, gender, email, phone, address, medicalHistory } = req.body;
    
    // Get next ID
    const idResult = await conn.execute('SELECT MAX(id) as maxId FROM patients');
    const nextId = ((idResult.rows && idResult.rows[0]) ? idResult.rows[0].MAXID : 0) + 1;

    await conn.execute(
      `INSERT INTO patients (id, name, age, gender, email, phone, address, medical_history) 
       VALUES (:id, :name, :age, :gender, :email, :phone, :address, :medical_history)`,
      {
        id: nextId,
        name,
        age,
        gender,
        email,
        phone,
        address,
        medical_history: medicalHistory
      }
    );
    await conn.commit();
    res.json({ id: nextId, name, age, gender, email, phone, address, medicalHistory });
  } catch (err) {
    console.error('Error adding patient:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Update patient
export async function updatePatient(req, res) {
  const conn = await getConnection();
  try {
    const { name, age, gender, email, phone, address, medicalHistory } = req.body;
    const id = req.params.id;

    await conn.execute(
      `UPDATE patients SET name = :name, age = :age, gender = :gender, 
       email = :email, phone = :phone, address = :address, medical_history = :medical_history 
       WHERE id = :id`,
      {
        name,
        age,
        gender,
        email,
        phone,
        address,
        medical_history: medicalHistory,
        id
      }
    );
    await conn.commit();
    res.json({ id, name, age, gender, email, phone, address, medicalHistory });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Delete patient
export async function deletePatient(req, res) {
  const conn = await getConnection();
  try {
    const id = req.params.id;
    await conn.execute('DELETE FROM patients WHERE id = :id', [id]);
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting patient:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
