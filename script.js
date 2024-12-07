document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById('getLocationButton');
    button.addEventListener('click', handleButtonClick);


    const storedtemperature = localStorage.getItem('temperature'); 
    const storeddescription = localStorage.getItem('description');
    const storedlatitude = localStorage.getItem('latitude'); 
    const storedlongitude = localStorage.getItem('longitude');
    const mapDiv = document.getElementById('map');
    const output = document.getElementById('output');
    const apioutput = document.getElementById('apioutput');
    const infosection = document.getElementById('info-section');

    
    let map;


    if (storedtemperature && storeddescription && storedlatitude && storedlongitude) {

        infosection.style.display = 'none';


        


        output.innerHTML = `<p>Latitude: ${storedlatitude}</p><p>Longitude: ${storedlongitude}</p>`;
        apioutput.innerHTML=`<p>temperature:${Math.round(storedtemperature)}°C</p>  <p>weather:${storeddescription}</p>`;

 

        map = L.map(mapDiv).setView([storedlatitude, storedlongitude], 13);
                    
                 
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

                L.marker([storedlatitude, storedlongitude]).addTo(map)
                    .bindPopup("You are here!")
                    .openPopup();
  
                }
                


        
    }

)

function handleButtonClick() {

    const reset = document.getElementById('reset');
    const storedlatitude1 = localStorage.getItem('latitude');
    const storedlongitude1 = localStorage.getItem('longitude');
    const button = document.getElementById('getLocationButton');
    const link = document.getElementById("info-section");

    if (!(storedlatitude1 && storedlongitude1) ){
        getLocation();
  }

  link.style.display="none";

}


function getLocation() {
    const output = document.getElementById('output');
    const loader = document.getElementById('loader');
    const mapDiv = document.getElementById('map');
    const apioutput = document.getElementById('apioutput');


 let map;


    loader.style.display = "block";
    output.innerHTML = "";
    apioutput.innerHTML = "";



    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
   
                loader.style.display = "none";

        
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                if (map) {
                    map.remove();}
                    

                    map = L.map(mapDiv).setView([latitude, longitude], 13);
                    
              
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
             
              
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup("You are here!")
                    .openPopup();
                output.innerHTML = `<p>Latitude: ${latitude}</p><p>Longitude: ${longitude}</p>`;

                    localStorage.setItem('latitude',latitude);
                    localStorage.setItem('longitude',longitude);

                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=4b03bce954f532b687c0338bed594efb`)
                .then(response => response.json())
                .then(data => {

                    if (data && data.main) {
                        const temperature = data.main.temp;
                        const description = data.weather[0].description;

                        localStorage.setItem('temperature', Math.round(temperature - 273.15));
                        localStorage.setItem('description', description); 


                    
                        apioutput.innerHTML=`<p>temperature:${Math.round(temperature-273.15)}°C</p>  <p>weather:${description}</p>`;


            }});

            },
            (error) => {
                
                loader.style.display = "none";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        output.textContent = "Permission denied. Please allow location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        output.textContent = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        output.textContent = "Request timed out. Please try again.";
                        break;
                    default:
                        output.textContent = "An unknown error occurred.";
                        break;
                }
            },
            {
                enableHighAccuracy: true
            }
        );
    } else {
        loader.style.display = "none";
        output.textContent = "Geolocation is not supported by this browser.";
    }
}


const reset = document.getElementById('reset');
reset.addEventListener('click',function(){
    localStorage.clear();
    location.reload();

})