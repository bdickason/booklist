(function() {
  var Users, cfg;
  cfg = require('../config/config.js');
  Users = (require('../controllers/users.js')).Users;
  describe('List all users: /users', function() {
    return it('Returns at least one valid user', function() {
      var user;
      user = new Users;
      user.getUsers(function(json) {
        expect(json).toBeDefined();
        expect(json[0].name).toBeDefined();
        expect(json[0].goodreadsID).toBeDefined();
        return jasmine.asyncSpecDone();
      });
      return jasmine.asyncSpecWait();
    });
  });
  describe('List a single user: /users/:id', function() {
    return it('Returns only one valid user', function() {
      var user;
      user = new Users;
      user.findById('4085451', function(json) {
        console.log(json);
        expect(json).toBeDefined();
        expect(json[0].name).toBeDefined();
        expect(json[0].goodreadsID).toBeDefined();
        expect(json[1]).toBeUndefined();
        return jasmine.asyncSpecDone();
      });
      return jasmine.asyncSpecWait();
    });
  });
}).call(this);
