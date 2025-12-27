const express = require('express');
const router = express.Router();
const pool = require('./database');

// ========== PATIENTS API ==========
router.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM patients ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/patients/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/patients', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, phone, email, address, 
            emergencyContact, emergencyPhone, medicalHistory, allergies, 
            insuranceProvider, insuranceNumber } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO patients (firstName, lastName, dateOfBirth, gender, phone, email, 
       address, emergencyContact, emergencyPhone, medicalHistory, allergies, 
       insuranceProvider, insuranceNumber) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, dateOfBirth, gender, phone, email, address,
       emergencyContact, emergencyPhone, medicalHistory, allergies,
       insuranceProvider, insuranceNumber]
    );
    
    const [newPatient] = await pool.execute('SELECT * FROM patients WHERE id = ?', [result.insertId]);
    res.status(201).json(newPatient[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/patients/:id', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, phone, email, address,
            emergencyContact, emergencyPhone, medicalHistory, allergies,
            insuranceProvider, insuranceNumber, lastVisit } = req.body;
    
    await pool.execute(
      `UPDATE patients SET firstName=?, lastName=?, dateOfBirth=?, gender=?, 
       phone=?, email=?, address=?, emergencyContact=?, emergencyPhone=?, 
       medicalHistory=?, allergies=?, insuranceProvider=?, insuranceNumber=?, 
       lastVisit=? WHERE id=?`,
      [firstName, lastName, dateOfBirth, gender, phone, email, address,
       emergencyContact, emergencyPhone, medicalHistory, allergies,
       insuranceProvider, insuranceNumber, lastVisit, req.params.id]
    );
    
    const [updated] = await pool.execute('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/api/patients/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM patients WHERE id = ?', [req.params.id]);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== APPOINTMENTS API ==========
router.get('/api/appointments', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, p.firstName, p.lastName, p.phone, p.email 
       FROM appointments a 
       LEFT JOIN patients p ON a.patientId = p.id 
       ORDER BY a.appointmentDate DESC, a.appointmentTime DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/appointments', async (req, res) => {
  try {
    const { patientId, appointmentDate, appointmentTime, duration, type, status, notes } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO appointments (patientId, appointmentDate, appointmentTime, duration, type, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patientId, appointmentDate, appointmentTime, duration || 30, type, status || 'Scheduled', notes]
    );
    const [newAppointment] = await pool.execute(
      `SELECT a.*, p.firstName, p.lastName FROM appointments a 
       LEFT JOIN patients p ON a.patientId = p.id WHERE a.id = ?`,
      [result.insertId]
    );
    res.status(201).json(newAppointment[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/appointments/:id', async (req, res) => {
  try {
    const { patientId, appointmentDate, appointmentTime, duration, type, status, notes } = req.body;
    await pool.execute(
      `UPDATE appointments SET patientId=?, appointmentDate=?, appointmentTime=?, 
       duration=?, type=?, status=?, notes=? WHERE id=?`,
      [patientId, appointmentDate, appointmentTime, duration, type, status, notes, req.params.id]
    );
    const [updated] = await pool.execute(
      `SELECT a.*, p.firstName, p.lastName FROM appointments a 
       LEFT JOIN patients p ON a.patientId = p.id WHERE a.id = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/api/appointments/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== TREATMENTS API ==========
router.get('/api/treatments', async (req, res) => {
  try {
    // Check if pool is available
    if (!pool) {
      throw new Error('Database connection pool not initialized');
    }
    
    const [rows] = await pool.execute(
      `SELECT t.*, p.firstName, p.lastName FROM treatments t 
       LEFT JOIN patients p ON t.patientId = p.id 
       ORDER BY t.treatmentDate DESC, t.id DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching treatments:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      details: 'Check server logs for more information'
    });
  }
});

router.post('/api/treatments', async (req, res) => {
  try {
    const { patientId, appointmentId, treatmentDate, toothNumber, treatmentType,
            description, diagnosis, procedure, procedureDetails, notes, nextVisitDate } = req.body;
    const procedureValue = procedureDetails || procedure || '';
    
    // Convert undefined to null for MySQL compatibility
    const params = [
      patientId ?? null,
      appointmentId ?? null,
      treatmentDate ?? null,
      toothNumber ?? null,
      treatmentType ?? null,
      description ?? null,
      diagnosis ?? null,
      procedureValue || null,
      notes ?? null,
      nextVisitDate ?? null
    ];
    
    const [result] = await pool.execute(
      `INSERT INTO treatments (patientId, appointmentId, treatmentDate, toothNumber, 
       treatmentType, description, diagnosis, procedureDetails, notes, nextVisitDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params
    );
    const [newTreatment] = await pool.execute(
      `SELECT t.*, p.firstName, p.lastName FROM treatments t 
       LEFT JOIN patients p ON t.patientId = p.id WHERE t.id = ?`,
      [result.insertId]
    );
    res.status(201).json(newTreatment[0]);
  } catch (error) {
    console.error('❌ Error creating treatment:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      details: 'Check server logs for more information'
    });
  }
});

router.put('/api/treatments/:id', async (req, res) => {
  try {
    const { patientId, appointmentId, treatmentDate, toothNumber, treatmentType,
            description, diagnosis, procedure, procedureDetails, notes, nextVisitDate } = req.body;
    const procedureValue = procedureDetails || procedure || '';
    
    // Convert undefined to null for MySQL compatibility
    const params = [
      patientId ?? null,
      appointmentId ?? null,
      treatmentDate ?? null,
      toothNumber ?? null,
      treatmentType ?? null,
      description ?? null,
      diagnosis ?? null,
      procedureValue || null,
      notes ?? null,
      nextVisitDate ?? null,
      req.params.id
    ];
    
    await pool.execute(
      `UPDATE treatments SET patientId=?, appointmentId=?, treatmentDate=?, toothNumber=?, 
       treatmentType=?, description=?, diagnosis=?, procedureDetails=?, notes=?, nextVisitDate=? 
       WHERE id=?`,
      params
    );
    const [updated] = await pool.execute(
      `SELECT t.*, p.firstName, p.lastName FROM treatments t 
       LEFT JOIN patients p ON t.patientId = p.id WHERE t.id = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (error) {
    console.error('❌ Error updating treatment:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      details: 'Check server logs for more information'
    });
  }
});

router.delete('/api/treatments/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM treatments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Treatment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PAYMENTS API ==========
router.get('/api/payments', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, pt.firstName, pt.lastName FROM payments p 
       LEFT JOIN patients pt ON p.patientId = pt.id 
       ORDER BY p.paymentDate DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/payments', async (req, res) => {
  try {
    const { patientId, treatmentId, appointmentId, paymentDate, amount, paymentMethod,
            paymentType, description, status } = req.body;
    
    // Generate invoice number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const invoiceNumber = `INV-${year}${month}-${random}`;
    
    const [result] = await pool.execute(
      `INSERT INTO payments (patientId, treatmentId, appointmentId, paymentDate, amount, 
       paymentMethod, paymentType, description, status, invoiceNumber) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [patientId, treatmentId, appointmentId, paymentDate, amount, paymentMethod,
       paymentType, description, status || 'Paid', invoiceNumber]
    );
    const [newPayment] = await pool.execute(
      `SELECT p.*, pt.firstName, pt.lastName FROM payments p 
       LEFT JOIN patients pt ON p.patientId = pt.id WHERE p.id = ?`,
      [result.insertId]
    );
    res.status(201).json(newPayment[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/payments/:id', async (req, res) => {
  try {
    const { patientId, treatmentId, appointmentId, paymentDate, amount, paymentMethod,
            paymentType, description, status } = req.body;
    await pool.execute(
      `UPDATE payments SET patientId=?, treatmentId=?, appointmentId=?, paymentDate=?, 
       amount=?, paymentMethod=?, paymentType=?, description=?, status=? WHERE id=?`,
      [patientId, treatmentId, appointmentId, paymentDate, amount, paymentMethod,
       paymentType, description, status, req.params.id]
    );
    const [updated] = await pool.execute(
      `SELECT p.*, pt.firstName, pt.lastName FROM payments p 
       LEFT JOIN patients pt ON p.patientId = pt.id WHERE p.id = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/api/payments/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM payments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== AUTH API ==========
router.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      success: true, 
      username: rows[0].username,
      message: 'Login successful' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/auth/password', async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0 || rows[0].password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    await pool.execute('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/auth/user', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [existing] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    if (existing.length > 0) {
      await pool.execute('UPDATE users SET password = ? WHERE username = ?', [password, username]);
      res.json({ message: 'User updated successfully' });
    } else {
      await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
      res.status(201).json({ message: 'User created successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


