let recordedSounds = [[],[],[],[],[]];
let isRecording =       [ false,false,false,false,false ] 
let isPlaying =         [ false,false,false,false,false ]
let shouldRepeat =      [ false,false,false,false,false ]
let repeatFunctionOnInterval = [ null,null,null,null,null ]
let repeat = [4]
let timeOfStartRecording=[5]

// This code is keybord users
// This code will add keydown event listener to the document
document.addEventListener("keydown", function (event) {
    let number = event.keyCode;
    let element = "";

    switch (number) {
        case 65:
            element = document.querySelector("#keyA");
            document.querySelector("#keyA").classList.add("active");
            break;
        case 83:
            element = document.querySelector("#keyS");
            document.querySelector("#keyS").classList.add("active");
            break;
        case 68:
            element = document.querySelector("#keyD");
            document.querySelector("#keyD").classList.add("active");
            break;
        case 70:
            element = document.querySelector("#keyF");
            document.querySelector("#keyF").classList.add("active");
            break;
        case 71:
            element = document.querySelector("#keyG");
            document.querySelector("#keyG").classList.add("active");
            break;
        case 72:
            element = document.querySelector("#keyH");
            document.querySelector("#keyH").classList.add("active");
            break;     
        case 74:     
            element = document.querySelector("#keyJ");
            document.querySelector("#keyJ").classList.add("active");
            break;
        case 75:
            element = document.querySelector("#keyK");
            document.querySelector("#keyK").classList.add("active");
            break;
        case 76:
            element = document.querySelector("#keyL");
            document.querySelector("#keyL").classList.add("active");
            break;
        default:
            return;
    }


    let soundToBePlayed = document.querySelector("#keyCode" + number);
    soundToBePlayed.play();    
    addSoundToChannelsIfTheyAreRecording(soundToBePlayed)        
})


document.addEventListener("keyup", function (event) {
    let number = event.keyCode;
    let element = "";

    switch (number) {
        case 65:
            element = document.querySelector("#keyA");
            document.querySelector("#keyA").classList.remove("active");
            break;
        case 83:
            element = document.querySelector("#keyS");
            document.querySelector("#keyS").classList.remove("active");
            break;
        case 68:
            element = document.querySelector("#keyD");
            document.querySelector("#keyD").classList.remove("active");
            break;
        case 70:
            element = document.querySelector("#keyF");
            document.querySelector("#keyF").classList.remove("active");
            break;
        case 71:
            element = document.querySelector("#keyG");
            document.querySelector("#keyG").classList.remove("active");
            break;
        case 72:
            element = document.querySelector("#keyH");
            document.querySelector("#keyH").classList.remove("active");
            break;     
        case 74:     
            element = document.querySelector("#keyJ");
            document.querySelector("#keyJ").classList.remove("active");
            break;
        case 75:
            element = document.querySelector("#keyK");
            document.querySelector("#keyK").classList.remove("active");
            break;
        case 76:
            element = document.querySelector("#keyL");
            document.querySelector("#keyL").classList.remove("active");
            break;
        default:
            break;
    }  
})



function addSoundToChannelsIfTheyAreRecording(soundToBePlayed){
    for(let i=1; i<=4; i++)
        if(isRecording[i])
            recordedSounds[ i ].push( {
                sound: soundToBePlayed,
                time: (new Date().getTime()) - timeOfStartRecording[ i ]
            })
        

}





function Play(channelNumber){
    if( isPlaying[ channelNumber ] == false ){
        Stop( channelNumber );
        //tak jak na starych magnetofonach - tylko 1 guzik moze byc aktywny.
        //naciskasz jakis inny - wciska sie a inne wyskakuja
    
        isPlaying[ channelNumber ] = true;
        PlayMusic( channelNumber );   //na pewno zagraj przynajmniej 1

        if( shouldRepeat[ channelNumber ] && recordedSounds[ channelNumber ].length >0)
            repeatFunctionOnInterval[ channelNumber ] = setInterval( 
                PlayMusic , 
                recordedSounds[ channelNumber ][ recordedSounds[ channelNumber ].length-1 ].time ,
                channelNumber
                )
        else if( recordedSounds[ channelNumber ].length >0)   
            setTimeout(function(){isPlaying[ channelNumber ] = false;}, // po zagranym tylko 1 utworze, odznacz ze juz nie gramy
            recordedSounds[ channelNumber ][ recordedSounds[ channelNumber ].length-1 ].time )
        
    }
}


function PlayMusic( channelNumber ){
    if( recordedSounds[ channelNumber ].length <= 0)
        return; // bo nic nie ma

    for(let i=0; i<recordedSounds[ channelNumber ].length-1; i++)
            if(isPlaying[ channelNumber ]){//still Playing - nobody touched stop? right?
                setTimeout(function(){
                    recordedSounds[ channelNumber ][ i ].sound.play();
                }, recordedSounds[ channelNumber ][ i ].time)
            }
}


function Repeat( channelNumber , button){
    if( shouldRepeat[ channelNumber ] == false){
        shouldRepeat[ channelNumber ] = true;   
        button.innerHTML = "Repeat on Play = ON";
    }
    else{
        if( repeatFunctionOnInterval[ channelNumber ] != null ){
            clearInterval( repeatFunctionOnInterval[ channelNumber ] );
            repeatFunctionOnInterval[ channelNumber ] = null;
            isPlaying[ channelNumber ] = false;
        }

        shouldRepeat[ channelNumber ] = false;   
        button.innerHTML = "Repeat on Play = OFF";
    }
}




function Stop( channelNumber ){
    if( isPlaying[ channelNumber ] ){
        isPlaying[ channelNumber ] = false;

        if( repeatFunctionOnInterval[ channelNumber ] != null ){
            clearInterval( repeatFunctionOnInterval[ channelNumber ] );
            repeatFunctionOnInterval[ channelNumber ] = null;
        }
    }

    if( isRecording[ channelNumber] ){
        isRecording[ channelNumber] = false;
        recordedSounds[ channelNumber ].push( {
            sound: null,
            time: (new Date().getTime()) - timeOfStartRecording[ channelNumber ]
        })
    }
}


function Record( channelNumber ){
    if(isRecording[ channelNumber ] == false){
        Stop( channelNumber );
        //tak jak na starych magnetofonach - tylko 1 guzik moze byc aktywny.
        //naciskasz jakis inny - wciska sie a inne wyskakuja

        isRecording[ channelNumber ] = true;
        recordedSounds[ channelNumber ] = [] // nagrywamy od nowa
        timeOfStartRecording[ channelNumber ] = new Date().getTime();
    }
}