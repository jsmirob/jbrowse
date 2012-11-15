define([ 'dojo/_base/declare',
         'JBrowse/Store/SeqFeature',
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
    },

    _getGlobalStats: function() {
        // retrieve data using XHRs to populate this.globalStats like:
        //  this.globalStats = {
        //     featureDensity: featureCount/refSeqLength
        // };
        //
        // when that is populated, call:
        //  this._deferred.stats.resolve({success: true});
        //  and
        //  this._deferred.features.resolve({success: true});
    },

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
    }
});

});

