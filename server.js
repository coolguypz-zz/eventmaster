const express = require('express')
const port = process.env.PORT || 3000;
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.resolve(__dirname,'client')))

app.listen(port,()=> console.log("listening on port:",port));