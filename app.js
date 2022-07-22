const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

//body-parser that gets the typed material from website
app.use(bodyParser.urlencoded({ extended: true }));

// all the static materials(imgs, css file) has been loaded through public folder
app.use(express.static("public"));

//the form post method deals the values entered by name
app.post("/", function (req, res) {
  const FirstName = req.body.fname;
  const SecondName = req.body.sname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: FirstName,
          LNAME: SecondName,
        },
      },
    ],
  };

  const JsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/AUDIENCE_ID";

  const options = {
    method: "POST",
    auth: "hassan:APIKEY",
  };

  //the url will respond either to success or failure depending on the status code of website url

  const request = https.request(url, options, function (response) {
    
     if(response.statusCode === 200){

        res.sendFile(__dirname + "/success.html");
         
     }
     else{

        res.sendFile(__dirname + "/failure.html");
     }
      
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

  });

  request.write(JsonData);
  request.end();
  
});

//REDIRECTING THE FAILURE PAGE TO HOME /
app.post("/failure", function(req,res){

      res.redirect("/");

});

//directs to the home page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//PORT OPEN AT 3000 OR RANDOM GIVEN HEROKU PORT
app.listen( process.env.PORT || 3000 , function () {
  //our local host
  console.log("Server running on port 3000");
});

