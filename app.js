const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();

const app = express();

const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  let jsonData = JSON.stringify(data);

  const url = `https://us14.api.mailchimp.com/3.0/lists/${process.env.LISTID}`;
  const options = {
    method: "POST",
    auth: `ruaridh1:${process.env.APIKEY}`,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.get("/", function (req, res) {
  res.sendFile(`${__dirname}/signup.html`);
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
