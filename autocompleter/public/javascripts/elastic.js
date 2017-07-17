// Instantiate the Bloodhound suggestion engine
var movies = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: '/documents/suggest/%QUERY',
        filter: function (results) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(results.hits.hits, function (result) {
            // return $.map(results.docsuggest[0].options, function (result) {
                return {
                    value: result._source.title
                };
            });
        },
        wildcard: '%QUERY'
    }
});

// Initialize the Bloodhound suggestion engine
movies.initialize();

// Instantiate the Typeahead UI
$('.typeahead').typeahead(null, {
    displayKey: 'value',
    source: movies.ttAdapter()
});