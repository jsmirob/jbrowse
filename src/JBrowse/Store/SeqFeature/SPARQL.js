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
        this.queryTemplate = args.queryTemplate ||
            " PREFIX pos:<https://github.com/dbcls/bh12/wiki/Feature-Annotation-Location-Description-Ontology#>"
            + " PREFIX up:<http://purl.uniprot.org/core/>"
            + " SELECT ?start ?end"
            + " WHERE {"
            + "  ?protein up:encodedBy ?gene ."
            + "  ?gene pos:locationOn ?location ."
            + "  ?location pos:begin ?sp ."
            + "  ?location pos:end ?ep."
            + "  ?sp a pos:Position ."
            + "  ?sp pos:position ?start ."
            + "  ?ep a pos:Position ."
            + "  ?ep pos:position ?end ."
            + "  FILTER( ?start <= {start} && ?end >= {end} ) ."
            + " }"
        ;
    },

    load: function() {
        // ping the endpoint to see if it's there
        dojo.xhrGet({ url: this.url+'?'+ioQuery.objectToQuery({ query: 'SELECT ?s WHERE { ?s ?p ?o } LIMIT 1' }),
                      handleAs: "text",
                      failOk: true,
                      load:  Util.debugHandler( this, function(o) { this.loadSuccess(o); }),
                      error: dojo.hitch( this, function(error) { this.loadFail(error, url); } )
        });
    },

    _makeQuery: function( startBase, endBase ) {
        return Util.fillTemplate( this.queryTemplate, { start: startBase, end: endBase, refseq: this.refSeq.name } );
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
                      headers: {
                          "Accept": "application/json"
                      },
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
        var fields = results.head.vars;
        var get  = function(n) { return this[n]; };
        var tags = function() { return fields;   };
        dojo.forEach( rows, function( row ) {
            var f = { get: get, tags: tags };
            dojo.forEach( fields, function(field) {
                f[field] = row[field].value;
            });
            featCallback( f, f.id );
        },this);
    }
});

});

