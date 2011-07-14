(function() {
  /* Goodreads - Handles all connectivity to Goodreads API */
  /* API Docs: http://www.goodreads.com/api */  var Goodreads, cfg, http, oauth, redis, sys, xml2js;
  http = require('http');
  xml2js = require('xml2js');
  oauth = require('oauth');
  redis = require('redis');
  sys = require('sys');
  cfg = require('../config/config.js');
  exports.Goodreads = Goodreads = (function() {
    /* CONFIG */    var checkCache, clone, consumer, getRequest, redis_client;
    function Goodreads() {
      this.options = {
        host: 'www.goodreads.com',
        port: 80,
        key: cfg.GOODREADS_KEY,
        method: 'GET'
      };
    }
    consumer = function() {
      return new oauth.OAuth('http://goodreads.com/oauth/request_token', 'http://goodreads.com/oauth/access_token', cfg.GOODREADS_KEY, cfg.GOODREADS_SECRET, '1.0', 'http://localhost:3000/goodreads/callback', 'HMAC-SHA1');
    };
    redis_client = redis.createClient(cfg.REDIS_PORT, cfg.REDIS_HOSTNAME);
    redis_client.on('error', function(err) {
      return console.log('REDIS Error:' + err);
    });
    /* Bookshelves */
    Goodreads.prototype.getShelves = function(userId, callback) {
      var _options;
      console.log('Getting shelves ' + userId);
      _options = clone(this.options);
      _options.path = 'http://www.goodreads.com/shelf/list.xml?user_id=' + userId + "&key=" + this.options.key;
      return checkCache(_options, callback);
    };
    Goodreads.prototype.getSingleList = function(userId, listId, callback) {
      var _options;
      console.log('Getting list: ' + listId);
      _options = clone(this.options);
      _options.path = 'http://www.goodreads.com/review/list/' + userId + '.xml?key=' + this.options.key + '&sort=rating&per_page=5&shelf=' + listId;
      return checkCache(_options, callback);
    };
    /* FRIENDS */
    Goodreads.prototype.getFriends = function(userId, req, res, callback) {
      var _options;
      console.log('Getting friends ' + userId);
      _options = clone(this.options);
      _options.path = 'http://www.goodreads.com/friend/user/' + userId + '.xml?&key=' + this.options.key;
      console.log(_options.path);
      console.log(req.session);
      return consumer().getProtectedResource(_options.path, 'GET', req.session.goodreads_accessToken, req.session.goodreads_secret, function(error, data, response) {
        if (error) {
          console.log(consumer());
          return callback('Error getting OAuth request token : ' + JSON.stringify(error), 500);
        } else {
          return callback(data);
        }
      });
    };
    /* OAUTH */
    Goodreads.prototype.requestToken = function(callback, req, res) {
      return consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results) {
        if (error) {
          console.log(consumer());
          return callback('Error getting OAuth request token : ' + JSON.stringify(error), 500);
        } else {
          req.session.oauthRequestToken = oauthToken;
          req.session.oauthRequestTokenSecret = oauthTokenSecret;
          return res.redirect('https://goodreads.com/oauth/authorize?oauth_token=' + req.session.oauthRequestToken + '&oauth_callback=' + consumer()._authorize_callback);
        }
      });
    };
    Goodreads.prototype.callback = function(callback, req, res) {
      var parser;
      parser = new xml2js.Parser();
      consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
          return res.send('Error getting OAuth access token : ' + (sys.inspect(error)) + '[' + oauthAccessToken + '] [' + oauthAccessTokenSecret + '] [' + (sys.inspect(results)) + ']', 500);
        } else {
          req.session.goodreads_accessToken = oauthAccessToken;
          req.session.goodreads_secret = oauthAccessTokenSecret;
          return consumer().get('http://www.goodreads.com/api/auth_user', req.session.goodreads_accessToken, req.session.goodreads_secret, function(error, data, response) {
            if (error) {
              return res.send('Error getting User ID : ' + (sys.inspect(error)), 500);
            } else {
              return parser.parseString(data);
            }
          });
        }
      });
      return parser.on('end', function(result) {
        req.session.goodreads_name = result.user.name;
        req.session.goodreads_id = result.user['@'].id;
        req.session.goodreads_auth = 1;
        console.log(req.session.goodreads_name + 'signed in with user ID: ' + req.session.goodreads_id + '\n');
        return res.redirect('/');
      });
    };
    checkCache = function(_options, callback) {
      return redis_client.get(_options.path, function(err, reply) {
        if (err) {
          return console.log('REDIS Error: ' + err);
        } else {
          if (reply) {
            console.log("REDIS readin' the cache!");
            return callback(JSON.parse(reply));
          } else {
            return getRequest(_options, callback);
          }
        }
      });
    };
    getRequest = function(_options, callback) {
      var parser, tmp;
      tmp = [];
      parser = new xml2js.Parser();
      return http.get(_options, function(res) {
        console.log('HTTP REQUEST!!!');
        res.setEncoding('utf8');
        parser = new xml2js.Parser();
        res.on('data', function(chunk) {
          tmp.push(chunk);
          return console.log('parsing chunks!');
        });
        res.on('end', function(e) {
          var body;
          body = tmp.join('');
          return parser.parseString(body);
        });
        return parser.on('end', function(result) {
          redis_client.setex(_options.path, cfg.REDIS_CACHE_TIME, JSON.stringify(result));
          return callback(result);
        });
      }).end();
    };
    clone = function(obj) {
      if (obj !== null || typeof obj !== 'object') {
        return obj;
      }
    };
    return Goodreads;
  })();
}).call(this);
