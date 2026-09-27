# BHOOMI-TRACK - Corrected Windows Ready

This version preserves the existing frontend/backend application and replaces
the native `better-sqlite3` dependency with `sql.js`, avoiding the native
compilation failure encountered with Node.js 24 on Windows.

## Run on Windows

Open PowerShell in this folder and run:

```powershell
npm.cmd install
npm.cmd start
```

Then open:

http://localhost:5000

Demo login:
- Email: admin@bhoomitrack.gov.in
- Password: Admin@123

The SQLite database is created automatically under `backend/data/`.

No PostgreSQL or Python build tools are required.
