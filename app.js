(function() {
  var Goodreads, Lists, RedisStore, Users, app, cfg, express, http, mongoose, oauth, sys;
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
  mongoose.connection.on('open', function() {
    return console.log('Mongo is connected!');
  });
  app.dynamicHelpers({
    session: function(req, res) {
      return req.session;
    }
  });
  /* Initialize controllers */
  Goodreads = (require('./controllers/goodreads.js')).Goodreads;
  Users = (require('./controllers/users.js')).Users;
  Lists = (require('./controllers/lists.js')).Lists;
  /* Start Route Handling */
  app.get('/', function(req, res) {
    var gr;
    if (req.session.goodreads_auth === 1) {
      gr = new Goodreads;
      return gr.getShelves(req.session.goodreadsID, function(json) {
        var list;
        if (json) {
          list = new Lists;
          List.add(req.session.goodreadsID, json);
          return res.render('index.jade', {
            json: json
          });
        }
      });
    } else {
      return res.send("You are not logged in. <A HREF='/goodreads/connect'>Click here</A> to login");
    }
  });
  app.get('/users', function(req, res) {
    var callback, user;
    callback = '';
    user = new Users;
    return user.getUsers(function(json) {
      console.log(json);
      return res.render('users', {
        json: json
      });
    });
  });
  app.get('/users/:id', function(req, res) {
    var callback, user;
    callback = '';
    user = new Users;
    return user.findById(req.params.id, function(json) {
      console.log(json);
      return res.render('users/singleUser', {
        json: json
      });
    });
  });
  app.get('/goodreads/connect', function(req, res) {
    var callback, gr;
    callback = '';
    gr = new Goodreads;
    return gr.requestToken(callback, req, res);
  });
  app.get('/goodreads/callback', function(req, res) {
    var callback, gr;
    callback = '';
    gr = new Goodreads;
    return gr.callback(callback, req, res);
  });
  app.get('/friends', function(req, res) {
    var callback, gr;
    callback = '';
    gr = new Goodreads;
    return gr.getFriends(req.session.goodreadsID, req, res, function(json) {
      return res.send(json);
    });
  });
  app.get('/goodreads/list/:listName', function(req, res) {
    var gr;
    gr = new Goodreads;
    return gr.getSingleList(req.session.goodreadsID, req.params.listName, function(json) {
      if (json) {
        return res.render('list/list-partial', {
          layout: false,
          json: json
        });
      }
    });
  });
  app.get('/logout', function(req, res) {
    console.log('--- LOGOUT ---');
    console.log(req.session);
    console.log('--- LOGOUT ---');
    req.session.destroy();
    return res.redirect('/');
  });
  app.listen(3000);
}).call(this);
