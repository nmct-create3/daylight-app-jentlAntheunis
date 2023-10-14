// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	// Bepaal het aantal minuten dat de zon al op is.
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
	console.info(queryResponse);
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	const sunrise = new Date(queryResponse.city.sunrise * 1000);
	const sunset = new Date(queryResponse.city.sunset * 1000);
	//format sunrise and sunset time to HH:MM
	const sunriseTime = `${formatTime(sunrise.getHours())}:${formatTime(sunrise.getMinutes())}`;
	const sunsetTime = `${formatTime(sunset.getHours())}:${formatTime(sunset.getMinutes())}`;
	document.querySelector('.js-sunrise').innerHTML = sunriseTime;
	document.querySelector('.js-sunset').innerHTML = sunsetTime;
	//get current time
	const now = new Date();
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	updateSunPosition(sunrise, sunset, now);

	updateMinutesLeft(sunset, now);
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
};

const updateSunPosition = (sunrise, sunset, now) => {
	//calculate the percentage of the day that has passed
	const totalMinutes = (sunset - sunrise) / 1000 / 60;
	const minutesPassed = (now - sunrise) / 1000 / 60;
	const percentage = (minutesPassed / totalMinutes) * 100;

	//map percentage to rotation between 0 and 180 degrees
	const rotation = (180 * percentage) / 100;
	
	//rotate sun element
	const sun = document.querySelector('.js-sun');
	sun.style.transform = `rotate(${rotation}deg)`;
};

const updateMinutesLeft = (sunset, now) => {
	const minutesLeft = (sunset - now) / 1000 / 60;
	const minutes = Math.floor(minutesLeft);
	document.querySelector('.js-time-left').innerHTML = `${minutes} minutes`;
};

const formatTime = (time) => {
	if (time < 10) {
		return `0${time}`;
	} else {
		return `${time}`;
	}
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
	// Eerst bouwen we onze url op
	const apiKey = 'cbfd1c6f2caa3d9e1ad4c2d8d03cc626';
	const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=nl&cnt=1`;
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
	console.info('fetching data...');
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			showResult(data);
		})
		.catch((error) => {
			console.error('There was a problem with the fetch operation:', error);
		});
};

document.addEventListener('DOMContentLoaded', function () {
	// 1 We will query the API with longitude and latitude.
	//ask the users location and call getApi with the coordinates
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			getAPI(position.coords.latitude, position.coords.longitude);
		});
	} else {
		console.error('Geolocation is not supported by this browser.');
	}
	// getAPI(50.8027841, 3.2097454);
});
