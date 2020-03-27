const express = require('express');
const axios = require('axios')

const port = process.env.PORT || 3000;
const APIKEY = `C0p1JrHhaLuA2ean7zga5dZO32rQlNce`;

const app = express();

app.use(express.json());

app.get(`/`, async(req, res) => {
  let data = null;

  await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${APIKEY}`,
  ).then(function (response) {
    // handle success
    console.log("Sucess response: ",response);
    data = response;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
  res.send({
    message:"ticketMast",
    data
       //  client
   })
  
})

app.listen(port, () => {
  console.log("server listen on port : ", port);
})