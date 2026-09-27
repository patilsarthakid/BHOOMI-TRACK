const bcrypt = require("bcryptjs");
const { initDb, run, get } = require("./db");

async function seed() {
  await initDb();

  run(
    "INSERT OR IGNORE INTO users(name,email,password_hash,role) VALUES(?,?,?,?)",
    "System Administrator",
    "admin@bhoomitrack.gov.in",
    bcrypt.hashSync("Admin@123", 10),
    "admin"
  );

  if (get("SELECT COUNT(*) AS c FROM land_parcels").c === 0) {
    run(
      `INSERT INTO land_parcels
      (survey_number,state,district,taluka,village,area,area_unit,land_type,latitude,longitude,owner_name,ownership_status,verification_status,acquisition_status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      "SRV-1001",
      "Maharashtra",
      "Nashik",
      "Niphad",
      "Pimpalgaon",
      2.5,
      "Hectare",
      "Agricultural",
      20.091,
      73.982,
      "Ramesh Patil",
      "Private",
      "Verified",
      "Under Review"
    );

    run(
      `INSERT INTO land_parcels
      (survey_number,state,district,taluka,village,area,area_unit,land_type,latitude,longitude,owner_name,ownership_status,verification_status,acquisition_status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      "SRV-1002",
      "Maharashtra",
      "Pune",
      "Haveli",
      "Wagholi",
      1.8,
      "Hectare",
      "Residential",
      18.578,
      73.982,
      "Sunita Deshmukh",
      "Private",
      "Verified",
      "Approved"
    );
  }

  if (get("SELECT COUNT(*) AS c FROM projects").c === 0) {
    run(
      `INSERT INTO projects
      (project_code,name,department,state,district,status,start_date,end_date)
      VALUES (?,?,?,?,?,?,?,?)`,
      "BT-PRJ-001",
      "National Highway Expansion",
      "Public Works Department",
      "Maharashtra",
      "Nashik",
      "Active",
      "2026-01-15",
      "2028-12-31"
    );

    run(
      `INSERT INTO projects
      (project_code,name,department,state,district,status,start_date,end_date)
      VALUES (?,?,?,?,?,?,?,?)`,
      "BT-PRJ-002",
      "Rural Connectivity Project",
      "Rural Development",
      "Maharashtra",
      "Pune",
      "Planning",
      "2026-04-01",
      "2029-03-31"
    );
  }

  if (get("SELECT COUNT(*) AS c FROM acquisitions").c === 0) {
    run(
      `INSERT INTO acquisitions
      (project_id,land_id,notification_date,award_date,status,remarks)
      VALUES (?,?,?,?,?,?)`,
      1,
      1,
      "2026-02-10",
      null,
      "Under Process",
      "Document scrutiny in progress"
    );

    run(
      `INSERT INTO acquisitions
      (project_id,land_id,notification_date,award_date,status,remarks)
      VALUES (?,?,?,?,?,?)`,
      1,
      2,
      "2026-01-20",
      "2026-06-15",
      "Awarded",
      "Award completed"
    );
  }

  if (get("SELECT COUNT(*) AS c FROM compensation").c === 0) {
    run(
      `INSERT INTO compensation
      (acquisition_id,owner_name,amount,status,payment_date,transaction_reference)
      VALUES (?,?,?,?,?,?)`,
      1,
      "Ramesh Patil",
      1250000,
      "Pending",
      null,
      null
    );

    run(
      `INSERT INTO compensation
      (acquisition_id,owner_name,amount,status,payment_date,transaction_reference)
      VALUES (?,?,?,?,?,?)`,
      2,
      "Sunita Deshmukh",
      950000,
      "Paid",
      "2026-07-10",
      "TXN-BT-20260710-001"
    );
  }

  if (get("SELECT COUNT(*) AS c FROM rehabilitation").c === 0) {
    run(
      `INSERT INTO rehabilitation
      (acquisition_id,beneficiary_name,package_type,status,benefits)
      VALUES (?,?,?,?,?)`,
      1,
      "Ramesh Patil",
      "R&R Package",
      "In Progress",
      "House assistance and livelihood support"
    );
  }

  console.log("Bhoomi Track demo data seeded successfully.");
  console.log("Login email: admin@bhoomitrack.gov.in");
  console.log("Login password: Admin@123");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});