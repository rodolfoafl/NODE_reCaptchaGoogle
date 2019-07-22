const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req, res) => {
    if(req.body.captcha === undefined
        || req.body.captcha === ''
        || req.body.captcha === null){
            return res.json({"success": false, "msg": "Please select captcha"});
    }

    //Secret key
    const secretKey = 'iT0HIwAxu4Pc9sX6zcpibPB/nHwUQmRww4XeBqI7eqDwkcwkCM36ZToGrPuXN6rV';

    //Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    //Make request to verify URL
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        //If not successful
        if(body.success !== undefined && !body.success){
            return res.json({"success": false, "msg": "Failed captcha verification"});
        }

        //If succescful
        return res.json({"success": true, "msg": "Captcha passed"});

    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});