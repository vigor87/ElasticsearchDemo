var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({  
    host: '35.189.31.8:9200',
    // host: 'localhost:9200',
    log: 'info'
});

var indexName = "randomindex";

/**
* Delete an existing index
*/
function deleteIndex() {  
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {  
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;  

function initMapping() {
    console.log('initMapping');
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                title: { type: "string", index: 'not_analyzed' },
                content: { type: "string" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple"
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addDocument(document) {  
    return elasticClient.index({
        index: indexName,
        type: "document",
        body: {
            title: document.title,
            content: document.content
        }
    });
}
exports.addDocument = addDocument;

function getSuggestions(input) {  
    return new Promise((resolve, reject) => {
        elasticClient.search({
            index: indexName,
            type: 'document',
            body: {
                query: {
                    multi_match: {
                        query: input,
                        fields: ['title', 'content'],
                        type : "phrase_prefix" 
                    }
                }
            }
            }).then(resolve).then(reject);
    });
    // return elasticClient.suggest({
    //     index: indexName,
    //     body: {
    //         docsuggest: {
    //             text: input,
    //             completion: {
    //                 field: "suggest",
    //                 fuzzy: true
    //             }
    //         }
    //     }
    // })
}
exports.getSuggestions = getSuggestions;