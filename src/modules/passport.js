const passport = require("passport")
const PassportLocal = require("passport-local").Strategy;
const Users = require("../models/users");

passport.serializeUser((user, done ) => {
  done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
  const user = await Users.findById(id);
  done(null, user);
});


passport.use('local-signin', new PassportLocal({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

    const user = await Users.findOne({email: username});
    if(!user) {
      return done(null, false, req.flash('signinMessage', 'No User Found'));
    }
    if(!user.comparePassword(password)) {
      return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
    }
    req.session.owner = user.tienda;
    return done(null, user);

}))
