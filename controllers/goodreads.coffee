### Goodreads - Handles all connectivity to Goodreads API ###
### API Docs: http://www.goodreads.com/api ###

http = require 'http'
xml2js = require 'xml2js'
oauth = require 'oauth'
redis = require 'redis'
sys = require 'sys'
cfg = require '../config/config.js' # contains API keys, etc.

exports.Goodreads = class Goodreads
  
  ### CONFIG ###

  # Default JSON options
  constructor: () ->
    @options = {
      host: 'www.goodreads.com',
      port: 80,
      key: cfg.GOODREADS_KEY,
      method: 'GET'
    }

  # OAuth options
  consumer = ->
    new oauth.OAuth 'http://goodreads.com/oauth/request_token', 'http://goodreads.com/oauth/access_token', cfg.GOODREADS_KEY, cfg.GOODREADS_SECRET, '1.0', 'http://localhost:3000/goodreads/callback', 'HMAC-SHA1'

  # Start up redis to cache API stuff
  console.log 'got this far!'
  redis_client = redis.createClient cfg.REDIS_PORT, cfg.REDIS_HOSTNAME
  redis_client.on 'error', (err) ->
    console.log 'REDIS Error:' + err


  ### Bookshelves ###

  # Get all shelves for a given user
  getShelves: (userId, callback) ->
    # Provide path to the API
    console.log 'Getting shelves ' + userId

    _options = clone(@options);
    _options.path = '/shelf/list.xml?user_id=' + userId + "&key=" + @options.key
  
    checkCache _options, callback
  
  # Get a specific list by ID
  getSingleList: (userId, listId, callback) ->
    # Provide path to the API
    console.log 'Getting list ' + userId

    _options = clone(@options);
    _options.path = '/review/list/' + userId + '.xml?key=' + @options.key + '&sort=rating&per_page=5&shelf=' + listId
  
    checkCache _options, callback
  
  ### FRIENDS ###
  getFriends: (userId, req, res, callback) ->
    # Provide path to the API
    console.log 'Getting friends ' + userId

    _options = clone(@options);
    _options.path = 'http://www.goodreads.com/friend/user/' + userId + '.xml?&key=' + @options.key
    console.log _options.path
    
    request = consumer().get _options.path, req.session.oauthRequestToken, req.session.oauthRequestTokenSecret
    request.addListener 'response', (response) ->
      response.setEncoding('utf8')
      response.addListener 'data', (chunk) ->
        console.log chunk
      response.addListener 'error', (error) ->
        console.log error
      response.addListener 'end', ->
        console.log '--- END ---'
    request.end()
  
    console.log request
    # checkCache _options, callback
  
  ### OAUTH ###
  requestToken: (callback, req, res) ->
    consumer().getOAuthRequestToken (error, oauthToken, oauthTokenSecret, results) -> 
      if error
        console.log consumer()
        res.send 'Error getting OAuth request token : ' + JSON.stringify(error), 500
      else
        req.session.oauthRequestToken = oauthToken
        req.session.oauthRequestTokenSecret = oauthTokenSecret
        res.redirect 'https://goodreads.com/oauth/authorize?oauth_token=' + req.session.oauthRequestToken + '&oauth_callback=' + consumer()._authorize_callback

  callback: (callback, req, res) ->
    parser = new xml2js.Parser()
  
    consumer().getOAuthAccessToken req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, (error, oauthAccessToken, oauthAccessTokenSecret, results) ->
      if error
        res.send 'Error getting OAuth access token : ' + (sys.inspect error) + '[' + oauthAccessToken + '] [' + oauthAccessTokenSecret + '] [' + (sys.inspect results) + ']', 500
      else
        req.session.goodreads_accessToken = oauthAccessToken
        req.session.goodreads_secret = oauthAccessTokenSecret
        consumer().get 'http://www.goodreads.com/api/auth_user', req.session.goodreads_accessToken, req.session.goodreads_secret, (error, data, response) ->
          if error
            res.send 'Error getting User ID : ' + (sys.inspect error), 500
          else
            parser.parseString(data)
  
    parser.on 'end', (result) ->
      req.session.goodreads_name = result.user.name
      req.session.goodreads_id = result.user['@'].id
      req.session.goodreads_auth = 1

      console.log req.session.goodreads_name + 'signed in with user ID: ' + req.session.goodreads_id + '\n'
      res.redirect '/'

  checkCache = (_options, callback) ->
    redis_client.get _options.path, (err, reply) ->
      if err
        console.log 'REDIS Error: ' + err
      else
        if reply
          console.log "REDIS readin' the cache!"
          callback JSON.parse(reply)
        else
          # Crap! Go grab it!
          console.log 'Oops not in the cache!'
          getRequest _options, callback
        
  getRequest = (_options, callback) ->
    # First check if object is in cache and call it back
    tmp = ''
    _req = http.request _options, (res) ->
      res.setEncoding 'utf8'
      parser = new xml2js.Parser()
  
      res.on 'data', (chunk) ->
        tmp += chunk
        console.log chunk
  
      res.on 'end', (e) ->
        parser.parseString tmp
  
      parser.on 'end', (result) ->
        redis_client.setex _options.path, cfg.REDIS_CACHE_TIME, JSON.stringify(result)
        callback result
  
    _req.on 'error', (e) ->
      console.log 'problem with request: ' + e.message
    
    _req.write 'data\n'
    _req.write 'data\n'
    _req.end()
    
  clone = (obj) ->
    if obj != null || typeof(obj) != 'object'
      return obj