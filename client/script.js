function fetchSuperheroInfo() {

    let name = document.getElementById('superheroId').value;
    let power = document.getElementById('powersSelection').value;
    let race = document.getElementById('raceSelection').value;
    let publisher = document.getElementById('publisherSelection').value;
    let searchResultsContainer = document.getElementById('searchResultsContainer');

    searchResultsContainer.innerHTML = '';
    console.log(name,power,race,publisher)

    let url = `http://localhost:17532/api/superheroes?${name ? 'name=' + name : ''}${power ? '&power=' + power : ''}${race ? '&Race=' + race : ''}${publisher ? '&Publisher=' + publisher : ''}`;

    if (url.endsWith('&')) {
        url = url.slice(0, -1);
    }

    fetch(url).then(response => {
        if (!response.ok) {
            let paragraph = document.getElementById('startP');

            paragraph.textContent = 'No Results Found!';
            paragraph.style.color = 'black';
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(superhero => {
          // Skip the _id field
        console.log(superhero)
        let paragraph = document.getElementById('startP');

        let div = document.createElement('div');
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

        let ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';
        ul.style.display = 'flex';
        ul.style.flexWrap = 'wrap';
        superhero.forEach(superhero => {
            const li = document.createElement('li');
            li.style.listStyleType = 'none';
            li.style.width = '100%';
            li.style.textAlign = 'center';
            li.style.flex = '0 0 calc(100% - 20px)';
            li.style.padding = '10px';
            li.style.display = 'flex';
            li.style.flexDirection = 'column';

            for (const [key, value] of Object.entries(superhero)) {
                if (key !== '_id') {
                    let attributeDiv = document.createElement('div');
                    attributeDiv.style.maxWidth = '100%';
                    attributeDiv.style.overflowWrap = 'break-word';
                    attributeDiv.textContent = `${key}: ${value}`;
                    li.appendChild(attributeDiv);
                }
            }

            let showPowersButton = document.createElement('button');
            showPowersButton.textContent = 'Show Powers';
            showPowersButton.style.width = '20%';
            showPowersButton.style.display = 'flex';
            showPowersButton.style.textAlign = 'center';
            showPowersButton.addEventListener('click', function () {
                fetchAndDisplayPowers(superhero, div);
            });
            li.appendChild(showPowersButton);

            let addButton = document.createElement('button');
            addButton.textContent = 'Add to List';
            addButton.style.width = '20%';
            addButton.style.display = 'inline-block'
            addButton.style.textAlign = 'center'
            addButton.addEventListener('click', function () {
                console.log(superhero)
                addToMyList(superhero,selectedList);
            });
            li.appendChild(addButton);

            ul.appendChild(li);
        });

        div.appendChild(ul);

        searchResultsContainer.innerHTML = '';
        searchResultsContainer.appendChild(div);
    }).catch(error => console.error('Error: ', error));

}

let selectedList;
async function createNewList(userInput) {
    const data = {
        listName: userInput,
        superheroes: []
    };

    await fetch(`http://localhost:17532/api/lists/`, {
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
    const response = await fetch(`http://localhost:17532/api/lists/${listName}`);
    const listDisplayDiv = document.getElementById('listDisplayDiv');
    listDisplayDiv.innerHTML = ''
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const listData = await response.json();


    const listObject = listData.find(list => list.listName === listName);

    if (listObject && Array.isArray(listObject.superheroes)) {
        listDisplayDiv.innerHTML = '';
        const selected = document.createElement('h3')
        selected.textContent = selectedList
        listDisplayDiv.appendChild(selected)
        listObject.superheroes.forEach(superhero => {
            const superheroElement = document.createElement('p');
            superheroElement.textContent = superhero.name;
            listDisplayDiv.appendChild(superheroElement);
        });
    } else{
        console.error('Superheroes data is not found or not an array', listObject);

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
    let whiteBox = document.getElementById('listContainer');
    let paragraph = document.getElementById('startP');
    let textbox = document.createElement('input');
    let container = document.getElementById('searchResultsContainer');
    container.innerHTML = '';

    textbox.type = 'text';
    textbox.placeholder = 'Enter a list name';

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

function fetchLists() {
    fetch('http://localhost:17532/api/lists').then(
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

    fetch(`http://localhost:17532/api/superheroes/single`,).then(response => {
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

async function deleteList() {
    let listName = window.prompt('Enter the name of the list to delete:')
    console.log(listName)
    try {
        const response = await fetch(`http://localhost:17532/api/lists/${listName}`,
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
    fetch(`http://localhost:17532/api/lists/${listName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ superhero: superhero }),
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
function fetchAndDisplayPowers(superhero, container) {
    fetch(`http://localhost:17532/api/superheroes/single?name=${superhero.name}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(powersData => {
            console.log(powersData)
            let powersList = document.createElement('ul');
            powersData.forEach(power => {
                let powerItem = document.createElement('li');
                powerItem.textContent = power;
                powersList.appendChild(powerItem);
            });


            container.innerHTML = '';
            container.appendChild(powersList);
        })
        .catch(error => console.error('Error', error));
}

async function sortList() {
    try {
        // Fetch the list elements
        const response = await fetch(`http://localhost:17532/api/lists/sort/${selectedList}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sortedList = await response.json();

        displayListElements(sortedList);
    } catch (error) {
        console.error('Error:', error);
    }
}
getPowers()

fetchLists()





