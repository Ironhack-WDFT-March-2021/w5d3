const router = require("express").Router();

// this middleware checks if the user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    // if the user is logged in proceed with the next step
    if (req.session.user) {
      next();
    } else {
      // otherwise redirect to /login
      res.redirect('/login')
    }
  }
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', loginCheck(), (req, res, next) => {
  console.log('this is the cookie: ', req.cookies);
  console.log('this is the logged in user: ', req.session.user);
  // set your own cookie
  // res.cookie('myCookie', 'hello world');
  // delete a cookie
  // res.clearCookie('myCookie');
  res.render('profile');
})

module.exports = router;