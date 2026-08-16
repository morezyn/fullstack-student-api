const path = require('path');
const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/student.routes');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/students', studentRoutes);

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'), (err) => {
    if (err) next();
  });
});

app.use(errorHandler);

module.exports = app;
