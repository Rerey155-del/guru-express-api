require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const classRoutes = require('./routes/classRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const { connectKafka, runConsumer } = require('./config/kafka');

const announcementRoutes = require('./routes/announcementRoutes');

app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: "Management Sekolah API V3 is running",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      teachers: "/api/teachers",
      students: "/api/students",
      subjects: "/api/subjects",
      classes: "/api/classes",
      schedules: "/api/schedules",
      announcements: "/api/announcements"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, async () => {
  console.log(`http://localhost:${PORT}`);
    
  // Inisialisasi Kafka
  try {
      await connectKafka();
      await runConsumer('announcements');
      console.log('Kafka siap digunakan');
  } catch (error) {
      console.error('Gagal inisialisasi Kafka:', error);
  }
});
