// Attach submit event to the flight search form
 document.getElementById('flightForm').addEventListener('submit', function (e) {
      e.preventDefault();

      const searchButton = document.getElementById('searchButton');
      searchButton.textContent = 'Searching...';
      searchButton.classList.add('loading');
      // Extract and prepare values from the form inputs
      const airline = document.getElementById('airline').value.trim().toUpperCase();
      const flightNumber = document.getElementById('flightNumber').value.trim();
      const flightDateRaw = new Date(document.getElementById('flightDate').value);
      const flightDate = flightDateRaw.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const departure = document.getElementById('departure').value.trim().toUpperCase();
      const arrival = document.getElementById('arrival').value.trim().toUpperCase();
      // Building the query URL to backend proxy endpoint
      const query = `/api/flights?airline_iata=${airline}&flight_number=${flightNumber}&dep_iata=${departure}&arr_iata=${arrival}`;

      // Fetch flight data from backend
      fetch(query)
        .then(response => response.json())
        .then(data => {
          const resultsContainer = document.getElementById('results');
          const detailsContainer = document.getElementById('flightDetails');
          resultsContainer.innerHTML = '';
          detailsContainer.innerHTML = '';
          // Check if any flight data was returned
          if (data && data.data && data.data.length > 0) {
            // Filter flights by exact date and route match
            const filtered = data.data.filter(flight => {
              return flight.flight_date === flightDate &&
                     flight.departure.iata === departure &&
                     flight.arrival.iata === arrival;
            });
            // If we have valid filtered results, show them in a table
            if (filtered.length > 0) {
              const table = document.createElement('table');
              table.innerHTML = `
                <thead>
                  <tr>
                    <th>Airline</th>
                    <th>Flight</th>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    ${filtered.map((flight, index) => `
                    <tr>
                      <td>${flight.airline.name}</td>
                      <td>${flight.flight.iata}</td>
                      <td>${flight.flight_date}</td>
                      <td>${flight.departure.iata}</td>
                      <td>${flight.arrival.iata}</td>
                      <td>${flight.flight_status}</td>
                      <td><button class="view-button" data-index="${index}">View</button></td>
                    </tr>
                  `).join('')}
                </tbody>
              `;
              resultsContainer.appendChild(table);
              // Attach event to view buttons for showing flight details
              document.querySelectorAll('.view-button').forEach(button => {
                button.addEventListener('click', (event) => {
                  const idx = event.target.getAttribute('data-index');
                  const flight = filtered[idx];
                  // Render detailed flight info in a card
                  detailsContainer.innerHTML = `
                    <div class="card" id="details">
                      <h3>Flight Details</h3>
                      <p><strong>Airline:</strong> ${flight.airline.name} (${flight.airline.iata})</p>
                      <p><strong>Flight Number:</strong> ${flight.flight.iata}</p>
                      <p><strong>Aircraft:</strong> ${flight.aircraft ? flight.aircraft.icao || 'N/A' : 'N/A'}</p>
                      <p><strong>Departure:</strong> ${flight.departure.airport} (${flight.departure.iata}), Terminal: ${flight.departure.terminal || 'N/A'}, Gate: ${flight.departure.gate || 'N/A'}, Scheduled: ${flight.departure.scheduled || 'N/A'}</p>
                      <p><strong>Arrival:</strong> ${flight.arrival.airport} (${flight.arrival.iata}), Terminal: ${flight.arrival.terminal || 'N/A'}, Gate: ${flight.arrival.gate || 'N/A'}, Scheduled: ${flight.arrival.scheduled || 'N/A'}</p>
                      <p><strong>Status:</strong> ${flight.flight_status}</p>
                    </div>
                    <a href="#details">⬆️ Jump to Flight Details</a>
                  `;
                });
              });
            } else {
              resultsContainer.innerHTML = '<p>No results found for the selected date and route.</p>';
            }
          } else {
            resultsContainer.innerHTML = '<p>No results found for your criteria.</p>';
          }
        })
        .catch(err => {
          console.error(err);
          document.getElementById('results').innerHTML = '<p>Error fetching flight data.</p>';
        }).finally(() => {
          // Restoring search button state
          searchButton.textContent = 'Search Flight';
          searchButton.classList.remove('loading');
        });
    });