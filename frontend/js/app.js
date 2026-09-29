const S = {
  token: localStorage.getItem("bt_token"),
  user: JSON.parse(localStorage.getItem("bt_user") || "null"),
  page: "dashboard"
};

const app = document.getElementById("app");

const esc = x =>
  String(x ?? "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));

async function api(u, o = {}) {
  o.headers = o.headers || {};

  if (S.token) {
    o.headers.Authorization = "Bearer " + S.token;
  }

  if (o.body && !(o.body instanceof FormData)) {
    o.headers["Content-Type"] = "application/json";
    o.body = JSON.stringify(o.body);
  }

  const r = await fetch(u, o);
  const d = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw Error(d.message || "Request failed");
  }

  return d;
}

function login() {
  app.innerHTML = `
    <div class="login">
     <div class="login-card">
       <div class="brand">
        <img src="images/logo.jpeg" class="brand-logo" alt="BHOOMI-TRACK Logo">
        <span>BHOOMI-TRACK</span></div>
        <h2>Land Management System</h2>

        <div class="field">
          <label>Email</label>
          <input id="email" value="admin@bhoomitrack.gov.in">
        </div>

        <div class="field">
          <label>Password</label>
          <input id="password" type="password" value="Admin@123">
        </div>

        <button class="btn" onclick="doLogin()">Login</button>

        <p id="loginError" class="error"></p>
      </div>
    </div>
  `;
}

async function doLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const d = await api("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });

    S.token = d.token;
    S.user = d.user;

    localStorage.setItem("bt_token", d.token);
    localStorage.setItem("bt_user", JSON.stringify(d.user));

    S.page = "dashboard";
    render();
  } catch (e) {
    document.getElementById("loginError").textContent = e.message;
  }
}

function logout() {
  localStorage.removeItem("bt_token");
  localStorage.removeItem("bt_user");

  S.token = null;
  S.user = null;

  login();
}

function nav(page, label) {
  return `
    <button
      class="nav-btn ${S.page === page ? "active" : ""}"
      onclick="S.page='${page}';load()">
      ${label}
    </button>
  `;
}

function render() {
  if (!S.user || !S.token) {
    login();
    return;
  }

  app.innerHTML = `
    <div class="layout">

      <aside class="sidebar">

        <div class="brand">
          🌍 BHOOMI-TRACK
        </div>

        <div class="muted">
          National Land Acquisition System
        </div>

        <div class="nav">
          ${nav("dashboard", "📊 Dashboard")}
          ${nav("land", "📍 Land Parcels")}
          ${nav("projects", "🏗️ Projects")}
          ${nav("acquisition", "📋 Acquisition")}
          ${nav("compensation", "💰 Compensation")}
          ${nav("rehabilitation", "👨‍👩‍👧 R&R")}
          ${nav("documents", "📄 Documents")}
          ${S.user.role === "admin" ? nav("audit", "🧾 Audit Logs") : ""}
        </div>

        <button
          class="btn secondary"
          style="width:100%;margin-top:20px"
          onclick="logout()">
          Logout
        </button>

      </aside>

      <main class="main">

        <div class="topbar">
          <div>
            <h1 id="title" style="margin:0"></h1>
            <span class="muted">
              ${esc(S.user.name)} · ${esc(S.user.role)}
            </span>
          </div>

          <span class="badge">Live System</span>
        </div>

        <div id="content"></div>

      </main>

    </div>
  `;

  load();
}

async function load() {
  const title = document.getElementById("title");
  const content = document.getElementById("content");

  title.textContent =
    S.page[0].toUpperCase() + S.page.slice(1);

  try {
    if (S.page === "dashboard") return dash(content);
    if (S.page === "land") return land(content);
    if (S.page === "projects") return projects(content);
    if (S.page === "acquisition") return acq(content);
    if (S.page === "compensation") return comp(content);
    if (S.page === "rehabilitation") return rehab(content);
    if (S.page === "documents") return docs(content);
    if (S.page === "audit") return audit(content);
  } catch (e) {
    content.innerHTML = `
      <div class="panel">
        <span class="error">${esc(e.message)}</span>
      </div>
    `;
  }
}

const stat = (a, b) => `
  <div class="card">
    <div class="muted">${a}</div>
    <div class="num">${esc(b)}</div>
  </div>
`;

async function dash(c) {
  const d = await api("/api/dashboard");

  c.innerHTML = `
    <div class="cards">

      ${stat("Land Parcels", d.landParcels)}
      ${stat("Projects", d.projects)}
      ${stat("Proposed Area", d.proposedArea + " ha")}
      ${stat("Acquired Area", d.acquiredArea + " ha")}
      ${stat(
        "Compensation Paid",
        "₹" + Number(d.compensationPaid).toLocaleString()
      )}
      ${stat("Affected Families", d.affectedFamilies)}
      ${stat("Displaced Families", d.displacedFamilies)}

    </div>

    <div class="grid">

      <div class="panel">
        <h3>Acquisition Stages</h3>
        ${bars(d.byStage, "stage")}
      </div>

      <div class="panel">
        <h3>Land by State</h3>
        ${bars(d.byState, "state")}
      </div>

    </div>

    <div class="panel">

      <h3>GIS / Geo-tagging</h3>

      <div id="map" class="map"></div>

    </div>
  `;

  loadGISMap();
}

function bars(a, k) {
  if (!a || !a.length) {
    return "No data yet.";
  }

  const m = Math.max(...a.map(x => x.count));

  return a.map(x => `
    <div style="margin:12px 0">

      <b>${esc(x[k])}</b>

      <span style="float:right">
        ${x.count}
      </span>

      <div
        style="
          height:8px;
          background:#e2e8f0;
          border-radius:8px;
          margin-top:5px;
        ">

        <div
          style="
            height:8px;
            width:${Math.max(8, x.count / m * 100)}%;
            background:#0e7490;
            border-radius:8px;
          ">
        </div>

      </div>

    </div>
  `).join("");
}

async function loadGISMap() {
  const mapElement = document.getElementById("map");

  if (!mapElement || typeof L === "undefined") {
    return;
  }

  const landData = await api("/api/land");

  const geoData = landData.filter(
    x =>
      x.latitude !== null &&
      x.latitude !== undefined &&
      x.longitude !== null &&
      x.longitude !== undefined &&
      x.latitude !== "" &&
      x.longitude !== ""
  );

  if (!geoData.length) {
    mapElement.innerHTML =
      "<p>No geo-tagged land parcels available.</p>";
    return;
  }

  const map = L.map("map");

  L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap contributors"
    }
  ).addTo(map);

  const markers = [];

  geoData.forEach(x => {
    const lat = Number(x.latitude);
    const lng = Number(x.longitude);

    const marker = L.marker([lat, lng]).addTo(map);

    marker.bindPopup(`
      <b>Survey Number:</b> ${esc(x.survey_number)}<br>
      <b>Owner:</b> ${esc(x.owner_name)}<br>
      <b>State:</b> ${esc(x.state)}<br>
      <b>District:</b> ${esc(x.district)}<br>
      <b>Taluka:</b> ${esc(x.taluka)}<br>
      <b>Village:</b> ${esc(x.village)}<br>
      <b>Area:</b> ${esc(x.area)} ${esc(x.area_unit)}<br>
      <b>Status:</b> ${esc(x.acquisition_status)}<br>
      <b>Latitude:</b> ${lat}<br>
      <b>Longitude:</b> ${lng}
    `);

    markers.push(marker);
  });

  if (markers.length === 1) {
    map.setView(
      [Number(geoData[0].latitude), Number(geoData[0].longitude)],
      13
    );
  } else {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }
}

async function land(c) {
  const a = await api("/api/land");

  c.innerHTML = `
    <div class="panel">

      <div class="toolbar">

        <input
          id="ls"
          placeholder="Search survey..."
          oninput="filterLand()">

        ${
          S.user.role !== "viewer"
            ? `<button class="btn" onclick="landForm()">
                 + Add Land
               </button>`
            : ""
        }

      </div>

      <div class="table-wrap">

        <table id="lt">

          <tr>
            <th>Survey</th>
            <th>Owner</th>
            <th>State</th>
            <th>District</th>
            <th>Village</th>
            <th>Area</th>
            <th>Acquisition</th>
            <th>GIS</th>
          </tr>

          ${a.map(x => `
            <tr>

              <td>${esc(x.survey_number)}</td>

              <td>${esc(x.owner_name)}</td>

              <td>${esc(x.state)}</td>

              <td>${esc(x.district)}</td>

              <td>${esc(x.village)}</td>

              <td>
                ${esc(x.area)} ${esc(x.area_unit)}
              </td>

              <td>
                <span class="badge">
                  ${esc(x.acquisition_status)}
                </span>
              </td>

              <td>
                ${
                  x.latitude && x.longitude
                    ? `<button
                         class="btn secondary"
                         onclick="viewLandOnMap(${Number(x.latitude)},${Number(x.longitude)})">
                         📍 View
                       </button>`
                    : "—"
                }
              </td>

            </tr>
          `).join("")}

        </table>

      </div>

    </div>
  `;
}

function viewLandOnMap(lat, lng) {
  S.page = "dashboard";
  render();

  setTimeout(() => {
    const mapElement = document.getElementById("map");

    if (!mapElement || typeof L === "undefined") {
      return;
    }

    const map = L.map("map").setView([lat, lng], 15);

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors"
      }
    ).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(
        `<b>Selected Land Parcel</b><br>
         Latitude: ${lat}<br>
         Longitude: ${lng}`
      )
      .openPopup();

  }, 500);
}

function filterLand() {
  const q =
    document.getElementById("ls").value.toLowerCase();

  document.querySelectorAll("#lt tr").forEach((r, i) => {
    if (i === 0) return;

    r.style.display =
      r.innerText.toLowerCase().includes(q)
        ? ""
        : "none";
  });
}

function fields(a) {
  return `
    <div class="form-grid">

      ${a.map(x => `
        <div class="field">

          <label>${x[1]}</label>

          <input
            id="${x[0]}"
            ${x[0].includes("date") ? "type=date" : ""}>

        </div>
      `).join("")}

    </div>
  `;
}

function modal(h) {
  let m = document.getElementById("modal");

  if (!m) {
    m = document.createElement("div");
    m.id = "modal";
    m.className = "modal";
    document.body.appendChild(m);
  }

  m.innerHTML = `
    <div class="modal-card">

      ${h}

      <button
        class="btn secondary"
        onclick="closeModal()">
        Cancel
      </button>

    </div>
  `;

  m.classList.add("open");
}

function closeModal() {
  document.getElementById("modal")?.classList.remove("open");
}

function vals(a) {
  const o = {};

  a.forEach(x => {
    o[x] =
      document.getElementById(x)?.value || "";
  });

  return o;
}

function landForm() {
  modal(`
    <h2>Add Land Parcel</h2>

    ${fields([
      ["survey_number", "Survey Number"],
      ["owner_name", "Owner Name"],
      ["state", "State"],
      ["district", "District"],
      ["taluka", "Taluka"],
      ["village", "Village"],
      ["area", "Area"],
      ["latitude", "Latitude"],
      ["longitude", "Longitude"]
    ])}

    <button class="btn" onclick="saveLand()">
      Save
    </button>
  `);
}

async function saveLand() {
  try {
    await api("/api/land", {
      method: "POST",
      body: vals([
        "survey_number",
        "owner_name",
        "state",
        "district",
        "taluka",
        "village",
        "area",
        "latitude",
        "longitude"
      ])
    });

    closeModal();
    load();

  } catch (e) {
    alert(e.message);
  }
}

async function projects(c) {
  const a = await api("/api/projects");

  c.innerHTML = `
    <div class="panel">

      <div class="toolbar">

        ${
          S.user.role !== "viewer"
            ? `<button class="btn" onclick="projectForm()">
                 + New Project
               </button>`
            : ""
        }

      </div>

      <div class="table-wrap">

        <table>

          <tr>
            <th>Project</th>
            <th>Type</th>
            <th>Agency</th>
            <th>State</th>
            <th>Proposed</th>
            <th>Acquired</th>
            <th>Status</th>
          </tr>

          ${a.map(x => `
            <tr>
              <td>${esc(x.project_name)}</td>
              <td>${esc(x.project_type)}</td>
              <td>${esc(x.implementing_agency)}</td>
              <td>${esc(x.state)}</td>
              <td>${x.proposed_area} ha</td>
              <td>${x.acquired_area} ha</td>
              <td>
                <span class="badge">
                  ${esc(x.project_status)}
                </span>
              </td>
            </tr>
          `).join("")}

        </table>

      </div>

    </div>
  `;
}

function projectForm() {
  modal(`
    <h2>Create Project</h2>

    ${fields([
      ["project_name", "Project Name"],
      ["project_type", "Project Type"],
      ["implementing_agency", "Agency"],
      ["central_ministry", "Central Ministry"],
      ["state", "State"],
      ["district", "District"],
      ["proposed_area", "Proposed Area"],
      ["acquired_area", "Acquired Area"],
      ["start_date", "Start Date"],
      ["target_date", "Target Date"]
    ])}

    <button class="btn" onclick="saveProject()">
      Create
    </button>
  `);
}

async function saveProject() {
  try {
    await api("/api/projects", {
      method: "POST",
      body: vals([
        "project_name",
        "project_type",
        "implementing_agency",
        "central_ministry",
        "state",
        "district",
        "proposed_area",
        "acquired_area",
        "start_date",
        "target_date"
      ])
    });

    closeModal();
    load();

  } catch (e) {
    alert(e.message);
  }
}

async function acq(c) {
  const a = await api("/api/acquisitions");

  c.innerHTML = `
    <div class="panel">

      <div class="toolbar">

        ${
          S.user.role !== "viewer"
            ? `<button class="btn" onclick="acqForm()">
                 + Start Acquisition
               </button>`
            : ""
        }

      </div>

      <div class="table-wrap">

        <table>

          <tr>
            <th>Survey</th>
            <th>Owner</th>
            <th>Project</th>
            <th>Stage</th>
            <th>Notification</th>
            <th>Award</th>
            <th>Possession</th>
          </tr>

          ${a.map(x => `
            <tr>

              <td>${esc(x.survey_number)}</td>
              <td>${esc(x.owner_name)}</td>
              <td>${esc(x.project_name)}</td>

              <td>
                <span class="badge">
                  ${esc(x.current_stage)}
                </span>
              </td>

              <td>${esc(x.notification_date)}</td>
              <td>${esc(x.award_date)}</td>
              <td>${esc(x.possession_date)}</td>

            </tr>
          `).join("")}

        </table>

      </div>

    </div>
  `;
}

async function acqForm() {
  const [l, p] = await Promise.all([
    api("/api/land"),
    api("/api/projects")
  ]);

  modal(`
    <h2>Start Acquisition</h2>

    <div class="field">

      <label>Land Parcel</label>

      <select id="parcel_id">

        ${l.map(x => `
          <option value="${x.id}">
            ${esc(x.survey_number)} -
            ${esc(x.owner_name)}
          </option>
        `).join("")}

      </select>

    </div>

    <div class="field">

      <label>Project</label>

      <select id="project_id">

        <option value="">None</option>

        ${p.map(x => `
          <option value="${x.id}">
            ${esc(x.project_name)}
          </option>
        `).join("")}

      </select>

    </div>

    ${fields([
      ["current_stage", "Stage"],
      ["proposal_date", "Proposal Date"],
      ["notification_date", "Notification Date"],
      ["notification_number", "Notification Number"],
      ["hearing_date", "Hearing Date"],
      ["award_date", "Award Date"],
      ["possession_date", "Possession Date"]
    ])}

    <button class="btn" onclick="saveAcq()">
      Save
    </button>
  `);
}

async function saveAcq() {
  const b = vals([
    "current_stage",
    "proposal_date",
    "notification_date",
    "notification_number",
    "hearing_date",
    "award_date",
    "possession_date"
  ]);

  b.parcel_id =
    document.getElementById("parcel_id").value;

  b.project_id =
    document.getElementById("project_id").value || null;

  try {
    await api("/api/acquisitions", {
      method: "POST",
      body: b
    });

    closeModal();
    load();

  } catch (e) {
    alert(e.message);
  }
}

async function comp(c) {
  const a = await api("/api/compensation");

  c.innerHTML = `
    <div class="panel">

      <div class="toolbar">

        ${
          S.user.role !== "viewer"
            ? `<button class="btn" onclick="compForm()">
                 + Compensation
               </button>`
            : ""
        }

      </div>

      <div class="table-wrap">

        <table>

          <tr>
            <th>Survey</th>
            <th>Owner</th>
            <th>Assessed</th>
            <th>Approved</th>
            <th>Paid</th>
            <th>Status</th>
          </tr>

          ${a.map(x => `
            <tr>
              <td>${esc(x.survey_number)}</td>
              <td>${esc(x.owner_name)}</td>
              <td>₹${Number(x.assessed_amount).toLocaleString()}</td>
              <td>₹${Number(x.approved_amount).toLocaleString()}</td>
              <td>₹${Number(x.paid_amount).toLocaleString()}</td>
              <td>${esc(x.payment_status)}</td>
            </tr>
          `).join("")}

        </table>

      </div>

    </div>
  `;
}

async function compForm() {
  const a = await api("/api/acquisitions");

  modal(`
    <h2>Compensation</h2>

    <div class="field">

      <label>Acquisition</label>

      <select id="acquisition_id">

        ${a.map(x => `
          <option value="${x.id}">
            ${esc(x.survey_number)} -
            ${esc(x.owner_name)}
          </option>
        `).join("")}

      </select>

    </div>

    ${fields([
      ["assessed_amount", "Assessed Amount"],
      ["approved_amount", "Approved Amount"],
      ["paid_amount", "Paid Amount"],
      ["payment_status", "Payment Status"],
      ["payment_date", "Payment Date"],
      ["payment_reference", "Reference"]
    ])}

    <button class="btn" onclick="saveComp()">
      Save
    </button>
  `);
}

async function saveComp() {
  const b = vals([
    "assessed_amount",
    "approved_amount",
    "paid_amount",
    "payment_status",
    "payment_date",
    "payment_reference"
  ]);

  b.acquisition_id =
    document.getElementById("acquisition_id").value;

  try {
    await api("/api/compensation", {
      method: "POST",
      body: b
    });

    closeModal();
    load();

  } catch (e) {
    alert(e.message);
  }
}

async function rehab(c) {
  const a = await api("/api/rehabilitation");

  c.innerHTML = `
    <div class="panel">

      <div class="toolbar">

        ${
          S.user.role !== "viewer"
            ? `<button class="btn" onclick="rehabForm()">
                 + R&R Record
               </button>`
            : ""
        }

      </div>

      <div class="table-wrap">

        <table>

          <tr>
            <th>Survey</th>
            <th>Owner</th>
            <th>Affected</th>
            <th>Displaced</th>
            <th>Rehabilitation</th>
            <th>Resettlement</th>
            <th>Disbursed</th>
          </tr>

          ${a.map(x => `
            <tr>
              <td>${esc(x.survey_number)}</td>
              <td>${esc(x.owner_name)}</td>
              <td>${x.affected_families}</td>
              <td>${x.displaced_families}</td>
              <td>${esc(x.rehabilitation_status)}</td>
              <td>${esc(x.resettlement_status)}</td>
              <td>₹${Number(x.assistance_disbursed).toLocaleString()}</td>
            </tr>
          `).join("")}

        </table>

      </div>

    </div>
  `;
}

async function rehabForm() {
  const a = await api("/api/acquisitions");

  modal(`
    <h2>Rehabilitation & Resettlement</h2>

    <div class="field">

      <label>Acquisition</label>

      <select id="acquisition_id">

        ${a.map(x => `
          <option value="${x.id}">
            ${esc(x.survey_number)} -
            ${esc(x.owner_name)}
          </option>
        `).join("")}

      </select>

    </div>

    ${fields([
      ["affected_families", "Affected Families"],
      ["displaced_families", "Displaced Families"],
      ["rehabilitation_status", "Rehabilitation Status"],
      ["resettlement_status", "Resettlement Status"],
      ["assistance_amount", "Assistance Amount"],
      ["assistance_disbursed", "Assistance Disbursed"]
    ])}

    <button class="btn" onclick="saveRehab()">
      Save
    </button>
  `);
}

async function saveRehab() {
  const b = vals([
    "affected_families",
    "displaced_families",
    "rehabilitation_status",
    "resettlement_status",
    "assistance_amount",
    "assistance_disbursed"
  ]);

  b.acquisition_id =
    document.getElementById("acquisition_id").value;

  try {
    await api("/api/rehabilitation", {
      method: "POST",
      body: b
    });

    closeModal();
    load();

  } catch (e) {
    alert(e.message);
  }
}

async function docs(c) {
  const a = await api("/api/documents");

  c.innerHTML = `
    <div class="panel">

      <form onsubmit="uploadDoc(event)">

        <div class="form-grid">

          <div class="field">
            <label>Type</label>
            <input
              name="document_type"
              value="Land Record">
          </div>

          <div class="field">
            <label>Parcel ID</label>
            <input name="parcel_id">
          </div>

          <div class="field">
            <label>Project ID</label>
            <input name="project_id">
          </div>

          <div class="field">
            <label>File</label>
            <input
              name="document"
              type="file"
              required>
          </div>

        </div>

        <button class="btn">
          Upload
        </button>

      </form>

    </div>

    <div class="panel">

      <table>

        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Version</th>
          <th>File</th>
        </tr>

        ${a.map(x => `
          <tr>
            <td>${esc(x.document_name)}</td>
            <td>${esc(x.document_type)}</td>
            <td>v${x.version}</td>
            <td>
              <a
                href="${esc(x.file_path)}"
                target="_blank">
                Open
              </a>
            </td>
          </tr>
        `).join("")}

      </table>

    </div>
  `;
}

async function uploadDoc(e) {
  e.preventDefault();

  try {
    await api("/api/documents", {
      method: "POST",
      body: new FormData(e.target)
    });

    load();

  } catch (x) {
    alert(x.message);
  }
}

async function audit(c) {
  const a = await api("/api/audit-logs");

  c.innerHTML = `
    <div class="panel">

      <table>

        <tr>
          <th>Date</th>
          <th>User</th>
          <th>Action</th>
          <th>Entity</th>
          <th>ID</th>
        </tr>

        ${a.map(x => `
          <tr>
            <td>${esc(x.created_at)}</td>
            <td>${esc(x.user_name)}</td>
            <td>${esc(x.action)}</td>
            <td>${esc(x.entity_type)}</td>
            <td>${esc(x.entity_id)}</td>
          </tr>
        `).join("")}

      </table>

    </div>
  `;
}

render();
