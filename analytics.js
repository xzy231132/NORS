import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from './firebase-config.mjs';

// utility: Format Firestore Timestamp to YYYY-MM-DD
function formatDate(ts) {
  const date = ts.toDate();
  return date.toISOString().split('T')[0];
}

// graph 1: Total Registrations Over Time
async function drawUserRegistrationsChart() {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const dateCounts = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.createdAt) {
        const date = formatDate(data.createdAt);
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });

    const labels = Object.keys(dateCounts).sort();
    const data = labels.map(date => dateCounts[date]);

    new Chart(document.getElementById('userRegistrationsChart').getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'User Registrations',
          data,
          fill: false,
          borderColor: 'blue',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'User Registrations Over Time'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } catch (err) {
    console.error("Error drawing user registrations chart:", err);
  }
}

// graph 2: Active vs. Inactive Users
async function drawActiveUsersChart() {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    let active = 0, inactive = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.active === true) active++;
      else inactive++;
    });

    new Chart(document.getElementById('activeUsersChart').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          label: 'User Activity',
          data: [active, inactive],
          backgroundColor: ['#4CAF50', '#9E9E9E']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Active vs Inactive Users'
          }
        }
      }
    });
  } catch (err) {
    console.error("Error drawing active users chart:", err);
  }
}

// run all charts
drawUserRegistrationsChart();
drawActiveUsersChart();
