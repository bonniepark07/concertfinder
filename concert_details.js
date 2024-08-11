const urlParams = new URLSearchParams(window.location.search);
const geteventID = urlParams.get('eventid');
console.log(geteventID)
const maindiv = document.querySelector("#main");
let queryURL = `https://app.ticketmaster.com/discovery/v2/events/${geteventID}.json?apikey=G1XqaCz3JyVAlSgxdHQ1UExYI9mgDVRx`
fetch(queryURL)
  .then(res => res.json())
  .then(data => {
    console.log(data)

    //maindiv.querySelector("#venue_info").innerHTML = data._embedded.venues[0].name;
    if(data._embedded.attractions[0].externalLinks.spotify){
    document.querySelector("#spotify_link").href = data._embedded.attractions[0].externalLinks.spotify[0].url
    console.log(data._embedded.attractions[0].externalLinks.spotify[0].url)
    }
    else{
      document.querySelector("#spotify_link").style.display = "none";
    }
    
    var elem = document.createElement("h2")
    elem.textContent = data.name
    maindiv.appendChild(elem)

    maindiv.appendChild(document.createElement("br"))
    elem = document.createElement("img")
    maindiv.appendChild(elem)
    elem.src = data.images[0].url

    elem = document.createElement("p")
    maindiv.appendChild(elem)
    elem.innerHTML = data.info
    if(!data.info){
      elem.innerHTML ="";
    }

    elem = document.createElement("p")
    maindiv.appendChild(elem)
    elem.innerHTML = data.pleaseNote
    if(data.info==data.pleaseNote){
      elem.innerHTML ="";
    }

    elem = document.createElement("p")
    maindiv.appendChild(elem)
    elem.innerHTML = data._embedded.venues[0].name

    elem = document.createElement("a")
    maindiv.appendChild(elem)
    elem.innerHTML = data._embedded.venues[0].address.line1
    elem.href = "https://maps.google.com/?q=" + data._embedded.venues[0].address.line1
  })