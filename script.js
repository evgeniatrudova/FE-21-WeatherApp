//_____DEL 3: Kod exempel med Bootstrap utan key med API: metadata, som bara finns på 8 språk; ej på svenska; och innehåller begränsad antal väder punkt referenser och funkar bäst med välkända städer som t.ex London/ Stockholm men kommer inte att ge svar för Lund eller Malmö för att Sverige har endast 2 data punkter; för Stockholm och Göteborg___________________________________________________________
/*  
 1) Väder app konstrueras med en konstruktur-metod. Kod delas upp i klasser; funktion av en klass kapslas in i konstruktor grupp som beskriver vad funtkionen gör.     
 2) Konstruktorfunktion söker efter data, när kod aktiveras.
      > Innehåller variabler; baseApiUrl och searchApiUrl som används för att markera sökning; så att korrekt data hämtas från API.
      > addCorsHeader() en metod markering som underlättar sökning i API, igenom cross-domain blockeringar.
      >  $.ajaxPrefilter() metod kontrollerar att Cors fungerar; syfte är att ha en bra header som markerar sökning i API.
 3)  Kod är organiserad i 3  område; denna struktur är vanlig när man arbetar med framework och utökar Java Script.
     constructor() {  this.grupp = $('id-av-grupp-från-html');}  
    1.- Core DOM Elements - Det som visas på skärm
    2.- Search Form - Sökning funktion
    3.- Error Box - fel meddelande funktion        
 4)  Class Display Forecast, innehåller  url för en bild för Forecast; samt grupp showTodaysForecastDetails() med parametrar  name, value, unit; som få instruktioner att när parameter data ändras; då ska DOM element ändras efter struktur: 
            $(`id från html`).append(`
            <div class="position inne i HTML">
                <span class="position inne i HTML">${name}</span>
                <span>${value} ${unit}</span>
            </div>
 5)   showUpcomingDaysForecast innehåller parametrar (dayImgUrl, weekDay, maxTemp) och organiseras på snärlik sätt med ${parameternamn}.
       $('#id').append(`
               <li class="html">
                <img class="html" src="${this.imageURL}/${dayImgUrl}.svg" />
                <span class="html">${weekDay}</span>
                <span class="html">${maxTemp}</span>
               </li>
 6)    Inkapslade funktioner anropas med showTodaysForecast för forecast genom id och nya JS namn.
        showTodaysForecast(forecast) {
        $('#id').html(java script namn för grupp);
        $('#forecast-card-img').attr('src', `${this.imageURL}/${forecast.todaysImgUrl}.svg`);
        }}
        
 7)    dataMiddleware är en klass som innehåller en konstruktor, som använder this. för att skapa  två objekt.
               this.displayForecast = new displayForecast();
               this.coreDomElements = new coreDomElements();
       
 8)     gatherTodaysForecastDetails(data) använder return, för att plocka ut data man önskar få ut från API, t.ex temperatur och luftfuktighet.Istället för att få ut all data; man organiserar sökning som 
         return {
            önskvärtsökning: {
                value: data.namnpåönskvärtsökning,
                unit: 'övriga tecken som %',
            },
 9)   gatherTodaysForecastGeneral(data) använder return metod för att plocka ut (data):  
            currentWeekday: moment (data.applicable_date).format('dddd'),
            todaysFullDate: moment(data.applicable_date).format('MMMM Do'),
            locationName: data.title,
            todaysImgUrl: data.weather_state_abbr,
            todaysTemp: Math.round(data.the_temp),
            weatherState: data.weather_state_name,
 10)    Koden förbereder sedan data som kommer att användas för att visa dagens prognosdetaljer och morgondagens prognosdetaljer genom att deklarera grupper som kan plockas ut med const; this. och data.Koden är avsedd att visa prognosen för idag och imorgon.
   
        prepareDataForDom(data) {
        const {  } = data.consolidated_weather[0]; organiserar alla möjliga data punkter man kan plocka från API
        const todaysForecastGeneral = this.gatherTodaysForecastGeneral({  }); = relevanta parametrar för design av app.
        const todaysForecastDetails = this.gatherTodaysForecastDetails({ }); = detaljer av todayforecast     
        prepareUpcomingDaysForecast(forecast) {
        $.each(forecast, (index, value) => {
            if (index < 1) return;
 11)    class requestController har construktor som använder this. för fetchForecastApi, coreDomeElements,coreDomElements,dataMiddleware, samt registrerEventListener som lyssnar till events. 
 12)     Om fetchWeather (query) använder sökning this inom fetchForecastApi return data och getLocation ger ingen svar; då få man fel meddelande  Could not find this location, please try again.
 
            fetchWeather(query) {  this.fetchForecastApi.getLocation(query, location => {
            if (!location || location.length === 0) {
                this.coreDomElements.showError('Could not find this location, please try again.');
                return;
 13)   Om data inte kan nåss, fel meddelande "Could not proceed with the request, please try again later"
 14)   Varje request, aktiveras när man trycker på Submit knapp; och sökning i API görs på nytt för showRequestInProgress och fetchWeather.
 15)   Data registreras.
 */
//________________________________________________________________
   class fetchForecastApi {
    constructor() { 
       this.baseApiUrl = 'https://www.metaweather.com/api/location/';
        this.searchApiUrl = `${this.baseApiUrl}/search`;
        this.addCorsHeader();
    }

    addCorsHeader() {
        $.ajaxPrefilter(options => {
            if (options.crossDomain && $.support.cors) {
                options.url = 'https://the-ultimate-api-challenge.herokuapp.com/' + options.url;
            }
        });
    }

    getLocation(query, callback) {
        $.getJSON(this.searchApiUrl, { query })
            .done(data => callback(data))
            .fail(() => callback(null));
    }

    getWeatherData(location, callback) {
        $.getJSON(`${this.baseApiUrl}/${location}`)
            .done(data => callback(data))
            .fail(() => callback(null));
    }
}
   class coreDomElements {
    constructor() {
        this.searchForm = $('#search-form');
        this.errorBox = $('#error-box');
        this.searchBox = $('#search-box');
        this.loaderBox = $('#loader-box');
        this.forecastBox = $('#forecast-box');
    }

    showForecast() {
        this.hideError();
        this.forecastBox.removeClass('d-none');
        this.forecastBox.addClass('d-flex');
    }

    showLoader() {
        this.loaderBox.removeClass('d-none');
    }

    hideLoader() {
        this.loaderBox.addClass('d-none');
    }

    showSearch() {
        this.searchBox.removeClass('d-none');
        this.searchBox.addClass('d-flex');
    }

    hideSearchBox() {
        this.searchBox.removeClass('d-flex');
        this.searchBox.addClass('d-none');
    }

    showError(message) {
        this.hideLoader();
        this.showSearch();
        this.errorBox.removeClass('d-none');
        this.errorBox.addClass('d-block');
        this.errorBox.html(`<p class="mb-0">${message}</p>`);
    }

    hideError() {
        this.errorBox.addClass('d-none');
    }
}
   class displayForecast {
    constructor() {
        this.imageURL = 'https://www.metaweather.com/static/img/weather';
    }
    showTodaysForecastDetails({ name, value, unit }) {
        $(`#forecast-details`).append(`
            <div class="d-flex justify-content-between">
                <span class="font-weight-bolder">${name}</span>
                <span>${value} ${unit}</span>
            </div>
        `);
    }
    showUpcomingDaysForecast({ dayImgUrl, weekDay, maxTemp, unit }) {
        $('#forecast-details-week').append(`
            <li class="forecastBox__week-day d-flex flex-column justify-content-center align-items-center p-2 weather-day">
                <img class="mb-2" width="30" src="${this.imageURL}/${dayImgUrl}.svg" />
                <span class="mb-2">${weekDay}</span>
                <span class="font-weight-bold">${maxTemp}&deg</span>
                <span>${unit}</span>
            </li>
        `);
    }
    showTodaysForecast(forecast) {
        $('#forecast-card-weekday').html(forecast.currentWeekday);
        $('#forecast-card-date').html(forecast.todaysFullDate);
        $('#forecast-card-location').html(forecast.locationName);
        $('#forecast-card-img').attr('src', `${this.imageURL}/${forecast.todaysImgUrl}.svg`);
        $('#forecast-card-temp').html(forecast.todaysTemp);
        $('#forecast-card-description').html(forecast.weatherState);
    }
}
   class dataMiddleware {
    constructor() {
        this.displayForecast = new displayForecast();
        this.coreDomElements = new coreDomElements();
    }
    gatherTodaysForecastDetails(data) {
        return {
            'Luft fuktighet': {
                value: data.humidity,
                unit: '%',
            },
            'Vind hastighet:': {
                value: Math.round(data.wind_speed),
                unit: 'km/h',
            },
            'Temperatur': {
                value: Math.round(data.max_temp),
                unit: '°C',
            },
        };
    }
    gatherTodaysForecastGeneral(data) {
        return {
            currentWeekday: moment(data.applicable_date).format('dddd'),
            todaysFullDate: moment(data.applicable_date).format('MMMM Do'),
            locationName: data.title,
            todaysImgUrl: data.weather_state_abbr,
            todaysTemp: Math.round(data.the_temp),
            weatherState: data.weather_state_name,
        };
    }
    prepareDataForDom(data) {
        const {
            predictability,
            humidity,
            wind_speed,
            air_pressure,
            max_temp,
            min_temp,
            applicable_date,
            the_temp,
            weather_state_abbr,
            weather_state_name,
        } = data.consolidated_weather[0];
        const todaysForecastGeneral = this.gatherTodaysForecastGeneral({
            applicable_date,
            weather_state_abbr,
            weather_state_name,
            the_temp,
            title: data.title,
        });
        const todaysForecastDetails = this.gatherTodaysForecastDetails({
            predictability,
            humidity,
            wind_speed,
            air_pressure,
            max_temp,
            min_temp,
        });

        this.displayForecast.showTodaysForecast(todaysForecastGeneral);
        this.prepareTodaysForecastDetails(todaysForecastDetails);
        this.prepareUpcomingDaysForecast(data.consolidated_weather);
        this.coreDomElements.hideLoader();
        this.coreDomElements.showForecast();
    }
    prepareTodaysForecastDetails(forecast) {
        $.each(forecast, (key, value) => {
            this.displayForecast.showTodaysForecastDetails({
                name: key.toUpperCase(),
                value: value.value,
                unit: value.unit,
            });
        });
    }
    prepareUpcomingDaysForecast(forecast) {
        $.each(forecast, (index, value) => {
            if (index < 1) return;

            const dayImgUrl = value.weather_state_abbr;
            const maxTemp = Math.round(value.max_temp);
            const weekDay = moment(value.applicable_date).format('dddd').substring(0, 3);
            const unit = value.weather_state_name ;
            

            this.displayForecast.showUpcomingDaysForecast({ dayImgUrl, maxTemp, weekDay, unit });
        });
    }
}
   class requestController {
    constructor() {
        this.fetchForecastApi = new fetchForecastApi();
        this.coreDomElements = new coreDomElements();
        this.dataMiddleware = new dataMiddleware();
        this.registerEventListener();
    }
    showRequestInProgress() {
        this.coreDomElements.showLoader();
        this.coreDomElements.hideSearchBox();
    }

    getQuery() {
        return $('#search-query').val().trim();
    }

    fetchWeather(query) {
        this.fetchForecastApi.getLocation(query, location => {
            if (!location || location.length === 0) {
                this.coreDomElements.showError('Position kan inte hittas; sök efter en huvudstad.');
                return;
            }

            this.fetchForecastApi.getWeatherData(location[0].woeid, data => {
                if (!data) {
                    this.coreDomElements.showError('Sökning kan inte genomföras; försök igen.');
                    return;
                }

                this.dataMiddleware.prepareDataForDom(data);
            });
        });
    }

    onSubmit() {
        const query = this.getQuery();
        if (!query) return;

        this.showRequestInProgress();
        this.fetchWeather(query);
    }

    registerEventListener() {
        this.coreDomElements.searchForm.on('submit', e => {
            e.preventDefault();
            this.onSubmit();
        });
    }
}
   const request = new requestController();





