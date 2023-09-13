// Import controllers
import log from '../logging/log.js';
import db from '../models/applicationModel.js';

// Creates new company in database - POST requeset to '/companies'
export const addCompany = async (req, res, next) => {
  log.info('[trackCtrl - addCompany] Attempting to add company to database...');
  // Sanitize information in request body
  const { name, website, user_id, notes } = req.body;
  try {
    // Query string for companies matching user_id and name on request body
    const companyQuery = 'SELECT * FROM companies WHERE user_id=$1 and name=$2';
    // Search database for company from sanitized and parameterized request body
    const data = await db.query(companyQuery, [user_id, name]);
    
    // If the company already exists in the database, throw an error
    if (data.rows.length) {
      throw new Error('Company already exists')
    }
  
    // Query string for inserting companies into database
    const addCompanyQuery =
      'INSERT INTO companies (name, website, user_id, notes) VALUES ($1, $2, $3, $4)';
    // Create new company in database from sanitized and parameterized request body
    const result = await db.query(addCompanyQuery, [name, website, user_id, notes]);
  
    // Assign message and created database row from query to res.locals
    res.locals.result = {
      message: 'Company added successfully',
      company: result.rows[0],
    };
    
    log.info('[trackCtrl - addCompany] Company successfully added to database.');
    // Proceed to next middleware
    return next();
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem adding the company. Please, try again!',
      status: err.status,
      message: err.message
    });
  }
};

// Creates new application in database - POST requeset to '/application'
export const addApplication = async (req, res, next) => {
  log.info('[trackCtrl - addApplication] Attempting to add application to database...');
  // Sanitize information in request body
  const {
    user_id,
    company_id, 
    position,
    salary,
    status,
    notes,
    application_url
  } = req.body;

  try {
    // Query string for inserting applications into database
    const applicationQuery =
    `INSERT INTO
    applications (user_id, company_id, position, salary, status, notes, application_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7);`;
    // Create new application in database from sanitized and parameterized request body
    const result =
      await db.query(
        applicationQuery,
        [user_id, company_id, position, salary, status, notes, application_url]
      );
    // Assign result from query to res.locals
    res.locals.result = result;

    log.info('[trackCtrl - addApplication] Application successfully added to database.');
    // Proceed to next middleware
    return next();
  } catch(err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem adding the application. Please, try again!',
      status: err.status,
      message: err.message
    });
  }
};