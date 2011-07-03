// Goodreads - Handles all connectivity to Goodreads API

var http = require('http');
var xml2js = require('xml2js');
var cfg = require('../config/config.js');    // contains API keys, etc.

Goodreads = function(){};

// Default JSON options
var options = {
  host: "www.goodreads.com",
  port: 80,
  key: cfg.GOODREADS_KEY,
  method: 'GET'
};

// Grab lists from a user's shelf
Goodreads.prototype.getLists = function (id, callback) {

    var _options = clone(options);

    // Provide path to the API
    _options.path = "/review/list/" + id + ".xml?key=" + _options.key;
    
    console.log(_options.path);
    getRequest(_options, callback);
    
//    callback = JSON.parse(callback);
}


function getRequest(options, callback)
{
    var tmp = "";
	var _req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  
      var parser = new xml2js.Parser();
	  
	  res.on('data', function (chunk) {
		console.log(tmp);
		tmp += chunk;
	  });
	  
	  res.on('end', function(e) {
             console.log("reached the end");
             parser.parseString(tmp);
             // callback(tmp); -- don't callback because it's delivered in XML
         });
         
      parser.on('end', function(result) {
          console.log(result);
         callback(result); 
      });
      
  	});

	_req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

   
    
	_req.write('data\n');
	_req.write('data\n');
	_req.end();
}

exports.Goodreads = Goodreads;

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}