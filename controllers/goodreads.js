// Goodreads - Handles all connectivity to Goodreads API
// API Docs: http://www.goodreads.com/api

var http = require('http');
var xml2js = require('xml2js');
var oauth = require('oauth');
var cfg = require('../config/config.js');    // contains API keys, etc.
var redis = require('redis');

Goodreads = function(){};

/* CONFIG */

// Default JSON options
var options = {
  host: "www.goodreads.com",
  port: 80,
  key: cfg.GOODREADS_KEY,
  method: 'GET'
};

// OAuth options
function consumer() {
    return new oauth.OAuth(
        "http://goodreads.com/oauth/request_token",
        "http://goodreads.com/oauth/access_token",
        cfg.GOODREADS_KEY,
        cfg.GOODREADS_SECRET,
        "1.0",
        "http://localhost:3000/goodreads/callback",
        "HMAC-SHA1");
}

// Start up redis to cache API stuff
redis_client = redis.createClient(cfg.REDIS_PORT, cfg.REDIS_HOSTNAME);

redis_client.on("error", function(err) {
    console.log("REDIS Error: " + err);
});

/* Bookshelves */

// Get all shelves for a given user
Goodreads.prototype.getShelves = function (userId, callback) {

    var _options = clone(options);

    // Provide path to the API
    _options.path = "/shelf/list.xml?user_id=" + userId + "&key=" + _options.key;
    
    console.log(_options.path);
    checkCache(_options, callback);
}

// Get a specific list by ID
Goodreads.prototype.getSingleList = function (userId, listId, callback) {

    console.log("Getting list " + userId);

    var _options = clone(options);

    // Provide path to the API
    _options.path = "http://www.goodreads.com/review/list/" + userId + ".xml?key=" + _options.key + "&sort=rating&per_page=200&shelf="+listId;
    
    console.log(_options.path);
    checkCache(_options, callback);
}


/* OAUTH */

Goodreads.prototype.requestToken = function (callback, req, res) {
    consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results) {
             if (error) {
                 console.log(consumer());
                 res.send("Error getting OAuth request token : " + JSON.stringify(error), 500);
             }
             else {
                 req.session.oauthRequestToken = oauthToken;
                 req.session.oauthRequestTokenSecret = oauthTokenSecret;

                 res.redirect("https://goodreads.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken+"&oauth_callback="+consumer()._authorize_callback);


             }
       });
  
}

Goodreads.prototype.callback = function (callback, req, res) {
    var parser = new xml2js.Parser();
    
    console.log(">>"+req.session.oauthRequestToken+"\n");
    console.log(">>"+req.session.oauthRequestTokenSecret+"\n");
    console.log(">>"+req.query.oauth_verifier+"\n");
    consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
      } else {
        req.session.goodreads_accessToken = oauthAccessToken;
        req.session.goodreads_secret = oauthAccessTokenSecret;
        // Right here is where we would write out some nice user stuff
        consumer().get("http://www.goodreads.com/api/auth_user", req.session.goodreads_accessToken, req.session.goodreads_secret, function (error, data, response) {
          if (error) {
            res.send("Error getting user ID : " + sys.inspect(error), 500);
          } else {
              parser.parseString(data);
          }  
        });  
      }
    });
    
    parser.on('end', function(result) {
    
      console.log(result);
      
      req.session.goodreads_name = result.user.name;    // Grab Goodreads name in case we don't have it
      req.session.goodreads_id = result.user['@'].id;   // Grab Goodreads user ID in case we don't have it
      req.session.goodreads_auth = 1;                   // User is Auth'd with goodreads! Woohoo! :)
      
      console.log(req.session.goodreads_name + " signed in with user ID: " + req.session.goodreads_id + "\n");
      
      res.redirect('/');
    });
}

function checkCache(options, callback)
{
    // First check if object is in cache and call it back

	console.log(options);
    
    redis_client.get(options.path, function (err, reply) { // get entire file
	
		console.log("Got to Redis");
		
        if (err) {
            console.log("REDIS error: " + err);
        } else {
            if(reply) {
                console.log("REDIS readin' the cache!");    // Nice! We made this call recently :)
                callback(JSON.parse(reply));

            }
            else {
                // Crap! Go grab it!
                console.log("Oops not in cache!");

                getRequest(options, callback);
        	}
        }
        // redis_client.quit();                
    });
}


function getRequest(options, callback)
{
    // First check if object is in cache and call it back
    
    var tmp = "";
	var _req = http.request(options, function(res) {
	    console.log('STATUS: ' + res.statusCode);
	    console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');

      var parser = new xml2js.Parser();

	  res.on('data', function (chunk) {
		tmp += chunk;
	  });

	  res.on('end', function(e) {
             parser.parseString(tmp);
             // callback(tmp); -- don't callback because it's delivered in XML
         });

      parser.on('end', function(result) {
            redis_client.setex(options.path, cfg.REDIS_CACHE_TIME, JSON.stringify(result)); // Cache result for a while
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