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
    .then(resp => resp.json())
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
  //element.innerHTML = '';
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
  //let originLong, originLat, destLong, destLat;
  
  if (selectedLocation !== null) {
    const siblingsElem = getAllSiblings(selectedLocation, parentElem);
  
    selectedLocation.classList.add('selected');
    siblingsElem.forEach(ele => ele.classList.remove('selected'));
  }
}))
  
//https://stackoverflow.com/questions/4378784/how-to-find-all-siblings-of-the-currently-selected-dom-object
function getAllSiblings(element, parent) {
  const children = [...parent.children];
  return children.filter(child => child !== element);
}
  
