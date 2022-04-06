import express from 'express'


const host = "127.0.1"
const port = 5000;
const app = express();

app.get('/',(req,res)=>{
    res.send("Hello World")
});


app.listen(port,()=>console.log(`server is running at https:\\www.${host}:${port}`))