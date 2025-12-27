#!/usr/bin/env node

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const mysql = require('mysql2/promise');

// Database connection pool - prioritize environment variables from MCP config
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'Vinay@1433',
  database: process.env.DB_NAME || 'dental_clinic',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Log connection info (to stderr so it doesn't interfere with MCP protocol)
console.error('MCP Server Config:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD ? '***' : 'NOT SET',
  database: process.env.DB_NAME || 'dental_clinic'
});

// Create MCP server
const server = new Server(
  {
    name: 'dental-clinic-mysql',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'execute_query',
        description: 'Execute a SQL query on the dental clinic database',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'SQL query to execute',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_patients',
        description: 'Get all patients or a specific patient by ID',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: {
              type: 'number',
              description: 'Optional patient ID to get specific patient',
            },
          },
        },
      },
      {
        name: 'get_appointments',
        description: 'Get all appointments or appointments for a specific date',
        inputSchema: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Optional date (YYYY-MM-DD) to filter appointments',
            },
            patientId: {
              type: 'number',
              description: 'Optional patient ID to filter appointments',
            },
          },
        },
      },
      {
        name: 'get_treatments',
        description: 'Get all treatments or treatments for a specific patient',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: {
              type: 'number',
              description: 'Optional patient ID to filter treatments',
            },
          },
        },
      },
      {
        name: 'get_payments',
        description: 'Get all payments or payments for a specific patient',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: {
              type: 'number',
              description: 'Optional patient ID to filter payments',
            },
          },
        },
      },
      {
        name: 'create_patient',
        description: 'Create a new patient',
        inputSchema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            dateOfBirth: { type: 'string' },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
            phone: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
            emergencyContact: { type: 'string' },
            emergencyPhone: { type: 'string' },
          },
          required: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'email'],
        },
      },
      {
        name: 'create_appointment',
        description: 'Create a new appointment',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: { type: 'number' },
            appointmentDate: { type: 'string' },
            appointmentTime: { type: 'string' },
            duration: { type: 'number' },
            type: { type: 'string' },
            status: { type: 'string' },
            notes: { type: 'string' },
          },
          required: ['patientId', 'appointmentDate', 'appointmentTime', 'type'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'execute_query': {
        const [rows] = await pool.execute(args.query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(rows, null, 2),
            },
          ],
        };
      }

      case 'get_patients': {
        let query = 'SELECT * FROM patients ORDER BY createdAt DESC';
        let params = [];
        if (args.patientId) {
          query = 'SELECT * FROM patients WHERE id = ?';
          params = [args.patientId];
        }
        const [rows] = await pool.execute(query, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(rows, null, 2),
            },
          ],
        };
      }

      case 'get_appointments': {
        let query = `SELECT a.*, p.firstName, p.lastName 
                     FROM appointments a 
                     LEFT JOIN patients p ON a.patientId = p.id`;
        let conditions = [];
        let params = [];

        if (args.date) {
          conditions.push('a.appointmentDate = ?');
          params.push(args.date);
        }
        if (args.patientId) {
          conditions.push('a.patientId = ?');
          params.push(args.patientId);
        }

        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY a.appointmentDate DESC, a.appointmentTime DESC';

        const [rows] = await pool.execute(query, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(rows, null, 2),
            },
          ],
        };
      }

      case 'get_treatments': {
        let query = `SELECT t.*, p.firstName, p.lastName 
                     FROM treatments t 
                     LEFT JOIN patients p ON t.patientId = p.id`;
        let params = [];
        if (args.patientId) {
          query += ' WHERE t.patientId = ?';
          params = [args.patientId];
        }
        query += ' ORDER BY t.treatmentDate DESC';

        const [rows] = await pool.execute(query, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(rows, null, 2),
            },
          ],
        };
      }

      case 'get_payments': {
        let query = `SELECT p.*, pt.firstName, pt.lastName 
                     FROM payments p 
                     LEFT JOIN patients pt ON p.patientId = pt.id`;
        let params = [];
        if (args.patientId) {
          query += ' WHERE p.patientId = ?';
          params = [args.patientId];
        }
        query += ' ORDER BY p.paymentDate DESC';

        const [rows] = await pool.execute(query, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(rows, null, 2),
            },
          ],
        };
      }

      case 'create_patient': {
        const [result] = await pool.execute(
          `INSERT INTO patients (firstName, lastName, dateOfBirth, gender, phone, email, 
           address, emergencyContact, emergencyPhone) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            args.firstName,
            args.lastName,
            args.dateOfBirth,
            args.gender,
            args.phone,
            args.email,
            args.address || null,
            args.emergencyContact || null,
            args.emergencyPhone || null,
          ]
        );
        const [newPatient] = await pool.execute('SELECT * FROM patients WHERE id = ?', [result.insertId]);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newPatient[0], null, 2),
            },
          ],
        };
      }

      case 'create_appointment': {
        const [result] = await pool.execute(
          `INSERT INTO appointments (patientId, appointmentDate, appointmentTime, duration, type, status, notes) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            args.patientId,
            args.appointmentDate,
            args.appointmentTime,
            args.duration || 30,
            args.type,
            args.status || 'Scheduled',
            args.notes || null,
          ]
        );
        const [newAppointment] = await pool.execute(
          `SELECT a.*, p.firstName, p.lastName FROM appointments a 
           LEFT JOIN patients p ON a.patientId = p.id WHERE a.id = ?`,
          [result.insertId]
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newAppointment[0], null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Dental Clinic MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

