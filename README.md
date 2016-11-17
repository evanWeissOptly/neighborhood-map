# Neighborhood Map

The goal of the Neighborhood Map project is to create a web application which uses the Google Maps API to display locations on a map.  The application also displays contact information for each location as retrieved from the Foursquare API.  The requirements for this project are described [here] (https://review.udacity.com/#!/rubrics/5/view).  This application is built using Knockout JavaScript and jQuery for Ajax requests and form handling.  It also uses Skeleton CSS for responsive styling.

Neighborhood Map is the final project of the Udacity JavaScript Design Patterns course.


## Quick start

All files required to view the application are included in this [github respository] (https://github.com/evanpweiss/neighborhood-map).  Simply clone the respository and load index.html in your web browser.


### What's included

Within [this respository] (https://github.com/evanpweiss/neighborhood-map), you'll find the following files:

* index.html (contains the structure of the application. data-bind attributes refer to the Knockout viewModel defined in app.js)
* js
** app.js (defines data Model, viewModel, Google Maps and Foursquare functions)
** lib
*** knockout-3.2.0.js (Knockout JS Library, see [knockoutjs.com] (knockoutjs.com))
* styles
** custom.css (contains styles specific to this project)
** skeleton.css (Skeleton CSS responsive framework, see [http://getskeleton.com/] (http://getskeleton.com/))

## Versioning

This is version 1.0 of my Neighborhood Map project.

## Credits

I leveraged the templates and example code provided as part of the JavaScript Design Patterns course extensively (in-particular the Knockout JS projects).  Massive thanks goes to Ben Jaffe and the rest of the awesome crew at Udacity!  Original source can be found [here] (https://github.com/udacity/ud989-cat-clicker-ko-starter).

The application uses the Google Maps JavaScript API.  I used the sample code provided in [the documentation] (https://developers.google.com/maps/documentation/javascript/).  Thank you Google for providing such a powerful API for everyone to use!

The application also use the Foursquare venue search API to display contact information for each location [see here for documentation] (https://developer.foursquare.com/docs/venues/search).  Thank you Foursquare for providing this information for developers to use!

Credit for this Readme format goes to Bootstrap's excellent [README.md] (https://github.com/twbs/bootstrap/blob/master/README.md)

## Creators

**Evan Weiss**

* <https://www.linkedin.com/in/evanpweiss>

## Copyright and license

Code released under [the MIT license](https://opensource.org/licenses/MIT):
Copyright (c) 2016, Evan Weiss

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.