function fetchSuperheroInfo() {
    let output = document.getElementById('listBox');
    let name = document.getElementById('superheroId').value;
    let power = document.getElementById('powersSelection').value;
    let race = document.getElementById('raceSelection').value;
    let publisher = document.getElementById('publisherSelection').value;
    console.log(name,power,race,publisher)
    output.innerHTML = '';


    let url = `http://localhost:17532/api/superheroes?${name ? 'name=' + name : ''}${power ? '&power=' + power : ''}${race ? '&Race=' + race : ''}${publisher ? '&Publisher=' + publisher : ''}`;

    if (url.endsWith('&')) {
        url = url.slice(0, -1);
    }

    fetch(url).then(response => {
        if (!response.ok) {
            let paragraph = document.getElementById('startP');
            paragraph.style.display = 'block';
            paragraph.textContent = 'No Results Found!';
            paragraph.style.color = 'black';
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(superhero => {
        console.log(superhero)
        let paragraph = document.getElementById('startP');
        paragraph.style.display = 'none';

        let div = document.createElement('div');
        div.style.background = '#3500D3';
        div.style.width = '750px';
        div.style.alignItems = 'center';
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
            if (key !== '_id') {
                let li = document.createElement('li');
                li.style.listStyleType = 'none';
                li.style.width = '100%';
                li.style.textAlign = 'center';
                li.style.flex = '0 0 calc(100% - 20px)';
                li.style.padding = '10px';


                let contentDiv = document.createElement('div');
                contentDiv.style.maxWidth = '1000px';


                contentDiv.textContent = `${key}: ${JSON.stringify(value)}`;


                let addButton = document.createElement('button');
                addButton.textContent = 'Add to List';
                addButton.addEventListener('click', function () {
                    addToMyList(superhero);
                });

                li.appendChild(contentDiv);
                li.appendChild(addButton);
                ul.appendChild(li);
            }
        }

        div.appendChild(ul);

        output.appendChild(div);
    }).catch(error => console.error('Error: ', error));

}


async function createListBox() {
    let whiteBox = document.getElementById('listContainer');
    let paragraph = document.getElementById('startP');
    let textbox = document.createElement('input');
    let listBoxCreated = false;
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

                if (!listBoxCreated) {
                    listBoxCreated = true;

                    // Create listBox
                    let othContainer = document.getElementById('colouredBlock');
                    let header = document.getElementById('labHeader');
                    let listBox = document.createElement('div');
                    listBox.setAttribute('id', 'listBox');
                    listBox.style.marginTop = (-637) + 'px';
                    listBox.style.marginLeft = (othContainer.offsetLeft + 175) + 'px';
                    listBox.style.width = '86.25vw';
                    listBox.style.height = ' 92.75vh';
                    listBox.style.overflow = 'auto';
                    listBox.style.alignItems = 'center'
                    listBox.style.justifyContent = 'center'
                    listBox.style.alignContent = 'center';
                    listBox.style.display = 'flex';
                    listBox.style.flexDirection = 'column'
                    listBox.style.backgroundColor = 'white';
                    othContainer.appendChild(listBox);
                }

                paragraph.style.display = 'none';
            }
        });
    }


function getPublisher(){
    fetch('http://localhost:17532/api/superheroes/single')
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
                select.add(option);
            }
        })
        .catch(error => console.error('Error: ', error));
}
getPublisher()

function getRace(){
    fetch('http://localhost:17532/api/superheroes/single')
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

function fetchLists(){

    fetch('http://localhost:17532/api/lists').then(
        response =>{
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }
    ).then(
        data =>{
            for (const listItem of data) {
                let whiteBox = document.getElementById('listContainer');
                const listName = listItem.listName;
                let button = document.createElement('button');
                // textbox.style.display = 'none'
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
                button.textContent = listName;

                button.addEventListener('mouseenter', function () {
                    button.style.backgroundColor = '#4CAF50';
                    button.style.color = 'white';
                });

                button.addEventListener('mouseleave', function () {
                    button.style.backgroundColor = '#8EE4AF';
                    button.style.color = '#4B4B4B';
                });

                whiteBox.appendChild(button);
            }
        }
    )
}

function getPowers() {

    fetch(`http://localhost:17532/api/superheroes/single`).then(response => {
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        return response.json();
    })
        .then(data => {

            const powers = data.powers;
            const fEntry = powers[0];
            const allPowers = new Set();

            const keys = Object.keys(fEntry);
            keys.forEach(key => {
                if (key !== 'hero_names' && key !== '_id') {
                    allPowers.add(key);
                }
            });

            let select = document.getElementById('powersSelection');
            for (let i of allPowers) {

                let option = document.createElement("option");
                option.text = i;
                select.add(option);
            }
        })
        .catch(error => console.error('Error', error));
}

function clearSearch(){
    document.getElementById('superheroId').value = '';
    document.getElementById('powersSelection').selectedIndex = 0;
    document.getElementById('raceSelection').selectedIndex = 0;
    document.getElementById('publisherSelection').selectedIndex = 0;
}

getPowers()

fetchLists()





