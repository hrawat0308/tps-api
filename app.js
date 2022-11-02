const express = require('express');
const bodyParser= require('body-parser');
require('dotenv').config(); 
const brandRoutes = require('./routes/brand');
const app = express();
app.use(bodyParser.json());


app.use('/', brandRoutes);

// Handling all the invalid routes
app.use((req, res, next)=>{
    const error = new Error("Invalid Route");
    error.code = 404;
    return next(error);
});


// Handling all the errors thrown 
app.use((err,req,res,next)=>{
    const error = err.message || "Something Went Wrong, Please try Again !!";
    res.status(err.code || 500);
    res.json({error : error});
});


app.listen(process.env.PORT, ()=>{
    console.log("Running");
});