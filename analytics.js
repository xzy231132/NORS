
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, where, Timestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utility: Format Firestore Timestamp to YYYY-MM-DD
function formatDate(ts) {
  const date = ts.toDate();
  return date.toISOString().split('T')[0];
}

// Graph 1: Total Registrations Over Time
async function drawUserRegistrationsChart() {
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
}

// Graph 2: Active vs. Inactive Users
async function drawActiveUsersChart() {
  const snapshot = await getDocs(collection(db, "users"));
  let active = 0, inactive = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.lastLogin) {
      const lastLoginDate = data.lastLogin.toDate();
      const daysSinceLogin = (new Date() - lastLoginDate) / (1000 * 60 * 60 * 24);
      daysSinceLogin < 30 ? active++ : inactive++;
    } else {
      inactive++;
    }
  });

  new Chart(document.getElementById('activeUsersChart').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Active (<30 days)', 'Inactive'],
      datasets: [{
        data: [active, inactive],
        backgroundColor: ['green', 'red']
      }]
    }
  });
}

// Graph 3: Post Category Breakdown
async function drawInputCategoriesChart() {
  const snapshot = await getDocs(collection(db, "posts"));
  const categoryCounts = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const category = data.category || "Uncategorized";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const labels = Object.keys(categoryCounts);
  const data = labels.map(l => categoryCounts[l]);

  new Chart(document.getElementById('inputCategoriesChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Post Categories',
        data,
        backgroundColor: 'orange'
      }]
    }
  });
}

// Graph 4: Post Trend Over Time
async function drawTimeTrendChart() {
  const snapshot = await getDocs(collection(db, "posts"));
  const postDates = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.createdAt) {
      const date = formatDate(data.createdAt);
      postDates[date] = (postDates[date] || 0) + 1;
    }
  });

  const labels = Object.keys(postDates).sort();
  const data = labels.map(date => postDates[date]);

  new Chart(document.getElementById('timeTrendChart').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Posts Over Time',
        data,
        borderColor: 'purple',
        fill: false
      }]
    }
  });
}

// Graph 5: Most Used Features (simulated by page visits or category usage)
async function drawTopFeaturesChart() {
  const snapshot = await getDocs(collection(db, "usageLogs")); // Assume usageLogs has feature usage logs
  const featureCounts = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const feature = data.feature || "unknown";
    featureCounts[feature] = (featureCounts[feature] || 0) + 1;
  });

  const labels = Object.keys(featureCounts);
  const data = labels.map(l => featureCounts[l]);

  new Chart(document.getElementById('topFeaturesChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Feature Usage',
        data,
        backgroundColor: 'skyblue'
      }]
    }
  });
}

// Load All Charts
window.addEventListener('load', () => {
  drawUserRegistrationsChart();
  drawActiveUsersChart();
  drawInputCategoriesChart();
  drawTimeTrendChart();
  drawTopFeaturesChart();
});
