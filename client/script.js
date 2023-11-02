function fetchSuperheroInfo(){
    const text = document.getElementById('superheroId').value

    fetch(`http://localhost:17532/api/superhero_info/${text}`).then(response=>{
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    })
        .then(superhero => {
            const output = document.getElementById('output')
            output.textContent = JSON.stringify(superhero)
            console.log(JSON.stringify(superhero))
        }).catch(error => console.error('Error: ',error))
}