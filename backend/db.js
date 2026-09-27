const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const dataDir = path.join(__dirname, "data");
const dbFile = path.join(dataDir, "bhoomi_track.db");

let db;

async function initDb() {
  const SQL = await initSqlJs();

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(dbFile)) {
    const fileBuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS land_parcels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      survey_number TEXT,
      state TEXT,
      district TEXT,
      taluka TEXT,
      village TEXT,
      area REAL,
      area_unit TEXT,
      land_type TEXT,
      latitude REAL,
      longitude REAL,
      owner_name TEXT,
      ownership_status TEXT,
      verification_status TEXT,
      acquisition_status TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_code TEXT,
      name TEXT,
      department TEXT,
      state TEXT,
      district TEXT,
      status TEXT,
      start_date TEXT,
      end_date TEXT
    );

    CREATE TABLE IF NOT EXISTS acquisitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      land_id INTEGER,
      notification_date TEXT,
      award_date TEXT,
      status TEXT,
      remarks TEXT
    );

    CREATE TABLE IF NOT EXISTS compensation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      acquisition_id INTEGER,
      owner_name TEXT,
      amount REAL,
      status TEXT,
      payment_date TEXT,
      transaction_reference TEXT
    );

    CREATE TABLE IF NOT EXISTS rehabilitation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      acquisition_id INTEGER,
      beneficiary_name TEXT,
      package_type TEXT,
      status TEXT,
      benefits TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT,
      entity_id INTEGER,
      file_name TEXT,
      file_path TEXT,
      uploaded_by INTEGER,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT,
      entity_type TEXT,
      entity_id INTEGER,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  persist();
}

function run(sql, ...params) {
  const stmt = db.prepare(sql);

  try {
    stmt.bind(params);
    stmt.step();

    const result = {
      lastInsertRowid: db.exec("SELECT last_insert_rowid() AS id")[0]
        .values[0][0]
    };

    persist();
    return result;
  } finally {
    stmt.free();
  }
}

function get(sql, ...params) {
  const stmt = db.prepare(sql);

  try {
    stmt.bind(params);

    if (!stmt.step()) {
      return undefined;
    }

    const columns = stmt.getColumnNames();
    const values = stmt.get();

    const row = {};

    columns.forEach((column, index) => {
      row[column] = values[index];
    });

    return row;
  } finally {
    stmt.free();
  }
}

function all(sql, ...params) {
  const stmt = db.prepare(sql);

  try {
    stmt.bind(params);

    const rows = [];

    while (stmt.step()) {
      const columns = stmt.getColumnNames();
      const values = stmt.get();

      const row = {};

      columns.forEach((column, index) => {
        row[column] = values[index];
      });

      rows.push(row);
    }

    return rows;
  } finally {
    stmt.free();
  }
}

function persist() {
  if (!db) return;

  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));
}

module.exports = {
  initDb,
  run,
  get,
  all,
  persist
};