import { getConnection } from '../config/database.js';

// Helper function to convert Oracle UPPERCASE column names to camelCase
function formatRecordData(row) {
  if (!row) return null;
  return {
    id: row.ID,
    patientId: row.PATIENT_ID,
    doctorId: row.DOCTOR_ID,
    recordDate: row.RECORD_DATE,
    diagnosis: row.DIAGNOSIS,
    treatment: row.TREATMENT,
    notes: row.NOTES
  };
}

// Get all medical records
export async function getAllRecords(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute('SELECT * FROM medical_records ORDER BY id');
    const formattedRows = (result.rows || []).map(formatRecordData);
    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching medical records:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Get records by patient ID
export async function getRecordsByPatientId(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      'SELECT * FROM medical_records WHERE patient_id = :patient_id',
      [req.params.patientId]
    );
    const formattedRows = (result.rows || []).map(formatRecordData);
    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching patient records:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Add new medical record
export async function addRecord(req, res) {
  const conn = await getConnection();
  try {
    const { patientId, doctorId, diagnosis, treatment, notes } = req.body;
    
    // Get next ID
    const idResult = await conn.execute('SELECT MAX(id) as maxId FROM medical_records');
    const nextId = ((idResult.rows && idResult.rows[0]) ? idResult.rows[0].MAXID : 0) + 1;

    await conn.execute(
      `INSERT INTO medical_records (id, patient_id, doctor_id, diagnosis, treatment, notes) 
       VALUES (:id, :patient_id, :doctor_id, :diagnosis, :treatment, :notes)`,
      {
        id: nextId,
        patient_id: patientId,
        doctor_id: doctorId,
        diagnosis,
        treatment: treatment || '',
        notes: notes || ''
      }
    );
    await conn.commit();
    res.json({ id: nextId, patientId, doctorId, diagnosis, treatment, notes });
  } catch (err) {
    console.error('Error adding medical record:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
