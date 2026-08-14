import mysql from 'mysql2/promise'
import { loadEnvFile } from 'node:process'
loadEnvFile()

export const pool = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
})
