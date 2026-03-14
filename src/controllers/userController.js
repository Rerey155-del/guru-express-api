const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const {username, password} = req.body;
  try{
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if(rows.length === 0 ) return res.status(401).json({ messsage: "Invalid credentials"});

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({ messsage: "Invalid credentials"});

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h'});

    res.json({ token, user: { id: user.id, username: user.username, role: user.role }});
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
  const { full_name, username, email, password, role, status } = req.body;
  try {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'password123', salt);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, username, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, username, email, hashedPassword, role || 'Admin', status || 'Aktif']
    );
    res.status(201).json({ id: result.insertId, full_name, username, email, role, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { full_name, username, email, password, role, status } = req.body;
  try {
    let query = 'UPDATE users SET full_name = ?, username = ?, email = ?, role = ?, status = ? WHERE id = ?';
    let params = [full_name, username, email, role, status, req.params.id];

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query = 'UPDATE users SET full_name = ?, username = ?, email = ?, password = ?, role = ?, status = ? WHERE id = ?';
      params = [full_name, username, email, hashedPassword, role, status, req.params.id];
    }

    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ id: req.params.id, full_name, username, email, role, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const patchUser = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    
    const current = rows[0];
    const data = { ...req.body };

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const updated = { ...current, ...data };
    
    await pool.query(
      'UPDATE users SET full_name = ?, username = ?, email = ?, password = ?, role = ?, status = ? WHERE id = ?',
      [updated.full_name, updated.username, updated.email, updated.password, updated.role, updated.status, req.params.id]
    );
    
    // Don't return password in response
    const { password: _, ...userResponse } = updated;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, login, createUser, updateUser, patchUser, deleteUser };
