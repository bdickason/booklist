var http = require('http');
var express = require('express');
var app = express.createServer();
var oauth = require('oauth');
var RedisStore = require('connect-redis')(express);
var sys = require('sys');
var cfg = require('./config/config.js');    // contains API keys, etc.

app.configure(function(){    
    app.set('views', __dirname + '/views');
    app.register('.html', require('jade'));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: cfg.SESSION_SECRET, store: new RedisStore}));
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
app.get('/', function(req, res) {
    
    console.log(req.session);
    if(req.session.goodreads_auth == 1) {
        // User is authenticated
        
        // Get my shelves
        Goodreads.getShelves(req.session.goodreads_id, function(json) {
    	    if(json)
    	    {
    	        // Received valid return from Goodreads
                    res.render("index.jade", { json: json });
    	    } 
    	});
    }
    else
    {
        // Prompt for login
        res.send("You are not logged in. <A HREF='/goodreads/connect'>Click here</A> to login");
    }
});

app.get('/logout', function(req, res) {
    console.log("--- LOGOUT ---")
    console.log(req.session);
    req.session.destroy();
    res.redirect("/");
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

app.get('/goodreads/list/:listName', function(req, res) {
    // Get a specific list
	Goodreads.getSingleList(req.session.goodreads_id, req.params.listName, function(json) {	    
	    if(json) {
	        // Received valid return from Goodreads
		    res.render("list.jade", { json: json });
	    }
	}); 
});


app.listen(3000);