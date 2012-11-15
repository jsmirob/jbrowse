define([ 'dojo/_base/declare',
         'JBrowse/Store/SeqFeature/REST',
         'JBrowse/Util',
         'JBrowse/Model/SimpleFeature',
         'dojo/io-query'
       ],
       function( declare, RESTStore, Util, SimpleFeature, ioQuery ) {

return declare( RESTStore,
{
    /**
     * JBrowse feature backend to retrieve features from KBase.
     * @constructs
     */
    constructor: function(args) {
        console.log("Constructor");

        this.browser.getPlugin("KBase", dojo.hitch( this, function(kbase) {
            kbase.cdmi_load.then( dojo.hitch( this, function () {
                //run CDMI function code
                console.log(arguments);
                this.cdmi_api = new CDMI_API("http://www.kbase.us/services/cdmi_api");

                this._deferred.stats.resolve({success: true});
                this._deferred.features.resolve({success: true});
	    }));
        }));
    },

    // _getGlobalStats: function( successCallback, errorCallback ) {
    //     // retrieve data using XHRs to populate this.globalStats like:
    //     //  this.globalStats = {
    //     //     featureDensity: featureCount/refSeqLength
    //     // };
    //     //
    //     // when that is populated, call:
    //     //  this._deferred.stats.resolve({success: true});
    //     //  and
    //     //  this._deferred.features.resolve({success: true});

    //     console.log("_getGlobalStats");
    // },

    _getFeatures: function( query, featCallback, finishCallback, errorCallback ) {
        // fetch features from a web service, translate them into
        // JBrowse features, call featCallback() with each of them,
        // and then finally call finishCallback()

        /**
         *  make a feature like:
         *    new SimpleFeature({
         *      data: {
         *        tag/value with feature data
         *        subfeatures: [ array of subfeatures of the feature ]
         *      },
         *      id: unique id of the feature
         *    });
         */


        //Get genome based on kbase id
        console.log('_getFeatures');
        console.log(query);

        console.log(this.config);

        // var features = this.cdmi_api.genomes_to_fids(["kb|g.0"], [])["kb|g.0"];

        // console.log(features);

        // var feature_data = this.cdmi_api.fids_to_feature_data(features);

        var test = new SimpleFeature({data: {start: 0, end: 100, strand: 1, name: "test feature"}, id: "kb|g.0.peg.28"});

        featCallback(test);
        finishCallback();
    }
});

});

