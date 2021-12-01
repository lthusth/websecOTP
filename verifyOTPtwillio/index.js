require('dotenv/config')
const express = require('express')
const app = express()
const port = 3000

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)

app.get('/', (req, res)=>{
    res.status(200).send({
        message: "Hello, World! This is a homepage",
    })
})

app.get('/api/v1/otp', (req,res) => {
     if (req.query.phonenumber) {
        client
        .verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({
            to: `+${req.query.phonenumber}`,
            channel: req.query.channel==='call' ? 'call' : 'sms' 
        })  
        .then(otp => {
            res.status(200).send({
                message: "Verification OTP is sent!!",
                phonenumber: req.query.phonenumber,
                otp
            })
        }) 
     } else {
        res.status(400).send({
            message: "Wrong phone number, please try again",
            phonenumber: req.query.phonenumber,
            data
        })
     }
})
app.get('/api/v1/verify', (req, res) => {
    if (req.query.phonenumber && (req.query.code).length === 6) {
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${req.query.phonenumber}`,
                code: req.query.code
            })
            .then(otp => {
                if (otp.status === "approved") {
                    res.status(200).send({
                        message: "User is verified!!",
                        otp
                    })
                }
            })
    } else {
        res.status(400).send({
            message: "Wrong phone number or otp",
            phonenumber: req.query.phonenumber,
            otp
        })
    }
})
app.listen(port, () => {
    console.log(`Server is running at ${port}`)})