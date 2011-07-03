var http = require('http');
var express = require('express');
var app = express.createServer();

app.configure(function(){    
    app.set('views', __dirname + '/views');
    app.register('.html', require('jade'));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router); 
});

// Initialize controllers
// var List = new (require('./controllers/list.js').List);                  // List display, etc
// var Amazon = new (require('./controllers/amazon.js').Amazon);            // Amazon book db
var Goodreads = new (require('./controllers/goodreads.js').Goodreads);   // Goodreads connectivity


// Initialize models
var Users = new (require('./models/users').Users);
var Lists = new (require('./models/lists').Lists);
var Books = new (require('./models/books').Books);

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
// Get list by ID
app.get('/goodreads/:userID', function(req, res) {
    // Get a user's lists
    // Add lists to Mongo
    // Display lists
    
	Goodreads.getLists(req.params.userID, function(json) {
	    if(json)
	    {
	        // Received valid return from Goodreads
	        Users.findByID(req.params.userID, function(json) {
                res.send();
        	});
	    }

	    
        // res.render('lists.jade', { json: json });
	});
});

app.listen(3000);