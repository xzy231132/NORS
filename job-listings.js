document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("jobListingsTableBody");
  firebase.auth().onAuthStateChanged(async function(user) {
    try {
      // you have to format the date to a YYYY-MM-DD string to match the data in firestore
      const today = new Date().toISOString().split('T')[0];
      const querySnapshot = await db.collection("jobPost")
        .where("deadline", ">=", today)
        .get();
      if (querySnapshot.empty) {
        tableBody.innerHTML = "<tr><td colspan='5'>No job listings available.</td></tr>";
        return;
      }
      querySnapshot.forEach(function(doc) {
        const job = doc.data();
        const jobId = doc.id;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${job.title || "No Title Found"}</td>
          <td>${job.company || "Company Unknown"}</td>
          <td>${job.location || "Location Unknown"}</td>
          <td>${new Date(job.deadline).toLocaleDateString()}</td>
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
            if (!name || !email) {
              alert("Please ensure your account has a name and an email.");
              return;
            }
            await db.collection("applications").add({
              job_id: jobId,
              resume: resumeUrl || null,
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
