function fetchSuperheroInfo() {

    const text = document.getElementById('superheroId').value;
    const output = document.getElementById('listBox');

    output.innerHTML = ''
    if (text === '') {
        output.textContent = '';
        return;
    }

    fetch(`http://localhost:17532/api/superheroes/name/${text}`).then(response => {
        if (!response.ok) {
            let container = document.getElementById('startContainer');
            let paragraph = document.getElementById('startP');
            paragraph.style.display = 'block'
            paragraph.textContent = 'No Results Found!'
            paragraph.style.color = 'black'
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
        .then(superheroes => {
            let paragraph = document.getElementById('startP');
            paragraph.style.display = 'none'
            for (const superhero of superheroes) {
                let div = document.createElement('div');
                div.style.background = '#3500D3';
                div.style.width = '500px'
                div.style.alignContent = 'center';
                div.style.marginBottom = '10px';
                div.style.display = 'flex';
                div.style.justifyContent = 'center';
                div.setAttribute('class', 'superheroDiv');
                div.style.color = 'WHITE';

                let ul = document.createElement('ul');
                ul.style.listStyleType = 'none';
                ul.style.padding = '0';
                ul.style.display = 'flex';
                ul.style.flexWrap = 'wrap';

                for (const [key, value] of Object.entries(superhero)) {
                    let li = document.createElement('li');
                    li.style.listStyleType = 'none'
                    li.style.width = '100%';
                    li.style.textAlign = 'center';
                    li.style.padding = '10px';
                    li.style.flex = '0 0 calc(33.33% - 20px)'
                    li.textContent = `${key}: ${JSON.stringify(value)}`;
                    ul.appendChild(li);
                }

                div.appendChild(ul);

                output.appendChild(div);
            }
        }).catch(error => console.error('Error: ', error));
}

function fetchSuperheroPower(){
    const text = document.getElementById('powersId').value
    const output = document.getElementById('output')

    if(text ===``){
        output.textContent = ''
        return;
    }

    fetch(`http://localhost:17532/api/superheroes/${text}/powers`).then(response =>{
        if(!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)

        return response.json()
    })
        .then(powers =>{
            output.textContent = JSON.stringify(powers)
            console.log(JSON.stringify(powers))
        }).catch(error =>console.error('Error',error))
}

async function createListBox() {
    let whiteBox = document.getElementById('listContainer');
    let paragraph = document.getElementById('startP');
    let textbox = document.createElement('input');
    textbox.style.alignContent = 'center';
    textbox.style.display = 'flex';
    paragraph.textContent = 'Enter a list name!'
    textbox.style.justifyContent = 'center';
    let container = document.getElementById('startContainer');
    container.appendChild(textbox)


    textbox.addEventListener('keydown', async function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            let userInput = textbox.value;

            const data = {
                listName: `${userInput}`,
                superheroes: []
            }

            await fetch(`http://localhost:17532/api/lists/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            let button = document.createElement('button');
            textbox.style.display = 'none'
            button.style.background = '#8EE4AF';
            button.style.alignContent = 'center';
            button.style.width = (whiteBox.offsetWidth - 2) + 'px';
            button.style.height = '25px';
            button.style.top = '1px'
            button.style.marginBottom = '1px';
            button.style.display = 'flex';
            button.style.border = '1px solid black';
            button.style.justifyContent = 'center';
            button.style.marginLeft = '1px';
            button.setAttribute('id', 'listButton');
            button.style.color = '#4B4B4B';
            button.textContent = userInput;

            button.addEventListener('mouseenter', function () {
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
            });

            button.addEventListener('mouseleave', function () {
                button.style.backgroundColor = '#8EE4AF';
                button.style.color = '#4B4B4B';
            });

            whiteBox.appendChild(button);

            let othContainer = document.getElementById('colouredBlock');

            container.style.top = 4 + '%';

            let listBox = document.createElement('div');
            listBox.setAttribute('id', 'listBox');
            listBox.style.marginTop = (-633) + 'px';
            listBox.style.marginLeft = (othContainer.offsetLeft + 175) + 'px';
            listBox.style.width = '86.25vw';
            listBox.style.height = ' 92.75vh';
            listBox.style.position = 'relative';
            listBox.style.overflow = 'auto';
            listBox.style.backgroundColor = 'white';
            othContainer.appendChild(listBox);

            paragraph.style.display = 'none';
        }
    });
}

function getPublisher(){
    fetch('http://localhost:17532/api/superheroes')
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const superheroes = data.superheroes;
            let publishers = new Set();

            for (const superhero of superheroes) {
                const publisher = superhero.Publisher;
                if (publisher) {
                    publishers.add(publisher);
                }
            }

            let select = document.getElementById('publisherSelection');


            for (let i of publishers) {
                let option = document.createElement("option");
                option.text = i;
                console.log(i)
                select.add(option);
            }
        })
        .catch(error => console.error('Error: ', error));
}
getPublisher()

function getRace(){
    fetch('http://localhost:17532/api/superheroes')
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const superheroes = data.superheroes;
            let races = new Set();

            for (const superhero of superheroes) {
                const race = superhero.Race;
                if (race) {
                    races.add(race);
                }
            }

            let select = document.getElementById('raceSelection');

            for (let i of races) {
                let option = document.createElement("option");
                option.text = i;
                select.add(option);
            }
        })
        .catch(error => console.error('Error: ', error));
}
getRace()







