import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();
const PG_URI = process.env.DEV_DB_URI;
// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

pool.on('connect', () => {
  console.log('PostgreSQL pool connection established...');
});
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});
// Adding some notes about the database here will be helpful for future you or other developers.
// Schema for the database can be found below:
// https://github.com/CodesmithLLC/unit-10SB-databases/blob/master/docs/assets/images/schema.png
// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
const db = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};

export default db;
