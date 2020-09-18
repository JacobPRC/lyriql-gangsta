const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const schema = require("./schema/schema");

const app = express();

mongoose.connect(keys.mongoURI);

require("./models/Lyrics");
const Song = require("./models/Songs");

console.log(Song);

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000, () => console.log("listening on 3000"));
