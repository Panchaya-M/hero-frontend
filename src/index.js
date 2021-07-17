import './style.scss'

document.addEventListener('DOMContentLoaded', function() {
    let listHeroesDOM = document.getElementById('list-heroes')
    let formHero = document.querySelector("form")

    if(listHeroesDOM == null) { return }
    let url = process.env.API_URL + "/heroes"
    formHero.setAttribute("action",url)
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
        addHeaderTitleToHeroesList(listHeroesDOM)
        
     })

     //Get all available jobs from backend
     let heroJobUrl = process.env.API_URL + "/hero_jobs"
     fetch(heroJobUrl, {
         method: "GET",
         headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.API_CREDENTIAL
        }
     })
     .then(resp => resp.json())
     .then(data => {
         let jobWrapper = document.getElementById('job-wrapper')
         if(jobWrapper == null) { return }

         buildJobDropdown(jobWrapper, data)
     })
})

function buildJobDropdown(targetDom, data) {
    targetDom.insertAdjacentHTML('afterbegin', `
        <select id="jobs" name="hero[job]">
            ${ data.jobs.map(item => { return `<option value=${item}>${item}</option>` }) }
            <option value=""></option>
        </select>
    `)
}

function addHeaderTitleToHeroesList(targetDom) {
    targetDom.insertAdjacentHTML('afterbegin', `
        <div class="hero-header">
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