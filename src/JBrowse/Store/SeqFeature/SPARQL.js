define([ 'dojo/_base/declare',
         'JBrowse/Store/SeqFeature',
         'JBrowse/Util',
         'JBrowse/Model/ArrayRepr',
         'JBrowse/Store/NCList',
         'JBrowse/Store/LazyArray',
         'dojo/io-query'
       ],
       function( declare, SeqFeatureStore, Util, ArrayRepr, GenericNCList, LazyArray, ioQuery ) {

return declare( SeqFeatureStore,

/**
 * @lends JBrowse.Store.SeqFeature.SPARQL
 */
{

    constructor: function(args) {
        this.url = this.urlTemplate;
        this.refSeq = args.refSeq;
        this.baseUrl = args.baseUrl;
        this.url = Util.resolveUrl(
            this.baseUrl,
            Util.fillTemplate( args.urlTemplate,
                               { 'refseq': this.refSeq.name }
                             )
        );
    },

    load: function() {
        // ping the endpoint to see if it's there
        dojo.xhrGet({ url: this.url+'?'+ioQuery.objectToQuery({ query: 'SELECT ?s WHERE { ?s ?p ?o } LIMIT 1' }),
                      handleAs: "text",
                      failOk: true,
                      load:  Util.debugHandler( this, function(o) { this.loadSuccess(o); }),
                      error: dojo.hitch( this, function(error) {
                                             if( error.status != 404 )
                                                 console.error(''+error);
                                             this.loadFail(error, url);
                                         })
        });
    },

    _makeQuery: function( startBase, endBase ) {
        return "select ?p where { ?p a <foo> }";
        return "SELECT ?type ?start ?end ?strand ?note"
            + "WHERE {"
            + "}"
        ;
    },

    loadSuccess: function( o ) {
        this.empty = false;
        this.setLoaded();
    },

    loadFail: function() {
        this.empty = true;
        this.setLoaded();
    },

    iterate: function( startBase, endBase, origFeatCallback, finishCallback ) {
        // ping the endpoint to see if it's there
        dojo.xhrGet({ url: this.url+'?'+ioQuery.objectToQuery({
                          query: this._makeQuery( startBase, endBase )
                      }),
                      handleAs: "json",
                      failOk: true,
                      load:  Util.debugHandler( this, function(o) {
                          this._resultsToFeatures(o, origFeatCallback);
                          finishCallback();
                      }),
                      error: dojo.hitch( this, function(error) {
                                             if( error.status != 404 )
                                                 console.error(''+error);
                                             this.loadFail(error, url);
                                         })
        });
    },

    _resultsToFeatures: function( results, featCallback ) {
        var rows = ((results||{}).results||{}).bindings || [];
        if( ! rows.length )
            return;
        var get = function(n) { return this[n]; };
        dojo.forEach( rows, function( row ) {
            var f = {
                start:  row.start.value,
                end:    row.end.value,
                strand: row.strand.value,
                id:     row.id.value,
                get:    get
            };
            featCallback( f, row.id.value );
        });
    }
});

});

