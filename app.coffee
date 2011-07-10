http = require 'http'
express = require 'express'
oauth = require 'oauth'
RedisStore = (require 'connect-redis')(express)
sys = require 'sys'
cfg = require './config/config.js'    # contains API keys, etc.

app = express.createServer()

app.configure ->
  app.set 'views', __dirname + '/views'
  app.register '.html', require 'jade'
  app.use express.methodOverride()
  app.use express.bodyParser()
  app.use express.cookieParser()
  app.use express.session { secret: cfg.SESSION_SECRET, store: new RedisStore}
  app.use app.router
  
app.dynamicHelpers { session: (req, res) -> req.session }

### Initialize controllers ###
Goodreads = new (require './controllers/goodreads.js').Goodreads
# List = new (require './controllers/list.js').List

### Initialize models
UsersModel = new (require './models/users').Users
ListsModel = new (require './models/lists').Lists
BooksModel = new (require './models/books').Books
###

### Start Route Handling ###

# Home Page
app.get '/', (req, res) ->
  console.log req.session
  if req.session.goodreads_auth == 1
    # User is authenticated
    
    # Get my shelevs
    Goodreads.getShelves req.session.goodreads_id, (json) ->
      if json
        res.render 'index.jade', { json: json }
  
  else
    # Prompt for login
    res.send "You are not logged in. <A HREF='/goodreads/connect'>Click here</A> to login"

app.get '/logout', (req, res) ->
  console.log '--- LOGOUT ---'
  console.log req.session
  req.session.destroy()
  res.redirect '/'

# Goodreads
app.get '/goodreads/connect', (req, res) ->
  callback = ''
  Goodreads.requestToken callback, req, res
  
app.get '/goodreads/callback', (req, res) ->
  # Handle goodreads callback
  callback = ''
  Goodreads.callback callback, req, res
  # Redirect back to '/' when done

# Get logged in user's friends
app.get '/friends', (req, res) ->
  callback = ''
  Goodreads.getFriends req.session.goodreads_id, req, res, (json) ->
    res.send json

app.get '/goodreads/list/:listName', (req, res) ->
  # Get a specific list
  Goodreads.getSingleList req.session.goodreads_id, req.params.listName, (json) ->
    if json
      # Received valid return from Goodreads
      res.render 'list.jade', { json: json }

app.listen 3000