document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("jobListingsTableBody");
  firebase.auth().onAuthStateChanged(async function(user) {
    try {
      const now = new Date();
      const querySnapshot = await db.collection("jobPost")
        .where("deadline", ">", now)
        .get();
      if (querySnapshot.empty) {
        tableBody.innerHTML = "<tr><td colspan='5'>No job listings available.</td></tr>";
        return;
      }
      querySnapshot.forEach(function(doc) {
        const job = doc.data();
        const jobId = doc.id;
        const row = document.createElement("tr");
        // very very similar logic to admin-posts.js
        row.innerHTML = `
          <td>${job.title || "No Title Found"}</td>
          <td>${job.company || "Company Unknown"}</td>
          <td>${job.location || "Location Unknown"}</td>
          <td>${job.deadline.toDate().toLocaleDateString()}</td>
          <td><button data-job-id="${jobId}">Apply Now</button></td>
        `;
        row.querySelector("button").addEventListener("click", async function() {
          try {
            const userDoc = await db.collection("users").doc(user.uid).get();
            if (!userDoc.exists) {
              alert("User profile not found.");
              return;
            }
            const userData = userDoc.data();
            const resumeUrl = userData.resumeUrl;
            const name = userData.name;
            const email = userData.email;
            if (!resumeUrl || !name || !email) {
              alert("Account is missing a resume, name, or email. Please contact support.");
              return;
            }
            await db.collection("applications").add({
              job_id: jobId,
              resume: resumeUrl,
              status: "Submitted",
              userID: user.uid,
              name: name,
              email: email,
              appliedAt: new Date()
            });
            alert("Application submitted successfully!");
          } catch (error) {
            console.error("Error submitting application:", error);
            alert("Error submitting application. Please try again.");
          }
        });
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching job listings:", error);
      tableBody.innerHTML = "<tr><td colspan='5'><strong>Error loading job listings.</strong></td></tr>";
    }
  });
});
