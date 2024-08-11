// search.js: Adds Functionality to the home page of the website and fetches and displays concerts that match the user's input. 

function myFunction() {
  document.getElementById("location-button").style.display="block";
  document.getElementById("location-button").style.visibility="visible"; 
}
function myFunction2() {
  document.getElementById("location-button").style.display="none";
  document.getElementById("location-button").style.visibility="hidden";
}


/* concertCardTemplate: template that all the concert cards created follows.
concertCardContainer: A div element that will contain all concert cards
*/
const concertCardTemplate = document.querySelector("template.concertcardtemplate")
const concertCardContainer = document.querySelector(".concert-cards")
let nextPageLink = ""
let prevPageLink = ""
let OriginalSearchURL = ""

// fetchconcerts(QueryURL): Function takes in a QueryURL parameter that specifies the genre, location, name of concerts we want to fetch. We fetch using this QueryURL, and display concert cards made from the fetched data.
function fetchconcerts(QueryURL) {
  // Remove All cards created and inserted into concert-cards. Remove all pre-existing page buttons
  while (document.querySelector(".concert-cards > .card")) {
    document.querySelector(".concert-cards > .card").remove()
  }
  const page = document.querySelector("#page")
  page.querySelectorAll('button').forEach(button => 
    {
      if(button.id != "next-button" && button.id != "previous-button"){
        button.remove()
      }
    }
  )
  
  nextButton.style.display = "none";
  previousButton.style.display = "none";
  console.log(QueryURL)
  // Fetching Concert Data, eventually using *data* as our main variable.
  fetch(QueryURL)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      const events = data._embedded.events
      concertCardContainer.setAttribute("id", "")
      document.querySelector("#trending-concerts").textContent = ""
      // Display a concert card for each event.
      events.forEach(event => {
        const card = concertCardTemplate.content.cloneNode(true).children[0]
        const header = card.querySelector(".header")
        const body = card.querySelector(".body")
        card.addEventListener("click",  function(){
          window.location.href = "./concert_details.html?eventid=" + event.id
          })
        header.textContent = changeDate(event.dates.start.localDate)
        header.innerHTML += "<br>" + changeTime(event.dates.start.localTime)
        body.innerHTML =  "<h4>" + event.name + "<br>" + event._embedded.venues[0].name + ", " + event._embedded.venues[0].city.name + "</h4>"
        var elem = document.createElement("img")
        body.appendChild(document.createElement("br"))
        body.appendChild(document.createElement("br"))
        body.appendChild(elem)
        elem.src = event.images[0].url
        var link = document.createElement("a")
        body.appendChild(document.createElement("br"))
        body.appendChild(link)
        link.href = event.url
        link.innerHTML = "Buy tickets" 
        link.className = "buyTickets"
        if(event.priceRanges){
          link.innerHTML += " starting from $" + event.priceRanges[0].min
        }
        card.setAttribute("id", "search-concerts")
        // Insert card into the div concertCardContainer
        concertCardContainer.append(card)

      })
      concertCardContainer.setAttribute("id", "search-concert-cards")
      document.querySelector("#totalresults").textContent = data.page.totalElements + " results"

      // Within fetchconcerts function, we save the link to the next page
      // Display and add url to previous button, only if there is a previous-link.
      if(!data._links.prev){
        // Hide the button
        previousButton.style.display = "none";
      }
      else{
        prevPageLink = "https://app.ticketmaster.com" + data._links.prev.href + "&apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx"
        // Show it as an inline block
        previousButton.style.display = "inline-block"
      }


      // Only display +- 5 page buttons from current page, while keeping in mind of the minimums and maximums (e.g. page 1)
      let currentPage = data.page.number
      for (let x=Math.max(0, currentPage-5); x<=Math.min(Math.max(currentPage+5,10), data.page.totalPages-1); x++){
        var link = document.createElement("button")
        link.innerHTML=x+1
        if(x==currentPage){
          link.style.backgroundColor="pink"
        }
        page.appendChild(link)
        link.addEventListener("click", function(){
          fetchconcerts(OriginalSearchURL+"&page="+x)

        })

      }
      
      // Display and add url to next button, only if there is a next-link.
       if (!data._links.next){
         nextButton.style.display = "none";
       } 
        else{
          page.appendChild(nextButton)
          nextPageLink = "https://app.ticketmaster.com" + data._links.next.href + "&apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx"
          nextButton.style.display = "inline-block"
        }
      
    })
}

// Function to change formatting of time from (e.g. 16:30:00) to (e.g. 4:30pm)
function changeTime (time){
  if(!time){
    return time;
  }
  time=time.substring(0,5);
  let hour = time.substring(0,2);
  let min = time.substring(3,5);
  if (hour>12){
    hour=hour-12;
    time = hour + ":" + min + "pm";
  }
  else if (hour==12){
    time = hour + ":" + min + "pm";
  }
  else {
    time = hour + ":" + min + "am";
  }
  return time;
  }

function changeDate (date){
  const dateObject = new Date(date)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[dateObject.getMonth()] + " " + (dateObject.getDate()+1)
}

// Display Popular concerts and their concert cards in the home page when it is loaded in. 
if(!window.location.hash){
window.onload = function() {
  let events_shown = []
  let QueryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx&segmentName=Music&size=164"
  document.querySelector("#trending-concerts").textContent = "TRENDING CONCERTS"
  console.log(QueryURL)
  fetch(QueryURL)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      const events = data._embedded.events
      concertCardContainer.setAttribute("id", "popularConcertContainer")
      events.forEach(event => {
      //for(let i=0; (i<events.length && concertCardContainer.children.length<9); i++){

      //let event = events[i];
      //console.log(events_shown)
        if ((!events_shown.includes(event._embedded.attractions[0].name))&&concertCardContainer.children.length<12){
        const card = concertCardTemplate.content.cloneNode(true).children[0]
        card.addEventListener("click",  function(){
          window.location.href = "./concert_details.html?eventid=" + event.id
          })
        const header = card.querySelector(".header")
        const body = card.querySelector(".body")
        header.textContent = event.name
        var elem = document.createElement("img")
        body.appendChild(document.createElement("br"))
        body.appendChild(elem)
        elem.src = event.images[0].url
        card.setAttribute("id", "popular-concerts")
        concertCardContainer.append(card)
        events_shown.push(event._embedded.attractions[0].name)
        // if(events_shown.length==9){
        //   return "";
        // }
        }
    })
      // const extraCards = concertCardContainer.children.length - 9;
      // for (let i = 0; i < extraCards; i++) {
      //   concertCardContainer.removeChild(concertCardContainer.lastChild);
      // }
  })
}
}
//Implement Search function using button, addEventListener Function from JS
// Below are variables of html elements that contain user input, and buttons.z
const searchInput = document.querySelector("#search")
const searchCity = document.querySelector("#city")
const searchButton = document.querySelector("#search-button")
const searchDate = document.querySelector("#date")
const searchLocation = document.querySelector("#location-button")
const searchRadius = document.querySelector("#radius")
const searchGenre = document.querySelector("#genre")
const nextButton = document.querySelector("#next-button")
const previousButton = document.querySelector("#previous-button")
const sortButton = document.querySelector("#sort")
// When user clicks on Search Button, get concerts!
searchButton.addEventListener("click", function() {
  var x = ""
  if (searchDate.value) {
    x = `${searchDate.value}T00:00:00Z`
  }
  // This URL below contains user's inputs and concatenates it into the url
   OriginalSearchURL = `https://app.ticketmaster.com/discovery/v2/events.json?&startDateTime=${x}&apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx&keyword=${searchInput.value}&city=${searchCity.value}&latlong=${latlong}&radius=${searchRadius.value}&unit=miles&segmentName=Music&classificationName=${searchGenre.value}&sort=${sortButton.value}`
  console.log(OriginalSearchURL)
  fetchconcerts(OriginalSearchURL)
}
)

// Functions to search when user presses Enter.
searchInput.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Trigger the button element with a click
    searchButton.click();
  }
})
searchCity.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Trigger the button element with a click
    searchButton.click();
  }
})

// getLocation(): Function to get user's current location (lat, long)
var x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
let latlong = "";
function showPosition(position) {
  latlong = position.coords.latitude + "," + position.coords.longitude;
  fetch(`https://us1.locationiq.com/v1/reverse?key=pk.4d6d2466e4b0c81a605079508a57700c&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
  .then(res => res.json())
  .then(data => {
    console.log(data.address.city)
    searchCity.placeholder = data.address.city;
    //searchCity.placeholder.style.setProperty("--c","black");
    document.getElementById("city").placeholder.style = "opacity: 1.0;";
    searchCity.classList.add('your-class');
  } 
      )


  //x.innerHTML = "Latitude: " + position.coords.latitude +
    //"<br>Longitude: " + position.coords.longitude;
  sortButton.value = "distance,asc";
}
searchLocation.addEventListener("click", getLocation)



// Do a new API call using the saved nextPageLink
nextButton.addEventListener("click",  function(){
  fetchconcerts(nextPageLink)
})
previousButton.addEventListener("click",  function(){
  fetchconcerts(prevPageLink)
})


//spotify login button
var client_id = '62eba6334dc445afa54845c49fd3a97b';
var redirect_uri = 'https://2a536443-072f-4ebb-b309-303f580840ac-00-1cuqv1k8kkw11.kirk.replit.dev/';

var scope = 'user-top-read';

var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

document.querySelector('#spotify-login').addEventListener('click', function(){
  window.location.href = url;
})

var access_token = null;
if(window.location.hash) {
  access_token = window.location.hash.substring(1).split('&')[0];
  access_token = access_token.split('=')[1];
  console.log(access_token);  
  getProfile(access_token)
}

async function getProfile(accessToken, url="") {
  let response; 
  if (url==""){
    response = await fetch('https://api.spotify.com/v1/me/top/artists', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
    });
  }
  else{
    response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
      });
  }

  const data = await response.json();
  console.log(data);
  let count = 0;

  let myInterval = setInterval(function() {
    recommendedConcerts(data, count)
    count++;
    if(count>=20){
      clearInterval(myInterval);
      if(concertCardContainer.children.length<12){
        const myTimeout = setTimeout(getProfile(accessToken, data.next), 200);
      }
    }

  }, 200);

//   //check if there are less than 9 concerts and if not call more. 


 }

 function recommendedConcerts (topArtist, i) {
  let artist = topArtist.items[i].name;
  console.log(artist)
  let events_shown = []
  let QueryURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx&segmentName=Music&size=60&keyword=${artist}`
   document.querySelector('#trending-concerts').textContent = "Your Recommendations"
  console.log(QueryURL)
  fetch(QueryURL)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      const events = data._embedded.events
      concertCardContainer.setAttribute("id", "popularConcertContainer")
      events.forEach(event => {
      //for(let i=0; (i<events.length && concertCardContainer.children.length<9); i++){

      //let event = events[i];
      if(concertCardContainer.children.length>=12){
        console.log("returned")
        return 
      }
      if (typeof event._embedded.attractions !== "undefined" && event._embedded.attractions[0].name== artist){
        if ((!events_shown.includes(event._embedded.attractions[0].name))&&concertCardContainer.children.length<12){
        const card = concertCardTemplate.content.cloneNode(true).children[0]
        card.addEventListener("click",  function(){
          window.location.href = "./concert_details.html?eventid=" + event.id
          })
        const header = card.querySelector(".header")
        const body = card.querySelector(".body")
        header.textContent = event.name
        var elem = document.createElement("img")
        body.appendChild(document.createElement("br"))
        body.appendChild(elem)
        elem.src = event.images[0].url
        card.setAttribute("id", "popular-concerts")
        concertCardContainer.append(card)
        events_shown.push(event._embedded.attractions[0].name)
        // if(events_shown.length==9){
        //   return "";
        // }
        }
      }
    })
      // const extraCards = concertCardContainer.children.length - 9;
      // for (let i = 0; i < extraCards; i++) {
      //   concertCardContainer.removeChild(concertCardContainer.lastChild);
      // }
  })
   .catch(error => {
     console.log(error)
       if (!(error instanceof TypeError)) throw error
     console.log("error caught")
   });
}
