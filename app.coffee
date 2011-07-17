http = require 'http'
express = require 'express'
oauth = require 'oauth'
RedisStore = (require 'connect-redis')(express)
sys = require 'sys'
mongoose = require 'mongoose'
cfg = require './config/config.js'    # contains API keys, etc.

app = express.createServer()

app.configure ->
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.register '.html', require 'jade'
  app.use express.methodOverride()
  app.use express.bodyParser()
  app.use express.cookieParser()
  app.use express.session { secret: cfg.SESSION_SECRET, store: new RedisStore}
  app.use app.router
  app.use express.static(__dirname + '/public')
  
mongoose.connection.on 'open', ->
  console.log 'Mongo is connected!'
  
app.dynamicHelpers { session: (req, res) -> req.session }

### Initialize controllers ###
Goodreads = (require './controllers/goodreads.js').Goodreads
Users = (require './controllers/users.js').Users
# Lists = new (require './controllers/lists.js').Lists


### Start Route Handling ###
 
# Home Page
app.get '/', (req, res) ->
  if req.session.goodreads_auth == 1
    # User is authenticated
    
    # Get my shelves
    gr = new Goodreads
    gr.getShelves req.session.goodreads_id, (json) ->
      if json
        res.render 'index.jade', { json: json }
  
  else
    # Prompt for login
    res.send "You are not logged in. <A HREF='/goodreads/connect'>Click here</A> to login"

# List All Users
app.get '/users', (req, res) ->
  callback = ''
  user = new Users
  user.getUsers (json) ->
    console.log json
    res.render 'users', { json: json }
    
# Single User Profile
app.get '/users/:id', (req, res) ->
  callback = ''
  user = new Users
  user.findById req.params.id, (json) ->
    console.log json
    res.render 'users/singleUser', { json: json }
  
# Goodreads
app.get '/goodreads/connect', (req, res) ->
  callback = ''
  gr = new Goodreads
  gr.requestToken callback, req, res
  
# Handle goodreads callback  
app.get '/goodreads/callback', (req, res) ->
  callback = ''
  gr = new Goodreads
  gr.callback callback, req, res
  # Redirect back to '/' when done

# Get logged in user's friends
app.get '/friends', (req, res) ->
  callback = ''
  gr = new Goodreads
  gr.getFriends req.session.goodreads_id, req, res, (json) ->
    res.send json

# Get a specific list
app.get '/goodreads/list/:listName', (req, res) ->
  gr = new Goodreads
  gr.getSingleList req.session.goodreads_id, req.params.listName, (json) ->
    if json
      # Received valid return from Goodreads
      res.render 'list/list-partial', { layout: false, json: json } # Ajax
      # res.render 'list/list', { json: json } # Render full list

app.get '/logout', (req, res) ->
  console.log '--- LOGOUT ---'
  console.log req.session
  console.log '--- LOGOUT ---'
  req.session.destroy()
  res.redirect '/'
        
app.listen 3000