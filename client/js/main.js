let trips = [];

async function fetchTrips() {
  try {
    const response = await fetch('http://127.0.0.1:5000/travels/getAllTravels');

    if (response.ok) {
      const data = await response.json();
      trips = data;
      console.log(trips);
      showTrips(trips);
    } else {
      console.error('Error fetching trips:', response.statusText);
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

const cities = [
  "Jerusalem", "Tel Aviv", "Haifa", "Rishon Lezion", "Petah Tikva", "Ashdod", "Netanya",
  "Beer Sheva", "Holon", "Ramat Gan", "Ashkelon", "Rehovot", "Bet Shemesh", "Herzliya",
  "Kfar Saba", "Hadera", "Modi'in-Maccabim-Re'ut", "Bat Yam", "Nahariya", "Kiryat Ata",
  "Kiryat Gat", "Ra'anana", "Ramla", "Lod", "Afula", "Karmiel", "Tiberias", "Eilat",
  "Acre", "Safed", "Dimona", "Yavne", "Nes Ziona", "Arad", "Rosh HaAyin", "Kiryat Motzkin",
  "Kiryat Bialik", "Kiryat Yam", "Yokneam", "Nof HaGalil", "Ramat Hasharon", "Zichron Yaakov",
  "Kiryat Shmona", "Kiryat Malakhi", "Beit She'an", "Ma'ale Adumim", "Kiryat Arba", "Modiin"
];

document.addEventListener('DOMContentLoaded', () => {
  fetchTrips(); // קריאה לפונקציה כשהדף נטען
});

function showTrips(trips) {
  const accordionContainer = document.getElementById('trip-accordion-container');
  const paginationContainer = document.getElementById('pagination-container');
  let currentPage = 1;
  const itemsPerPage = 5;

  const displayTrips = (tripsToDisplay) => {
    accordionContainer.innerHTML = '';
    tripsToDisplay.forEach((trip, index) => {
      const accordionItem = document.createElement('div');
      accordionItem.className = 'accordion-item';
      accordionItem.innerHTML = `
      <h2 class="accordion-header" id="heading-${index}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="false" aria-controls="collapse-${index}">
      <i class="fas fa-car vehicle-icon"></i>
      ${trip.startPoint} <i class="fas fa-arrow-right mx-2"></i> ${trip.endPoint}
      </button>
      </h2>
      <div id="collapse-${index}" class="accordion-collapse collapse" aria-labelledby="heading-${index}" data-bs-parent="#trip-accordion-container">
      <div class="accordion-body">
      <p><i class="bi bi-clock-fill"></i> <strong>Time:</strong> &nbsp; ${formatToNormalDate(trip.date, trip.time)}</p>
      <p><i class="fas fa-chair"></i> <strong>Seats Available:</strong> &nbsp;  ${trip.seatsAvailable}</p>
      <p><i class="fas fa-shekel-sign"></i> <strong>Cost:</strong> &nbsp; ${trip.cost}₪</p>
      <button class="btn btn-primary btn-sm d-flex align-items-center" style="background-color: rgb(79, 115, 137); color: white; border: none;" data-bs-toggle="modal" data-bs-target="#driverDetailsModal-${index}">
        <i class="bi bi-person-circle me-2"></i> Driver Details
      </button>
      </div>
      </div>

      <!-- Modal for Driver Details -->
      <div class="modal fade" id="driverDetailsModal-${index}" tabindex="-1" aria-labelledby="driverDetailsModalLabel-${index}" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="driverDetailsModalLabel-${index}">Driver Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p><i class="fas fa-user me-2"></i><strong>Name:</strong> ${trip.driverName}</p>
        <p><i class="fas fa-phone-alt me-2"></i><strong>Phone:</strong> ${trip.driverPhone}</p>
        <p><i class="fas fa-envelope me-2"></i><strong>Email:</strong> ${trip.driverEmail}</p>
        <button class="btn btn-primary btn-sm" onclick="window.location.href='mailto:${trip.driverEmail}'">
          <i class="fas fa-envelope me-2"></i> Send Email
        </button>
          <button class="btn btn-success btn-sm" onclick="window.location.href='tel:${trip.driverPhone}'">
          <i class="fas fa-phone me-2"></i> Call
        </button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
      </div>
      </div>
      </div>
      </div>`;
      accordionContainer.appendChild(accordionItem);
    });
  };
  displayTrips(trips);


  const paginateTrips = (trips) => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const tripsToDisplay = trips.slice(start, end);
    displayTrips(tripsToDisplay);
  };

  const displayPagination = (trips) => {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(trips.length / itemsPerPage);
    if (currentPage > 1) {
      const prevButton = document.createElement('button');
      prevButton.className = 'btn btn-primary d-flex align-items-center me-1';
      prevButton.innerHTML = `<i class="fas fa-chevron-left me-2"></i> Previous`;
      prevButton.addEventListener('click', () => {
        currentPage--;
        paginateTrips(trips);
        displayPagination(trips);
      });
      paginationContainer.appendChild(prevButton);
      prevButtonAdded = true;
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.className = 'btn btn-primary d-flex align-items-center ms-1';
      nextButton.innerHTML = `Next <i class="fas fa-chevron-right ms-2"></i>`;
      nextButton.addEventListener('click', () => {
        currentPage++;
        paginateTrips(trips);
        displayPagination(trips);
      });
      paginationContainer.appendChild(nextButton);
      nextButtonAdded = true;
    }

    paginateTrips(trips);
  };

  document.querySelector('#Search').addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();
    const filteredTrips = trips.filter((trip) =>
      trip.startPoint.toLowerCase().includes(searchTerm) ||
      trip.endPoint.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    paginateTrips(filteredTrips);
    displayPagination(filteredTrips);
  });

  paginateTrips(trips);
  displayPagination(trips);
}


function formatToNormalDate(dateString, timeString) {
  const date = new Date(dateString);
  if (isNaN(date)) {
    console.error("Invalid date format:", dateString);
    return "Invalid date";
  }
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const timeParts = timeString.split(" ");
  const days = parseInt(timeParts[0]);
  const hours = parseInt(timeParts[2]);
  const minutes = parseInt(timeParts[4]);
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  const formattedHours = String(date.getHours()).padStart(2, '0');
  const formattedMinutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${formattedHours}:${formattedMinutes}`;
}

document.getElementById('openCardButton').addEventListener('click', function () {
  const card = document.getElementById('tripCard');
  const overlay = document.getElementById('overlay');
  if (card.style.display === 'none') {
    card.style.display = 'block';
    overlay.style.display = 'block';
  } else {
    card.style.display = 'none';
    overlay.style.display = 'none';
  }
});

document.getElementById('overlay').addEventListener('click', function () {
  const card = document.getElementById('tripCard');
  const overlay = document.getElementById('overlay');
  card.style.display = 'none';
  overlay.style.display = 'none';
});

const destinationSelect = document.getElementById("destination");
const sourceSelect = document.getElementById("source");

cities.forEach(city => {
  const option = document.createElement("option");
  option.value = city;
  option.textContent = city;
  destinationSelect.appendChild(option);
});


cities.forEach(city => {
  const option = document.createElement("option");
  option.value = city;
  option.textContent = city;
  sourceSelect.appendChild(option);
});

document.addEventListener("DOMContentLoaded", function () {
  const volunteerRadios = document.querySelectorAll('input[name="volunteerType"]');
  const priceField = document.getElementById("priceField");

  volunteerRadios.forEach(radio => {
    radio.addEventListener("change", function () {
      if (document.getElementById("addVolunteer").checked) {
        priceField.style.display = "none";
      } else {
        priceField.style.display = "block";
      }
    });
  });

  if (document.getElementById("addVolunteer").checked) {
    priceField.style.display = "none";
  } else {
    priceField.style.display = "block";
  }
});


const volunteerCheckbox = document.getElementById('volunteer');
const priceField = document.getElementById('priceFieldElement');
const filtersButton = document.getElementById('filterButton')
volunteerCheckbox.addEventListener('change', function () {
  if (this.checked) {
    priceField.style.display = 'none';
    filtersButton.style.marginTop = '5%'
  } else {
    priceField.style.display = 'block';
  }
});

const priceRange = document.getElementById('price');
const priceValue = document.getElementById('priceValue');
priceRange.value = 100;
priceValue.textContent = 'All';


priceRange.addEventListener('input', function () {
  priceValue.textContent = priceRange.value;
});

document.addEventListener('DOMContentLoaded', () => {
  const filterButton = document.getElementById('filterButton');
  filterButton.addEventListener('click', applyFilters);
});

function applyFilters() {
  const sourceSelect = document.getElementById('source');
  const destinationSelect = document.getElementById('destination');
  const seatsSelect = document.getElementById('seats');
  const selectedVehicle = document.querySelector('input[name="vehicleType"]:checked');
  const volunteerCheckbox = document.getElementById('volunteer');
  const priceRange = document.getElementById('price');
  const timeFilter = document.getElementById('timeFilter');

  const isVolunteer = volunteerCheckbox.checked;
  const maxPrice = Number(priceRange.value);
  const selectedTime = timeFilter.value;

  const selectedSource = sourceSelect.value || null;
  const selectedDestination = destinationSelect.value || null;
  const selectedSeats = seatsSelect.value || 1;

  const filteredTrips = trips.filter((trip) => {
    const matchesSource = selectedSource ? trip.startPoint.toLowerCase() === selectedSource.toLowerCase() : true;
    const matchesDestination = selectedDestination ? trip.endPoint.toLowerCase() === selectedDestination.toLowerCase() : true;
    const matchesSeats = selectedSeats ? trip.seatsAvailable >= selectedSeats : true;
    const matchesVehicle = selectedVehicle && selectedVehicle.value !== 'All' ? trip.vehicleType === selectedVehicle.value : true;
    const matchesVolunteer = isVolunteer ? trip.cost == 0 : true;
    const matchesPrice = maxPrice ? trip.cost <= maxPrice : true;

    let matchesTime = true;
    const tripDate = new Date(`${trip.date}T${trip.time}Z`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    if (selectedTime === 'today') {
      matchesTime = tripDate.toDateString() === today.toDateString();
    }
    else if (selectedTime === 'this-week') {
      matchesTime = tripDate >= startOfWeek && tripDate <= today;
    }
    else if (selectedTime === 'this-month') {
      matchesTime = tripDate.getFullYear() === today.getFullYear() && tripDate.getMonth() === today.getMonth();
    }
    else if (selectedTime === 'all') {
      matchesTime = true;
    }

    return matchesSource && matchesDestination && matchesSeats && matchesVehicle && matchesVolunteer && matchesPrice && matchesTime;
  });
  showTrips(filteredTrips);
}

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', function () {
  document.getElementById('source').selectedIndex = 0;
  document.getElementById('destination').selectedIndex = 0;
  document.getElementById('timeFilter').selectedIndex = 0;
  document.getElementById('seats').value = 1;
  document.getElementById('allVehicle').checked = true;
  document.getElementById('volunteer').checked = false;
  document.getElementById('price').value = 100;
  document.getElementById('priceValue').textContent = "All";
  showTrips(trips);
});


document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const source = document.getElementById("addSource").value;
  const destination = document.getElementById("addDestination").value;
  const tripDate = document.getElementById("tripDate").value;
  const tripTime = document.getElementById("tripTime").value;
  const vehicleType = document.querySelector('input[name="addVehicleType"]:checked').value;
  const seats = document.getElementById("addSeats").value;
  const isVolunteer = document.querySelector('input[name="volunteerType"]:checked').value;
  const price = document.getElementById("AddPrice").value;

  const tripData = {
    source: source,
    destination: destination,
    tripDate: tripDate,
    tripTime: tripTime,
    vehicleType: vehicleType,
    seats: seats,
    isVolunteer: isVolunteer,
    price: isVolunteer === "volunteer" ? 0 : price
  };

  fetch('http://127.0.0.1:5000/travels/addTravel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(tripData)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to add trip');
      }
    })
    .then(data => {
      console.log(data);
      document.querySelector("form").reset();
      const card = document.getElementById('tripCard');
      const overlay = document.getElementById('overlay');
      const travelAdded = document.getElementById('travelAdded')
      travelAdded.style.display = 'block';
      setTimeout(function () {
        card.style.display = 'none';
        overlay.style.display = 'none';
        travelAdded.style.display = 'none';
      }, 2000);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to add trip');
    });
});

