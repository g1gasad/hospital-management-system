import { getConnection } from '../config/database.js';

// Helper function to convert Oracle UPPERCASE column names to camelCase
function formatDoctorData(row) {
  if (!row) return null;
  return {
    id: row.ID,
    name: row.NAME,
    specialization: row.SPECIALIZATION,
    department: row.DEPARTMENT,
    email: row.EMAIL,
    phone: row.PHONE,
    availability: row.AVAILABILITY
  };
}

// Get all doctors
export async function getAllDoctors(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute('SELECT * FROM doctors ORDER BY id');
    const formattedRows = (result.rows || []).map(formatDoctorData);
    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Get doctor by ID
export async function getDoctorById(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      'SELECT * FROM doctors WHERE id = :id',
      [req.params.id]
    );
    if (result.rows && result.rows.length > 0) {
      res.json(formatDoctorData(result.rows[0]));
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (err) {
    console.error('Error fetching doctor:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Add new doctor
export async function addDoctor(req, res) {
  const conn = await getConnection();
  try {
    const { name, specialization, department, email, phone, availability } = req.body;
    
    // Get next ID
    const idResult = await conn.execute('SELECT MAX(id) as maxId FROM doctors');
    const nextId = ((idResult.rows && idResult.rows[0]) ? idResult.rows[0].MAXID : 0) + 1;

    await conn.execute(
      `INSERT INTO doctors (id, name, specialization, department, email, phone, availability) 
       VALUES (:id, :name, :specialization, :department, :email, :phone, :availability)`,
      {
        id: nextId,
        name,
        specialization,
        department,
        email,
        phone,
        availability
      }
    );
    await conn.commit();
    res.json({ id: nextId, name, specialization, department, email, phone, availability });
  } catch (err) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Update doctor
export async function updateDoctor(req, res) {
  const conn = await getConnection();
  try {
    const { name, specialization, department, email, phone, availability } = req.body;
    const id = req.params.id;

    await conn.execute(
      `UPDATE doctors SET name = :name, specialization = :specialization, 
       department = :department, email = :email, phone = :phone, availability = :availability 
       WHERE id = :id`,
      {
        name,
        specialization,
        department,
        email,
        phone,
        availability,
        id
      }
    );
    await conn.commit();
    res.json({ id, name, specialization, department, email, phone, availability });
  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Delete doctor
export async function deleteDoctor(req, res) {
  const conn = await getConnection();
  try {
    const id = req.params.id;
    await conn.execute('DELETE FROM doctors WHERE id = :id', [id]);
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
