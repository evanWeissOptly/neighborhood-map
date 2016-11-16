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
    this.click = function(restaurant) {
        //close all infowindows
        viewmodel.restaurantList().forEach(function(restaurant){
            restaurant.infowindow.close();
        });
        //open infowindow for this marker
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

    viewmodel.filteredList().forEach(function(restaurant){
        var infowindow = new google.maps.InfoWindow({
            content: "<h1>"+ restaurant.name +"</h1>"
        });

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