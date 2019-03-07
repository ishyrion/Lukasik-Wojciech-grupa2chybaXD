let startPosition // rynek główny, Adaś
let map // nasza mapa
let marker // ikonka uzytkownika
let ws // polaczenie
let imie // imie uzytkownika
let players = [] // gracze
let przycisnieteKlawisze = new Set(); // {}


function initMap() {

    startPosition = {
        lat: 50.061466,
        lng: 19.9379968
    };//Rynek główny, Adaś

    map = new google.maps.Map(
      document.getElementById('root'), {
          zoom: 13, 
          center: startPosition
        });

    marker = new google.maps.Marker({ 
        position: startPosition, 
        map: map,
        icon: 'runner.png'
    });

  //  map.setOptions({gestureHandling: "none", keyboardShortcuts: false});
    //zoomControl: false , mozna dodac, zeby nie zmieniali zooma mapy

    getPlayerLocalization()
    window.addEventListener( 'keydown', dodajKlawiszIWyswietl )
    window.addEventListener( 'keyup', function(event) {
        przycisnieteKlawisze.delete(event.key || event.keyCode);
      });
    //window.onkeydown = moveMarkerIWyswietl;
    startWebSocket()
}


function dodajKlawiszIWyswietl(event){
    przycisnieteKlawisze.add(event.key || event.keyCode); 
    event.preventDefault();
    moveMarkerIWyswietl();
    return;   
}


function moveMarkerIWyswietl () {
    let lat = marker.getPosition().lat()
    let lng = marker.getPosition().lng()
    let deltaPosition = Math.pow(2, -(map.zoom-2))
    //vektor zmiany polozenia
    //(map.zoom-23); // delta zalezna od zooma
    //ewentualnie trzeba zablokowac zooma, albo ustawic delte stala


    if( przycisnieteKlawisze.has('ArrowUp') || przycisnieteKlawisze.has('w') || przycisnieteKlawisze.has('W')) 
        lat += deltaPosition; 
    if( przycisnieteKlawisze.has('ArrowDown') || przycisnieteKlawisze.has('s') || przycisnieteKlawisze.has('S'))   
        lat -= deltaPosition; 
    if( przycisnieteKlawisze.has('ArrowLeft') ||  przycisnieteKlawisze.has('a') || przycisnieteKlawisze.has('A'))   
        lng -= deltaPosition; 
    if( przycisnieteKlawisze.has('ArrowRight') ||  przycisnieteKlawisze.has('d') || przycisnieteKlawisze.has('D'))  
        lng += deltaPosition; 

/*
    let alias = {
        'ArrowUp' : 38,
        'ArrowDown' : 40,
        'ArrowLeft' : 37,
        'ArrowRight' : 39,
        "KeyW" : 87,
        "KeyS" : 83,
        "KeyA" : 65,
        "KeyD" : 68
    }

    if( przycisnieteKlawisze[alias["KeyW"]] ||  
        przycisnieteKlawisze[alias['ArrowUp']] )     lat += deltaPosition; 
    if( przycisnieteKlawisze[alias["KeyS"]] || 
        przycisnieteKlawisze[alias['ArrowDown']] )   lat -= deltaPosition; 
    if( przycisnieteKlawisze[alias["KeyA"]] ||  
        przycisnieteKlawisze[alias['ArrowLeft']] )   lng -= deltaPosition; 
    if( przycisnieteKlawisze[alias["KeyD"]] ||  
        przycisnieteKlawisze[alias['ArrowRight']] )  lng += deltaPosition; 
*/

/*
    switch ( event.code ) {
        case "KeyW":    case 'ArrowUp':     lat += deltaPosition; break;
        case "KeyS":    case 'ArrowDown':   lat -= deltaPosition; break;
        case "KeyA":    case 'ArrowLeft':   lng -= deltaPosition; break;
        case "KeyD":    case 'ArrowRight':  lng += deltaPosition; break;
    }
*/

/*
    let code = event.code

    if(code== "KeyW" ||  code =='ArrowUp' )     lat += deltaPosition; 
    if(code== "KeyS" ||  code =='ArrowDown' )   lat -= deltaPosition; 
    if(code== "KeyA" ||  code =='ArrowLeft' )   lng -= deltaPosition; 
    if(code== "KeyD" ||  code =='ArrowRight' )  lng += deltaPosition; 

*/

    //Bo Google mapy tylko do 85
    //nie pokazuja, ze na biegunach jest wejscie do podziemnego świata Agartha!!!
    if( lat> 85) lat-=170;// (85+delta)-170 = -85+delta
    if( lat<-85) lat+=170;//-(85+delta)+170 =  85-delta
    if( lng> 180) lng-=360;//(180+delta)-360= -180+delta
    if( lng<-180) lng+=360;//-(180+delta)+360= 180-delta

    let position = {
        lat,
        lng
    }

    // let wsData = {
    //     lat: lat,
    //     lng: lng,
    //     imie: imie
    // }

    map.setCenter( position )
    marker.setPosition( position )
    
    //ws.send(JSON.stringify(wsData))
}

function getPlayerLocalization(){
    navigator.geolocation.getCurrentPosition( localizationPermitted, localizationDenied )
}

function localizationPermitted( event ){

    currentPosition = {
        lat: event.coords.latitude,
        lng: event.coords.longitude
    };

    map.setCenter( currentPosition )
    marker.setPosition( currentPosition )

    document.querySelector('#localization').disabled = true;

    ustawID()

}

function localizationDenied( event ){

    alert('Ustawiono lokalizacje na: Kraków->Rynek Główny.')

    ustawID()

}

function ustawID() {
    
    let response

    do( response = prompt("Podaj swój imie ( nie może być pusty )"))

    while( response == null || response == "" )

    imie = response

    document.querySelector("#nickname").innerText = `Twój imie: ${response}`

}

function startWebSocket() {

    let url =   ' ws://91.121.6.192:8010'
    //nie dziala, nie chce podlaczyc
    //ciezko przetestowac funkcje zespolowe

    ws = new WebSocket(url)
    // ws.addEventListener('open', onWSOpen)
    // ws.addEventListener('message', onWSMessage)

}

