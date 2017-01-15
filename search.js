$(document).ready(function() {
    //general assumptions
    var apiUrl = "https://api.viki.io/v4/search.json?";
    var appId = "100266a";
    var resultsCap = "5";
    var withPeople = true;

    //language selected (init at 'tt' for english)
    var language = "tt";

    //current matching results
    var currentMatchingResults = [];

    //images div 
    var images = document.getElementById("images");

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

    function filterMatchesByLanguage(searchTerm, images) {
        var filteredMatches = images.filter(function(image){
            //if title in selected langauge exists, set it variable
            if(image[language]){
                var imageTitleInSelectedLanguage = image[language].toLowerCase();
            }
            
            //return only images that have valid title in selected language and contain search string
            return imageTitleInSelectedLanguage && imageTitleInSelectedLanguage.indexOf(searchTerm) > -1;
        });

        currentMatchingResults = filteredMatches.map(function(image){
            var imageData = {};
            imageData.title = image[language];
            imageData.url = image.i;
            return imageData;
        })

        console.log("filtered matches -->", currentMatchingResults);
    }

    function displayMatchingImagesFromApi(searchTerm, searchParams) {
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
    
    function searchImagesAndDisplayMatches(searchTerm) {
        //get matching images from API
        var searchParams = generateSearchParams(searchTerm);
        displayMatchingImagesFromApi(searchTerm, searchParams);
    };

    function displayMatches() {
        console.log("trying to display images -->", currentMatchingResults);
        
        //clear images div
        $('#images').empty();
        
        //append new images to images div
        currentMatchingResults.forEach(function(matchingImage){
            //create new image container
            var newImageContainer = document.createElement("div");
            newImageContainer.setAttribute("class", "imageContainer");
            newImageContainer.innerText = matchingImage.title;

            //create new image
            var newImage = document.createElement("img");
            newImage.setAttribute("src", matchingImage.url);

            //append new image to image container
            newImageContainer.appendChild(newImage);

            //append new image container to dom
            images.appendChild(newImageContainer);
        });
    }

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

    $("#search-input").keyup(_.debounce(function(e) {
        var currentValueInSearchField = e.target.value.toLowerCase();
        
        if(currentValueInSearchField){ 
            searchImagesAndDisplayMatches(currentValueInSearchField)
        }
    }, 250));
});