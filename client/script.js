
async function fetchSuperheroInfo() {
    const nameField = document.getElementById('superheroId');

    const power = document.getElementById('powersSelection').value;
    const race = document.getElementById('raceSelection').value;
    const publisher = document.getElementById('publisherSelection').value;
    const searchNumber = document.getElementById('searchNumber').value
    console.log(searchNumber)

    nameField.value = name;

    const searchResultsContainer = document.getElementById('searchResultsContainer');
    searchResultsContainer.innerHTML = '';

    let url = `/api/superheroes?${name ? 'name=' + name : ''}${power ? '&power=' + 
        power : ''}${race ? '&Race=' + race : ''}${publisher ? '&Publisher=' + publisher : ''}${searchNumber ? '&limit=' 
        + searchNumber : ''}`;
    url = url.endsWith('&') ? url.slice(0, -1) : url;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("No Results Found!")
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const superheroes = await response.json();
        console.log(superheroes)

        const powersPromises = superheroes.map(hero => fetchAndDisplayPowers(hero.name));
        console.log(powersPromises)
        const allPowers = await Promise.all(powersPromises);

        const div = createSuperheroesDiv(superheroes, allPowers);
        searchResultsContainer.appendChild(div);
    } catch (error) {
        console.error('Error: ', error);
    }
}
function createSuperheroesDiv(superheroes, allPowers) {
    const div = document.createElement('div');
    div.style.background = '#3500D3';
    div.style.width = '750px';
    div.style.alignItems = 'center';
    div.style.overflow = 'auto'
    div.style.alignContent = 'center';
    div.style.marginBottom = '10px';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.setAttribute('class', 'superheroDiv');
    div.style.color = 'WHITE';
    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.padding = '0';
    ul.style.display = 'flex';
    ul.style.flexWrap = 'wrap';

    superheroes.forEach((superhero, index) => {
        const li = createSuperheroListItem(superhero, allPowers[index]);
        ul.appendChild(li);
    });

    div.appendChild(ul);
    return div;
}

function createSuperheroListItem(superhero, powers) {
    const li = document.createElement('li');
   li.style.listStyleType = 'none';
   li.style.width = '100%';
   li.style.textAlign = 'center';
   li.style.flex = '0 0 calc(100% - 20px)';
   li.style.padding = '10px';
   li.style.display = 'flex';
   li.style.flexDirection = 'column';

    Object.entries(superhero).forEach(([key, value]) => {
        if (key !== '_id') {
            const attributeDiv = document.createElement('div');
            attributeDiv.style.maxWidth = '100%';
            attributeDiv.style.overflowWrap = 'break-word';
            attributeDiv.textContent = `${key}: ${value}`;
            attributeDiv.textContent = `${key}: ${value}`;
            li.appendChild(attributeDiv);
        }
    });

    if (powers.length > 0) {
        const powersDiv = document.createElement('div');
        powersDiv.textContent = `Powers: ${powers.join(', ')}`;
        li.appendChild(powersDiv);
    }

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to List';
    addButton.style.width = '20%';
    addButton.style.display = 'inline-block'
    addButton.style.textAlign = 'center'
    addButton.textContent = 'Add to List';
    addButton.addEventListener('click', () => addToMyList(superhero, selectedList));
    li.appendChild(addButton);

    return li;
}


let selectedList;
async function createNewList(userInput) {
    const data = {
        listName: userInput,
        superheroes: []
    };

    await fetch(`/api/lists/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            alert('List Name Already Exists!')
            return;
        }
        addListButton(userInput);
        return response.json();
    }).catch(error => alert(error));

}

function addListButton(listName) {
    const whiteBox = document.getElementById('listContainer');
    let button = document.createElement('button');

    button.textContent = listName;
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

    button.addEventListener('mouseenter', () => button.style.backgroundColor = '#4CAF50');
    button.addEventListener('mouseleave', () => button.style.backgroundColor = '#8EE4AF');
    button.addEventListener('click', () => displayListElements(listName));
    button.addEventListener('click', () => selectList(listName, button));
    whiteBox.appendChild(button);
}


async function displayListElements(listName) {
    const response = await fetch(`/api/lists/${listName}`,{
        METHOD: 'GET'
    });
    const listDisplayDiv = document.getElementById('listDisplayDiv');
    listDisplayDiv.innerHTML = '';
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const listData = await response.json();
    const listObject = listData.find(list => list.listName === listName);
    const list = listObject.superheroes

    if (listObject && Array.isArray(listObject.superheroes)) {
        const selected = document.createElement('h3');
        selected.textContent = listName;
        listDisplayDiv.appendChild(selected);
        list.forEach(superhero => {
            console.log(JSON.stringify(superhero))
            const superheroElement = document.createElement('p');
            superheroElement.textContent = superhero.name;
            superheroElement.style.cursor = 'pointer';
            superheroElement.addEventListener('click', () => fetchInfo(superhero.name));
            listDisplayDiv.appendChild(superheroElement);
        });
    } else {
        console.error('Superheroes data is not found or not an array', listObject);
    }
}

async function fetchInfo(superhero) {
    try {
        const response = await fetch(`/api/superheroes/single/name/${superhero}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)

        let dataString = `Superhero Information:\n\n`;

        data.forEach((superheroObj, index) => {
            for (const key in superheroObj) {
                if (superheroObj.hasOwnProperty(key) && key !== 'powers' && key !== '_id') {
                    dataString += `${key}: ${superheroObj[key]}\n`;
                }
            }

            if (superheroObj.powers) {
                let activePowers = [];
                for (let power in superheroObj.powers) {
                    if (superheroObj.powers[power] === "True") {
                        activePowers.push(power);
                    }
                }
                if (activePowers.length > 0) {
                    dataString += `\nActive Powers:\n- ${activePowers.join('\n- ')}\n`;
                }
            }

            if (index < data.length - 1) {
                dataString += '\n---\n\n';
            }
        });

        alert(dataString);
    } catch (error) {
        console.error('Error fetching superhero info:', error);
    }
}
function selectList(listName, buttonElement) {
    const allListButtons = document.querySelectorAll('#listContainer button');
    allListButtons.forEach(btn => btn.classList.remove('selected'));
    buttonElement.classList.add('selected');
    selectedList = listName;
    console.log(selectedList)
}

async function createListBox() {
    let paragraph = document.getElementById('startP');
    let textbox = document.createElement('input');
    textbox.setAttribute('id','listName')
    let container = document.getElementById('searchResultsContainer');
    container.innerHTML = '';
    let label = document.createElement('p')
    label.setAttribute('for','listName')
    label.style.marginBottom = '-50px'
    label.textContent = 'ENTER A NAME FOR YOUR LIST:'
    container.appendChild(label)

    textbox.type = 'text';
    textbox.style.marginTop = '100px'
    paragraph.placeholder = 'Enter a list name';

    container.appendChild(textbox);
    textbox.focus();


    textbox.addEventListener('keydown', async function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            let userInput = textbox.value.trim();
            if (userInput) {
                createNewList(userInput);
                textbox.style.display = 'none';
                paragraph.style.display = 'none';
            }
        }
    });
}

function getPublisher(){
    fetch('/api/superheroes/info')
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let publishers = new Set();

            for (const superhero of data) {
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
    fetch('/api/superheroes/info/')
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let races = new Set();

            for (const superhero of data) {
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

function fetchAndDisplayPowers(superheroName) {
    return fetch(`/api/superheroes/single/name/${encodeURIComponent(superheroName)}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!data || !Array.isArray(data) || data.length === 0) {
                console.log(`Superhero ${superheroName} not found.`);
                return [];
            }

            let activePowers = [];

            data.forEach(superheroObj => {
                if (superheroObj.powers) {
                    for (let power in superheroObj.powers) {
                        if (superheroObj.powers[power] === "True") {
                            activePowers.push(power);
                        }
                    }
                }
            });

            return activePowers;
        })
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}


getRace()

function fetchLists() {
    fetch('/api/lists').then(
        response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }

    ).then(data => {
        const whiteBox = document.getElementById('listContainer');
        for (const listItem of data) {
            let button = document.createElement('button');
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
            button.textContent = listItem.listName;
            button.addEventListener('mouseenter', () => button.style.backgroundColor = '#4CAF50');
            button.addEventListener('mouseleave', () => button.style.backgroundColor = '#8EE4AF');
            button.addEventListener('click', () => displayListElements(listItem.listName));
            button.addEventListener('click', () => selectList(listItem.listName, button));
            whiteBox.appendChild(button);
        }
    }).catch(error => console.error('Error', error));
}
function getPowers() {

    fetch(`/api/superheroes/powers`,).then(response => {
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        return response.json();
    })
        .then(data => {
            console.log(data)
            const allPowers = new Set();

            const keys = Object.keys(data);
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

async function deleteList() {
    let listName = window.prompt('Enter the name of the list to delete:')
    try {
        const response = await fetch(`/api/lists/${listName}`,
            {method: 'DELETE'});

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            alert("List deleted! Refreshing page...")
            location.reload()
        } else {
            const errorData = await response.json();
            console.error(errorData.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }

}

function addToMyList(superhero, listName) {
    fetch(`/api/lists/${listName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ superhero: superhero}),
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('Superhero added to list:', data);
            displayListElements(listName);
        })
        .catch(error => console.error('Error', error));
}

async function sortList() {
    try {
        const response = await fetch(`/api/lists/sort/${selectedList}`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sortedList = await response.json();
        console.log(sortedList)

        await displayListElements(selectedList);
    } catch (error) {
        console.error('Error:', error);
    }
}
getPowers()

fetchLists()





