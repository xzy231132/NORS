import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore, collection, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
          backgroundColor: ['green', 'gray']
        }]
      }
    });
  } catch (err) {
    console.error("Error drawing active users chart:", err);
  }
}

// graph 3 post categories breakdown
async function drawPostCategoriesChart() {
  try {
    const snapshot = await getDocs(collection(db, "jobPosts"));
    const categoryCounts = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const category = data.category || "Uncategorized";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const labels = Object.keys(categoryCounts);
    const data = labels.map(label => categoryCounts[label]);

    new Chart(document.getElementById('postCategoriesChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Job Post Categories',
          data,
          backgroundColor: 'orange'
        }]
      }
    });
  } catch (err) {
    console.error("Error drawing post categories chart:", err);
  }
}

// graph 4 job posts over time
async function drawPostTrendChart() {
  try {
    const snapshot = await getDocs(collection(db, "jobPosts"));
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

    new Chart(document.getElementById('postTrendChart').getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Job Posts Over Time',
          data,
          fill: false,
          borderColor: 'green',
          tension: 0.1
        }]
      }
    });
  } catch (err) {
    console.error("Error drawing post trend chart:", err);
  }
}

// load graphs 
window.addEventListener('DOMContentLoaded', () => {
  drawUserRegistrationsChart();
  drawActiveUsersChart();
  drawPostCategoriesChart();
  drawPostTrendChart();
});
