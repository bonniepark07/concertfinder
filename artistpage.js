const urlParams = new URLSearchParams(window.location.search);
const getartistID = urlParams.get('artistid');
console.log(getartistID)
let queryURL = `https://app.ticketmaster.com/discovery/v2/attractions/${getartistID}.json?apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx&locale=en-us`
fetch(queryURL)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    document.querySelector("#artist-name").textContent = data.name
    document.querySelector("#artist-image").src = data.images[0].url
    document.querySelector("#artist-url").href = data.url

    if(data.externalLinks){
      // if(data.externalLinks.homepage)
      //   document.querySelector("#description").href = data.externalLinks.homepage[0].url
      
      // if(data.externalLinks.homepage)
      //   document.querySelector("#homepage").href = data.externalLinks.homepage[0].url
      
      if(data.externalLinks.homepage){
        document.querySelector("#homepage").href = data.externalLinks.homepage[0].url
      }
      else{
        document.querySelector("#homepage").remove()
      }
      
      if(data.externalLinks.itunes){
        document.querySelector("#itunes").href = data.externalLinks.itunes[0].url
      }
        
      else{
        document.querySelector("#itunes").remove()
      }

      if(data.externalLinks.spotify){
        document.querySelector("#spotify").href = data.externalLinks.spotify[0].url
      }
      else{
        document.querySelector("#spotify").remove()
      }
      
      if(data.externalLinks.wiki){
        document.querySelector("#wiki").href = data.externalLinks.wiki[0].url
      }

      else{
        document.querySelector("#wiki").remove()
      }
    }
    else{
      document.querySelector("#homepage").remove()
      document.querySelector("#itunes").remove()
      document.querySelector("#spotify").remove()
      document.querySelector("#wiki").remove()
    }
    getURL(data.name)
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
        try{
        elem1.href = "./concert_details.html?eventid=" + event.id
        elem1.textContent = event.dates.start.localDate
        concert_info.push(elem1)

        // if (event._embedded.venues){
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
        }catch(error){
          console.log(error)
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
      let upcomingconcertsdiv = document.querySelector("#upcoming-concerts")
      upcomingconcertsdiv.appendChild(elem)
      for (let i = 0; i < concert_arr.length; i++) {
        let table_row = document.createElement("tr")
        if(i==0){
          table_row.setAttribute("id", "table-header")
        }
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