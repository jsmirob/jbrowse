define( ['dojo/_base/declare',
         'JBrowse/Store'],
        function( declare, Store ) {

/**
 * Base class for JBrowse data backends that hold sequences and
 * features.  Some aspects reminiscent of Lincoln Stein's
 * Bio::DB::SeqFeature::Store.
  *
 * @class JBrowse.SeqFeatureStore
 * @extends JBrowse.Store
 * @constructor
 */

return declare(Store,{
    constructor: function(args) {
        if( !args ) return;
        this.loaded  = args.loaded;
        this.changed = args.changeCallback || function() {};
        this.refSeq = args.refSeq;
    },

    getDensity: function() {
        return this.density || 0;
    }
});
});