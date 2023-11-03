function fetchSuperheroInfo(){
    const text = document.getElementById('superheroId').value
    const output = document.getElementById('output')

    if(text ===``){
        output.textContent = ''
    }

    fetch(`http://localhost:17532/api/superheroes/id/${text}`).then(response=>{
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    })
        .then(superhero => {
            output.textContent = JSON.stringify(superhero)
            console.log(JSON.stringify(superhero))
        }).catch(error => console.error('Error: ',error))
}

function fetchSuperheroPower(){
    const text = document.getElementById('powersId').value
    const output = document.getElementById('output')

    if(text ===``){
        output.textContent = ''
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



