const express = require('express');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const lessonsRoutes = require('./routes/lesson.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});