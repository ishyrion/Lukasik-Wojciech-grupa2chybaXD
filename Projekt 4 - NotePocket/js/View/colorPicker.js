window.addEventListener("load", () =>
{
    //inits values
    let r =  $("#selectedNoteColorR").val();
    let g =  $("#selectedNoteColorG").val();
    let b =  $("#selectedNoteColorB").val();
    let color = 'rgb('+r+','+g+','+b+')';

    $("#selectedNoteColor").css("backgroundColor", color);
    $("#selectedNoteTitle").css("borderBottom", "2px solid "+color);
    $("#selectedNoteTitleInput").css("color", color);
    $("#selectedNoteContents").css("borderBottom", "2px solid "+color);
    let addButton = $("#selectedNoteAddNew");
    addButton.css("border", "2px solid "+color);
    addButton.css("color", color);
    let saveButton = $("#selectedNoteSave");
    saveButton.css("border", "2px solid "+color);
    saveButton.css("color", color);
    $(".selectedNoteIcon").css("color", color);
    let icons = $(".iIcon");
    icons.css("color", color);
    icons.css("borderColor", color);

    //if input value changes then changes objects colors
    $(".selectedNoteRange").on('input change',() =>
    {
        r =  $("#selectedNoteColorR").val();
        g =  $("#selectedNoteColorG").val();
        b =  $("#selectedNoteColorB").val();
        color = 'rgb('+r+','+g+','+b+')';
        $("#selectedNoteColor").css("backgroundColor", color);
        $("#selectedNoteTitle").css("borderBottom", "2px solid "+color);
        $("#selectedNoteTitleInput").css("color", color);
        $("#selectedNoteContents").css("borderBottom", "2px solid "+color);
        let addButton = $("#selectedNoteAddNew");
        addButton.css("border", "2px solid "+color);
        addButton.css("color", color);
        let saveButton = $("#selectedNoteSave");
        saveButton.css("border", "2px solid "+color);
        saveButton.css("color", color);
        $(".selectedNoteIcon").css("color", color);
        let icons = $(".iIcon");
        icons.css("color", color);
        icons.css("borderColor", color);
    });

});