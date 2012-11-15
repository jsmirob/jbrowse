define(
       [
           'dojo/_base/declare',
           'JBrowse/Plugin',
           'dojo/io/script'
       ],
    function( declare, JBPlugin, requestScript ) {
return declare( JBPlugin, {

    constructor: function() {
        this.cdmi_load = requestScript.get({url:"src/KBase/CDMI.js"});        
        console.log(this.cdmi_load);
    }
   // does nothing KBase-specific right now
});
});
