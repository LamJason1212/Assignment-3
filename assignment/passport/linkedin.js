var LinkedInStrategy = require('passport-linkedin');
var User = require('../models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = {
    'clientID': '<your_app_identifier>',
    'clientSecret': '<your_app_secret>',
    'callbackURL': "http://127.0.0.1:3000/auth/linkedin/callback"
},

passport.use(new LinkedInStrategy({
    consumerKey: config.linkedin.clientID,
    consumerSecret: config.linkedin.clientSecret,
    callbackURL: config.linkedin.callbackURL 
},
//Linkedin sends back the tokens and progile info
function(access_token, refresh_token, profile, done) {
    // asynchronous
    process.nextTick(function() {
     
      // find the user in the database based on their linkedin id
      User.findOne({ 'id' : profile.id }, function(err, user) {
 
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
 
          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that linkedin id, create them
            var newUser = new User();
 
            // set all of the linkedin information in our user model
            newUser.linkedin.id    = profile.id; // set the users linkedin id                 
            newUser.linkedin.access_token = access_token; // we will save the token that linkedin provides to the user                    
            newUser.linkedin.firstName  = profile.name.givenName;
            newUser.linkedin.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.linkedin.email = profile.emails[0].value; // linkedin can return multiple emails so we'll take the first
 
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, newUser);
            });
         } 
      });
    });
}));