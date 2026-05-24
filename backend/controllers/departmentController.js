import { getConnection } from '../config/database.js';

// Helper function to convert Oracle UPPERCASE column names to camelCase
function formatDepartmentData(row) {
  if (!row) return null;
  return {
    id: row.ID,
    name: row.NAME,
    head: row.HEAD
  };
}

// Get all departments
export async function getAllDepartments(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute('SELECT * FROM departments ORDER BY id');
    const formattedRows = (result.rows || []).map(formatDepartmentData);
    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

// Get department by ID
export async function getDepartmentById(req, res) {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      'SELECT * FROM departments WHERE id = :id',
      [req.params.id]
    );
    if (result.rows && result.rows.length > 0) {
      res.json(formatDepartmentData(result.rows[0]));
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (err) {
    console.error('Error fetching department:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}
