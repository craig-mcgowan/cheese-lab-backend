/*----------------------------------
   Dependencies
----------------------------------*/
require("dotenv").config()
const { PORT = 3000, MONGODB_URL } = process.env

const express = require("express")
const mongoose = require("mongoose")
const app = express()

const cors = require("cors")
const morgan = require("morgan")


/*----------------------------------
   Database Connection
----------------------------------*/
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

mongoose.connection
  .on("open",()=>console.log("Connected to Mongo"))
  .on("close",()=>console.log("Disconnected from Mongo"))
  .on("error", (error) => console.log(error))

/*----------------------------------
   Models
----------------------------------*/
const CheeseSchema = new mongoose.Schema({
  name: String,
  countryOfOrigin: String,
  image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)
/*----------------------------------
   Middleware
----------------------------------*/
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
/*----------------------------------
   Routes and Routers
----------------------------------*/
//test route
app.get("/", (req, res) => {
  res.send("Hello World")
 } 
)

//index route
app.get("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.find({}))
  } catch (error) {
    res.status(400).json({error})
  }
})

// Create Route - post request to /cheese
// create a person from JSON body
app.post("/cheese", async (req, res) => {
    try {
        // create a new cheese
        res.json(await Cheese.create(req.body))
    } catch (error){
        //send error
        res.status(400).json({error})
    }
})

//update route
app.put("/cheese/:id", async (req, res) => {
  try {
    res.json(
      await Cheese.findByIdAndUpdate(req.params.id, req.body, {new:true})
    )
  } catch (error) {
    res.status(400).json({error})
  }
})

//Destroy Route

app.delete(`/cheese/:id`, async (req, res) => {
  try {
    res.json(
      await Cheese.findByIdAndRemove(req.params.id)
    )
  } catch (error) {
    res.status(400).json({error})
    
  }
})

/*----------------------------------
   Server Listener
----------------------------------*/
app.listen(PORT, ()=>console.log(`express is listening on PORT ${PORT}`))