//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require('path');

const app = express();


app.use(express.static("public"));
//Nastaví veřejnou složku (root)

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/signup.html");
})
app.post("/", (req,res) => {
    const firstName = req.body.first_name;
    const secondName = req.body.second_name;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                merge_fields: {
                    FNAME: firstName,
                    LNAME : secondName
                },
                status: "subscribed",
            }
        ],
        update_existing: false,
    };

    const jsonData = JSON.stringify(data);
    const listId = "5706c19eac";
    const appId = "1fb60e83af149ab4ecfa757c3c0af706-us7";
    const url = "https://us7.api.mailchimp.com/3.0/lists/" + listId;
    const options = {
        method: "POST",
        auth: "prchys:"+appId
    };
    const request = https.request(url,options,function (response) {
        if(response.statusCode === 200) {
            res.sendFile(path.join(__dirname,"/success.html"))
        } else {
            res.sendFile(path.join(__dirname,"/failure.html"))
        }
        response.on("data", function(data)  {
            console.log(JSON.parse(data));
        })
        response.on("error", function(err) {
            console.log(err);
        })
    })
    request.write(jsonData);
    request.end();

    
});
app.post("/failure", function(req,res) {
    res.redirect("/")
})
app.listen(process.env.PORT || 3000 , () => {
    console.log("Server has started on port 3000.");
});

//api: 1fb60e83af149ab4ecfa757c3c0af706-us7
//audience: 5706c19eac