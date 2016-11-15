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
        self.restaurantList.push( new Restaurant(restaurant) );
    });
};

var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.description = ko.observable(data.description);
    this.position = ko.observable(data.position);
};

ko.applyBindings(new viewModel());


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.8987772, lng: -122.0620264},
        zoom: 16
    });

    var infowindows = [];

    restaurants.forEach(function(restaurant){
        var infowindow = new google.maps.InfoWindow({
            content: "<h1>"+ restaurant.name +"</h1>"
        });

        infowindows.push(infowindow);

        var marker = new google.maps.Marker({
            position: restaurant.position,
            map: map
        });

        marker.addListener('click', function() {
            infowindows.forEach(function(infowindow){
                infowindow.close();
            });
            infowindow.open(map, marker);
        });
    });
}

