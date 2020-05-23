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
      data.features.forEach(location => displayLocations(location, point))});  
}
