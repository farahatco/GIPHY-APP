
var topic = ["Axolotl", "Falcon", "Fox", "Goat", "Lion", "Monkey", "Moose", "Numbat", "Opossum", "Otter", "Pig", "Quoll", "Rabbit", "Wolf", "Yak", "Zebra"];
var favGiflist = [];

$(document).ready(function () {
    populateButtons();

    $("#addGif1").on("click", function () {
        $(".diplayButton").empty();
        addButton();
        populateButtons();
    })

    $(document).on("click", ".buttonsList", function () {
        var searchGif = $(this).text();
        displayGif(searchGif);
    });

    $(document).on("dblclick", ".buttonsList", function (event) {
        event.preventDefault();
        var favGif = $(this).text();
        if (!searchArray(favGif, favGiflist)) {
            AddToFavList(favGif);
        }
    });

    $(document).on("click", "#gifs-appear-here img", function () {
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("animateImage"));
            $(this).attr("data-state", "animate");
        }
        else if (state === "animate") {
            $(this).attr("src", $(this).attr("stillImage"));
            $(this).attr("data-state", "still");
        }
    });

    $(document).on("click", "#display-fav li", function () {
        var searchGif = $(this).text();
        displayGif(searchGif);
    });

    $("#Add-fav").on("click", function (event) {
        event.preventDefault();
        var favGif = $("#fav-gif").val().trim();
        if (!searchArray(favGif, favGiflist)) {
            AddToFavList(favGif);
        }
        $("#fav-gif").val("");
    });

    // Display Favotite List when Page load
    display_fav();

    //  Functions

    // function to Add Gif Buttons
    function addButton() {
        var newGif = $("#newGif").val().trim().toLowerCase();
        if (newGif.length != 0) {
            if (!searchArray(newGif, topic))
                topic.push(newGif);
            $("#newGif").val(" ");
        }
        else {
            $("#newGif").attr("placeholder", "Enter Values");
            alert("You Must Enter Search Value");
            $("#newGif").focus()
        }
    }

    // function to populate Gif Buttons
    function populateButtons() {
        for (var i = 0; i < topic.length; i++) {
            var bt = $("<button>");
            bt.attr("class", "buttonsList");
            bt.text(topic[i]).val();
            bt.addClass("btn btn-primary")
            bt.addClass("pad")
            $(".diplayButton").append(bt);
        }
    }
    // function to Add Favorite Gif To List
    function AddToFavList(name) {
        if (localStorage.getItem('favorite')) {
            favGiflist = JSON.parse(localStorage.getItem('favorite'));
        } else {
            favGiflist = [];
        }
        var favGif = name //$("#fav-gif").val().trim();
        favGiflist.push(favGif);
        $("#display-fav").append("<li> " + favGif + "</li>");
        $("#display-fav").addClass("list-group-item-active")
        $("#display-fav").css("list-style", "none")
        $("#display-fav").addClass("list-group list-group-item list-group-item-default");
        localStorage.setItem("favorite", JSON.stringify(favGiflist));
        $("#fav-gif").val("");
    }

    // function to Display Favorite Gif 
    function display_fav() {
        var favJson = localStorage.getItem("favorite");
        var favList = JSON.parse(favJson);
        for (i = 0; i < favList.length; i++) {
            $("#display-fav").prepend("<li> " + favList[i] + "</li>");
            $("#display-fav").addClass("list-group-item-active")
            $("#display-fav").css("list-style", "none")
            $("#display-fav").addClass("list-group list-group-item list-group-item-default");
        }
    }
    // function to Display selected Gif 

    function displayGif(searchGif) {
        $("#gifs-appear-here").empty();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            searchGif + "&api_key=dc6zaTOxFJmzC&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response);
            response.data.forEach(function (gif) {
                var imageDiv = $("<div>");
                var animalImage = $("<img>").attr({
                    "src": gif.images.fixed_height_still.url,
                    "data-state": "still",
                    "animateImage": gif.images.fixed_height.url,
                    "stillImage": gif.images.fixed_height_still.url,
                    "rating": gif.rating
                });
                imageDiv.addClass("gifDisplay");
                animalImage.addClass("img-responsive");
                animalImage.addClass("img-thumbnail");
                //animalImage.append(animalImage);
                console.log(gif.rating)
                imageDiv.append("<div>Rate IS : " + animalImage.attr("rating") + "</div>")
                imageDiv.append(animalImage)
                $("#gifs-appear-here").append(imageDiv)
                console.log("gif", gif);
                console.log("animated " + gif.images.fixed_height.url);
                console.log("still " + gif.images.fixed_height_still.url)
            })

        });
    }

    // function to Prevent Duplicate Same Gif Or Favorite Gif 
    function searchArray(item, arr) {
        var newarr = [];
        var newitem = item.toLowerCase();
        for (i = 0; i < arr.length; i++) {
            var newArrItem = arr[i].toLowerCase();
            newarr.push(newArrItem)

        }
        var result = $.inArray(newitem, newarr);
        console.log(newarr)
        if (result === -1) {
            return false;
        }
        else {
            alert("Already Exist!...")
            return true;
        }
    }
});
