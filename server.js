require('dotenv').config()
const express=require('express');
const path=require('path');
const ejsMate=require('ejs-mate')
const db=require('./database');
const { deprecate } = require('util');

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render("register")
})

app.post('/register',async(req,res)=>{
 try {
    const {name,email,dept,ph}=req.body;
    await db.query("insert into stud_db.info (Name,Email,Department,Mobile) values (?,?,?,?)",[name,email,dept,ph]);
    res.redirect('/display');
 } catch (error) {
    console.log(error);
    return res.json(error)
 }
})


app.get('/display', async (req, res) => {
    try {
        const queryResult = await db.query("SELECT * FROM stud_db.info");
        const students = queryResult[0]; 
        res.render("display", { students });
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
});



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})