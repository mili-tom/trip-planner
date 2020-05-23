const APIkeyWinTransit = 'eM0x2PJKCyqqY7BOlun';
const APIkeyMapbox = 'pk.eyJ1IjoibWlsaXRvbSIsImEiOiJja2E2YmtpN2cwNmhzMnlvejA0cm5kamtpIn0.DvZmdFkPPyBWuuW-TgOpTw';
const bboxWinnipeg = '-97.325875, 49.766204, -96.953987, 49.99275';

const ulElem = document.querySelectorAll('ul.origins, ul.destinations');
const formElem = document.querySelectorAll('form');

formElem.forEach(element => element.addEventListener('submit', function(event) {
  const input = event.target.querySelector('input');
  const point = event.target.closest('form').className.slice(0,-5);
  //console.log(point);

  if (input.value.length > 0) {
    findLocation(input.value, point);
  }

  event.preventDefault();
}))

function findLocation(query, point) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=10&bbox=${bboxWinnipeg}&access_token=${APIkeyMapbox}`)
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
  //console.log(selectedLocation);
  const parentElem = selectedLocation.closest('ul');
  let originLong, originLat, destLong, destLat;
  
  if (selectedLocation !== null) {
    const siblingsElem = getAllSiblings(selectedLocation, parentElem);
  
    selectedLocation.classList.add('selected');
    siblingsElem.forEach(ele => ele.classList.remove('selected'));

    const selectedOrigLocation = document.querySelector(`.origins > .selected`);  
    const selectedDestLocation = document.querySelector(`.destinations > .selected`);
    //console.log(selectedOrigLocation)
    if (selectedOrigLocation !==null && selectedDestLocation !== null) {
    originLong = selectedOrigLocation.dataset.long;
    //console.log(originLong);
    originLat = selectedOrigLocation.dataset.lat;
    //console.log(originLat);
    destLong = selectedDestLocation.dataset.long;
    //console.log(destLong);
    destLat = selectedDestLocation.dataset.lat;
    //console.log(destLat);
    }
  
    if (originLong !== undefined && originLat !== undefined && destLong !== undefined && destLat !== undefined) {
      console.log(originLong, originLat, destLong, destLat);
      //planTrip(originLong, originLat, destLong, destLat);
    }
  }
}))
  
//source: https://stackoverflow.com/questions/4378784/how-to-find-all-siblings-of-the-currently-selected-dom-object
//function takes two parameters (element and its parent) and based on that makes array of all elements that are children of selected element's parent (in this case all <li> inside of <ul>); then it filters that array and returns array of all sibling elements (just element itself is excluded from array)
function getAllSiblings(element, parent) {
  const children = [...parent.children];
  return children.filter(child => child !== element);
}

function planTrip(originlong, originLat, destLong, destLat) {
  const buttonElem = document.querySelector('.plan-trip');
  buttonElem.addEventListener('click' , function() {
    fetch(`https://api.winnipegtransit.com/v3/trip-planner.json?origin=geo/${originLat},${originlong}&destination=geo/${destLat},${destLong}&usage=long&api-key=${APIkeyWinTransit}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });  
  })
}