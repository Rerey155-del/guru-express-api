const pool = require('../config/db');

const getClasses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM classes');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createClass = async (req, res) => {
  const { class_designation, room_id, utilization } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO classes (class_designation, room_id, utilization) VALUES (?, ?, ?)',
      [class_designation, room_id, utilization]
    );
    res.status(201).json({ id: result.insertId, class_designation, room_id, utilization });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE classes SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Class not found" });
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM classes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClasses, createClass, updateClass, deleteClass };
