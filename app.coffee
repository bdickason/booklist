http = require 'http'
express = require 'express'
oauth = require 'oauth'
RedisStore = (require 'connect-redis')(express)
sys = require 'sys'
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
  
app.dynamicHelpers { session: (req, res) -> req.session }

### Initialize controllers ###
Goodreads = require './controllers/goodreads.js'
# List = new (require './controllers/list.js').List

### Initialize models
UsersModel = new (require './models/users').Users
ListsModel = new (require './models/lists').Lists
BooksModel = new (require './models/books').Books
###

### Start Route Handling ###

# Home Page
app.get '/', (req, res) ->
  if req.session.goodreads_auth == 1
    # User is authenticated
    
    # Get my shelevs
    gr = new Goodreads.Goodreads
    gr.getShelves req.session.goodreads_id, (json) ->
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
  gr = new Goodreads.Goodreads
  gr.requestToken callback, req, res
  
# Handle goodreads callback  
app.get '/goodreads/callback', (req, res) ->
  callback = ''
  gr = new Goodreads.Goodreads
  gr.callback callback, req, res
  # Redirect back to '/' when done

# Get logged in user's friends
app.get '/friends', (req, res) ->
  callback = ''
  gr = new Goodreads.Goodreads
  gr.getFriends req.session.goodreads_id, req, res, (json) ->
    res.send json

# Get a specific list
app.get '/goodreads/list/:listName', (req, res) ->
  gr = new Goodreads.Goodreads
  gr.getSingleList req.session.goodreads_id, req.params.listName, (json) ->
    if json
      # Received valid return from Goodreads
        res.render 'list/list-partial', { layout: false, json: json } # Ajax
      # Render full list      res.render 'list.jade', { layout: false json: json }        

app.listen 3000