/* =========================================
   BHOOMI TREK
   COMMON JAVASCRIPT
========================================= */


/* =========================================
   PROFILE - SHOW REGISTER / LOGIN
========================================= */

function showForm(formType) {

    const registerForm =
        document.getElementById("registerForm");

    const loginForm =
        document.getElementById("loginForm");

    const buttons =
        document.querySelectorAll(".tab-btn");


    if (formType === "register") {

        registerForm.style.display = "block";
        loginForm.style.display = "none";

        buttons[0].classList.add("active");
        buttons[1].classList.remove("active");

    }

    else {

        registerForm.style.display = "none";
        loginForm.style.display = "block";

        buttons[0].classList.remove("active");
        buttons[1].classList.add("active");

    }
}


/* =========================================
   CHANGE USER TYPE
========================================= */

function changeUserType() {

    const userType =
        document.getElementById("userType").value;

    const citizenFields =
        document.getElementById("citizenFields");

    const officerFields =
        document.getElementById("officerFields");


    if (userType === "citizen") {

        citizenFields.style.display = "block";
        officerFields.style.display = "none";

    }

    else {

        citizenFields.style.display = "none";
        officerFields.style.display = "block";

    }
}


/* =========================================
   CREATE PROFILE
========================================= */

function createProfile() {

    const userType =
        document.getElementById("userType").value;

    let profile = {};


    /* LANDOWNER / CITIZEN */

    if (userType === "citizen") {

        const name =
            document.getElementById("citizenName").value.trim();

        const mobile =
            document.getElementById("citizenMobile").value.trim();

        const email =
            document.getElementById("citizenEmail").value.trim();

        const address =
            document.getElementById("citizenAddress").value.trim();

        const password =
            document.getElementById("citizenPassword").value;


        if (
            name === "" ||
            mobile === "" ||
            email === "" ||
            address === "" ||
            password === ""
        ) {

            alert("Please fill all the fields.");
            return;
        }


        profile = {

            type: "citizen",
            name: name,
            mobile: mobile,
            email: email,
            address: address,
            password: password

        };

    }


    /* GOVERNMENT OFFICER */

    else {

        const name =
            document.getElementById("officerName").value.trim();

        const department =
            document.getElementById("department").value.trim();

        const office =
            document.getElementById("officeName").value.trim();

        const employeeId =
            document.getElementById("employeeId").value.trim();

        const email =
            document.getElementById("officerEmail").value.trim();

        const password =
            document.getElementById("officerPassword").value;


        if (
            name === "" ||
            department === "" ||
            office === "" ||
            employeeId === "" ||
            email === "" ||
            password === ""
        ) {

            alert("Please fill all the fields.");
            return;
        }


        profile = {

            type: "officer",
            name: name,
            department: department,
            office: office,
            employeeId: employeeId,
            email: email,
            password: password

        };

    }


    /* SAVE PROFILE */

    localStorage.setItem(
        "bhoomiProfile",
        JSON.stringify(profile)
    );


    /* MARK USER AS LOGGED IN */

    localStorage.setItem(
        "bhoomiLoggedIn",
        "true"
    );


    alert(
        "Profile created successfully!"
    );


    /* OPEN LOCATION SEARCH */

    window.location.href =
        "location_search.html";
}


/* =========================================
   LOGIN
========================================= */

async function loginUser() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    if (email === "" || password === "") {

        alert("Please enter email and password.");
        return;
    }


    /* =========================================
       BHOOMI-TRACK BACKEND LOGIN
    ========================================= */

    try {

        if (typeof bhoomiLogin !== "function") {

            alert(
                "Backend login connector is not loaded."
            );

            return;
        }


        await bhoomiLogin(
            email,
            password
        );


        localStorage.setItem(
            "bhoomiLoggedIn",
            "true"
        );


        alert("Login successful!");


        window.location.href =
            "location_search.html";


    } catch (error) {

        console.error(
            "Backend login failed:",
            error
        );


        alert(
            "Invalid email or password."
        );
    }
}

/* =========================================
   CHECK LOGIN
========================================= */

function checkLogin() {

    const loggedIn =
        localStorage.getItem("bhoomiLoggedIn");


    if (loggedIn !== "true") {

        alert(
            "Please login first to access Location Search."
        );


        window.location.href =
            "profile.html";
    }
}

/* =========================================
   SEARCH LOCATION
   BHOOMI TREK
========================================= */


/* CHECK LOGIN BEFORE OPENING LOCATION PAGE */

function checkLogin() {

    const loggedIn = localStorage.getItem("bhoomiLoggedIn");

    if (loggedIn !== "true") {

        alert("Please login first to access Location Search.");

        window.location.href = "profile.html";
    }
}


/* =========================================
   LOAD DISTRICTS
========================================= */

function loadDistricts() {

    const state = document.getElementById("state").value;

    const district = document.getElementById("district");

    const taluka = document.getElementById("taluka");

    const village = document.getElementById("village");


    // Clear old values

    district.innerHTML =
        '<option value="">Select District</option>';

    taluka.innerHTML =
        '<option value="">Select Taluka</option>';

    village.innerHTML =
        '<option value="">Select Village</option>';


    // Maharashtra Districts

    if (state === "Maharashtra") {

        district.innerHTML +=
            '<option value="Dhule">Dhule</option>';

        district.innerHTML +=
            '<option value="Pune">Pune</option>';

        district.innerHTML +=
            '<option value="Nashik">Nashik</option>';

        district.innerHTML +=
            '<option value="Mumbai">Mumbai</option>';

        district.innerHTML +=
            '<option value="Nagpur">Nagpur</option>';

        district.innerHTML +=
            '<option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>';
    }


    // Gujarat Districts

    else if (state === "Gujarat") {

        district.innerHTML +=
            '<option value="Ahmedabad">Ahmedabad</option>';

        district.innerHTML +=
            '<option value="Surat">Surat</option>';

        district.innerHTML +=
            '<option value="Vadodara">Vadodara</option>';
    }


    // Karnataka Districts

    else if (state === "Karnataka") {

        district.innerHTML +=
            '<option value="Bengaluru">Bengaluru</option>';

        district.innerHTML +=
            '<option value="Mysuru">Mysuru</option>';
    }


    // Madhya Pradesh Districts

    else if (state === "Madhya Pradesh") {

        district.innerHTML +=
            '<option value="Bhopal">Bhopal</option>';

        district.innerHTML +=
            '<option value="Indore">Indore</option>';
    }
}


/* =========================================
   LOAD TALUKAS
========================================= */

function loadTalukas() {

    const district = document.getElementById("district").value;

    const taluka = document.getElementById("taluka");

    const village = document.getElementById("village");


    // Clear old values

    taluka.innerHTML =
        '<option value="">Select Taluka</option>';

    village.innerHTML =
        '<option value="">Select Village</option>';


    /* -------- DHULE -------- */

    if (district === "Dhule") {

        taluka.innerHTML +=
            '<option value="Dhule">Dhule</option>';

        taluka.innerHTML +=
            '<option value="Sakri">Sakri</option>';

        taluka.innerHTML +=
            '<option value="Shirpur">Shirpur</option>';

        taluka.innerHTML +=
            '<option value="Shindkheda">Shindkheda</option>';
    }


    /* -------- PUNE -------- */

    else if (district === "Pune") {

        taluka.innerHTML +=
            '<option value="Haveli">Haveli</option>';

        taluka.innerHTML +=
            '<option value="Mulshi">Mulshi</option>';

        taluka.innerHTML +=
            '<option value="Maval">Maval</option>';

        taluka.innerHTML +=
            '<option value="Shirur">Shirur</option>';
    }


    /* -------- NASHIK -------- */

    else if (district === "Nashik") {

        taluka.innerHTML +=
            '<option value="Nashik">Nashik</option>';

        taluka.innerHTML +=
            '<option value="Sinnar">Sinnar</option>';

        taluka.innerHTML +=
            '<option value="Igatpuri">Igatpuri</option>';
    }


    /* -------- MUMBAI -------- */

    else if (district === "Mumbai") {

        taluka.innerHTML +=
            '<option value="Andheri">Andheri</option>';

        taluka.innerHTML +=
            '<option value="Borivali">Borivali</option>';
    }


    /* -------- NAGPUR -------- */

    else if (district === "Nagpur") {

        taluka.innerHTML +=
            '<option value="Nagpur">Nagpur</option>';

        taluka.innerHTML +=
            '<option value="Kamptee">Kamptee</option>';
    }
}


/* =========================================
   LOAD VILLAGES
========================================= */

function loadVillages() {

    const taluka = document.getElementById("taluka").value;

    const village = document.getElementById("village");


    // Clear old villages

    village.innerHTML =
        '<option value="">Select Village</option>';


    /* -------- DHULE TALUKA -------- */

    if (taluka === "Dhule") {

        village.innerHTML +=
            '<option value="Dhule">Dhule</option>';

        village.innerHTML +=
            '<option value="Laling">Laling</option>';

        village.innerHTML +=
            '<option value="Ner">Ner</option>';

        village.innerHTML +=
            '<option value="Chinchwar">Chinchwar</option>';
    }


    /* -------- SAKRI -------- */

    else if (taluka === "Sakri") {

        village.innerHTML +=
            '<option value="Sakri">Sakri</option>';

        village.innerHTML +=
            '<option value="Kukawal">Kukawal</option>';

        village.innerHTML +=
            '<option value="Sample Village">Sample Village</option>';
    }


    /* -------- SHIRPUR -------- */

    else if (taluka === "Shirpur") {

        village.innerHTML +=
            '<option value="Shirpur">Shirpur</option>';

        village.innerHTML +=
            '<option value="Thalner">Thalner</option>';

        village.innerHTML +=
            '<option value="Sample Village">Sample Village</option>';
    }


    /* -------- SHINDKHEDA -------- */

    else if (taluka === "Shindkheda") {

        village.innerHTML +=
            '<option value="Shindkheda">Shindkheda</option>';

        village.innerHTML +=
            '<option value="Dondaicha">Dondaicha</option>';

        village.innerHTML +=
            '<option value="Sample Village">Sample Village</option>';
    }


    /* -------- PUNE - HAVELI -------- */

    else if (taluka === "Haveli") {

        village.innerHTML +=
            '<option value="Wagholi">Wagholi</option>';

        village.innerHTML +=
            '<option value="Kharadi">Kharadi</option>';

        village.innerHTML +=
            '<option value="Lohegaon">Lohegaon</option>';

        village.innerHTML +=
            '<option value="Mundhwa">Mundhwa</option>';
    }


    /* -------- PUNE - MULSHI -------- */

    else if (taluka === "Mulshi") {

        village.innerHTML +=
            '<option value="Pirangut">Pirangut</option>';

        village.innerHTML +=
            '<option value="Paud">Paud</option>';
    }


    /* -------- PUNE - MAVAL -------- */

    else if (taluka === "Maval") {

        village.innerHTML +=
            '<option value="Lonavala">Lonavala</option>';

        village.innerHTML +=
            '<option value="Talegaon">Talegaon</option>';
    }


    /* -------- PUNE - SHIRUR -------- */

    else if (taluka === "Shirur") {

        village.innerHTML +=
            '<option value="Shirur">Shirur</option>';

        village.innerHTML +=
            '<option value="Ranjangaon">Ranjangaon</option>';
    }


    /* -------- NASHIK -------- */

    else if (taluka === "Nashik") {

        village.innerHTML +=
            '<option value="Nashik">Nashik</option>';

        village.innerHTML +=
            '<option value="Sample Village">Sample Village</option>';
    }


    /* -------- SINNAR -------- */

    else if (taluka === "Sinnar") {

        village.innerHTML +=
            '<option value="Sinnar">Sinnar</option>';

        village.innerHTML +=
            '<option value="Sample Village">Sample Village</option>';
    }


    /* -------- IGATPURI -------- */

    else if (taluka === "Igatpuri") {

        village.innerHTML +=
            '<option value="Igatpuri">Igatpuri</option>';

        village.innerHTML +=
            '<option value="Sample Village">Sample Village</option>';
    }
}


/* =========================================
   SEARCH LOCATION BUTTON
========================================= */

function searchLocation() {

    // Get selected values

    const state =
        document.getElementById("state").value;

    const district =
        document.getElementById("district").value;

    const taluka =
        document.getElementById("taluka").value;

    const village =
        document.getElementById("village").value;

    const purpose =
        document.getElementById("purpose").value;


    // Check all fields

    if (
        state === "" ||
        district === "" ||
        taluka === "" ||
        village === "" ||
        purpose === ""
    ) {

        alert("Please select all location details.");

        return;
    }


    // Store selected location

    const locationData = {

        state: state,

        district: district,

        taluka: taluka,

        village: village,

        purpose: purpose

    };


    // Save location data

    localStorage.setItem(
        "bhoomiLocation",
        JSON.stringify(locationData)
    );


    // Success message

    alert("Location found successfully!");


    // Open Government Authority page

    window.location.href =
        "government_authority.html";

}

/* =========================================
   LAND PARCELS PAGE
========================================= */

function loadLandParcels() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    if (savedLocation === null) {

        alert("Please search a location first.");

        window.location.href =
            "location_search.html";

        return;
    }


    const locationData =
        JSON.parse(savedLocation);


    document.getElementById("showState").textContent =
        locationData.state;

    document.getElementById("showDistrict").textContent =
        locationData.district;

    document.getElementById("showTaluka").textContent =
        locationData.taluka;

    document.getElementById("showVillage").textContent =
        locationData.village;

    document.getElementById("showPurpose").textContent =
        locationData.purpose;
}


/* =========================================
   VIEW PARCEL
========================================= */

function viewParcel(surveyNumber) {

    localStorage.setItem(
        "selectedSurveyNumber",
        surveyNumber
    );


    window.location.href =
        "land_information.html";
}

/* =========================================
   LAND INFORMATION
========================================= */

```javascript
function loadLandInformation() {

    // Get saved location
    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    // Get selected survey number
    const selectedSurvey =
        localStorage.getItem("selectedSurveyNumber");


    // Check required data

    if (
        savedLocation === null ||
        selectedSurvey === null
    ) {

        alert("Please select a land parcel first.");

        window.location.href =
            "land_parcels.html";

        return;
    }


    // Convert location data

    const locationData =
        JSON.parse(savedLocation);


    // Display survey number

    document.getElementById("surveyNumber")
        .textContent = selectedSurvey;

    document.getElementById("surveyNumber2")
        .textContent = selectedSurvey;


    // Display location

    document.getElementById("state")
        .textContent =
        locationData.state;

    document.getElementById("district")
        .textContent =
        locationData.district;

    document.getElementById("taluka")
        .textContent =
        locationData.taluka;

    document.getElementById("village")
        .textContent =
        locationData.village;

    document.getElementById("purpose")
        .textContent =
        locationData.purpose;


    // Display parcel information

    if (selectedSurvey === "SUR-1025") {

        document.getElementById("landowner")
            .textContent = "Rajesh Patil";

        document.getElementById("area")
            .textContent = "2.5 Acres";

        document.getElementById("landType")
            .textContent = "Agricultural";

        document.getElementById("landStatus")
            .textContent = "In Progress";

        document.getElementById("currentStage")
            .textContent = "Verification";

    }


    else if (selectedSurvey === "SUR-1042") {

        document.getElementById("landowner")
            .textContent = "Sunil Patil";

        document.getElementById("area")
            .textContent = "3.0 Acres";

        document.getElementById("landType")
            .textContent = "Agricultural";

        document.getElementById("landStatus")
            .textContent = "Verification";

        document.getElementById("currentStage")
            .textContent = "Verification";

    }


    else if (selectedSurvey === "SUR-1088") {

        document.getElementById("landowner")
            .textContent = "Mahesh Patil";

        document.getElementById("area")
            .textContent = "1.5 Acres";

        document.getElementById("landType")
            .textContent = "Residential";

        document.getElementById("landStatus")
            .textContent = "Compensation";

        document.getElementById("currentStage")
            .textContent = "Compensation";

    }


    else if (selectedSurvey === "SUR-1112") {

        document.getElementById("landowner")
            .textContent = "Prakash More";

        document.getElementById("area")
            .textContent = "3.5 Acres";

        document.getElementById("landType")
            .textContent = "Agricultural";

        document.getElementById("landStatus")
            .textContent = "Completed";

        document.getElementById("currentStage")
            .textContent = "Completed";

    }

}


// Go to Track Acquisition

function goToTrackAcquisition() {

    window.location.href =
        "track_acquisition.html";

}
```



/* =========================================
   GO TO TRACK ACQUISITION
========================================= */

function goToTrackAcquisition() {

    window.location.href =
        "track_acquisition.html";
}

/* =========================================
   TRACK ACQUISITION
========================================= */

function loadAcquisitionStatus() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    const selectedSurvey =
        localStorage.getItem("selectedSurveyNumber");


    if (savedLocation === null ||
        selectedSurvey === null) {

        alert("Please select a land parcel first.");

        window.location.href =
            "land_parcels.html";

        return;
    }


    const locationData =
        JSON.parse(savedLocation);


    document.getElementById("trackSurvey")
        .textContent = selectedSurvey;


    document.getElementById("trackLocation")
        .textContent =
        locationData.village +
        ", " +
        locationData.district;


    /*
       Sample owner and status
       according to selected survey number
    */

    if (selectedSurvey === "SUR-1042") {

        document.getElementById("trackOwner")
            .textContent = "Sunil Patil";

        document.getElementById("trackStatus")
            .textContent = "Verification";

        document.getElementById("progressFill")
            .style.width = "42%";

        document.getElementById("progressText")
            .textContent = "42% Completed";
    }


    else if (selectedSurvey === "SUR-1088") {

        document.getElementById("trackOwner")
            .textContent = "Mahesh Patil";

        document.getElementById("trackStatus")
            .textContent = "Compensation";

        document.getElementById("progressFill")
            .style.width = "65%";

        document.getElementById("progressText")
            .textContent = "65% Completed";
    }


    else if (selectedSurvey === "SUR-1112") {

        document.getElementById("trackOwner")
            .textContent = "Prakash More";

        document.getElementById("trackStatus")
            .textContent = "Completed";

        document.getElementById("progressFill")
            .style.width = "100%";

        document.getElementById("progressText")
            .textContent = "100% Completed";
    }


    else {

        document.getElementById("trackOwner")
            .textContent = "Rajesh Patil";

        document.getElementById("trackStatus")
            .textContent = "In Progress";

        document.getElementById("progressFill")
            .style.width = "57%";

        document.getElementById("progressText")
            .textContent = "57% Completed";
    }
}

 /* =========================================
    VERIFICATION PAGE
 ========================================= */

function loadVerification() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    const selectedSurvey =
        localStorage.getItem("selectedSurveyNumber");


    if (savedLocation === null ||
        selectedSurvey === null) {

        alert("Please select a land parcel first.");

        window.location.href =
            "land_parcels.html";

        return;
    }


    const locationData =
        JSON.parse(savedLocation);


    document.getElementById("verificationSurvey")
        .textContent = selectedSurvey;


    document.getElementById("verificationLocation")
        .textContent =
        locationData.village +
        ", " +
        locationData.district;


    /* SAMPLE LANDOWNERS */

    if (selectedSurvey === "SUR-1042") {

        document.getElementById("verificationOwner")
            .textContent = "Sunil Patil";

        document.getElementById("verificationStatus")
            .textContent = "Verification";

    }

    else if (selectedSurvey === "SUR-1088") {

        document.getElementById("verificationOwner")
            .textContent = "Mahesh Patil";

        document.getElementById("verificationStatus")
            .textContent = "Verified";

    }

    else if (selectedSurvey === "SUR-1112") {

        document.getElementById("verificationOwner")
            .textContent = "Prakash More";

        document.getElementById("verificationStatus")
            .textContent = "Completed";

    }

    else {

        document.getElementById("verificationOwner")
            .textContent = "Rajesh Patil";

        document.getElementById("verificationStatus")
            .textContent = "In Progress";
    }
}

/* =========================================
   COMPENSATION PAGE
========================================= */

function loadCompensation() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    const selectedSurvey =
        localStorage.getItem("selectedSurveyNumber");


    if (savedLocation === null ||
        selectedSurvey === null) {

        alert("Please select a land parcel first.");

        window.location.href =
            "land_parcels.html";

        return;
    }


    const locationData =
        JSON.parse(savedLocation);


    document.getElementById("compSurvey")
        .textContent = selectedSurvey;


    /*
       Sample compensation data
    */

    if (selectedSurvey === "SUR-1042") {

        document.getElementById("compOwner")
            .textContent = "Sunil Patil";

        document.getElementById("compArea")
            .textContent = "3.0 Acres";
    }

    else if (selectedSurvey === "SUR-1088") {

        document.getElementById("compOwner")
            .textContent = "Mahesh Patil";

        document.getElementById("compArea")
            .textContent = "1.5 Acres";
    }

    else if (selectedSurvey === "SUR-1112") {

        document.getElementById("compOwner")
            .textContent = "Prakash More";

        document.getElementById("compArea")
            .textContent = "3.5 Acres";
    }

    else {

        document.getElementById("compOwner")
            .textContent = "Rajesh Patil";

        document.getElementById("compArea")
            .textContent = "2.5 Acres";
    }
}

 /* =========================================
    OBJECTION & GRIEVANCE
 ========================================= */

function loadObjectionPage() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    const selectedSurvey =
        localStorage.getItem("selectedSurveyNumber");


    if (savedLocation === null ||
        selectedSurvey === null) {

        alert("Please select a land parcel first.");

        window.location.href =
            "land_parcels.html";

        return;
    }


    const locationData =
        JSON.parse(savedLocation);


    document.getElementById("objectionSurvey")
        .textContent = selectedSurvey;


    document.getElementById("objectionLocation")
        .textContent =
        locationData.village +
        ", " +
        locationData.district;


    /* SAMPLE LANDOWNER */

    if (selectedSurvey === "SUR-1042") {

        document.getElementById("objectionOwner")
            .textContent = "Sunil Patil";

    }

    else if (selectedSurvey === "SUR-1088") {

        document.getElementById("objectionOwner")
            .textContent = "Mahesh Patil";

    }

    else if (selectedSurvey === "SUR-1112") {

        document.getElementById("objectionOwner")
            .textContent = "Prakash More";

    }

    else {

        document.getElementById("objectionOwner")
            .textContent = "Rajesh Patil";
    }


    /* SET TODAY'S DATE */

    const today =
        new Date().toISOString().split("T")[0];

    document.getElementById("objectionDate")
        .value = today;


    /* LOAD SAVED OBJECTION */

    const savedObjection =
        localStorage.getItem("bhoomiObjection");

    if (savedObjection !== null) {

        const objection =
            JSON.parse(savedObjection);

        document.getElementById("grievanceStatus")
            .textContent = "Submitted";

        document.getElementById("grievanceMessage")
            .textContent =
            "Your objection has been submitted successfully. Reference ID: "
            + objection.referenceId;
    }
}


/* =========================================
   SUBMIT OBJECTION
========================================= */

function submitObjection(event) {

    event.preventDefault();


    const objectionType =
        document.getElementById("objectionType").value;

    const description =
        document.getElementById("objectionDescription")
        .value.trim();

    const surveyNumber =
        localStorage.getItem("selectedSurveyNumber");


    if (objectionType === "" ||
        description === "") {

        alert("Please fill all required fields.");

        return;
    }


    /* CREATE REFERENCE ID */

    const referenceId =
        "BT-GRV-" +
        Math.floor(10000 + Math.random() * 90000);


    const objection = {

        referenceId: referenceId,

        surveyNumber: surveyNumber,

        type: objectionType,

        description: description,

        date:
            document.getElementById("objectionDate").value,

        status: "Submitted"
    };


    localStorage.setItem(
        "bhoomiObjection",
        JSON.stringify(objection)
    );


    document.getElementById("grievanceStatus")
        .textContent = "Submitted";

    document.getElementById("grievanceMessage")
        .textContent =
        "Your objection has been submitted successfully. Reference ID: "
        + referenceId;


    alert(
        "Objection submitted successfully!\n\nReference ID: "
        + referenceId
    );

}

/* =========================================
   FINAL APPROVAL
========================================= */

function loadApproval() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    const selectedSurvey =
        localStorage.getItem("selectedSurveyNumber");


    /* CHECK DATA */

    if (savedLocation === null ||
        selectedSurvey === null) {

        alert("Please select a land parcel first.");

        window.location.href =
            "land_parcels.html";

        return;
    }


    const locationData =
        JSON.parse(savedLocation);


    /* LOCATION */

    document.getElementById("approvalSurvey")
        .textContent = selectedSurvey;

    document.getElementById("approvalLocation")
        .textContent =
        locationData.village +
        ", " +
        locationData.district;


    /* =====================================
       SURVEY-WISE INFORMATION
    ===================================== */

    if (selectedSurvey === "SUR-1042") {

        document.getElementById("approvalOwner")
            .textContent = "Sunil Patil";

        document.getElementById("approvalStatus")
            .textContent = "Pending";

        document.getElementById("approvalTitle")
            .textContent =
            "Final Approval Pending";

        document.getElementById("approvalMessage")
            .textContent =
            "The land acquisition proposal is currently awaiting final government approval.";

        document.getElementById("approvalDepartment")
            .textContent =
            "District Collector Office";

        document.getElementById("approvalAuthority")
            .textContent =
            "District Collector";

        document.getElementById("approvalProject")
            .textContent =
            "Government Infrastructure Project";

        document.getElementById("approvalDate")
            .textContent =
            "Pending";

    }

    else if (selectedSurvey === "SUR-1088") {

        document.getElementById("approvalOwner")
            .textContent = "Mahesh Patil";

        document.getElementById("approvalStatus")
            .textContent = "Approved";

        document.getElementById("approvalTitle")
            .textContent =
            "Final Approval Granted";

        document.getElementById("approvalMessage")
            .textContent =
            "The land acquisition proposal has received final government approval.";

        document.getElementById("approvalDepartment")
            .textContent =
            "District Collector Office";

        document.getElementById("approvalAuthority")
            .textContent =
            "District Collector";

        document.getElementById("approvalProject")
            .textContent =
            "Government Infrastructure Project";

        document.getElementById("approvalDate")
            .textContent =
            "15 August 2026";

    }

    else if (selectedSurvey === "SUR-1112") {

        document.getElementById("approvalOwner")
            .textContent = "Prakash More";

        document.getElementById("approvalStatus")
            .textContent = "Approved";

        document.getElementById("approvalTitle")
            .textContent =
            "Final Approval Completed";

        document.getElementById("approvalMessage")
            .textContent =
            "Final approval has been completed and the land acquisition process has moved to possession.";

        document.getElementById("approvalDepartment")
            .textContent =
            "District Collector Office";

        document.getElementById("approvalAuthority")
            .textContent =
            "District Collector";

        document.getElementById("approvalProject")
            .textContent =
            "Government Infrastructure Project";

        document.getElementById("approvalDate")
            .textContent =
            "10 July 2026";

    }

    else {

        document.getElementById("approvalOwner")
            .textContent = "Rajesh Patil";

        document.getElementById("approvalStatus")
            .textContent = "Pending";

        document.getElementById("approvalTitle")
            .textContent =
            "Final Approval Pending";

        document.getElementById("approvalMessage")
            .textContent =
            "The acquisition proposal is under review by the competent government authority.";

        document.getElementById("approvalDepartment")
            .textContent =
            "District Collector Office";

        document.getElementById("approvalAuthority")
            .textContent =
            "District Collector";

        document.getElementById("approvalProject")
            .textContent =
            "Government Infrastructure Project";

        document.getElementById("approvalDate")
            .textContent =
            "Pending";
    }
}

/* =========================================
   LAND POSSESSION
========================================= */

function loadPossession() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    const selectedSurvey =
        localStorage.getItem("selectedSurveyNumber");


    /* CHECK DATA */

    if (savedLocation === null ||
        selectedSurvey === null) {

        alert("Please select a land parcel first.");

        window.location.href =
            "land_parcels.html";

        return;
    }


    const locationData =
        JSON.parse(savedLocation);


    /* LOCATION */

    document.getElementById("possessionSurvey")
        .textContent = selectedSurvey;

    document.getElementById("possessionLocation")
        .textContent =
        locationData.village +
        ", " +
        locationData.district;


    /* =====================================
       SURVEY-WISE INFORMATION
    ===================================== */

    if (selectedSurvey === "SUR-1042") {

        document.getElementById("possessionOwner")
            .textContent = "Sunil Patil";

        document.getElementById("possessionStatus")
            .textContent = "Pending";

        document.getElementById("possessionTitle")
            .textContent =
            "Possession Pending";

        document.getElementById("possessionMessage")
            .textContent =
            "Final approval is still pending. Possession will begin after approval.";

        document.getElementById("possessionDate")
            .textContent = "Pending";

        document.getElementById("handoverStatus")
            .textContent = "Pending";

    }

    else if (selectedSurvey === "SUR-1088") {

        document.getElementById("possessionOwner")
            .textContent = "Mahesh Patil";

        document.getElementById("possessionStatus")
            .textContent = "In Progress";

        document.getElementById("possessionTitle")
            .textContent =
            "Possession Process Started";

        document.getElementById("possessionMessage")
            .textContent =
            "The final approval has been completed and the possession process is in progress.";

        document.getElementById("possessionDate")
            .textContent = "20 August 2026";

        document.getElementById("handoverStatus")
            .textContent = "In Progress";

    }

    else if (selectedSurvey === "SUR-1112") {

        document.getElementById("possessionOwner")
            .textContent = "Prakash More";

        document.getElementById("possessionStatus")
            .textContent = "Completed";

        document.getElementById("possessionTitle")
            .textContent =
            "Land Possession Completed";

        document.getElementById("possessionMessage")
            .textContent =
            "The land has been successfully handed over to the government authority.";

        document.getElementById("possessionDate")
            .textContent = "18 July 2026";

        document.getElementById("handoverStatus")
            .textContent = "Completed";

    }

    else {

        document.getElementById("possessionOwner")
            .textContent = "Rajesh Patil";

        document.getElementById("possessionStatus")
            .textContent = "Pending";

        document.getElementById("possessionTitle")
            .textContent =
            "Possession Pending";

        document.getElementById("possessionMessage")
            .textContent =
            "Land possession will begin after final government approval.";

        document.getElementById("possessionDate")
            .textContent = "Pending";

        document.getElementById("handoverStatus")
            .textContent = "Pending";
    }
}


/* =========================================
   POSSESSION CERTIFICATE
========================================= */

function downloadCertificate() {

    const selectedSurvey =
        localStorage.getItem("selectedSurveyNumber");

    if (selectedSurvey === null) {

        alert("Please select a land parcel first.");

        return;
    }

    alert(
        "Possession Certificate\n\n" +
        "Survey Number: " + selectedSurvey +
        "\n\nCertificate will be available after successful land handover."
    );
}

/* =========================================
   DASHBOARD
========================================= */
 
async function loadDashboard() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    if (savedLocation !== null) {
        try {
            const locationData = JSON.parse(savedLocation);

            const locationElement =
                document.getElementById("dashboardLocation");

            if (locationElement) {
                locationElement.textContent =
                    locationData.village + ", " +
                    locationData.district + ", " +
                    locationData.state;
            }

        } catch (error) {
            console.log("Saved location could not be loaded.");
        }
    }

    try {

        const data = await getDashboard();

        /* =========================
           TOP DASHBOARD CARDS
        ========================= */

        document.getElementById("totalParcels")
            .textContent = data.landParcels ?? 0;

        const underProcess =
            data.byStage?.find(
                item => item.stage === "Under Process"
            );

        document.getElementById("underAcquisition")
            .textContent =
            underProcess ? underProcess.count : 0;

        const awarded =
            data.byStage?.find(
                item => item.stage === "Awarded"
            );

        document.getElementById("completedCases")
            .textContent =
            awarded ? awarded.count : 0;

        document.getElementById("delayedCases")
            .textContent = "0";


        /* =========================
           OVERALL PROGRESS
        ========================= */

        const proposedArea =
            Number(data.proposedArea) || 0;

        const acquiredArea =
            Number(data.acquiredArea) || 0;

        let progress = 0;

        if (proposedArea > 0) {
            progress = Math.round(
                (acquiredArea / proposedArea) * 100
            );
        }

        progress = Math.max(
            0,
            Math.min(100, progress)
        );

        document.getElementById("dashboardProgress")
            .textContent = progress + "%";

        document.getElementById("dashboardProgressFill")
            .style.width = progress + "%";


        /* =========================
           COMPENSATION
        ========================= */

        const compensation =
            await getCompensation();

        const totalCompensation =
            compensation.reduce(
                (sum, item) =>
                    sum + Number(item.amount || 0),
                0
            );

        const paidCompensation =
            compensation
                .filter(item => item.status === "Paid")
                .reduce(
                    (sum, item) =>
                        sum + Number(item.amount || 0),
                    0
                );

        const pendingCompensation =
            totalCompensation -
            paidCompensation;

        const compensationBoxes =
            document.querySelectorAll(
                ".compensation-dashboard-box h2"
            );

        if (compensationBoxes.length >= 3) {

            compensationBoxes[0].textContent =
                "₹" +
                totalCompensation.toLocaleString("en-IN");

            compensationBoxes[1].textContent =
                "₹" +
                paidCompensation.toLocaleString("en-IN");

            compensationBoxes[2].textContent =
                "₹" +
                pendingCompensation.toLocaleString("en-IN");
        }


        /* =========================
           RECENT CASES
        ========================= */

        const land =
            await getLand();

        const acquisitions =
            await getAcquisitions();

        const tableBody =
            document.querySelector(
                ".dashboard-table-container table tbody"
            );

        if (
            tableBody &&
            Array.isArray(land) &&
            Array.isArray(acquisitions)
        ) {

            tableBody.innerHTML = "";

            acquisitions.slice(0, 5).forEach(
                acquisition => {

                    const parcel =
                        land.find(
                            item =>
                                Number(item.id) ===
                                Number(acquisition.land_id)
                        );

                    if (!parcel) return;

                    let stage = "Acquisition";

                    if (
                        acquisition.status ===
                        "Under Process"
                    ) {
                        stage = "Verification";
                    }

                    if (
                        acquisition.status ===
                        "Awarded"
                    ) {
                        stage = "Completed";
                    }

                    const statusClass =
                        acquisition.status === "Awarded"
                            ? "completed"
                            : "progress";

                    const row =
                        document.createElement("tr");

                    row.innerHTML = `
                        <td>${parcel.survey_number}</td>

                        <td>${parcel.owner_name}</td>

                        <td>
                            ${parcel.area}
                            ${parcel.area_unit}
                        </td>

                        <td>${stage}</td>

                        <td>
                            <span class="dashboard-status ${statusClass}">
                                ${acquisition.status}
                            </span>
                        </td>
                    `;

                    tableBody.appendChild(row);
                }
            );
        }


        console.log(
            "BHOOMI-TRACK dashboard data loaded:",
            data
        );

    } catch (error) {

        console.error(
            "Unable to load BHOOMI-TRACK dashboard data:",
            error
        );
    }
}
/* =========================================
   GIS MAP
========================================= */

let selectedGISParcel = "";


/* LOAD GIS MAP */

function loadGISMap() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");


    if (savedLocation !== null) {

        const locationData =
            JSON.parse(savedLocation);

        document.getElementById("gisLocation")
            .textContent =
            locationData.village +
            ", " +
            locationData.district +
            ", " +
            locationData.state;

        document.getElementById("gisPurpose")
            .textContent =
            locationData.purpose;
    }
}


/* SELECT PARCEL */

function selectGISParcel(surveyNumber) {

    selectedGISParcel = surveyNumber;

    localStorage.setItem(
        "selectedSurveyNumber",
        surveyNumber
    );


    const owner =
        document.getElementById("selectedGISOwner");

    const area =
        document.getElementById("selectedGISArea");

    const status =
        document.getElementById("selectedGISStatus");


    document.getElementById("selectedGISSurvey")
        .textContent = surveyNumber;


    if (surveyNumber === "SUR-1025") {

        owner.textContent = "Rajesh Patil";
        area.textContent = "2.5 Acres";
        status.textContent = "In Progress";

    }

    else if (surveyNumber === "SUR-1042") {

        owner.textContent = "Sunil Patil";
        area.textContent = "3.0 Acres";
        status.textContent = "Verification";

    }

    else if (surveyNumber === "SUR-1088") {

        owner.textContent = "Mahesh Patil";
        area.textContent = "1.5 Acres";
        status.textContent = "Compensation";

    }

    else if (surveyNumber === "SUR-1112") {

        owner.textContent = "Prakash More";
        area.textContent = "3.5 Acres";
        status.textContent = "Completed";
    }
}


/* VIEW LAND INFORMATION */

function viewSelectedGISParcel() {

    if (selectedGISParcel === "") {

        alert("Please select a land parcel from the map.");

        return;
    }

    localStorage.setItem(
        "selectedSurveyNumber",
        selectedGISParcel
    );

    window.location.href =
        "land_information.html";
}


/* RESET MAP */

function resetMap() {

    selectedGISParcel = "";

    document.getElementById("selectedGISSurvey")
        .textContent = "Select a parcel";

    document.getElementById("selectedGISOwner")
        .textContent = "-";

    document.getElementById("selectedGISArea")
        .textContent = "-";

    document.getElementById("selectedGISStatus")
        .textContent = "-";
}

/* =========================================
   DELAY DETECTION
========================================= */

function loadDelayDetection() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    if (savedLocation === null) {

        alert("Please search a location first.");

        window.location.href =
            "location_search.html";

        return;
    }

    const locationData =
        JSON.parse(savedLocation);


    document.getElementById("delayLocation")
        .textContent =
        locationData.village +
        ", " +
        locationData.district +
        ", " +
        locationData.state;


    document.getElementById("delayPurpose")
        .textContent =
        locationData.purpose;


    /* DEFAULT DELAY CASE */

    document.getElementById("delaySurvey")
        .textContent = "SUR-1025";

    document.getElementById("delayOwner")
        .textContent = "Rajesh Patil";

    document.getElementById("delayArea")
        .textContent = "2.5 Acres";

    document.getElementById("expectedDuration")
        .textContent = "60 Days";

    document.getElementById("actualDuration")
        .textContent = "78 Days";

    document.getElementById("delayDays")
        .textContent = "18 Days";

    document.getElementById("delayStage")
        .textContent = "Verification";

    document.getElementById("delayProgressText")
        .textContent = "57%";

    document.getElementById("delayProgressFill")
        .style.width = "57%";


    document.getElementById("delayReason")
        .textContent =
        "Document verification is taking longer than the expected processing time.";


    document.getElementById("delayRecommendation")
        .textContent =
        "Verify pending documents and notify the responsible authority to complete the verification process.";

}

/* =========================================
   NOTIFICATIONS
========================================= */

function loadNotifications() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    if (savedLocation === null) {

        alert("Please search a location first.");

        window.location.href =
            "location_search.html";

        return;
    }

    const locationData =
        JSON.parse(savedLocation);


    document.getElementById("notificationLocation")
        .textContent =
        locationData.village +
        ", " +
        locationData.district +
        ", " +
        locationData.state;


    document.getElementById("notificationPurpose")
        .textContent =
        locationData.purpose;


    document.getElementById("totalNotifications")
        .textContent = "5";


    document.getElementById("unreadNotifications")
        .textContent = "2";
}

/* =========================================
   GOVERNMENT AUTHORITY
========================================= */

function loadGovernmentAuthority() {

    const savedLocation =
        localStorage.getItem("bhoomiLocation");

    if (savedLocation === null) {

        alert("Please search a location first.");

        window.location.href =
            "location_search.html";

        return;
    }

    const locationData =
        JSON.parse(savedLocation);


    /* DISPLAY LOCATION */

    document.getElementById("authorityState")
        .textContent = locationData.state;

    document.getElementById("authorityDistrict")
        .textContent = locationData.district;

    document.getElementById("authorityTaluka")
        .textContent = locationData.taluka;

    document.getElementById("authorityVillage")
        .textContent = locationData.village;


    /* DISPLAY PURPOSE */

    document.getElementById("authorityPurpose")
        .textContent = locationData.purpose;


    /* DEFAULT AUTHORITY */

    document.getElementById("department")
        .textContent =
        "District Collector Office";

    document.getElementById("responsibleAuthority")
        .textContent =
        "District Collector";

    document.getElementById("acquisitionOfficer")
        .textContent =
        "Land Acquisition Officer";

    document.getElementById("officeLocation")
        .textContent =
        locationData.district +
        " District Collector Office";
}

function submitContact(event) {

    // Stop page refresh

    event.preventDefault();


    // Get form values

    const name =
        document.getElementById("contactName").value;

    const email =
        document.getElementById("contactEmail").value;

    const subject =
        document.getElementById("contactSubject").value;

    const message =
        document.getElementById("contactMessage").value;


    // Check fields

    if (
        name === "" ||
        email === "" ||
        subject === "" ||
        message === ""
    ) {

        alert("Please fill all fields.");

        return;
    }


    // Prototype success message

    alert(
        "Thank you, " +
        name +
        "!\n\nYour message has been submitted successfully."
    );


    // Clear form

    document.getElementById("contactName").value = "";

    document.getElementById("contactEmail").value = "";

    document.getElementById("contactSubject").value = "";

    document.getElementById("contactMessage").value = "";

}

