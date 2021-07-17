import './style.scss'

document.addEventListener('DOMContentLoaded', function() {
    let listHeroesDOM = document.getElementById('list-heroes')
    
    if(listHeroesDOM == null) { return }

    let url = process.env.API_URL + "/heroes"
    fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.API_CREDENTIAL
        }
    })
    .then(resp => resp.json())
    .then(data => {
        buildHeroDom(listHeroesDOM, data)  
        addHeaderTitleToHeroesList(listHeroesDom)
        
     })
})

function addHeaderTitleToHeroesList(targetDom) {
    targetDom.insertAdjacentHTML('afterbegin', `
        <div class="hero-hearder">
            <div>Name</div>
            <div>Level</div>
            <div>HP</div>
            <div>MP</div>
            <div>Job</div>
        </div>
    `)
}

function buildHeroDom(targetDom, data) {
    data.forEach(hero => {
        let htmlStr = `
            <div class="hero">
                <a href="" class="hero-name">${hero.name}</a>
                <div>${hero.level}</div>
                <div>${hero.hp}</div>
                <div>${hero.mp}</div>
                <div>${hero.job}</div>
            </div>
        `
        targetDom.insertAdjacentHTML('beforeend', htmlStr)
    })
}