// define our Retaurant model and default values
var Model = {
    restaurants: [
        {
            name: "Broderick Roadhouse",
            description: "Massive, fresh burgers and a great selection of craft beer.",
            position: {lat: 37.900009, lng: -122.062241}
        },
        {
            name: "Mixed Grain",
            description: "The best korean in Walnut Creek.  Try the spicy pork!",
            position: {lat:37.900062, lng: -122.062043}
        },
        {
            name: "Brass Bear",
            description: "Solid deli sandwiches!",
            position: {lat: 37.900514, lng: -122.061540}
        },
        {
            name: "Lottie's Creamery",
            description: "Amazing ice cream.  Get a waffle cone!",
            position: {lat: 37.899807, lng: -122.060686}
        },
        {
            name: "Dragon's Pond",
            description: "Solid chinese food.  They deliver!",
            position: {lat: 37.898500, lng: -122.062014}
        }
    ],
    /* address, category, phone and URL will be populated by async Foursquare API
    and therefore are defined as observables (because we want to be notified when)
    the API call completes and they are updted.  All other properties don't require
    notification */
    Restaurant: function(data) {
        this.name = data.name;
        this.description = data.description;
        this.position = data.position;
        this.infowindow;
        this.marker;
        this.address = ko.observable();
        this.category = ko.observable();
        this.phone = ko.observable();
        this.url = ko.observable();
    }
};

// define viewmodel
var viewModel = function() {
    var self = this;

    /* restaurantList will hold all restaurant objects,
    and filteredList will be the subset of restaurants matching the search keyword*/
    this.restaurantList = ko.observableArray();
    Model.restaurants.forEach(function(restaurant){
        self.restaurantList().push( new Model.Restaurant(restaurant) );
    });
    this.filteredList = ko.observableArray(this.restaurantList());

    // jQuery event handler for filter form submit
    $("#filter").submit(function(event){
        // prevent form submit and then get search keyword
        event.preventDefault();
        var kw = $("#kw").val().toLowerCase();
        // reset filteredList
        self.filteredList([]);

        // check each restaurant and add to filteredList if it matches search keyword
        self.restaurantList().forEach(function(restaurant){
            if (restaurant.name.toLowerCase().indexOf(kw) > -1) {
                self.filteredList.push(restaurant);
            }
        });

        // update markers to match filtered list
        self.updateMarkers();
    });

    /* observable array to populate with text to display when APIs fail
    (only used for Foursquare API fail currently but could be extended to other APIs) */
    this.error = ko.observableArray();

    // function to populate infowindow content with Foursquare data
    this.populateContent = function(restaurant) {
        var content = "<h4>" + restaurant.name + "</h4>";
        content += "<h5>" + restaurant.category() + "</h5>";
        content += '<a href="' + restaurant.url() + '" target="_blank">' + restaurant.url() + '</a>'
        content += "<div>" + restaurant.phone() + "</div>";
        restaurant.address().forEach(function(line){ // note that address is an array
            content += "<div>" + line + "</div>";
        });
        content += '<div class="disclaimer">Contact info courtesy of Foursquare</div>';
        content += "Evan says: <i>" + restaurant.description + "</i>";

        restaurant.infowindow.setContent(content);
    }

    /* method will be used to control clicks on markers and retaurants list items */
    this.click = function(restaurant) {
        // close all infowindows
        viewmodel.restaurantList().forEach(function(restaurant){
            restaurant.infowindow.close();
        });

        //open infowindow for this marker, populating async foursquare content
        self.populateContent(restaurant)
        restaurant.infowindow.open(map, restaurant.marker);

        // animate marker on click
        restaurant.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
            restaurant.marker.setAnimation(null);
        }, 1400);
    }

    // hide all markers and then show all markers in filteredList
    this.updateMarkers = function() {
        self.restaurantList().forEach(function(restaurant) {
            restaurant.marker.setMap(null);
        });
        self.filteredList().forEach(function(restaurant){
            restaurant.marker.setMap(map);
        });
    }

    // nav tray open and close (courtesy of http://www.w3schools.com/howto/howto_js_sidenav.asp)
    this.openNav = function() {
        document.getElementById("sidenav").style.width = "250px";
    }

    this.closeNav = function() {
        document.getElementById("sidenav").style.width = "0";
    }

    // Build foursquare API request url, query will be the restaurant's name
    this.request_url = function(query) {
        var url = "https://api.foursquare.com/v2/venues/search?near=walnut creek&query=" + query
        url += "&intent=match&client_id=WLTEWU4ZCJ0XA1Z0L2VQBUAXKQIGLUQGI1NBG4XV2M0ZLMND&"
        url += "client_secret=5RG21TJCKX3XQFRAE5BUDKKHTEZCAPQI5G0XZAJQITUZGU31&v=20161115"
        return url
    }

    // Get Foursquare data for each restaurant (we'll do address, phone number, category and url)
    this.restaurantList().forEach(function(restaurant){
        var query = restaurant.name;
        var settings = {
            success: function(data) {
                // on success, grab the data from the response and set on the restaurant object
                var venue = data.response.venues[0];
                restaurant.address(venue.location.formattedAddress || "");
                restaurant.phone(venue.contact.formattedPhone || "");
                restaurant.category(venue.categories[0].name || "");
                restaurant.url(venue.url || "");
            },
            error: function() {
                // on failure, populate self.error to be displayed in error div
                var errorText = "A Foursquare API error occurred.  Restaurant contact information may not be available.";
                if (self.error().indexOf(errorText) == -1) {
                    self.error.push(errorText);
                }
            }
        };
        jQuery.ajax(self.request_url(query), settings);
    });
};

// initialize viewmodel
var viewmodel = new viewModel();
ko.applyBindings(viewmodel);


// initialize Google Maps API
var map;

function initMap() {
    // initialize map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.8987772, lng: -122.0620264},
        zoom: 16
    });

    // for each restaurant, create InfoWindow and Marker objects
    viewmodel.restaurantList().forEach(function(restaurant){
        var infowindow = new google.maps.InfoWindow({});

        restaurant.infowindow = infowindow;

        var marker = new google.maps.Marker({
            position: restaurant.position,
            map: map
        });

        restaurant.marker = marker;

        marker.addListener('click', function() {
            viewmodel.click(restaurant);
        });
    });
}

