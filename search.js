$(document).ready(function() {
    //assumptions
    var apiUrl = "https://api.viki.io/v4/search.json?";
    var appId = "100266a";
    var resultsCap = "5";
    var withPeople = true;

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

    function displayMatchingImagesFromApi(searchParams) {
        //reset currentMatchingResults
        currentMatchingResults = [];

        //retrieve matching Images and repopulate currentMatchingResults
        $.ajax({
            url: apiUrl,
            type: "get", 
            data: searchParams,
            dataType: 'json',
            success: function (images) {
                images.forEach(function(image){
                    var imageData = {};
                    imageData.titleEn = image.tt;
                    imageData.url = image.i;

                    currentMatchingResults.push(imageData);
                });
                
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
        displayMatchingImagesFromApi(searchParams);
    };

    function displayMatches() {
        console.log("trying to display images -->", currentMatchingResults);
        currentMatchingResults.forEach(function(matchingImage){
            //create new image container
            var newImageContainer = document.createElement("div");
            newImageContainer.setAttribute("class", "imageContainer");
            newImageContainer.innerText = matchingImage.titleEn;

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
    $("#search-input").keyup(function(e) {
        var currentValueInSearchField = e.target.value.toLowerCase();
        
        if(currentValueInSearchField){ 
            searchImagesAndDisplayMatches(currentValueInSearchField)
        }
    });
});