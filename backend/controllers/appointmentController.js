import { getConnection } from '../config/database.js';

// Helper function to convert Oracle UPPERCASE column names to camelCase
function formatAppointmentData(row) {
  if (!row) return null;
  return {
    id: row.ID,
    patientId: row.PATIENT_ID,
    doctorId: row.DOCTOR_ID,
    appointmentDate: row.APPOINTMENT_DATE,
    appointmentTime: row.APPOINTMENT_TIME,
    reason: row.REASON,
    status: row.STATUS
  };
}

// Get all appointments
export async function getAllAppointments(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute('SELECT * FROM appointments ORDER BY id');
    const formattedRows = (result.rows || []).map(formatAppointmentData);
    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Get appointment by ID
export async function getAppointmentById(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      'SELECT * FROM appointments WHERE id = :id',
      [req.params.id]
    );
    if (result.rows && result.rows.length > 0) {
      res.json(formatAppointmentData(result.rows[0]));
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Add new appointment
export async function addAppointment(req, res) {
  const conn = await getConnection();
  try {
    const { patientId, doctorId, date, time, reason, status } = req.body;
    
    // Get next ID
    const idResult = await conn.execute('SELECT MAX(id) as maxId FROM appointments');
    const nextId = ((idResult.rows && idResult.rows[0]) ? idResult.rows[0].MAXID : 0) + 1;

    await conn.execute(
      `INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, reason, status) 
       VALUES (:id, :patient_id, :doctor_id, :appointment_date, :appointment_time, :reason, :status)`,
      {
        id: nextId,
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: new Date(date),
        appointment_time: time,
        reason: reason || '',
        status: status || 'Scheduled'
      }
    );
    await conn.commit();
    res.json({ id: nextId, patientId, doctorId, date, time, reason, status });
  } catch (err) {
    console.error('Error adding appointment:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Update appointment
export async function updateAppointment(req, res) {
  const conn = await getConnection();
  try {
    const { patientId, doctorId, date, time, reason, status } = req.body;
    const id = req.params.id;

    await conn.execute(
      `UPDATE appointments SET patient_id = :patient_id, doctor_id = :doctor_id, 
       appointment_date = :appointment_date, appointment_time = :appointment_time, reason = :reason, status = :status 
       WHERE id = :id`,
      {
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: new Date(date),
        appointment_time: time,
        reason,
        status,
        id
      }
    );
    await conn.commit();
    res.json({ id, patientId, doctorId, date, time, reason, status });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Delete appointment
export async function deleteAppointment(req, res) {
  const conn = await getConnection();
  try {
    const id = req.params.id;
    await conn.execute('DELETE FROM appointments WHERE id = :id', [id]);
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
