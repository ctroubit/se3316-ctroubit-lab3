const express = require('express');
const fs = require('fs')
const app = express();
let s_info_data;
fs.readFile('superheroes/superhero_info.json','utf8',(err,data)=>{
    if(err){
        console.error('Error:',err)
        return;
    }
    s_info_data = JSON.parse(data);
})

app.get('/',(req,res)=>{
    res.send('Hello World')
});

app.get('/api/superhero_info',(req,res)=>{
    res.send(s_info_data)
})

app.get('api/superhero_info/:id',(req,res)=>{
    const superhero = s_info_data.find(s => s.name)
})
const port = process.env.ACSvcPort || 3000
app.listen(port,()=>console.log(`Listening on port ${port}...`))