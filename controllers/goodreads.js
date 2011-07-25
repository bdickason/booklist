(function() {
  /* Goodreads - Handles all connectivity to Goodreads API */
  /* API Docs: http://www.goodreads.com/api */  var Goodreads, Users, cfg, goodreads_client, http, redis, sys;
  http = require('http');
  goodreads_client = (require('goodreads')).client;
  redis = require('redis');
  sys = require('sys');
  cfg = require('../config/config.js');
  Users = (require('./user.js')).User;
  exports.Goodreads = Goodreads = (function() {
    /* CONFIG */    var redis_client;
    function Goodreads() {
      this.options = {
        key: cfg.GOODREADS_KEY,
        secret: cfg.GOODREADS_SECRET,
        callback: 'http://localhost:3000/goodreads/callback'
      };
    }
    redis_client = redis.createClient(cfg.REDIS_PORT, cfg.REDIS_HOSTNAME);
    redis_client.on('error', function(err) {
      return console.log('REDIS Error:' + err);
    });
    /* BOOKSHELVES */
    Goodreads.prototype.getShelves = function(userId, callback) {
      var cacheKey, gr;
      console.log('Getting shelves ' + userId);
      gr = new goodreads_client(this.options);
      cacheKey = 'getShelves/' + userId;
      return redis_client.get(cacheKey, function(err, reply) {
        if (err) {
          return console.log('REDIS Error: ' + err);
        } else {
          if (reply) {
            return callback(JSON.parse(reply));
          } else {
            return gr.getShelves(userId, function(json) {
              if (json) {
                redis_client.setex(cacheKey, cfg.REDIS_CACHE_TIME, JSON.stringify(json));
                return callback(json);
              }
            });
          }
        }
      });
    };
    Goodreads.prototype.getSingleShelf = function(userId, listId, callback) {
      var cacheKey, gr;
      console.log('Getting list: ' + listId);
      gr = new goodreads_client(this.options);
      cacheKey = 'getSingleShelf/' + userId + '/' + listId;
      return redis_client.get(cacheKey, function(err, reply) {
        if (err) {
          return console.log('REDIS Error: ' + err);
        } else {
          if (reply) {
            return callback(JSON.parse(reply));
          } else {
            return gr.getSingleShelf(userId, listId, function(json) {
              if (json) {
                redis_client.setex(cacheKey, cfg.REDIS_CACHE_TIME, JSON.stringify(json));
                return callback(json);
              }
            });
          }
        }
      });
    };
    /* FRIENDS */
    Goodreads.prototype.getFriends = function(userId, req, res, callback) {
      console.log('Getting friends ' + userId);
      this.options.path = 'http://www.goodreads.com/friend/user/' + userId + '.xml?&key=' + this.options.key;
      console.log(this.options.path);
      console.log(req.session);
      return consumer().getProtectedResource(this.options.path, 'GET', req.session.goodreads_accessToken, req.session.goodreads_secret, function(error, data, response) {
        if (error) {
          console.log(consumer());
          return callback('Error getting OAuth request token : ' + JSON.stringify(error), 500);
        } else {
          return callback(data);
        }
      });
    };
    /* OAUTH */
    Goodreads.prototype.requestToken = function(req, res, callback) {
      var gr;
      gr = new goodreads_client(this.options);
      return gr.requestToken(function(callback) {
        console.log('request token!');
        req.session.goodreads_authToken = callback.oauthToken;
        req.session.goodreads_authSecret = callback.oauthTokenSecret;
        return res.redirect(callback.url);
      });
    };
    Goodreads.prototype.callback = function(req, res, callback) {
      var gr;
      gr = new goodreads_client(this.options);
      return gr.processCallback(req.session.goodreads_authToken, req.session.goodreads_authSecret, req.params.authorize, function(callback) {
        var users;
        req.session.goodreads_name = callback.username;
        req.session.goodreadsID = callback.userid;
        req.session.goodreads_auth = 1;
        console.log(req.session.goodreads_name + ' signed in with user ID: ' + req.session.goodreadsID + '\n');
        res.redirect('/');
        if (req.session.goodreadsID !== null) {
          console.log('Adding user: ' + req.session.goodreads_name);
          users = new Users;
          return users.addUser(req.session.goodreadsID, req.session.goodreads_name, callback);
        }
      });
    };
    return Goodreads;
  })();
}).call(this);
