let notatka = {
        title: 'przykladowa notatka',
        content: 'nie zapomnij kupic mleka',
        data: Date.now(),
        //let data = new Date(timestamp)
        //data.get

}

let jNotatka = JSON.stringify(notatka)

localStorage.setItem('notatki',jNotatka)

let a = JSON.parse(localStorage.getItem('notatki'))

//zrob klase ktora przechowuje tablice tych notatek 
//localStorage.length
//localStorage.key(0)
//localStorage['notatki'] ~= getItem