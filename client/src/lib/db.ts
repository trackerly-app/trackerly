import { Pool } from 'pg';
import dotenv from 'dotenv';

// use this so we can change PG_URI depending on environment
dotenv.config();
let PG_URI: string | undefined;
if (process.env.MODE === 'production') {
  PG_URI = process.env.DB_URI;
} else {
  PG_URI = process.env.DEV_DB_URI;
}

// singleton declaration, hopefully this will keep the
// pool to a single connection per app
let dbConnection: Pool | undefined;

if (dbConnection === undefined) {
  dbConnection = new Pool({
    connectionString: PG_URI,
  });

  dbConnection.on('connect', () => {
    console.log('PostgreSQL pool connection established...');
  });
}

dbConnection.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/*
  This can be used to execute any query on the database
  and also log the data to the console for verification

  DB Schema can be found here:
  https://lucid.app/lucidchart/0b73da00-9a48-4963-ba80-9d3ee8e00525/edit?invitationId=inv_63753087-9915-47de-b476-399bcd930af6&page=0_0#
*/
const db = {
  query: (text: string, params: any[]) => {
    console.log('executed query', text);
    return dbConnection!.query(text, params);
  },
};

export default db;
