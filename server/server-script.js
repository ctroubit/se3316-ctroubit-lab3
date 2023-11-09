const express = require('express');
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

// app.get('/api/superheroes', async (req, res) => {
//     try {
//         const infoCursor = db.collection('info').find();
//         const powersCursor = db.collection('powers').find();
//
//         const s_info_data = await infoCursor.toArray();
//         const s_powers_data = await powersCursor.toArray();
//
//         const combinedData = {
//             superheroes: s_info_data,
//             powers: s_powers_data
//         };
//
//         res.status(200).json(combinedData);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Could not fetch data' });
//     }
// });

app.get('/api/superheroes', async (req, res) => {
    try {
        let query = {};

        if (req.query.name) {
            query.name = { $regex: new RegExp(`^${req.query.name}`, 'i') };
        }

        if (req.query.Race) {
            query.Race = req.query.Race;
        }

        if (req.query.Publisher) {
            query.Publisher = req.query.Publisher;
        }

        console.log('Initial query:', query);

        const matchingSuperheroes = await db.collection('info').find(query).toArray();

        if (req.query.power) {
            if (matchingSuperheroes.length === 0) {
                console.log('No matching superheroes found');
                res.status(404).send('No matching superheroes found');
                return;
            }

            const heroNames = matchingSuperheroes.map(hero => hero.name);

            const powers = await db.collection('powers').find({ hero_names: { $in: heroNames } }).toArray();

            const superheroesWithPowers = matchingSuperheroes.filter(hero => {
                const heroPowers = powers.find(power => power.hero_names.includes(hero.name));
                const powerBeingLookedFor = req.query.power;

                return heroPowers && heroPowers[powerBeingLookedFor] === 'True';
            });

            if (superheroesWithPowers.length === 0) {
                console.log(`No matching superheroes found for power: ${req.query.power}`);
                res.status(404).send(`No matching superheroes found for power: ${req.query.power}`);
                return;
            }

            console.log('Sending matching superheroes with powers');
            res.status(200).json(superheroesWithPowers);
        } else {
            console.log('Sending matching superheroes');
            res.status(200).json(matchingSuperheroes);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch superhero data', message: error.message });
    }
});

app.get('/api/superheroes/single',async(req,res)=>{
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
})

app.get('/api/superheroes/single/:searchBy/:value', async (req, res) => {
    try {
        const searchBy = req.params.searchBy;
        const value = req.params.value;
        let query = {};

        switch (searchBy) {
            case 'id':
                query = { id: parseInt(value) };
                break;
            case 'name':
                query = { name: { $regex: new RegExp(`^${value}`, 'i') } };
                break;
            case 'power':
                query = { powers: { $elemMatch: { $eq: value, $eq: "True" } } };
                break;
            case 'publisher':
                query = { Publisher: value };
                break;
            case 'race':
                query = { Race: value };
                break;
            default:
                res.status(400).json({ error: 'Invalid search criteria' });
                return;
        }

        const matchingSuperheroes = await db.collection('info').find(query).toArray();

        if (matchingSuperheroes.length === 0) {
            console.log(`No superheroes found for ${searchBy}: ${value}`);
            res.status(404).send(`No superheroes found for ${searchBy}: ${value}`);
        } else {
            console.log(`Sending matching superheroes for ${searchBy}: ${value}`);
            res.status(200).json(matchingSuperheroes);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch superhero data' });
    }
});

app.get('/api/superheroes/:hero_names', async (req, res) => {
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
app.post('/api/lists', (req, res) => {
    const { listName, superheroes } = req.body;
    db.collection('lists').insertOne({ listName, superheroes })
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});


app.get('/api/lists', async (req, res) => {
    try {
        const lists = await db.collection('lists').find({}).toArray();
        res.json(lists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch lists' });
    }
});

app.get('/api/lists/:listName', async (req,res) =>{
    try{
        const list = await db.collection('lists').find({listName: req.params.listName}).toArray()
        res.json(list)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch lists' });
    }
})
app.get('/api/superheroes', async (req, res) => {
    try {
        const { name, power, race, publisher } = req.query;

        // Build the query object based on the provided parameters
        const query = {};

        if (name) {
            query.name = new RegExp(`^${name}`, 'i');
        }

        if (power) {
            query.powers = { $elemMatch: { powerName: power } };
        }

        if (race) {
            query.race = race;
        }

        if (publisher) {
            query.publisher = publisher;
        }

        const superheroes = await db.collection('info').find(query).toArray();

        res.status(200).json(superheroes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch data' });
    }
});

