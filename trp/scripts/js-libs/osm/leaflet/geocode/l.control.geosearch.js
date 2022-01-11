/*
 * L.Control.GeoSearch - search for an address and zoom to its location
 * https://github.com/smeijer/L.GeoSearch
 */

L.GeoSearch = {};
L.GeoSearch.Provider = {};

L.GeoSearch.Result = function (x, y, label, bounds) {
    this.X = x;
    this.Y = y;
    this.Label = label;
    this.bounds = bounds;
};

L.Control.GeoSearch = L.Control.extend({
    options: {
        position: 'topleft',
        showMarker: true,
        retainZoomLevel: false,
        draggable: false
    },

    _config: {
        country: 'nz',
        searchLabel: 'search for address ...',
        notFoundMessage: 'Sorry, that address could not be found.',
        messageHideDelay: 3000,
        zoomLevel: 13
    },

    initialize: function (options) {
        L.Util.extend(this.options, options);
        L.Util.extend(this._config, options);
    },

    onAdd: function (map) {
        var $controlContainer = map._controlContainer,
            nodes = $controlContainer.childNodes,
            topCenter = false;

        for (var i = 0, len = nodes.length; i < len; i++) {
            var klass = nodes[i].className;
            if (/leaflet-top/.test(klass) && /leaflet-center/.test(klass)) {
                topCenter = true;
                break;
            }
        }

        if (!topCenter) {
            var tc = document.createElement('div');
            tc.className += 'leaflet-top leaflet-center';
            $controlContainer.appendChild(tc);
            map._controlCorners.topcenter = tc;
        }

        this._map = map;
        this._container = L.DomUtil.create('div', 'leaflet-control-geosearch');

        var searchbox = document.createElement('input');
        searchbox.id = 'leaflet_control_geosearch_qry';
        searchbox.type = 'text';
        searchbox.placeholder = this._config.searchLabel;
        this._searchbox = searchbox;

        var msgbox = document.createElement('div');
        msgbox.id = 'leaflet-control-geosearch-msg';
        msgbox.className = 'leaflet-control-geosearch-msg';
        this._msgbox = msgbox;

        var resultslist = document.createElement('ul');
        resultslist.id = 'leaflet-control-geosearch-results';
        this._resultslist = resultslist;

        this._msgbox.appendChild(this._resultslist);
        this._container.appendChild(this._searchbox);
        this._container.appendChild(this._msgbox);

        L.DomEvent
          .addListener(this._container, 'click', L.DomEvent.stop)
          .addListener(this._searchbox, 'keypress', this._onKeyUp, this);

        L.DomEvent.disableClickPropagation(this._container);

        return this._container;
    },

    geosearch: function (qry) {
        var that = this;
        try {
            var provider = this._config.provider;

            if (typeof provider.GetLocations == 'function') {
                var results = provider.GetLocations(qry, function (results) {
                    that._processResults(results);
                });
            }
            else {
                var url = provider.GetServiceUrl(qry);
                this.sendRequest(provider, url);
            }
        }
        catch (error) {
            this._printError(error);
        }
    },

    geosearchsuggest: function (qry) {
        var that = this;
       // try {
            var provider = this._config.provider;
            var url = provider.GetServiceUrlSuggest(qry);
            this.sendRequestSuggest(provider, url);
       // } catch (error) {
        //    this._printError(error);
        //}
    },

    sendRequestSuggest: function(provider,url){
        var that = this;

        window.parseLocation = function (response) {
            var results = provider.ParseJSONSuggest(response);

            document.body.removeChild(document.getElementById('getJsonP'));
            delete window.parseLocation;
        };

        function getJsonP(url) {
            url = url + '&callback=parseLocation';
            var script = document.createElement('script');
            script.id = 'getJsonP';
            script.src = url;
            script.async = true;
            document.body.appendChild(script);
        }

        if (XMLHttpRequest) {
            var xhr = new XMLHttpRequest();

            if ('withCredentials' in xhr) {
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var response = JSON.parse(xhr.responseText),
                                resultssuggest = provider.ParseJSONSuggest(response);
                            that._processResultsSuggest(resultssuggest);
                        } else if (xhr.status == 0 || xhr.status == 400) {
                            getJsonP(url);
                        } else {
                            that._printError(xhr.responseText);
                        }
                    }
                };

                xhr.open('GET', url, true);
                xhr.send();
            } else if (XDomainRequest) {
                var xdr = new XDomainRequest();

                xdr.onerror = function (err) {
                    that._printError(err);
                };

                xdr.onload = function () {
                    var response = JSON.parse(xdr.responseText),
                        resultssuggest = provider.ParseJSONSuggest(response);

                    that._processResultsSuggest(resultssuggest);
                };

                xdr.open('GET', url);
                xdr.send();
            } else {
                getJsonP(url);
            }
        }
    },

    sendRequestSuggested: function (provider, url) {
        var that = this;

        window.parseLocation = function (response) {
            var results = provider.ParseJSON(response);
            that._processResults(results);

            document.body.removeChild(document.getElementById('getJsonP'));
            delete window.parseLocation;
        };

        function getJsonP(url) {
            url = url + '&callback=parseLocation';
            var script = document.createElement('script');
            script.id = 'getJsonP';
            script.src = url;
            script.async = true;
            document.body.appendChild(script);
        }

        if (XMLHttpRequest) {
            var xhr = new XMLHttpRequest();

            if ('withCredentials' in xhr) {
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var response = JSON.parse(xhr.responseText),
                                results = provider.ParseJSONSuggested(response);

                            that._processResults(results);
                        } else if (xhr.status == 0 || xhr.status == 400) {
                            getJsonP(url);
                        } else {
                            that._printError(xhr.responseText);
                        }
                    }
                };

                xhr.open('GET', url, true);
                xhr.send();
            } else if (XDomainRequest) {
                var xdr = new XDomainRequest();

                xdr.onerror = function (err) {
                    that._printError(err);
                };

                xdr.onload = function () {
                    var response = JSON.parse(xdr.responseText),
                        results = provider.ParseJSONSuggested(response);

                    that._processResults(results);
                };

                xdr.open('GET', url);
                xdr.send();
            } else {
                getJsonP(url);
            }
        }
    },

    sendRequest: function (provider, url) {
        var that = this;

        window.parseLocation = function (response) {
            var results = provider.ParseJSON(response);
            that._processResults(results);

            document.body.removeChild(document.getElementById('getJsonP'));
            delete window.parseLocation;
        };

        function getJsonP(url) {
            url = url + '&callback=parseLocation';
            var script = document.createElement('script');
            script.id = 'getJsonP';
            script.src = url;
            script.async = true;
            document.body.appendChild(script);
        }

        if (XMLHttpRequest) {
            var xhr = new XMLHttpRequest();

            if ('withCredentials' in xhr) {
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var response = JSON.parse(xhr.responseText),
                                results = provider.ParseJSON(response);

                            that._processResults(results);
                        } else if (xhr.status == 0 || xhr.status == 400) {
                            getJsonP(url);
                        } else {
                            that._printError(xhr.responseText);
                        }
                    }
                };

                xhr.open('GET', url, true);
                xhr.send();
            } else if (XDomainRequest) {
                var xdr = new XDomainRequest();

                xdr.onerror = function (err) {
                    that._printError(err);
                };

                xdr.onload = function () {
                    var response = JSON.parse(xdr.responseText),
                        results = provider.ParseJSON(response);

                    that._processResults(results);
                };

                xdr.open('GET', url);
                xdr.send();
            } else {
                getJsonP(url);
            }
        }
    },

    _processResultsSuggest: function (results) {
        $("#leaflet-control-geosearch-results").empty();
        var that = this;
        results.forEach(function (f) {
            $("#leaflet-control-geosearch-results").append("<li data-key ="+ f.magicKey +">" + f.Name + "</li>");
        });
        $("#leaflet-control-geosearch-results li").unbind('click.namespace').bind('click', function () {
            var provider = that._config.provider;
            var qry = $(this).text();
            var magicKey = $(this).attr('data-key');
            var url = provider.GetServiceUrlSuggested(qry, magicKey);
            that.sendRequestSuggested(provider, url);
        });
        

    },

    _processResults: function (results) {
        if (results.length > 0) {
            this._map.fireEvent('geosearch_foundlocations', { Locations: results });
            console.log(results);
            this._showLocation(results[0]);
        } else {
            this._printError(this._config.notFoundMessage);
        }
    },

    _showLocation: function (location) {
        if (this.options.showMarker == true) {
            if (typeof this._positionMarker === 'undefined') {
                this._positionMarker = new L.marker(
                    [location.Y, location.X],
                    { draggable: this.options.draggable }
                ).addTo(this._map).bindPopup(location.Label);
            }
            else {
                this._positionMarker.setLatLng([location.Y, location.X]).bindPopup(location.Label);
            }
        }
        if (!this.options.retainZoomLevel && location.bounds && location.bounds.isValid()) {
            this._map.fitBounds(location.bounds);
        }
        else {
            this._map.setView([location.Y, location.X], this._getZoomLevel(), false);
        }

        this._map.fireEvent('geosearch_showlocation', {
            Location: location,
            Marker: this._positionMarker
        });
    },

    _printError: function (message) {
        var elem = this._resultslist;
        elem.innerHTML = '<li>' + message + '</li>';
        elem.style.display = 'block';

        this._map.fireEvent('geosearch_error', { message: message });

        setTimeout(function () {
            elem.style.display = 'none';
        }, 3000);
    },

    _onKeyUp: function (e) {
        var esc = 27,
            enter = 13;
        this.geosearchsuggest(this._searchbox.value);
        if (e.keyCode === esc) { // escape key detection is unreliable
            this._searchbox.value = '';
            this._map._container.focus();
        } else if (e.keyCode === enter) {
            e.preventDefault();
            e.stopPropagation();

            this.geosearch(this._searchbox.value);
        }
    },

    _getZoomLevel: function () {
        if (!this.options.retainZoomLevel) {
            return this._config.zoomLevel;
        }
        return this._map.zoom;
    }

});