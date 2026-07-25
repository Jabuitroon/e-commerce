import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'r00t',
  database: 'tiendaapp',
  waitForConnections: true,
  connectionLimit: 10,
})

// To do: Implement a function to get a connection from the pool and handle errors appropriately.
