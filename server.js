const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Data = require("./data"); // Import the Data model
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const cors = require("cors");
app.use(cors());
// Connect to MongoDB using async/await
(async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect("mongodb+srv://vishesh:050403@cluster0.du9nxq1.mongodb.net/vishesh", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
        let date_ = new Date();
        let date =date_.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
        let time =date_.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false});
        function updateTime(){
            date_ = new Date();
            date =new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
            time =new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false});
        }

        setInterval(updateTime,60000);
        app.post("/data", async (req, res) => {
            // console.log("Result", req.body);

            const data = new Data({
                temp: req.body.temp,
                humidity: req.body.humidity,
                pressure: req.body.pressure,
                altitude: req.body.altitude,
                fl:req.body.feelsLike,
                dp:req.body.dewPoint,
                time: time,
                date: date,
                timeStamp: date_

            });
            console.log(data);
            try {
                // Save the product data to the database
                const dataToStore = await data.save();
                res.status(200).json(dataToStore);
            } catch (error) {
                res.status(400).json({
                    'status': error.message
                });
            }
        });

        app.post("/getDate",async (req,res)=>{
            let date = req.body.date;
            console.log(req.body);
            let data = await Data.find({date:date});
            let filtered = {
                temp:(data.map((item)=>item.temp).reduce((a,b)=>a+b,0)/data.length).toFixed(2),
                humidity:(data.map((item)=>item.humidity).reduce((a,b)=>a+b,0)/data.length).toFixed(2),
                pressure:(data.map((item)=>item.pressure).reduce((a,b)=>a+b,0)/data.length).toFixed(2),
                altitude:(data.map((item)=>item.altitude).reduce((a,b)=>a+b,0)/data.length).toFixed(2),
                fl:(data.map((item)=>item.fl).reduce((a,b)=>a+b,0)/data.length).toFixed(2),
                dp:(data.map((item)=>item.dp).reduce((a,b)=>a+b,0)/data.length).toFixed(2),
            }
            res.status(200).json(filtered);
        });


        app.get('/', (req, res) => {
            res.send('Hey this is my API running 🥳')
        });

        app.get("/api/get_data", async (req, res) => {
            try {
                // Use the `Data` model to find all products in the database
                const data = await Data.find().sort({ "timeStamp": -1 }).limit(60); // Use Data.find() to retrieve all products

                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({
                    'status': error.message
                });
            }
        });



        // Route to get the most recent sensor data
        app.get('/api/mostRecentSensorData', async (req, res) => {
        try {
            const mostRecentData = await Data.find().sort({ "timeStamp": -1 }).limit(1);
            res.json(mostRecentData);
        } catch (error) {
            console.error('Error fetching most recent sensor data:', error);
            res.status(500).send('Internal Server Error');
        }
        });


        // Start your Express server
        app.listen(5000, () => {
            console.log("Connected to server at 5000");
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
})();
