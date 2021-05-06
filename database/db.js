const mongoose = require('mongoose')

const DB_URL = 'mongodb+srv://ayushi:lgNmRWcUoITrXcJA@cluster0.yq5ua.mongodb.net/mernjan21?retryWrites=true&w=majority'



mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(con => {
    console.log("Database server is connnected")
}).catch(err => {
    console.log("Error in DB Connection", err)
})

