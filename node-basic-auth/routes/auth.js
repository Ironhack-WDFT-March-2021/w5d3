const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  // check if we have a user with the entered username -> is the username correct
  User.findOne({ username: username })
    .then(userFromDB => {
      if (userFromDB === null) {
        // the user is not in the database -> we show the login formm again
        res.render('login', { message: 'Invalid credentials' });
        return;
      }
      // if the username exists we check the password
      if (bcrypt.compareSync(password, userFromDB.password)) {
        // hashed password from the input and hash match
        // we log the user in
        req.session.user = userFromDB;
        // redirect to profile 
        res.redirect('/profile');
      }
    })
})

// this is the route where the signup form get's posted to
router.post('/signup', (req, res, next) => {
  // get username and password
  const { username, password } = req.body;
  console.log({ username, password });
  // is the password at least 8 chars
  if (password.length < 8) {
    // if not we show the signup form again with a message
    res.render('signup', { message: 'Your password has to be 8 chars min' });
    return
  }
  if (username === '') {
    res.render('signup', { message: 'Your username cannot be empty' });
    return
  }
  // validation passed - password is long enough and the username is not empty
  // check if the username already exists
  User.findOne({ username: username })
    .then(userFromDB => {
      // if user exists -> we render signup again
      if (userFromDB !== null) {
        res.render('signup', { message: 'This username is already taken' });
      } else {
        // the username is available
        // we create the hashed password
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        console.log(hash);
        // create the user in the database
        User.create({ username: username, password: hash })
          .then(createdUser => {
            console.log(createdUser);
            // log the user in immediately
            // req.session.user = createdUser;
            // redirect to login
            res.redirect('/login');
          })
      }
    })
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      next(error);
    } else {
      res.redirect('/');
    }
  })
});


module.exports = router;