$( document ).ready(function() {

    var printValueInSearchField = function(text) {
        console.log(text);
    }

    $( "#search-input" ).keyup(function(e) {
        var currentValueInSearchField = e.target.value;
        return printValueInSearchField(currentValueInSearchField)
    });
});