### Goodreads - Handles all connectivity to Goodreads API ###
### API Docs: http://www.goodreads.com/api ###

http = require 'http'
goodreads_client = (require 'goodreads').client
redis = require 'redis'
sys = require 'sys'
cfg = require '../config/config.js' # contains API keys, etc.
Users = (require './user.js').User

exports.Goodreads = class Goodreads
  
  ### CONFIG ###

  # Default JSON options
  constructor: () ->
    @options = {
      key: cfg.GOODREADS_KEY,
      secret: cfg.GOODREADS_SECRET,
      callback: 'http://localhost:3000/goodreads/callback'
    }
  
  # Start up redis to cache API stuff
  redis_client = redis.createClient cfg.REDIS_PORT, cfg.REDIS_HOSTNAME
  redis_client.on 'error', (err) ->
    console.log 'REDIS Error:' + err


  ### BOOKSHELVES ###

  # Get all shelves for a given user
  getShelves: (userId, callback) ->
    console.log 'Getting shelves ' + userId
    
    gr = new goodreads_client @options
    
    # Create unique key for redis caching
    cacheKey = 'getShelves/' + userId
    redis_client.get cacheKey, (err, reply) ->
      if err
        console.log 'REDIS Error: ' + err
      else
        if reply
          callback JSON.parse reply
        else
          # Crap! Go grab it!   
          gr.getShelves userId, (json) ->
            if json
              # cache the output
              redis_client.setex cacheKey, cfg.REDIS_CACHE_TIME, JSON.stringify(json)
              callback json
  
  # Get a specific list by ID
  getSingleShelf: (userId, listId, callback) ->
    # Provide path to the API
    console.log 'Getting list: ' + listId

    gr = new goodreads_client @options
    
    # Create unique key for redis caching
    cacheKey = 'getSingleShelf/' + userId + '/' + listId
    
    redis_client.get cacheKey, (err, reply) ->
      if err
        console.log 'REDIS Error: ' + err
      else
        if reply
          callback JSON.parse reply
        else
          # Crap! Go grab it!
          gr.getSingleShelf userId, listId, (json) ->
            if json
              # cache the output
              redis_client.setex cacheKey, cfg.REDIS_CACHE_TIME, JSON.stringify(json)
              callback json
  
  ### FRIENDS ###
  getFriends: (userId, req, res, callback) ->
    # Provide path to the API
    console.log 'Getting friends ' + userId

    @options.path = 'http://www.goodreads.com/friend/user/' + userId + '.xml?&key=' + @options.key
    console.log @options.path
    console.log req.session
    
    consumer().getProtectedResource @options.path, 'GET', req.session.goodreads_accessToken, req.session.goodreads_secret, (error, data, response) ->
      if error
        console.log consumer()
        callback 'Error getting OAuth request token : ' + JSON.stringify(error), 500
      else
        callback data
  
  ### OAUTH ###
  requestToken: (req, res, callback) ->
    gr = new goodreads_client @options
    
    gr.requestToken (callback) ->
      console.log 'request token!'

      # Log everything to ze session!
      req.session.goodreads_authToken = callback.oauthToken
      req.session.goodreads_authSecret = callback.oauthTokenSecret
      
      # Send user back to goodreads for callback
      res.redirect callback.url

  callback: (req, res, callback) ->
    gr = new goodreads_client @options    
    
    gr.processCallback req.session.goodreads_authToken, req.session.goodreads_authSecret, req.params.authorize, (callback) ->
    
      req.session.goodreads_name = callback.username
      req.session.goodreadsID = callback.userid
      req.session.goodreads_auth = 1
      req.session.goodreads_accessToken = callback.accessToken
      req.session.goodreads_accessTokenSecret = callback.accessTokenSecret

      console.log req.session.goodreads_name + ' signed in with user ID: ' + req.session.goodreadsID + '\n'

      res.redirect '/'
      
      if req.session.goodreadsID != null
        console.log 'Adding user: ' + req.session.goodreads_name
        users = new Users
        users.addUser(req.session.goodreadsID, req.session.goodreads_name, callback)
