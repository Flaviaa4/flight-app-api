import {options } from "./config.js";

// Variables for airports data
let airportsData = [];
let filteredData = [];

// Initial current page
let currentPage = 1;

// Default rows per page
const resultsPerPage = 10;

// Query
const query = "/api/airports";

// Fetch airports data on load
window.addEventListener('DOMContentLoaded', () => {
  fetch(query, options)
    .then(res => res.json())
    .then(data => {
        // Check if the result is not empty
      airportsData = (data && data.data) ? data.data : [];
      filteredData = [...airportsData];
      currentPage = 1;
      // Display data in table
      renderTable();
      // Paginate
      renderPagination();
    })
    .catch(err => {
      document.getElementById('results').innerHTML = '<p>Error loading airport data.</p>';
    }
);
});

// Filtering data
function filterData(query) {
  const lower = query.toLowerCase();
  // Filter data based on several conditions
  filteredData = airportsData.filter(a =>
    (a.airport_name && a.airport_name.toLowerCase().includes(lower)) ||
    (a.iata_code && a.iata_code.toLowerCase().includes(lower)) ||
    (a.country_name && a.country_name.toLowerCase().includes(lower)) ||
    (a.city_iata_code && a.city_iata_code.toLowerCase().includes(lower))
  );
  currentPage = 1;
  renderTable();
  renderPagination();
}

// Function to sort data
function sortData(sortValue) {
  const [field, dir] = sortValue.split("-");
  filteredData.sort((a, b) => {
    let va = a[field] || "";
    let vb = b[field] || "";
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
  });
  currentPage = 1;
  renderTable();
  renderPagination();
}

function renderTable() {
  const start = (currentPage - 1) * resultsPerPage;
  const end = start + resultsPerPage;
  // Slice the filtered data
  const data = filteredData.slice(start, end);

  // Initialize results div
  const container = document.getElementById('results');
  container.innerHTML = "";

  // No results found
  if (data.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  // Display returned data into table
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Airport</th>
        <th>IATA</th>
        <th>ICAO</th>
        <th>City Code</th>
        <th>Country</th>
        <th>Timezone</th>
        <th>Latitude</th>
        <th>Longitude</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(airport => `
        <tr>
          <td>${airport.airport_name}</td>
          <td>${airport.iata_code}</td>
          <td>${airport.icao_code}</td>
          <td>${airport.city_iata_code}</td>
          <td>${airport.country_name}</td>
          <td>${airport.timezone}</td>
          <td>${airport.latitude}</td>
          <td>${airport.longitude}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  container.appendChild(table);
}

// Function to paginate
function renderPagination() {

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / resultsPerPage);
  // Pagination DOM
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";

  // Hide pagination when pages are lesser than 1
  if (totalPages <= 1) return;

  // Loop through pages
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = (i === currentPage) ? "active" : "";
    // Change pagination
    btn.addEventListener('click', () => {
      currentPage = i;
      renderTable();
      renderPagination();
    });
    pagination.appendChild(btn);
  }
}

// Event listeners
document.getElementById('filterInput').addEventListener('input', (e) => {
  filterData(e.target.value);
});

document.getElementById('sortDropdown').addEventListener('change', (e) => {
  sortData(e.target.value);
});
