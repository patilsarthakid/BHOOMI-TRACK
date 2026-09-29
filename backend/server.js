require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const { initDb, run, all, get } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || "bhoomi_track_change_this_secret";

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

function auth(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    req.user = jwt.verify(header.substring(7), SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Bhoomi Track" });
});
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "citizen",
      mobile = "",
      address = "",
      department = "",
      office = "",
      employeeId = ""
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      });
    }

    const existingUser = get(
      "SELECT id FROM users WHERE email = ?",
      email.trim().toLowerCase()
    );

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered"
      });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const result = run(
      `INSERT INTO users
      (name,email,password_hash,role)
      VALUES (?,?,?,?)`,
      name.trim(),
      email.trim().toLowerCase(),
      passwordHash,
      role
    );

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      user: {
        id: result.lastInsertRowid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      error: err.message
    });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = get(
      "SELECT id,name,email,password_hash,role FROM users WHERE email = ?",
      email
    );

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/dashboard", auth, (req, res) => {
  try {
    const landParcels = get("SELECT COUNT(*) AS count FROM land_parcels");
    const projects = get("SELECT COUNT(*) AS count FROM projects");

    const proposedArea = get(
      "SELECT COALESCE(SUM(area), 0) AS total FROM land_parcels"
    );

    const acquiredArea = get(`
      SELECT COALESCE(SUM(lp.area), 0) AS total
      FROM land_parcels lp
      INNER JOIN acquisitions a ON a.land_id = lp.id
    `);

    const compensationPaid = get(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM compensation"
    );

    const affectedFamilies = get(`
      SELECT COUNT(DISTINCT owner_name) AS count
      FROM land_parcels
      WHERE owner_name IS NOT NULL AND TRIM(owner_name) <> ''
    `);

    const displacedFamilies = get(`
      SELECT COUNT(DISTINCT beneficiary_name) AS count
      FROM rehabilitation
      WHERE beneficiary_name IS NOT NULL AND TRIM(beneficiary_name) <> ''
    `);

    const byStage = all(`
      SELECT COALESCE(status, 'Not specified') AS stage, COUNT(*) AS count
      FROM acquisitions
      GROUP BY status
      ORDER BY count DESC
    `);

    const byState = all(`
      SELECT COALESCE(state, 'Not specified') AS state, COUNT(*) AS count
      FROM land_parcels
      GROUP BY state
      ORDER BY count DESC
    `);

    res.json({
      landParcels: landParcels.count,
      projects: projects.count,
      proposedArea: Number(proposedArea.total || 0),
      acquiredArea: Number(acquiredArea.total || 0),
      compensationPaid: Number(compensationPaid.total || 0),
      affectedFamilies: affectedFamilies.count,
      displacedFamilies: displacedFamilies.count,
      byStage,
      byState
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/land", auth, (req, res) => {
  try {
    res.json(all("SELECT * FROM land_parcels ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/projects", auth, (req, res) => {
  try {
    res.json(all("SELECT * FROM projects ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/acquisitions", auth, (req, res) => {
  try {
    res.json(all("SELECT * FROM acquisitions ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/compensation", auth, (req, res) => {
  try {
    res.json(all("SELECT * FROM compensation ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/rehabilitation", auth, (req, res) => {
  try {
    res.json(all("SELECT * FROM rehabilitation ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/documents", auth, (req, res) => {
  try {
    res.json(all("SELECT * FROM documents ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/documents", auth, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const result = run(
      `INSERT INTO documents
      (entity_type,entity_id,file_name,file_path,uploaded_by)
      VALUES (?,?,?,?,?)`,
      req.body.entity_type || "general",
      req.body.entity_id || null,
      req.file.originalname,
      req.file.path,
      req.user.id
    );

    res.json({
      success: true,
      id: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/audit-logs", auth, (req, res) => {
  try {
    res.json(all("SELECT * FROM audit_logs ORDER BY id DESC"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

async function start() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Bhoomi Track running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

start();
