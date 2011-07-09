(function() {
  var Goodreads, RedisStore, app, cfg, express, http, oauth, sys;
  http = require('http');
  express = require('express');
  oauth = require('oauth');
  RedisStore = (require('connect-redis'))(express);
  sys = require('sys');
  cfg = require('./config/config.js');
  app = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.register('.html', require('jade'));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: cfg.SESSION_SECRET,
      store: new RedisStore
    }));
    return app.use(app.router);
  });
  app.dynamicHelpers({
    session: function(req, res) {
      return req.session;
    }
  });
  /* Initialize controllers */
  Goodreads = new (require('./controllers/goodreads.js')).Goodreads;
  /* Initialize models
  UsersModel = new (require './models/users').Users
  ListsModel = new (require './models/lists').Lists
  BooksModel = new (require './models/books').Books
  */
  /* Start Route Handling */
  app.get('/', function(req, res) {
    console.log(req.session);
    if (req.session.goodreads_auth === 1) {
      return Goodreads.getShelves(req.session.goodreads_id, function(json) {
        if (json) {
          return res.render('index.jade', {
            json: json
          });
        }
      });
    } else {
      return res.send("You are not logged in. <A HREF='/goodreads/connect'>Click here</A> to login");
    }
  });
  app.get('/logout', function(req, res) {
    console.log('--- LOGOUT ---');
    console.log(req.session);
    req.session.destroy();
    return res.redirect('/');
  });
  app.get('/goodreads/connect', function(req, res) {
    var callback;
    callback = '';
    return Goodreads.requestToken(callback, req, res);
  });
  app.get('/goodreads/callback', function(req, res) {
    var callback;
    callback = '';
    return Goodreads.callback(callback, req, res);
  });
  app.get('/goodreads/list/:listName', function(req, res) {
    return Goodreads.getSingleList(req.session.goodreads_id, req.params.listName, function(json) {
      if (json) {
        return res.render('list.jade', {
          json: json
        });
      }
    });
  });
  app.listen(3000);
}).call(this);
