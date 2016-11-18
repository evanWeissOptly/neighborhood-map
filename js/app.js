// define our restaurant default values
var Model = {
    restaurants: [
        {
            name: 'Broderick Roadhouse',
            description: 'Massive, fresh burgers and a great selection of craft beer.',
            position: {lat: 37.900009, lng: -122.062241}
        },
        {
            name: 'Mixed Grain',
            description: 'The best korean in Walnut Creek.  Try the spicy pork!',
            position: {lat:37.900062, lng: -122.062043}
        },
        {
            name: 'Brass Bear',
            description: 'Solid deli sandwiches!',
            position: {lat: 37.900514, lng: -122.061540}
        },
        {
            name: 'Lottie\'s Creamery',
            description: 'Amazing ice cream.  Get a waffle cone!',
            position: {lat: 37.899807, lng: -122.060686}
        },
        {
            name: 'Dragon\'s Pond',
            description: 'Solid chinese food.  They deliver!',
            position: {lat: 37.898500, lng: -122.062014}
        }
    ]
};

/* address, category, phone and URL will be populated by async Foursquare API
and therefore are defined as observables (because we want to be notified when)
the API call completes and they are updted.  All other properties don't require
notification */
var Restaurant = function(data) {
    this.name = data.name;
    this.description = data.description;
    this.position = data.position;
    this.infowindow;
    this.marker;
    this.address = ko.observable();
    this.category = ko.observable();
    this.phone = ko.observable();
    this.url = ko.observable();
};

// define viewmodel
var ViewModel = function() {
    var self = this;

    /* restaurantList will hold all restaurant objects,
    and filteredList will be the subset of restaurants matching the search keyword*/
    this.restaurantList = ko.observableArray();
    Model.restaurants.forEach(function(restaurant){
        self.restaurantList().push( new Restaurant(restaurant) );
    });

    // this observable will store text input from the search field
    this.kw = ko.observable(null);

    // we will compute a filtered list of restaurants based on the value of the search keyword
    this.filteredList = ko.computed(function(){
        if (this.kw() !== null) {
            var newList = [];
            self.restaurantList().forEach(function(restaurant){
                if (restaurant.name.toLowerCase().indexOf(self.kw().toLowerCase()) > -1) {
                    newList.push(restaurant);
                }
            });
            return newList;
        } else {
            return self.restaurantList();
        }
    }, this);

    /* Add a subscribe function which will be triggered to show and hide markers each time the
    value of filteredList changes.  Also close the infowindow if it is bound to an invisible marker */
    this.filteredList.subscribe(function() {
        self.restaurantList().forEach(function(restaurant) {
            restaurant.marker.setVisible(false);
        });

        // tracks if the infowindow is attached to a visible marker
        var visible = false;

        self.filteredList().forEach(function(restaurant){
            if (infowindow.content.indexOf(restaurant.name) > -1) {
                visible = true;
            }
            restaurant.marker.setVisible(true);
        });

        // if the infowindow is not attached to a visible marker, close it.
        if (visible === false) {
            infowindow.close();
        }
    });

    /* observable array to populate with text to display when APIs fail
    (only used for Foursquare API fail currently but could be extended to other APIs) */
    this.error = ko.observableArray();

    // function to populate infowindow content with Foursquare data
    this.populateContent = function(restaurant) {
        var content = '<h4>' + restaurant.name + '</h4>';
        content += '<h5>' + restaurant.category() + '</h5>';
        if (restaurant.url() === null) {
            content += '<div>No website provided</div>';
        } else {
            content += '<a href="' + restaurant.url() + '" target="_blank">' + restaurant.url() + '</a>';
        }
        content += '<div>' + restaurant.phone() + '</div>';
        restaurant.address().forEach(function(line){ // note that address is an array
            content += '<div>' + line + '</div>';
        });
        content += '<div class="disclaimer">Contact info courtesy of Foursquare</div>';
        content += 'Evan says: <i>' + restaurant.description + '</i>';

        infowindow.setContent(content);
    };

    /* method will be used to control clicks on markers and retaurants list items */
    this.click = function(restaurant) {
        // pan to marker position
        map.panTo(restaurant.marker.getPosition());

        // open infowindow for this marker, populating async foursquare content
        self.populateContent(restaurant);
        infowindow.open(map, restaurant.marker);

        // animate marker on click
        restaurant.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
            restaurant.marker.setAnimation(null);
        }, 1400);
    };

    // observable to control the width of the side nav.  Starts with value of 0 so that side nav is hidden.
    this.navWidth = ko.observable('0');

    // When hamburger button is clicked, set navWidth to 250px
    this.openNav = function() {
        self.navWidth('250px');
    };

    // When close button is clicked, set navWidth back to 0
    this.closeNav = function() {
        self.navWidth('0');
    };

    // Build foursquare API request url, query will be the restaurant's name
    this.request_url = function(query) {
        return 'https://api.foursquare.com/v2/venues/search?near=walnut creek&query=' + query +
        '&intent=match&client_id=WLTEWU4ZCJ0XA1Z0L2VQBUAXKQIGLUQGI1NBG4XV2M0ZLMND&' +
        'client_secret=5RG21TJCKX3XQFRAE5BUDKKHTEZCAPQI5G0XZAJQITUZGU31&v=20161115';
    };

    // Get Foursquare data for each restaurant (we'll do address, phone number, category and url)
    this.restaurantList().forEach(function(restaurant){
        var query = restaurant.name;
        var settings = {
            success: function(data) {
                // on success, grab the data from the response and set on the restaurant object
                var venue = data.response.venues[0];
                restaurant.address(venue.location.formattedAddress || ['No address provided']);
                restaurant.phone(venue.contact.formattedPhone || 'No phone number provided');
                restaurant.category(venue.categories[0].name || 'Category unknown');
                restaurant.url(venue.url || null);
            },
            error: function() {
                // on failure, populate self.error to be displayed in error div
                var errorText = 'A Foursquare API error occurred.  ' +
                'Restaurant contact information may not be available.';
                if (self.error().indexOf(errorText) == -1) {
                    self.error.push(errorText);
                }
            }
        };
        jQuery.ajax(self.request_url(query), settings);
    });
};

// initialize viewmodel
var viewmodel = new ViewModel();
ko.applyBindings(viewmodel);


// initialize Google Maps API
var map;
var infowindow;

function initMap() {
    // initialize map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.8987772, lng: -122.0620264},
        zoom: 16
    });

    // create empty info window object
    infowindow = new google.maps.InfoWindow({});

    // for each restaurant, create Marker objects
    viewmodel.restaurantList().forEach(function(restaurant){

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

// function for Google Maps API error handling
function mapError() {
    viewmodel.error.push('A Google Maps API error occurred.  The map may not display!');
}