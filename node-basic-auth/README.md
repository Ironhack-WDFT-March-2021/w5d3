### Install express session and connect-mongo
```bash
$ npm install express-session connect-mongo@3.2.0
```

### Add this to app.js
```js
// in app.js
require("./config")(app);
// session configuration

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./db/index');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
)

// end of session configuration
```

### In .env
```
PORT=3000
SESSION_SECRET=keyboardcat
```

### For the current version of connect-mongo the configuration would look like this

#### Install not a specific but the current version of connect-mongo

```bash
$ npm install express-session connect-mongo
```

```js
// in app.js
require("./config")(app);
// session configuration

const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('./db/index');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: true,
    store: MongoStore.create({
      mongoUrl: mongoose.connection
    })
  })
)

// end of session configuration
```

### You also need to update db/index.js

```js
// db/index.js
// 

module.exports = mongoose;
```