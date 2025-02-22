const mongoose = require('mongoose')
require('dotenv').config()

const connectDb = async() =>{
     try {
        console.log("MONGO_URI:", process.env.MONGO_URI)
await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

        console.log("connected to mongoDB")
     } catch (err) {
        console.error('error connecting to mongodb :',err.message)
     }
}


module.exports = {connectDb};
