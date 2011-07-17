cfg = require '../config/config.js'  # contains API keys, etc'
Users = (require '../controllers/users.js').Users

# user tests go here
describe 'List all users: /users', -> 
  it 'Returns at least one valid user', ->
    user = new Users
    user.getUsers (json) ->
      expect(json).toBeDefined()
      expect(json[0].name).toBeDefined()
      expect(json[0].goodreadsID).toBeDefined()
      jasmine.asyncSpecDone()
    jasmine.asyncSpecWait()

describe 'List a single user: /users/:id', ->
  it 'Returns only one valid user', ->
    user = new Users
    user.findById '4085451', (json) ->
      console.log json
      expect(json).toBeDefined()
      expect(json[0].name).toBeDefined()
      expect(json[0].goodreadsID).toBeDefined()
      expect(json[1]).toBeUndefined()
      jasmine.asyncSpecDone()
    jasmine.asyncSpecWait()