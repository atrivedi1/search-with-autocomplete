$(document).ready(function() {
    //assumptions
    var apiUrl = "https://api.viki.io/v4/search.json?c=b&per_page=5&with_people=true&with_paywall=1&app=100266a&t=1440586215";
    var appId = "100266a";
    var resultsCap = "5";
    var withPeople = true;

    //cache
    var cache = {};

    //current matching results
    var currentMatchingResults = [];

    //helper functions
    var findMatchingResults = function(searchTerm) {
        console.log("trying to find matching results")
        //clear results
        currentMatchingResults = [];

        //find matching results
        for(var title in cache) {
            var titleContainsCharacters = title.indexOf(searchTerm) > -1 ? true : false;
     
            if(titleContainsCharacters) {
                var matchingImageInfo = {}
                matchingImageInfo[title] = cache[title];
                currentMatchingResults.push(matchingImageInfo)
            }
        }
    };

    var generateSearchParams = function(searchTerm){
        var params = {
            c: searchTerm,
            per_page: resultsCap,
            with_people: withPeople,
            app: appId,
            t: Date.now()
        };

        return params;
    }

    var getDataFromApi = function(searchParams) {
        var searchTerm = searchParams.c; 

        $.get(apiUrl, function(data) {
            console.log("search performed successfully")
            
            data.forEach(function(imageData){
                var imageTitle = imageData.tt.trim().toLowerCase();
                var imageUrl = imageData.i;
                cache[imageTitle] = imageUrl;
            });

            findMatchingResults(searchTerm);
        });
    };
    
    var searchTitlesAndDisplayResults = function(searchTerm) {
        //if cache is empty then get data from API;
        if(Object.keys(cache).length === 0) {
            var searchParams = generateSearchParams(searchTerm);
            getDataFromApi(searchParams);
        }
        //once cache is created, find matching titles
        else { findMatchingResults(searchTerm) }

        //display results
        
    };

    //event listeners/handlers
    $("#search-input").keyup(function(e) {
        var currentValueInSearchField = e.target.value.toLowerCase();
        return searchTitlesAndDisplayResults(currentValueInSearchField)
    });
});