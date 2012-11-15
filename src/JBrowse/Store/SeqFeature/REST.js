define([ 'dojo/_base/declare',
         'JBrowse/Store/SeqFeature',
         'JBrowse/Store/DeferredStatsMixin',
         'JBrowse/Store/DeferredFeaturesMixin',
         'JBrowse/Util',
         'dojo/io-query'
       ],
       function( declare, SeqFeatureStore, DeferredStatsMixin, DeferredFeaturesMixin, Util, ioQuery ) {

return declare( [ SeqFeatureStore, DeferredStatsMixin, DeferredFeaturesMixin ],
{

    /**
     * JBrowse store backend to retrieve features or sequences from a REST service.
     * @constructs
     */
    constructor: function(args) {
    }
});
});

