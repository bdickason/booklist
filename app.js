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

app.get('/goodreads/connect', function(req, res) {
    var callback = "";
    Goodreads.requestToken(callback, req, res);
});

app.get('/goodreads/callback', function(req, res) {
   // Handle goodreads callback
   // Redirect to /goodreads 
   var callback = "";
      Goodreads.callback(callback, req, res);    
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