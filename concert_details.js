const urlParams = new URLSearchParams(window.location.search);
const geteventID = urlParams.get('eventid');
console.log(geteventID)
const maindiv = document.querySelector("#main");
let queryURL = `https://app.ticketmaster.com/discovery/v2/events/${geteventID}.json?apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx&locale=en-us`

fetch(queryURL)
  .then(res => res.json())
  .then(data => {
    console.log(data)

    //maindiv.querySelector("#venue_info").innerHTML = data._embedded.venues[0].name;
    if(data._embedded.attractions[0].externalLinks){
    if (data._embedded.attractions[0].externalLinks.spotify) {
      document.querySelector("#spotify_link").style.display = "block";
      document.querySelector("#spotify_link").href = data._embedded.attractions[0].externalLinks.spotify[0].url
      console.log(data._embedded.attractions[0].externalLinks.spotify[0].url)
    }
    }

    document.querySelector("#buy_tickets").href = data.url

    var elem = document.createElement("img")
    maindiv.insertBefore(elem, maindiv.firstChild);
    elem.src = data.images[0].url

    elem = document.createElement("h2")
    elem.textContent = data.name
    maindiv.insertBefore(elem, maindiv.firstChild);

    elem = document.createElement("p")
    maindiv.appendChild(elem)
    elem.innerHTML = data.info
    if (!data.info) {
      elem.innerHTML = "";
    }

    elem = document.createElement("p")
    maindiv.appendChild(elem)
    elem.innerHTML = data.pleaseNote
    if (data.info == data.pleaseNote) {
      elem.innerHTML = "";
    }
    elem = document.createElement("p")
    maindiv.appendChild(elem)
    elem.innerHTML = data.dates.start.localDate

    elem = document.createElement("p")
    maindiv.appendChild(elem)
    elem.innerHTML = data._embedded.venues[0].city.name 
    
    if (data._embedded.venues[0].state){
      elem.innerHTML += ", " + data._embedded.venues[0].state.stateCode
    }

    elem = document.createElement("p")
    maindiv.appendChild(elem)
    elem.innerHTML = data._embedded.venues[0].name

    elem = document.createElement("a")
    maindiv.appendChild(elem)
    elem.innerHTML = data._embedded.venues[0].address.line1
    elem.href = "https://maps.google.com/?q=" + data._embedded.venues[0].address.line1

    elem = document.createElement("img")
    maindiv.appendChild(elem)
    
    if(data.seatmap){
    elem.src = data.seatmap.staticUrl
    elem.id = "seatmap"
    }

    getURL(data._embedded.attractions[0].name)
    getArtists(data.classifications[0].genre.name, data._embedded.attractions[0].name)
  })

function getURL(name) {
  let queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx&keyword=${encodeURI(name)}&segmentName=Music&locale=en-us`
  console.log(queryURL)
  fetch(queryURL)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      // Previously implemented code
      // Create a 2D array of concert info.
      const events = data._embedded.events
      let concert_arr = []
      events.forEach(event => {
        // let concert_info = [event.dates.start.localDate, event._embedded.venues[0].city.name, event._embedded.venues[0].name] //... Fill with rest, Location, etc.
        let concert_info = []
        let elem1 = document.createElement("a")
        elem1.href = "./concert_details.html?eventid=" + event.id
        elem1.textContent = event.dates.start.localDate
        concert_info.push(elem1)

        let elem2 = document.createElement("p")
        elem2.textContent = event._embedded.venues[0].city.name
        concert_info.push(elem2)

        let elem3 = document.createElement("a")
        elem3.href = event.url
        elem3.textContent = event._embedded.venues[0].name
        concert_info.push(elem3)

        if (!(elem1.textContent == "" || elem2.textContent == "" || elem3.textContent == "")) {
          concert_arr.push(concert_info)
        }
      })
      concert_arr.sort(sortFunction);

      function sortFunction(a, b) {
        if (a[0].textContent === b[0].textContent) {
          return 0;
        }
        else {
          return (a[0].textContent < b[0].textContent) ? -1 : 1;
        }
      }
      let date = document.createElement("p")
      date.textContent = "Date"

      let location = document.createElement("p")
      location.textContent = "Location"

      let venue = document.createElement("p")
      venue.textContent = "Venue"

      concert_arr.unshift([date, location, venue])

      // console.log(concert_arr)
      elem = document.createElement("table")
      maindiv.appendChild(elem)
      for (let i = 0; i < concert_arr.length; i++) {
        let table_row = document.createElement("tr")
        for (let j = 0; j < concert_arr[i].length; j++) {
          let table_data = document.createElement("td")
          // console.log(concert_arr[i][j])
          table_data.appendChild(concert_arr[i][j])
          table_row.appendChild(table_data)
        }
        elem.appendChild(table_row)
      }

    }
    )
}
function getArtists(genre, artist) {
  arr = [genre];
  // if(type!="Undefined"){
  //   arr.push(type);
  // }
  var arrStr = encodeURIComponent(JSON.stringify(arr));
  let queryURL = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx&classificationName=${arrStr}&segmentName=Music&locale=en-us`
  console.log(queryURL)
  fetch(queryURL)
    .then(res => res.json())
    .then(data => {
      console.log(arr)
      console.log("get artist:", data)
      const artistCardTemplate = document.querySelector("template.artistcardtemplate")
      const artistCardContainer = document.querySelector(".artist-cards")
      var numartists = artistCardContainer.getElementsByTagName('.card').length
      for (let i=0; numartists < 6; i++){
        const card = artistCardTemplate.content.cloneNode(true).children[0]
        const header = card.querySelector(".header")
        var elem1 = document.createElement("h3")
        header.appendChild(elem1)
        if (artist==data._embedded.attractions[i].name){
          i++
        }
        elem1.textContent = data._embedded.attractions[i].name
        const body = card.querySelector(".body")
        var elem = document.createElement("img")
        body.appendChild(elem)
        elem.src = data._embedded.attractions[i].images[0].url
        artistCardContainer.append(card)
        numartists++
        card.addEventListener("click",  function(){
          window.location.href = "./artistpage.html?artistid=" + data._embedded.attractions[i].id
          })
      }
      


      
      // Previously implemented code
      // Create a 2D array of concert info.
      // const events = data._embedded.events
      // let concert_arr = []
      // events.forEach(event => {
      //   // let concert_info = [event.dates.start.localDate, event._embedded.venues[0].city.name, event._embedded.venues[0].name] //... Fill with rest, Location, etc.
      //   let concert_info = []
      //   let elem1 = document.createElement("a")
      //   elem1.href = "./concert_details.html?eventid=" + event.id
      //   elem1.textContent = event.dates.start.localDate
      //   concert_info.push(elem1)

      //   let elem2 = document.createElement("p")
      //   elem2.textContent = event._embedded.venues[0].city.name
      //   concert_info.push(elem2)

      //   let elem3 = document.createElement("a")
      //   elem3.href = event.url
      //   elem3.textContent = event._embedded.venues[0].name
      //   concert_info.push(elem3)

      //   if (!(elem1.textContent == "" || elem2.textContent == "" || elem3.textContent == "")) {
      //     concert_arr.push(concert_info)
      //   }
      }
        )}


