var restaurants = [
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
];


var viewModel = function() {
    var self = this;
    this.restaurantList = ko.observableArray();
    restaurants.forEach(function(restaurant){
        self.restaurantList().push( new Restaurant(restaurant) );
    });
    this.filteredList = ko.observableArray(this.restaurantList());

    this.applyFilter = function(kw) {
        self.filteredList([]);
        self.restaurantList().forEach(function(restaurant){
            if (restaurant.name.toLowerCase().indexOf(kw) > -1) {
                self.filteredList.push(restaurant);
            }
        });
        updateMarkers();
    }

    this.error = ko.observable();

    this.click = function(restaurant) {
        //close all infowindows
        viewmodel.restaurantList().forEach(function(restaurant){
            restaurant.infowindow.close();
        });
        //set infowindow content
        var content = "<h4>" + restaurant.name + "</h4>";
        content += "<h5>" + restaurant.category() + "</h5>";
        content += '<a href="' + restaurant.url() + '">' + restaurant.url() + '</a>'
        content += "<div>" + restaurant.phone() + "</div>";
        restaurant.address().forEach(function(line){
            content += "<div>" + line + "</div>";
        });
        content += "<i>" + restaurant.description + "</i>"

        //open infowindow for this marker
        restaurant.infowindow.setContent(content);
        restaurant.infowindow.open(map, restaurant.marker);
        //animate marker
        restaurant.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
            restaurant.marker.setAnimation(null);
        }, 1400);
    }
};

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

var viewmodel = new viewModel();
ko.applyBindings(viewmodel);

var markers = [];
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.8987772, lng: -122.0620264},
        zoom: 16
    });

    viewmodel.restaurantList().forEach(function(restaurant){
        var infowindow = new google.maps.InfoWindow({});

        restaurant.infowindow = infowindow;

        var marker = new google.maps.Marker({
            position: restaurant.position,
            map: map
        });

        restaurant.marker = marker;
        markers.push(marker);

        marker.addListener('click', function() {
            viewmodel.click(restaurant);
        });
    });
}


// Function to remove markers
var updateMarkers = function() {
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    viewmodel.filteredList().forEach(function(restaurant){
        restaurant.marker.setMap(map);
    });
}

// jQuery
$("#filter").submit(function(event){
    event.preventDefault();
    var kw = $("#kw").val().toLowerCase();
    viewmodel.applyFilter(kw);
});

// Foursquare API stuff
var request_url = function(query) {
    return "https://api.foursquare.com/v2/venues/search?near=walnut creek&query="+ query +"&intent=match&client_id=WLTEWU4ZCJ0XA1Z0L2VQBUAXKQIGLUQGI1NBG4XV2M0ZLMND&client_secret=5RG21TJCKX3XQFRAE5BUDKKHTEZCAPQI5G0XZAJQITUZGU31&v=20161115"
}

// Get Foursquare data for each restaurant (we'll do address, phone number, and category)
viewmodel.restaurantList().forEach(function(restaurant){
    var query = restaurant.name;
    var settings = {
        success: function(data) {
            var venue = data.response.venues[0];
            console.log(venue);
            restaurant.address(venue.location.formattedAddress || "");
            restaurant.phone(venue.contact.formattedPhone || "");
            restaurant.category(venue.categories[0].name || "");
            restaurant.url(venue.url || "");
        },
        error: function() {
            console.log("an error ocurred");
        }
    };
    jQuery.ajax(request_url(query), settings);
});