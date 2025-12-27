# Dental Clinic MCP Server

Model Context Protocol (MCP) server for connecting to the Dental Clinic MySQL database.

## Setup

1. Make sure you have the `.env` file configured in the root directory with your MySQL credentials.

2. Install dependencies:
```bash
cd mcp-server
npm install
```

3. Make the script executable:
```bash
chmod +x index.js
```

## MCP Configuration

Add this to your MCP client configuration (e.g., in Cursor settings):

```json
{
  "mcpServers": {
    "dental-clinic-mysql": {
      "command": "node",
      "args": ["/Users/vinaykumar/Desktop/new project/todo/mcp-server/index.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_USER": "root",
        "DB_PASSWORD": "your_password",
        "DB_NAME": "dental_clinic"
      }
    }
  }
}
```

## Available Tools

### execute_query
Execute any SQL query on the database.

### get_patients
Get all patients or a specific patient by ID.

### get_appointments
Get appointments, optionally filtered by date or patient ID.

### get_treatments
Get treatments, optionally filtered by patient ID.

### get_payments
Get payments, optionally filtered by patient ID.

### create_patient
Create a new patient record.

### create_appointment
Create a new appointment.

## Usage

The MCP server will be available to AI assistants that support MCP, allowing them to:
- Query the database
- Retrieve patient, appointment, treatment, and payment data
- Create new records
- Execute custom SQL queries



