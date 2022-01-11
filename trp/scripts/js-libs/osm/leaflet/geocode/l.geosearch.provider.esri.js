/**
 * L.Control.GeoSearch - search for an address and zoom to it's location
 * L.GeoSearch.Provider.Esri uses arcgis geocoding service
 * https://github.com/smeijer/L.GeoSearch
 */

L.GeoSearch.Provider.Esri = L.Class.extend({
    options: {

    },

    initialize: function (options) {
        options = L.Util.setOptions(this, options);
    },

    GetServiceUrl: function (qry) {
        var parameters = L.Util.extend({
            text: qry,
            f: 'pjson'
        }, this.options);

        return (location.protocol === 'https:' ? 'https:' : 'http:')
            + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find'
            + L.Util.getParamString(parameters);
    },

    GetServiceUrlSuggest: function(qry){
        var parameters = L.Util.extend({
            text: qry,
            f: 'pjson'
        }, this.options);
        return (location.protocol === 'https:' ? 'https:' : 'http:')
            + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'
            + L.Util.getParamString(parameters);
    },

    GetServiceUrlSuggested : function(qry,key){
       
        return (location.protocol === 'https:' ? 'https:' : 'http:')
            + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine='+qry+'&f=pjson&outFields=Match_addr,Addr_type,StAddr,City&magicKey='+ key;
    },

    ParseJSON: function (data) {
        if (data.locations.length == 0)
            return [];

        var results = [];
        for (var i = 0; i < data.locations.length; i++)
            results.push(new L.GeoSearch.Result(
                data.locations[i].feature.geometry.x,
                data.locations[i].feature.geometry.y,
                data.locations[i].name
            ));
        return results;
    },

    ParseJSONSuggested: function (data) {
        var results = [];
        if (data.candidates) {
            if (data.candidates.length == 0)
                return [];
            for (var i = 0; i < data.candidates.length; i++)
                results.push(new L.GeoSearch.Result(
                    data.candidates[i].location.x,
                    data.candidates[i].location.y,
                    data.candidates[i].address
                ));
        }
        return results;
    },

    ParseJSONSuggest: function (data) {
        var resultssuggest = [];
        if (data.suggestions) {

            if (data.suggestions.length == 0)
                return [];
            for (var i = 0; i < data.suggestions.length; i++) {
                resultssuggest.push({ "Name": data.suggestions[i].text, "magicKey": data.suggestions[i].magicKey });
            }
            
        }
        return resultssuggest;
    }

});