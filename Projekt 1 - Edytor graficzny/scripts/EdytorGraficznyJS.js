let ourCanvas
let ourCanvasContext
let zdjecieBezZmian
let d



function init() {
    //dodaj miejsce na zdjecia
    ourCanvas = document.createElement('canvas');
    ourCanvas.id = 'canvas-scene';

    ourCanvasContext = ourCanvas.getContext('2d');

    document.querySelector('#canvas-container').appendChild(ourCanvas);

    //zapodaj poczatkowy img
    let image = new Image();
    image.src = "logo.jpg";
    image.addEventListener('load', event => {
        ourCanvas.width = image.width;
        ourCanvas.height = image.height;
        ourCanvasContext.drawImage(image, 0, 0, ourCanvas.width, ourCanvas.height);
        zdjecieBezZmian = ourCanvasContext.getImageData(0, 0, ourCanvas.width, ourCanvas.height).data;
    });

    document.querySelector('#inputJasnosc').value = 0
    document.querySelector('#inputKontrast').value = 0
    document.querySelector('#inputNasycenie').value = 100
}
init();



function previewFile(){
    let image = new Image();
    let file    = document.querySelector('input[type=file]').files[0];
    let reader  = new FileReader();
  
    reader.addEventListener("load", function () {
      image.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
      image.addEventListener('load', event => {
        ourCanvas.width = image.width;
        ourCanvas.height = image.height;
        ourCanvasContext.drawImage(image, 0, 0, ourCanvas.width, ourCanvas.height);
        zdjecieBezZmian = ourCanvasContext.getImageData(0, 0, ourCanvas.width, ourCanvas.height).data;
    });

    document.querySelector('#inputJasnosc').value = 0
    document.querySelector('#inputKontrast').value = 0
    document.querySelector('#inputNasycenie').value = 100
    }
}
   


function dostosujWyswietlaneZdjecie(){
    d = [...zdjecieBezZmian];
    let imageData = ourCanvasContext.createImageData(ourCanvas.width, ourCanvas.height);

    zmienJasnoscWykonaj(parseInt(document.querySelector('#inputJasnosc').value));
    zmienKontrastWykonaj(parseInt(document.querySelector('#inputKontrast').value));
    zmienNasycenieWykonaj(parseInt(document.querySelector('#inputNasycenie').value));

    imageData.data.set(d);
    ourCanvasContext.putImageData(imageData, 0, 0);

}


function normalizuj(toReturn){
    if( toReturn < 0)
        return 0;
    if( toReturn > 255)
        return 255;
    
    return toReturn;
}

function zmienJasnoscWykonaj(deltaVector){
   for( let i = 0; i < d.length; i+=4)
        for( let j = 0; j<3; j++)
            d[i+j] = normalizuj(d[i+j]+deltaVector)
}



function zmienKontrastWykonaj(deltaVector){
   let contrast = (deltaVector/100) + 1;
    let intercept = 128 * (1 - contrast);

    for(var i=0;i<d.length;i+=4)
        for(let j=0; j<3; j++)
            d[i+j] = normalizuj(d[i+j]*contrast + intercept);
}



function zmienNasycenieWykonaj(deltaVector){
     for (let i=0; i<d.length; i+=4) {
        let hsv= RGBtoHSV ([d[i], d[i+1], d[i+2]]);
        hsv[1] *= deltaVector/100;
        let rgb= HSVtoRGB(hsv);
        d[i] = normalizuj(rgb[0]);
        d[i+1] = normalizuj(rgb[1]);
        d[i+2] = normalizuj(rgb[2]);
    }
}




function RGBtoHSV(color) {
    let r,g,b,h,s,v, min, max, delta;
    r= color[0];
    g= color[1];
    b= color[2];
    min = Math.min( r, g, b );
    max = Math.max( r, g, b );


    v = max;
    delta = max - min;
    if( max != 0 )
        s = delta / max;
    else {
        s = 0;
        h = -1;
        return [h, s, undefined];
    }
    if( r === max )
        h = ( g - b ) / delta;      
    else if( g === max )
        h = 2 + ( b - r ) / delta;  
    else
        h = 4 + ( r - g ) / delta;  
    h *= 60;                
    if( h < 0 )
        h += 360;
    if ( isNaN(h) )
        h = 0;
    return [h,s,v];
}



function HSVtoRGB(color) {
    let h,s,v,r,g,b, f, i, p, q, t;
    h= color[0];
    s= color[1];
    v= color[2];
    if(s === 0 ) {
        r = g = b = v;
        return [r,g,b];
    }
    h /= 60;         
    i = Math.floor( h );
    f = h - i;          
    p = v * ( 1 - s );
    q = v * ( 1 - s * f );
    t = v * ( 1 - s * ( 1 - f ) );
    switch( i ) {
        case 0:
            [r, g, b] = [v, t, p]
            break;
        case 1:
            [r, g, b] = [q, v, p]
            break;
        case 2:
            [r, g, b] = [p, v, t]
            break;
        case 3:
            [r, g, b] = [p, q, v]
            break;
        case 4:
            [r, g, b] = [t, p, v]
            break;
        default:        
            [r, g, b] = [v, p, q]
            break;
    }
    return [r,g,b];
}


