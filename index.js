const express  = require('express');
const app = express();
const path = require('path');

app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , 'public')));

app.get('/' , (req , res)=>{
    res.render('homepage');
})
app.get('/next1' , (req , res)=>{
    res.render('next1');
})
app.get('/next2' , (req , res)=>{
    res.render('next2');
})
app.get('/next3' , (req , res)=>{
    res.render('next3');
})


app.listen(3000 , ()=>{
    console.log("Server is running..");
})

