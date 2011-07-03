// Goodreads - Handles all connectivity to Goodreads API

var http = require('http');
var xml2js = require('xml2js');
var oauth = require('oauth');
var cfg = require('../config/config.js');    // contains API keys, etc.

Goodreads = function(){};

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
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        // Right here is where we would write out some nice user stuff
        consumer().get("http://www.goodreads.com/api/auth_user", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
          if (error) {
            res.send("Error getting user ID : " + sys.inspect(error), 500);
          } else {
              parser.parseString(data);

//            req.session.goodreadsID = data["s"];
          }  
        });  
      }
    });
    
    parser.on('end', function(result) {
      console.log(result);
      req.session.user_name = result.user.name;
      req.session.goodreadsID = result.user.id;
      
      res.send('You are signed in: as ' + result.user.name);

    });
}

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