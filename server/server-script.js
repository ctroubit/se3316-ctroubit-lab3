const express = require('express');
const fs= require('fs')
const cors = require('cors')
const path = require('path');
const {connectToDb, getDb} = require('./db')

let db;
const port = process.env.ACSvcPort || 3000

connectToDb((err)=>{
    if(!err){
        app.listen(port,()=>console.log(`Listening on port ${port}...`))
        db = getDb()
    }
})
const app = express();
app.use(cors())
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json())

app.get('/api/superheroes', async (req, res) => {
    try {
        const infoCursor = db.collection('info').find();
        const powersCursor = db.collection('powers').find();

        const s_info_data = await infoCursor.toArray();
        const s_powers_data = await powersCursor.toArray();

        const combinedData = {
            superheroes: s_info_data,
            powers: s_powers_data
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch data' });
    }
});

app.get('/api/superheroes/id/:id', async (req, res) => {
    try {
        const superheroId = parseInt(req.params.id);
        const superhero = await db.collection('info').findOne({ id: superheroId });

        if (!superhero) {
            res.status(404).send('Superhero not found');
            return;
        }

        res.status(200).json(superhero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch superhero data' });
    }
});

app.get('/api/superheroes/name/:name', async (req, res) => {
    try {
        const searchName = req.params.name;
        const regex = new RegExp(`^${searchName}`, 'i');

        const infoCursor = db.collection('info').find({ name: regex });
        const matchingSuperheroes = await infoCursor.toArray();

        if (matchingSuperheroes.length === 0) {
            console.log('Superheroes not found');
            res.status(404).send('Superheroes not found');
        } else {
            console.log('Sending matching superheroes');
            res.status(200).json(matchingSuperheroes);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch superhero data' });
    }
});

app.get('/api/superheroes/hero_names/:hero_names', async (req, res) => {
    try {
        const searchName = req.params.hero_names;
        const regex = new RegExp(`^${searchName}`, 'i');

        const powersCursor = db.collection('powers').find({ hero_names: regex });
        const matchingSuperheroes = await powersCursor.toArray();

        if (matchingSuperheroes.length === 0) {
            console.log('Superheroes not found');
            res.status(404).send('Superheroes not found');
        } else {
            console.log('Sending matching superheroes');
            res.status(200).json(matchingSuperheroes);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch superhero data' });
    }
});


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

app.put('/api/lists/:listName',(req,res)=>{
    const list = lists.find(l => l.listName === req.params.listName)

})
app.post('/api/lists',(req,res)=>{
const {listName, superheroes} = req.body

    const list = {
    listName,superheroes
    }

    lists.push(list)
    res.send(list)
})

app.get('/api/lists',(req,res)=>{
    res.json(lists)
})
