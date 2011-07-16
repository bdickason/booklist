(function() {
  var Goodreads, RedisStore, Users, app, cfg, express, http, mongoose, oauth, sys;
  http = require('http');
  express = require('express');
  oauth = require('oauth');
  RedisStore = (require('connect-redis'))(express);
  sys = require('sys');
  mongoose = require('mongoose');
  cfg = require('./config/config.js');
  app = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.register('.html', require('jade'));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: cfg.SESSION_SECRET,
      store: new RedisStore
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });
  app.dynamicHelpers({
    session: function(req, res) {
      return req.session;
    }
  });
  /* Initialize controllers */
  Goodreads = require('./controllers/goodreads.js');
  Users = require('./controllers/users.js');
  /* Initialize models
  UsersModel = new (require './models/users').Users
  ListsModel = new (require './models/lists').Lists
  BooksModel = new (require './models/books').Books
  */
  /* Start Route Handling */
  app.get('/', function(req, res) {
    var gr;
    if (req.session.goodreads_auth === 1) {
      gr = new Goodreads.Goodreads;
      return gr.getShelves(req.session.goodreads_id, function(json) {
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
    var callback, gr;
    callback = '';
    gr = new Goodreads.Goodreads;
    return gr.requestToken(callback, req, res);
  });
  app.get('/goodreads/callback', function(req, res) {
    var callback, gr;
    callback = '';
    gr = new Goodreads.Goodreads;
    return gr.callback(callback, req, res);
  });
  app.get('/friends', function(req, res) {
    var callback, gr;
    callback = '';
    gr = new Goodreads.Goodreads;
    return gr.getFriends(req.session.goodreads_id, req, res, function(json) {
      return res.send(json);
    });
  });
  app.get('/goodreads/list/:listName', function(req, res) {
    var gr;
    gr = new Goodreads.Goodreads;
    return gr.getSingleList(req.session.goodreads_id, req.params.listName, function(json) {
      if (json) {
        return res.render('list/list-partial', {
          layout: false,
          json: json
        });
      }
    });
  });
  app.listen(3000);
}).call(this);
