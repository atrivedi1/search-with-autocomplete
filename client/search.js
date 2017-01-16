$(document).ready(function() {
    //key dom elements
    var potentialMatches = document.getElementById("potential-matches")
    var images = document.getElementById("images-container");

    //general assumptions
    var apiUrl = "https://api.viki.io/v4/search.json?";
    var appId = "100266a";
    var resultsCap = "5";
    var withPeople = true;

    //language selected (init at 'tt' for english)
    var language = "tt";

    //current matching image results
    var currentMatchingResults = [];

    //helper functions
   function generateSearchParams(searchTerm){
        var params = {
            c: searchTerm,
            per_page: "5",
            with_people: true,
            app: appId,
            t: Date.now()
        };

        return params;
    }

    function handleSearch(searchTerm) {
        //get matching images from API
        var searchParams = generateSearchParams(searchTerm);
        fetchAndDisplayMatchingImages(searchTerm, searchParams);
    };

    function filterMatchesByLanguage(searchTerm, images) {
        //filter on images that contain searchTerm AND are in the selected language
        var filteredMatches = images.filter(function(image){
            //if title in selected langauge exists, set it to a variable
            if(image[language]){
                var imageTitleInSelectedLanguage = image[language].toLowerCase();
            }
            
            //return only images that have valid title in selected language and contain search string
            return imageTitleInSelectedLanguage && imageTitleInSelectedLanguage.indexOf(searchTerm) > -1;
        });

        //build out current matching results array with cleaned up version of filtered matches
        currentMatchingResults = filteredMatches.map(function(image){
            var imageData = {};
            imageData.title = image[language];
            imageData.url = image.i;
            return imageData;
        })
    }

    function displayMatches() {
        //clear datalist
        $('#potential-matches').empty();    
        //clear images div
        $('#images-container').empty();
        
        //append matching image titles to datalist and matching images to images div
        currentMatchingResults.forEach(function(matchingImage){
            //create new option elements based on matches
            $('#potential-matches').append("<option value='" + matchingImage.title + "'>");

            //create new image data container
            var newImageContainer = document.createElement("div");
            newImageContainer.setAttribute("class", "image-data-container");
            
            //creat new image title div
            var newImageTitle = document.createElement("div");
            newImageTitle.setAttribute("class", "image-title-container");
            
            var title = document.createElement("div");
            title.setAttribute("class", "image-title")
            title.innerText = matchingImage.title;

            newImageTitle.appendChild(title);
      
            //create new image
            var newImage = document.createElement("img");
            newImage.setAttribute("class", "image");
            newImage.setAttribute("src", matchingImage.url);

            //append image title and image to image data container
            newImageContainer.appendChild(newImageTitle);
            newImageContainer.appendChild(newImage);

            //append new image container to dom
            images.appendChild(newImageContainer);
        });
    }

    function fetchAndDisplayMatchingImages(searchTerm, searchParams) {
        //reset currentMatchingResults
        currentMatchingResults = [];

        //retrieve matching Images and repopulate currentMatchingResults
        $.ajax({
            url: apiUrl,
            type: "get", 
            data: searchParams,
            dataType: 'json',
            success: function (images) {
                filterMatchesByLanguage(searchTerm, images);
                displayMatches();
            },
            error: function (err) {
                console.log(err)
            }
        });
    };
    
    //event listeners/handlers
    $("#language-dropdown").change(function(e) {
        var languageSelected = e.target.value;
        
        //set language
        switch(languageSelected){
            case "english":
                language = "tt";
                break;
            case "spanish":
                language = "te"
                break;
            case "french":
                language = "tf"
                break;
            default:
                language = "tt";
                break;
        }

        //clear out search bar once language is selected
        $("#search-input").val("");
    });

    $("#search-input").bind('input', _.debounce(function(e) {
        //get keycode of current keypress event
        var keyCode = (e.keyCode || e.which);
        
        //get current search value
        var currentValueInSearchField = e.target.value.toLowerCase();
        
        //ignore arrow strokes
        if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
            return;
        }

        //if there is a search term in the search bar, handle search
        if(currentValueInSearchField){ 
            handleSearch(currentValueInSearchField)
        }
    }, 250));
});