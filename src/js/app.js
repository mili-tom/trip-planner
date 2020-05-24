const APIkeyWinTransit = 'eM0x2PJKCyqqY7BOlun';
const APIkeyMapbox = 'pk.eyJ1IjoibWlsaXRvbSIsImEiOiJja2E2YmtpN2cwNmhzMnlvejA0cm5kamtpIn0.DvZmdFkPPyBWuuW-TgOpTw';
const geoBorderWinnipeg = '-97.325875, 49.766204, -96.953987, 49.99275';

const ulElem = document.querySelectorAll('ul.origins, ul.destinations');
const formElem = document.querySelectorAll('form');
const ulTripElem = document.querySelector('.my-trip');

formElem.forEach(element => element.addEventListener('submit', function(event) {
  const input = event.target.querySelector('input');
  const point = event.target.closest('form').className.slice(0,-5);

  if (input.value.length > 0) {
    findLocation(input.value, point);
  }

  event.preventDefault();
}))

function findLocation(query, point) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=10&bbox=${geoBorderWinnipeg}&access_token=${APIkeyMapbox}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      deletePreviousSearch(point);
      data.features.forEach(location => {
        displayLocations(location, point);
      })
    });  
}

function deletePreviousSearch(point) {
  ulElem.forEach(element => {
    if (element.className.includes(point)) {
      element.innerHTML = '';
    }
  })
}

function displayLocations(location, point) {
  ulElem.forEach(element => {      
    if (element.className.includes(point)) {
      element.insertAdjacentHTML('beforeend',
        `<li data-long=${location.center[0]} data-lat=${location.center[1]}>
          <div class="name">${location.text}</div>
          <div>${location.properties.address}</div>
        </li>`
      )
    }
  });
}

ulElem.forEach(element => element.addEventListener('click', function(event) {
  const selectedLocation = event.target.closest('li');
  const parentElem = selectedLocation.closest('ul');
    
  if (selectedLocation !== null) {
    const siblingsElem = getAllSiblings(selectedLocation, parentElem);
  
    selectedLocation.classList.add('selected');
    siblingsElem.forEach(ele => ele.classList.remove('selected'));

    const selectedOrigLocation = document.querySelector(`.origins > .selected`);  
    const selectedDestLocation = document.querySelector(`.destinations > .selected`);
    
    getGeoData(selectedOrigLocation, selectedDestLocation);
  }
}))
  
//source: https://stackoverflow.com/questions/4378784/how-to-find-all-siblings-of-the-currently-selected-dom-object
//function takes two parameters (element and its parent) and based on that makes array of all elements that are children of selected element's parent (in this case all <li> inside of <ul>); then it filters that array and returns array of all sibling elements (just element itself is excluded from array)
function getAllSiblings(element, parent) {
  const children = [...parent.children];
  return children.filter(child => child !== element);
}

function getGeoData(start, end) {
  let originLong, originLat, destLong, destLat = '';

  if (start !==null && end !== null) {
    originLong = start.dataset.long;
    originLat = start.dataset.lat;
    destLong = end.dataset.long;
    destLat = end.dataset.lat;
  }

  if (originLong !== undefined && originLat !== undefined && destLong !== undefined && destLat !== undefined) {
    console.log(originLong, originLat, destLong, destLat);
    planTrip(originLong, originLat, destLong, destLat);
  }
}

function planTrip(originlong, originLat, destLong, destLat) {
  const buttonElem = document.querySelector('.plan-trip');
  buttonElem.addEventListener('click' , function() {
    fetch(`https://api.winnipegtransit.com/v3/trip-planner.json?origin=geo/${originLat},${originlong}&destination=geo/${destLat},${destLong}&usage=long&api-key=${APIkeyWinTransit}`)
      .then(response => response.json())
      .then(data => {
        if (data.plans.length > 0) {
          console.log(data.plans[0].segments);
          deletePreviousPlan();
          data.plans[0].segments.forEach(step => displayPlan(step));
        } else {
          ulTripElem.innerHTML = 'Unavailable at the moment.'
        }
      });  
  })
}

function deletePreviousPlan() {
  ulTripElem.innerHTML = '';
}

function displayPlan(step) {
  ulTripElem.insertAdjacentHTML('beforeend', 
    `<li>
      <i class="${setIcon(step.type)}" aria-hidden="true"></i>
      ${setText(step)}
    </li>`)
}