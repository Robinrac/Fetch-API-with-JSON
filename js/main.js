let holidays = [];

// Get elements by ID
const searchInput = document.getElementById('search-input');
const yearSelect = document.getElementById('year-select');
const countrySelect = document.getElementById('country-select');
const searchButton = document.getElementById('search-button');
const dataContainer = document.getElementById('data-container');

// Create Const from specified year + adds 5 years from current year
// This allows the user to filter date from 5 years into the future
const currentYear = new Date().getFullYear();
const endYear = currentYear + 5;

// This code creates a loop that iterates from the variable "currentYear" to the variable "endYear" (inclusive).
// In each iteration, it creates a new "option" HTML element, sets its "value" and "text" properties to the current iteration number (i.e. the current year),
// and appends the option to an HTML element with the variable name "yearSelect"
// It creates options for a select/dropdown list for years starting from currentYear to endYear
for (let i = currentYear; i <= endYear; i++) {
  let option = document.createElement("option");
  option.value = i.toString();
  option.text = i.toString();
  yearSelect.appendChild(option);
}

// Adds an eventListener which filters and displays the holidays fetched from https://date.nager
// The following filters are: By name, year and by country.
searchButton.addEventListener('click', () => {

    let searchTerm = searchInput.value.toLowerCase();                       // Get seachInput value and convert to lower case
    let selectedYear = yearSelect.value;                                    // Get yearSelect Value
    let selectedCountry = countrySelect.value;                              // Get countrySelect Value
    
    let filteredData = holidays.filter(holiday =>                           // Filters "holidays" using filter method,
        (holiday.name.toLowerCase().includes(searchTerm) || !searchTerm)    // checking previous Values and stores in filteredData variable
        && (holiday.date.includes(selectedYear) || !selectedYear)
        && (holiday.countryCode === selectedCountry || !selectedCountry)
    );

    // Loops through holiday library creating strings displaying holidays with their respective properties
    let dataHtml = '';
    filteredData.forEach(holiday => {
        dataHtml += `<tr><td>${holiday.countryCode}</td><td>${holiday.name}</td><td>${holiday.date}</td></tr>`;
        });

    // Appends "dataHtml" to "holiday-table-body"'s table element
    dataContainer.querySelector('#holiday-table-body').innerHTML = dataHtml;
});

// Clear filters button
// Sets all filter values to default 
document.getElementById("clear-filters-button").addEventListener("click", () => {
  searchInput.value = "";
  yearSelect.value = "";
  countrySelect.value = "";
});

// Function "fetchHolidays" retrieves list of holidays from external API https://date.nager.at/Api/v2/PublicHolidays/
function fetchHolidays(year, countryCode) {
  fetch(`https://date.nager.at/Api/v2/PublicHolidays/${year}/${countryCode}`)   // Fetch data with year and countryCode parameters
  .then(response => response.json())                                            // Response in form of JSON which is then parsed into JS object
  .then(data => {                                                               
    holidays = holidays.concat(data);                                           // Data stored in array "holidays"
  })
  .catch(error => {                                                             // If request fails error message appears
    console.log('Error:', error);
    document.getElementById("loading").innerHTML = "Error: Failed to fetch data";
  });
}

// Retrieves list of holidays for current year of following countries:
// Adds data to holidays array by calling function fetchHolidays
for (let i = currentYear; i <= endYear; i++) {
  fetchHolidays(i, 'US');
  fetchHolidays(i, 'CA');
  fetchHolidays(i, 'GB');
  fetchHolidays(i, 'SE');
  fetchHolidays(i, 'PL');
  fetchHolidays(i, 'ES');
  fetchHolidays(i, 'CH');
}