import './style.scss'

document.addEventListener('DOMContentLoaded', function() {
    let listHeroesDOM = document.getElementById('list-heroes')

    if(listHeroesDOM == null) { return }

    let url = process.env.API_URL + "/heroes"
    fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        addHeaderTitleToHeroesList(listHeroesDom)
        buildHeroDom(listHeroesDOM, data)  
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
                <a href="">${hero.name}</a>
                <div>${hero.level}</div>
                <div>${hero.hp}</div>
                <div>${hero.mp}</div>
                <div>${hero.job}</div>
        `
    })
}