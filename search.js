$( document ).ready(function() {
    //assumptions
    var apiUrl = "https://api.viki.io/v4/search.json?c=b&per_page=5&with_people=true&with_paywall=1&app=100266a&t=1440586215";
    var appId = "100266a";
    var resultsCap = "5";
    var withPeople = true;

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

    var makeGetRequest = function(searchParams) {
        $.get(apiUrl, function(data) {
            console.log(data);
            alert( "search was performed" );
        });
    };
    
    var searchApi = function(searchTerm) {
        var searchParams = generateSearchParams(searchTerm);
        makeGetRequest(searchParams);
    };

    $( "#search-input" ).keyup(function(e) {
        var currentValueInSearchField = e.target.value;
        return searchApi(currentValueInSearchField)
    });
});