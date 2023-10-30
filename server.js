const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Data = require("./data"); // Import the Data model

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
            let date_ = new Date();
            date =date_.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
            time =date_.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false});
        }

        setInterval(updateTime,59000);
        // Define the /api/add_product route for adding products
        app.post("/data", async (req, res) => {
            console.log("Result", req.body);

            // Create a new instance of the Product model using the dataSchema
            const data = new Data({
                temp: req.body.temp,
                humidity: req.body.humidity,
                pressure: req.body.pressure,
                altitude: req.body.altitude,
                fl:req.body.feelsLike,
                dp:req.body.dewPoint,
                time: time,
                date: date

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


        app.get('/', (req, res) => {
            res.send('Hey this is my API running 🥳')
        });

        app.get("/api/get_data", async (req, res) => {
            try {
                // Use the `Data` model to find all products in the database
                const data = await Data.find().sort({ "time": -1 }).limit(240); // Use Data.find() to retrieve all products

                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({
                    'status': error.message
                });
            }
        });
        // ...

        // Route to get the most recent sensor data
        app.get('/api/mostRecentSensorData', async (req, res) => {
        try {
            const mostRecentData = await Data.find().sort({ "time": -1 }).limit(1);
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
