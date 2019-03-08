//list of all notes
var notesList = [];
//check if list is open
var listOpened = false;

window.addEventListener("load", async () =>
{
    await getAllNotes();
    //console.log("Loaded");
    await sortNotes();
    //console.log("Sorted");
    await reloadAllNotes();
    //console.log("Shown");

    //shows add note panel
    $("#addNote").click(async () => 
    {
        //moves main panel to top
        $("#selectedNote").css("bottom", 0);
        //resets values
        $("#selectedNoteTitleInput").val("");
        $("#selectedNoteContents").val("");
        //shows suitable buttons
        $("#selectedNoteSave").css("display", "none");
        let button = $("#selectedNoteAddNew");
        button.css("display", "block");
        $("#selectedNoteDelete").css("display", "none");
        $("#selectedNoteHighlight").html("star_outline");

        //removes old listeners if any and adds new.
        button.off("click").on("click", async () => 
        {
            //collects information 
            //note color
            let colorsArray = [];
            colorsArray.push($("#selectedNoteColorR").val());
            colorsArray.push($("#selectedNoteColorG").val());
            colorsArray.push($("#selectedNoteColorB").val());
            //title and contents
            let noteTitle = $("#selectedNoteTitleInput").val();
            let noteContents = $("#selectedNoteContents").val();
            //check if note has to be highlighted
            let highlighted = false;
            if($("#selectedNoteHighlight").html() == "star")
            {
                highlighted = true;
            }
            //gets present date
            let now = new Date();
            //creates new Note object
            let note = new Note(colorsArray, noteTitle, noteContents, now, highlighted);
            //validates note and if its correct adds to array, then saves it to localStorage
            await validateAndSaveNewNote(note);
            alert("Note added successfully!");
        });
    });
    //opens and closes saved notes tab
    $("#showNotes").click(() => 
    {
        if(!listOpened)
        {
            listOpened = true;
            $("#notesList").css("left", "0px");
        }
        else
        {
            listOpened = false;
            $("#notesList").css("left", "-350px");
        }
    });
    //deletes all notes
    $("#deleteNotes").click(async ()=>
    {
        await removeAllNotes();
    });
    //changes state of highlight option in main panel
    $("#selectedNoteHighlight").click(() =>
    {
        if($("#selectedNoteHighlight").html() == "star")
        {
            $("#selectedNoteHighlight").html("star_border");
        }
        else
        {
            $("#selectedNoteHighlight").html("star");
        }
    });

});
//gets all notes from array and draws matching divs
function reloadAllNotes()
{
    return new Promise((resolve)=>
    {
        $("#notesListHighlighted").html("");
        $("#notesListNormal").html("");
        notesList.forEach((el) =>
        {
            let color = "rgb("+el.colorR+","+el.colorG+","+el.colorB+")";

            let noteDiv = document.createElement("div");
            noteDiv.className = "noteDiv";
            noteDiv.style.backgroundColor = color;

            let noteTitle = document.createElement("p");
            noteTitle.className = "noteDivTitle";
            noteTitle.innerHTML = el.title;
            noteDiv.appendChild(noteTitle);

            let noteDate = document.createElement("p");
            noteDate.className = "noteDivDate";
            let dateNow = new Date(el.date);

            let dateDay = dateNow.getDate();
            if(dateDay < 10)
                dateDay = '0' + dateDay;

            let dateMonth = dateNow.getMonth()+1;
            if(dateMonth < 10)
                dateMonth = '0' + dateMonth;

            let dateYear = dateNow.getFullYear();
            let dateString = dateDay+"/"+dateMonth+"/"+dateYear;
            noteDate.innerHTML = dateString;
            noteDiv.append(noteDate);

            //listeners that changes background if hovers over element
            noteDiv.addEventListener("mouseover", () =>
            {
                noteDiv.style.backgroundColor = "#35363b";
            });
            noteDiv.addEventListener("mouseout", () =>
            {
                noteDiv.style.backgroundColor = color;
            });

            //listener that opens main panel and sets matching parameters from Note object
            noteDiv.addEventListener("click", () =>
            {
                $("#selectedNote").css("bottom", 0);
                $("#selectedNoteTitleInput").val(el.title);
                $("#selectedNoteContents").val(el.contents);
                //shows suitable buttons
                $("#selectedNoteAddNew").css("display", "none");
                $("#selectedNoteSave").css("display", "block");
                $("#selectedNoteDelete").css("display", "block");
                //changes value of RGB inputs and fires input change event
                $("#selectedNoteColorR").val(el.colorR).change();
                $("#selectedNoteColorG").val(el.colorG).change();
                $("#selectedNoteColorB").val(el.colorB).change();
                //if note is highlighted then show diffrent icon
                if(el.isHighlighted)
                {
                    $("#selectedNoteHighlight").html("star");
                }
                else
                {
                    $("#selectedNoteHighlight").html("star_outline");
                }
                //removes old listeners if any then adds new that saves existing note.
                $("#selectedNoteSave").off("click").on("click", async () => 
                {
                    await validateAndEditNote(el);
                });
                //removes old listenrs if any then adds new that removes exsiting note.
                $("#selectedNoteDelete").off("click").on("click", async () => 
                {
                    if(confirm("Are you sure you want to delete this note?"))
                    {
                        await removeNote(el);
                    }

                });

            });
            //if note is highlighted adds icon in notes list and adds to normal or highlighted section
            if(el.isHighlighted)
            {  
                let highlighted = document.createElement("i");
                highlighted.className += "material-icons";
                highlighted.className += " noteDivHighlighted";
                highlighted.innerHTML = "star"
                highlighted.style.color = "#efefef";
                noteDiv.appendChild(highlighted);
                $("#notesListHighlighted").append(noteDiv);
            }
            else
            {
                $("#notesListNormal").append(noteDiv);
            }
        });
        resolve();
    });
}