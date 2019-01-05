Notatka = {
        title: 'przykladowa notatka',
        content: 'nie zapomnij kupic mleka',
        data: Date.now(),
        //let data = new Date(timestamp)
        //data.get

}

let jNotatka = JSON.stringify(Notatka)

localStorage.setItem('notatki',jNotatka)



//zrob klase ktora przechowuje tablice tych notatek 
//localStorage.length
//localStorage.key(0)
//localStorage['notatki'] ~= getItem




let tablicaNotatek = [];
if( localStorage.getItem("tablicaNotatek") != null){
    tablicaNotatek = JSON.parse(localStorage.getItem('tablicaNotatek'))


}


function dodajNotatke() {
    let tekst = dodajNotatkeText.value;

    let nowaNotatka = new Notatka();
    nowaNotatka.content = tekst;

    tablicaNotatek.push(nowaNotatka)
    localStorage["tablicaNotatek"] = tablicaNotatek;
}