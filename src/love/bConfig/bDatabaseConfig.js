const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.set('strictQuery', true);
    mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(response => {
        console.log(`Great!... Mongo DB connected with server: ${response.connection.host}`)
    })
    // .catch(error => {
    //     console.log(error)
    // })    
}

module.exports = connectDatabase