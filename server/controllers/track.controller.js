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
      throw new Error('Company already exists');
    }

    // Query string for inserting companies into database
    const addCompanyQuery =
      'INSERT INTO companies (name, website, user_id, notes) VALUES ($1, $2, $3, $4)';
    // Create new company in database from sanitized and parameterized request body
    const result = await db.query(addCompanyQuery, [
      name,
      website,
      user_id,
      notes,
    ]);

    // Assign message and created database row from query to res.locals
    res.locals.result = {
      message: 'Company added successfully',
      company: result,
    };

    log.info(
      '[trackCtrl - addCompany] Company successfully added to database.'
    );
    // Proceed to next middleware
    return next();
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem adding the company. Please, try again!',
      status: err.status || 500,
      message: err.message,
    });
  }
};

export const getCompanies = async (req, res, next) => {
  log.info("Attempting to get a user's companies");
  const { user_id } = req.params;
  try {
    // get all the companies for a particular user
    const getCompaniesQuery = 'SELECT * FROM companies WHERE user_id=$1';

    // if this returns an empty array, the user has no companies
    const data = await db.query(getCompaniesQuery, [user_id]);

    // store the companies returned so we can pass it to the front end
    res.locals.companies = data.rows;

    log.info('Companies successfully found');
    return next();
  } catch (err) {
    return next({
      log: "There was a problem getting a user's companies",
      status: err.status || 500,
      message: err.message,
    });
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    // this will need to come from the front end, so put it in the try block in case they can't be destructured from req.body
    const { id, name, website, notes } = req.body;

    // update the company row where id is a number
    const updateQuery =
      'UPDATE companies SET (name, website, notes) = ($1, $2, $3) WHERE id=$4 RETURNING *;';

    // could also do 'UPDATE companies SET name=$1, website=$2, notes=$3 WHERE id=$4 RETURN *;'

    const data = await db.query(updateQuery, [name, website, notes, id]);

    res.locals.company = data.rows[0];

    return next();
  } catch (err) {
    return next({
      log: 'There was a problem updating the company',
      status: err.status || 500,
      message: err.message,
    });
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    // this will need to come from the front end, so put it in the try block in case they can't be destructured from req.body
    const { id, name, website, notes } = req.body;
    // update the company row where id is a number
    let deleteApps = 'DELETE FROM applications  WHERE company_id = $1;';
    await db.query(deleteApps, [id]);
    deleteApps = 'DELETE FROM companies WHERE id = $1 RETURNING *;';
    const data = await db.query(deleteApps, [id]);
    res.locals.company = data.rows[0];
    return next();
  } catch (err) {
    return next({
      log: 'There was a problem deleting the company',
      status: err.status || 500,
      message: err.message,
    });
  }
};

// Creates new application in database - POST requeset to '/application'
export const getApplications = async (req, res, next) => {
  log.info(
    '[trackCtrl - getApplications] Attempting to get applications from database...'
  );
  // Sanitize information in request body
  try {
    const { user_id } = req.params;

    // Query string for inserting applications into database
    const applicationQuery = `SELECT c.*, a.*
    FROM companies c
    INNER JOIN applications a
    ON c.id = a.company_id AND c.user_id = a.user_id
    WHERE c.user_id = $1
    ORDER BY a.status ASC`;
    console.log('trying to aget applications');
    // Create new application in database from sanitized and parameterized request body
    const result = await db.query(applicationQuery, [user_id]);
    // Assign result from query to res.locals
    res.locals.result = result.rows;
    console.log('got applications');
    log.info(
      '[trackCtrl - getApplication] Applications successfully retreived.'
    );
    // Proceed to next middleware
    return next();
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem getting applications!',
      status: err.status || 500,
      message: err.message,
    });
  }
};

// Creates new application in database - POST requeset to '/application'
export const addApplication = async (req, res, next) => {
  log.info(
    '[trackCtrl - addApplication] Attempting to add application to database...'
  );
  // Sanitize information in request body
  const {
    user_id,
    company_id,
    position,
    salary,
    status,
    notes,
    application_url,
  } = req.body;

  try {
    // Query string for inserting applications into database
    const applicationQuery = `INSERT INTO
    applications (user_id, company_id, position, salary, status, notes, application_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    // Create new application in database from sanitized and parameterized request body
    const result = await db.query(applicationQuery, [
      user_id,
      company_id,
      position,
      salary,
      status,
      notes,
      application_url,
    ]);
    // Assign result from query to res.locals
    res.locals.result = result.rows[0];

    log.info(
      '[trackCtrl - addApplication] Application successfully added to database.'
    );
    // Proceed to next middleware
    return next();
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem adding the application. Please, try again!',
      status: err.status || 500,
      message: err.message,
    });
  }
};

// update applicatoin - Put request to '/application'
export const updateApplication = async (req, res, next) => {
  log.info(
    '[trackCtrl - updateApplication] Attempting to update application in the database...'
  );
  // Sanitize information in request body

  try {
    const { id } = req.body;
    if (id === undefined) throw new Error('no applications to update');
    //query for getting the applicaiton info
    let applicationQuery = `SELECT * FROM applications WHERE id=$1`;
    let data = await db.query(applicationQuery, [id]);
    if (data.rows.length === 0) throw new Error('no applications to update');
    console.log('found application');
    // Query string for inserting applications into database
    const currentState = data.rows[0];
    for (let key in currentState) {
      if (req.body.hasOwnProperty(key)) currentState[key] = req.body[key];
    }
    const { position, salary, status, notes, application_url } = currentState;
    applicationQuery = `UPDATE applications SET position=$1, salary=$2, status=$3, notes=$4, application_url=$5
    WHERE id =$6 RETURNING*`;
    // Update Application
    const result = await db.query(applicationQuery, [
      position,
      salary,
      status,
      notes,
      application_url,
      id,
    ]);
    // Assign result from query to res.locals
    res.locals.result = result.rows[0];
    console.log('updated application');
    log.info(
      '[trackCtrl - updateApplication] Application successfully updated in the database.'
    );
    // Proceed to next middleware
    return next();
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem updating the application. Please, try again!',
      status: err.status || 500,
      message: err.message,
    });
  }
};

// update applicatoin - Put request to '/application'
export const deleteApplication = async (req, res, next) => {
  log.info(
    '[trackCtrl - deleteApplication] Attempting to delete application in the database...'
  );
  // Sanitize information in request body

  try {
    const { id } = req.body;
    if (id === undefined) throw new Error('no applications to delete');
    //query for getting the applicaiton info
    let applicationQuery = `DELETE FROM applications WHERE id=$1 RETURNING*`;
    let data = await db.query(applicationQuery, [id]);
    if (data.rows.length === 0) throw new Error('no applications to delete');
    console.log('deleted application');
    // Query string for inserting applications into database

    res.locals.result = data.rows[0];
    console.log('deleted application');
    log.info(
      '[trackCtrl - deletedApplication] Application successfully deleted in the database.'
    );
    // Proceed to next middleware
    return next();
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem updating the application. Please, try again!',
      status: err.status || 500,
      message: err.message,
    });
  }
};

// SELECT c.*, a.* FROM companies c, applications a INNER JOIN c.id = a.company_id WHERE user_id=$1;
