import express, { response } from "express";
import https from "https";
import bodyParser from "body-parser";
import {dirname} from "path";
import {fileURLToPath} from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", (req,res) => res.sendFile(__dirname + "/signup.html"));

app.post("/", (req,res) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const JSONdata = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/deed77cdfd";
    const options = {
        method: "POST",
        auth: "Michelle:92e042afd9e09130b9d4cb6f42cc1ee8-us1"
    }

    const request = https.request(url, options, (response) => {
        
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        });
    });

    request.write(JSONdata);
    request.end();
});

app.post("/failure", (req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000."));


// API Key
// 92e042afd9e09130b9d4cb6f42cc1ee8-us1

// list ID
// deed77cdfd