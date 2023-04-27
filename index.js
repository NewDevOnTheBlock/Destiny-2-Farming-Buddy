require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');
// declare an express instance called app
const app = express();
// create an endpoint called static? *
app.use(express.static('static'));

app.get('/auth', (req, res) => {
  res.redirect(
    `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.CLIENT_ID}`,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  // body of request = client Id, client secret + code*? (from url)
  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
  };
  
  const opts = { 
    headers: { 
      accept: 'application/json',
      'X-API-Key': process.env.API_KEY
    }
  };

  axios
    .post('https://www.bungie.net/platform/app/oauth/token/', body, opts)
    .then(console.log("response: ", _res))
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');