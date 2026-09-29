// =====================================
// BHOOMI TREK - LAND INFORMATION
// =====================================


// Land Information Form

document.getElementById("landForm")
.addEventListener("submit", function(event) {

    // Prevent page refresh
    event.preventDefault();


    // Get values

    let ownerName =
        document.getElementById("ownerName").value;

    let surveyNumber =
        document.getElementById("surveyNumber").value;

    let village =
        document.getElementById("village").value;

    let projectName =
        document.getElementById("projectName").value;


    // Display success message

    alert(
        "✅ Land Information Saved Successfully!\n\n" +

        "Owner Name: " + ownerName + "\n" +

        "Survey Number: " + surveyNumber + "\n" +

        "Village: " + village + "\n" +

        "Project: " + projectName
    );


    // Reset form

    document.getElementById("landForm").reset();

});



// Login Button

function login() {

    alert(
        "🔐 Login Module\n\n" +
        "Admin and Landowner login will be available soon."
    );

}
