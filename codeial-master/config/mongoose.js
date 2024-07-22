const mongoose = require('mongoose');

mongoose
    .connect("mongodb://127.0.0.1:27017/myapp")
    .then(()=> console.log("db connection successfull.."))
    .catch((err)=>console.log("error while connecting to db", err));
    

const db = mongoose.connection;
db.on('err', console.error.bind(console,'something wrong in connection'));

db.once('open',()=>console.log(` db is connected`));

module.exports= db;