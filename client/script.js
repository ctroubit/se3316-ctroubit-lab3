function fetchSuperheroInfo() {
    const text = document.getElementById('superheroId').value
    const output = document.getElementById('output')

    if (text === ``) {
        output.textContent = ''
        return;
    }

    fetch(`http://localhost:17532/api/superheroes/id/${text}`).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    })
        .then(superhero => {
            let div = document.createElement('div');
            div.style.border = '2px solid white';
            div.style.background = '#d3d3d3';
            div.style.alignContent = 'center';
            div.style.marginBottom = '10px';
            div.style.marginTop = '100px';
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.setAttribute('id', 'superheroDiv');
            div.style.color = '#4B4B4B';

            let ul = document.createElement('ul');
            ul.style.listStyleType = 'none';
            ul.style.padding = '0';

            for (const [key, value] of Object.entries(superhero)) {
                let li = document.createElement('li');
                li.textContent = `${key}: ${value}`;
                ul.appendChild(li);
            }

            div.appendChild(ul);

            // Append the formatted information to the output element
            output.appendChild(div);
        }).catch(error => console.error('Error: ', error))
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

function createList(){
    let whiteBox = document.getElementById('whiteBox')
    let container = document.getElementById('startContainer')

    container.style.top = 10+'%'
    let listDiv = document.createElement('div')

    let paragraph = document.getElementById('startP')
    paragraph.textContent = ''


    let newDiv = document.createElement('div')
        newDiv.style.background = '#d3d3d3';
        newDiv.style.alignContent = 'center';
        newDiv.style.width = (whiteBox.offsetWidth -25) + 'px'
        newDiv.style.height = '10px';
        newDiv.style.display = 'flex';
        newDiv.style.justifyContent = 'center';
        newDiv.setAttribute('id', 'list');
        newDiv.style.color = '#4B4B4B';

        whiteBox.appendChild(newDiv)

}

function getPublisher(){
    fetch('http://localhost:17532/api/superheroes').then(response=>{
        if(!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)

        return response.json()
    }).then(data => {
        const superheroes = data.superheroes;

            let publishers = new Set()

            for (const superhero of superheroes) {
                const publisher = superhero.Publisher;
                if (publisher) {
                    publishers.add(publisher);

                }
            }
            let select = document.getElementById('publisherBox')
            for (let i of publishers.values()){
                let option = document.createElement("option");
                option.text = i
                select.add(option)
            }

    }).catch(error => console.error('Error: ', error));
}

window.onload = function (){
    getPublisher()
}




