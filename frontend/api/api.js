const API_BASE = "";

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("bhoomi_token");

    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(API_BASE + endpoint, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || data.message || "API request failed");
    }

    return data;
}

async function bhoomiLogin(email, password) {
    const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    if (data.token) {
        localStorage.setItem("bhoomi_token", data.token);
    }

    if (data.user) {
        localStorage.setItem("bhoomi_user", JSON.stringify(data.user));
    }

    return data;
}

function bhoomiLogout() {
    localStorage.removeItem("bhoomi_token");
    localStorage.removeItem("bhoomi_user");
    window.location.href = "index.html";
}

function isBhoomiLoggedIn() {
    return !!localStorage.getItem("bhoomi_token");
}

async function getDashboard() {
    return await apiRequest("/api/dashboard");
}

async function getLand() {
    return await apiRequest("/api/land");
}

async function getProjects() {
    return await apiRequest("/api/projects");
}

async function getAcquisitions() {
    return await apiRequest("/api/acquisitions");
}

async function getCompensation() {
    return await apiRequest("/api/compensation");
}

async function getRehabilitation() {
    return await apiRequest("/api/rehabilitation");
}

async function getDocuments() {
    return await apiRequest("/api/documents");
}

async function getAuditLogs() {
    return await apiRequest("/api/audit-logs");
}
