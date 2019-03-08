class Note
{
    constructor(colors, title, contents, date, isHighlighted)
    {
        this.colorR = colors[0];
        this.colorG = colors[1];
        this.colorB = colors[2];
        this.title = title;
        this.contents = contents;
        this.date = date;
        this.isHighlighted = isHighlighted;
    }

}
function saveAllNotes()
{
    return new Promise((resolve) =>
    {
        let notesString = JSON.stringify(notesList);
        localStorage.setItem("appNotes", notesString);
        resolve();
    });
}
function getAllNotes()
{
    return new Promise((resolve) => 
    {
        let notesString = localStorage.getItem("appNotes");
        notesList = JSON.parse(notesString);
        if(notesList == null)
        {
            notesList = [];
        }
        resolve();
    });
}
function sortNotes()
{
    return new Promise((resolve) =>
    {
        if(notesList != null)
        {
            notesList.sort((a,b) =>
            {
                if(a.date < b.date)
                    return 1;
                if(a.date > b.date)
                    return -1;

                return 0;
            });
        }
        resolve();
    });
}
async function validateAndSaveNewNote(note)
{
    return new Promise(async (resolve) =>
    {

        let noteTitle = $("#selectedNoteTitleInput").val();
        let noteContents = $("#selectedNoteContents").val();
        //change 'enter' to /n
        noteContents = noteContents.split('\u000A').join("\\n");
        if(noteTitle.length > 30)
        {
            alert("Please shorten up your note title.");
            return false;   
        }
        notesList.unshift(note);
        await saveAllNotes();
        await sortNotes();
        await reloadAllNotes();
        resolve();
        return true;
    });
    
}
async function validateAndEditNote(note)
{
    return new Promise(async (resolve) => 
    {
        let colorsArray = [];
        colorsArray.push($("#selectedNoteColorR").val());
        colorsArray.push($("#selectedNoteColorG").val());
        colorsArray.push($("#selectedNoteColorB").val());

        let newTitle = $("#selectedNoteTitleInput").val();
        if(newTitle.length > 30)
        {
            alert("Please shorten up your note title.");
            return false;   
        }
        let newContents = $("#selectedNoteContents").val();
        //change 'enter' to /n
        newContents = newContents.split('\u000A').join("\\n");
        let now = new Date();
        let newIsHighlighted = false;
        if($("#selectedNoteHighlight").html() == "star")
            newIsHighlighted = true;
        
        note.colorR = colorsArray[0];
        note.colorG = colorsArray[1];
        note.colorB = colorsArray[2];
        note.title = newTitle;
        note.contents = newContents;
        note.date = now;
        note.isHighlighted = newIsHighlighted;

        await saveAllNotes();
        await sortNotes();
        notesList = notesList.filter(item => item !== note);
        notesList.unshift(note);
        await reloadAllNotes();
        alert("Note edited sucessfully!");
        resolve();
        return true;
    });
}
async function removeNote(note)
{
    return new Promise(async (resolve) => 
    {
        notesList = notesList.filter(item => item !== note);
        $("#selectedNoteTitleInput").val("");
        $("#selectedNoteContents").val("");
        $("#selectedNoteHighlight").html("star_outline");
        $("#selectedNoteAddNew").css("display", "block");
        $("#selectedNoteSave").css("display", "none");
        $("#selectedNoteDelete").css("display", "none");
        await saveAllNotes();
        await sortNotes();
        await reloadAllNotes();
        resolve();
    });
}
async function removeAllNotes()
{
    return new Promise(async (resolve) =>
    {
        let respond = prompt('Are you sure you want to delete all your notes? If so type in "DELETE"');
        if(respond == "DELETE")
        {
            notesList = [];
            await saveAllNotes();
            await reloadAllNotes();
            resolve();
        }

    })
}