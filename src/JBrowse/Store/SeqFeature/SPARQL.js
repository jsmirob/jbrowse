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


    /**
     * JBrowse feature backend to retrieve features from a SPARQL endpoint.
     * @constructs
     */
    constructor: function(args) {
        this.url = this.urlTemplate;
        this.refSeq = args.refSeq;
        this.baseUrl = args.baseUrl;
        this.density = 0;
        this.url = Util.resolveUrl(
            this.baseUrl,
            Util.fillTemplate( args.urlTemplate,
                               { 'refseq': this.refSeq.name }
                             )
        );
        this.queryTemplate = args.queryTemplate ||
"PREFIX xsd:<http://www.w3.org/2001/XMLSchema#> PREFIX  rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX pos:<http://phenomebrowser.net/gff3/#> SELECT ?id ?name ?type ?start ?end ?strand WHERE { ?id rdf:type ?te . ?te rdfs:label ?type .  ?id pos:location ?location . ?location pos:start ?sp .  ?sp pos:position ?start . ?location pos:end ?ep . ?ep pos:position ?end . ?sp rdf:type ?spt . ?spt rdf:label ?strand . ?id rdfs:label ?name . FILTER( !(?start > {end} || ?end < {start}) ) . FILTER( ?type = \"gene\"^^xsd:string )  }";

    },

    load: function() {
        // ping the endpoint to see if it's there
        dojo.xhrGet({ url: this.url+'?'+ioQuery.objectToQuery({ query: 'SELECT ?s WHERE { ?s ?p ?o } LIMIT 1' }),
                      handleAs: "text",
                      failOk: false,
                      load:  Util.debugHandler( this, function(o) { this.loadSuccess(o); }),
                      error: dojo.hitch( this, function(error) { this.loadFail(error, this.url); } )
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
                      headers: { "Accept": "application/json" },
                      handleAs: "json",
                      failOk: true,
                      load:  Util.debugHandler( this, function(o) {
                          this._resultsToFeatures(o, origFeatCallback);
                          finishCallback();
                      }),
                      error: dojo.hitch( this, function(error) { this.loadFail(error, this.url); })
        });
    },

    _resultsToFeatures: function( results, featCallback ) {
        var rows = ((results||{}).results||{}).bindings || [];
        if( ! rows.length )
            return;
        var fields = results.head.vars;
        var requiredFields = ['start','end','strand','id'];
        for( var i = 0; i<4; i++ ) {
            if( fields.indexOf( requiredFields[i] ) == -1 ) {
                console.error("Required field "+requiredFields[i]+" missing from feature data");
                return;
            }
        };
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

