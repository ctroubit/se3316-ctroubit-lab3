const express = require('express');
const fs = require('fs')
const cors = require('cors')
const app = express();
const path = require('path');

app.use(cors())
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json())
let s_info_data;
let s_powers_data;
fs.readFile('superheroes/superhero_info.json','utf8',(err,data)=>{
    if(err){
        console.error('Error:',err)
        return;
    }
    s_info_data = JSON.parse(data);
})

fs.readFile('superheroes/superhero_powers.json','utf-8',(err,data)=>{
    if(err){
        console.error('Error:',err)
        return;
    }
    s_powers_data = JSON.parse(data)
})


app.get('/',(req,res)=>{
    res.send('Hello World')
});

app.get('/api/superheroes', (req, res) => {
    const combinedData = {
        superheroes: s_info_data,
        powers: s_powers_data
    };

    res.json(combinedData);
});

app.get('/api/superheroes/id/:id',(req,res)=>{
    const superhero = s_info_data.find(s => s.id === parseInt(req.params.id));
    if(!superhero)
        res.status(404).send('Id not found')
    res.send(superhero)
})

app.get('/api/superheroes/name/:name',(req,res)=>{
    const searchName = req.params.name;

    const regex = new RegExp(`^${searchName}`, 'i');
    const matchingSuperheroes = s_info_data.filter(s => s.name.match(regex));

    if(matchingSuperheroes.length === 0) {
        console.log('Superheroes not found');
        res.status(404).send('Superheroes not found');
    } else {
        console.log('Sending matching superheroes');
        res.send(matchingSuperheroes);
    }
});
app.get('/api/superheroes/hero_names/:hero_names',(req,res)=>{
    const searchName = req.params.hero_names;

    const regex = new RegExp(`^${searchName}`, 'i');
    const matchingSuperheroes = s_powers_data.filter(s => s.hero_names.match(regex));

    if(matchingSuperheroes.length === 0) {
        console.log('Superheroes not found');
        res.status(404).send('Superheroes not found');
    } else {
        console.log('Sending matching superheroes');
        res.send(matchingSuperheroes);
    }
})

app.get('/api/superheroes/:id/powers', (req, res) => {
    const superheroId = parseInt(req.params.id);


    const superhero = s_info_data.find(superhero => superhero.id === superheroId);

    if (!superhero) {
        res.status(404).json({ message: `Superhero with ID ${superheroId} not found` });
        return;
    }

    const superheroPowers = s_powers_data.find(power => power.hero_names === superhero.name);

    if (!superheroPowers) {
        res.status(404).json({ message: `Powers not found for Superhero with ID ${superheroId}` });
        return;
    }

    res.json(superheroPowers);
});

const port = process.env.ACSvcPort || 3000
app.listen(port,()=>console.log(`Listening on port ${port}...`))