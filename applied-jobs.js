document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById('appliedJobsContainer');
  firebase.auth().onAuthStateChanged(function(user) {
    db.collection("applications")
      .where("userID", "==", user.uid)
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.empty) {
          container.innerHTML = "<p>You haven't applied to any jobs yet.</p>";
          return;
        }
        let html = "<ul>";
        const promises = [];
        querySnapshot.forEach(function(doc) {
          const data = doc.data();
          const jobId = data.job_id;
          const status = data.status || "Pending";
          // because this is NoSQL this is going to look weird:
          // search jobPosts for the document with job_id
          // get this document, check to make sure it exists, then find the job title or assign a default
          // then add the job title and your application status to a new line
          const newPromise = db.collection("jobPosts").doc(jobId).get().then(function(jobDoc) {
            const jobTitle = jobDoc.exists ? jobDoc.data().title : "Job Title Missing";
            html += `<li><strong>${jobTitle}</strong> — Status: ${status}</li>`;
          });
          // push newPromise to the array of promises and then for each one of them spit out a row
          // with the new info
          promises.push(newPromise);
        });
        Promise.all(promises).then(function() {
          html += "</ul>";
          container.innerHTML = html;
        });
      })
      .catch(function(error) {
        console.error("Error fetching applications:", error);
        container.innerHTML = "<p>Error loading applications. Try again later.</p>";
      });
  });
});
