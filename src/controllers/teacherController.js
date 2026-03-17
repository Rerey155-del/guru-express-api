const pool = require('../config/db');

const logAudit = async (entity_name, entity_id, action, name, old_value, new_value) => {
  try {
    await pool.query(
      'INSERT INTO audit_logs (entity_name, entity_id, action, name, old_value, new_value) VALUES (?,?,?,?,?,?)',
      [entity_name, entity_id, action, name, JSON.stringify(old_value), JSON.stringify(new_value)]
    );
  } catch (error) {
    console.error('Error logging audit:', error);
  }
};

// List all teachers
const getTeachers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teachers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Teacher not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new teacher
const createTeacher = async (req, res) => {
  const { name, nip, email, department, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO teachers (name, nip, email, department, status) VALUES (?, ?, ?, ?, ?)',
      [name, nip, email, department, status || 'Aktif']
    );

    const newId = result.insertId;
    const newData = { name, nip, email, department, status: status || 'Aktif' };

    await logAudit('teachers', newId, 'CREATE', 'Admin system', null, newData);

    res.status(201).json({ id: newId, ...newData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing teacher (PUT)
const updateTeacher = async (req, res) => {
  const { name, nip, email, department, status } = req.body;
  const id = req.params.id;
  try {
    // 1. Ambil data lama untuk audit log
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Teacher not found" });
    const oldData = rows[0];

    // 2. Eksekusi Update
    await pool.query(
      'UPDATE teachers SET name = ?, nip = ?, email = ?, department = ?, status = ? WHERE id = ?',
      [name, nip, email, department, status, id]
    );

    const newData = { id, name, nip, email, department, status };

    // 3. Catat Audit Log
    await logAudit('teachers', id, 'UPDATE', 'Admin system', oldData, newData);

    res.json(newData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Partially update a teacher (PATCH)
const patchTeacher = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Teacher not found" });

    const current = rows[0];
    const { name, nip, email, department, status } = req.body;

    const updated = {
      name: name !== undefined ? name : current.name,
      nip: nip !== undefined ? nip : current.nip,
      email: email !== undefined ? email : current.email,
      department: department !== undefined ? department : current.department,
      status: status !== undefined ? status : current.status
    };

    await pool.query(
      'UPDATE teachers SET name = ?, nip = ?, email = ?, department = ?, status = ? WHERE id = ?',
      [updated.name, updated.nip, updated.email, updated.department, updated.status, req.params.id]
    );

    res.json({ id: req.params.id, ...updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  const id = req.params.id;
  try {
    // 1. Ambil data lama (old_value) agar ada jejak sebelum dihapus
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Teacher not found" });
    const oldData = rows[0];
    // 2. Lakukan Delete
    await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
    // 3. CATAT AUDIT LOG
    await logAudit('teachers', id, 'DELETE', 'Admin System', oldData, null);
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  patchTeacher,
  deleteTeacher
};
