var http = require('http');
var express = require('express');
var app = express.createServer();
var oauth = require('oauth');
var sys = require('sys');
var cfg = require('./config/config.js');    // contains API keys, etc.

app.configure(function(){    
    app.set('views', __dirname + '/views');
    app.register('.html', require('jade'));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "testing"}));
    app.use(app.router); 
});

app.dynamicHelpers({
  session: function(req, res){
    return req.session;
  }
});

// Initialize controllers
// var List = new (require('./controllers/list.js').List);                  // List display, etc
var Goodreads = new (require('./controllers/goodreads.js').Goodreads);   // Goodreads connectivity


// Initialize models
var UsersModel = new (require('./models/users').Users);
var ListsModel = new (require('./models/lists').Lists);
var BooksModel = new (require('./models/books').Books);

// Start route handling

// Home Page
app.get('/', function(req, res){

// Check for OAuth
/*	if(!req.session.oauth_access_token) {
		res.redirect("/goodreads_login");
	}
	else {
		res.redirect("/lists");
	} */
});

/* GOODREADS */

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

app.get('/goodreads/connect', function(req, res) {
    
 //   Goodreads.requestToken(callback, req, res);
    
    consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results) {
          if (error) {
              console.log(consumer());
              res.send("Error getting OAuth request token : " + JSON.stringify(error), 500);
          }
          else {
              req.session.oauthRequestToken = oauthToken;
              req.session.oauthRequestTokenSecret = oauthTokenSecret;
              
              console.log("Redirecting to: https://goodreads.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken+"&oauth_callback="+consumer()._authorize_callback);

              res.redirect("https://goodreads.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken+"&oauth_callback="+consumer()._authorize_callback);
              

          }
    });
    
});

app.get('/goodreads/callback', function(req, res) {
   // Handle goodreads callback
   // Redirect to /goodreads 
   
//   Goodreads.callback(callback, req, res);
   
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
              console.log(data);
//            req.session.goodreadsID = data["s"];    
            res.send('You are signed in: ' + data)
          }  
        });  
      }
    });
    
});

// Get list by ID
app.get('/goodreads/:userID', function(req, res) {
    // Get a user's lists
    // Add lists to Mongo
    // Display lists
    
	Goodreads.getLists(req.params.userID, function(json) {
	    if(json)
	    {
	        // Received valid return from Goodreads
	        UsersModel.findByID(req.params.userID, function(json) {
                res.send();
        	});
	    }

	    
        // res.render('lists.jade', { json: json });
	});
});

app.listen(3000);