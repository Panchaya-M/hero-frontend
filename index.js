require('dotenv').config()
import './src/style.scss'

document.addEventListener('DOMContentLoaded', function() {
    let listHeroesDom = document.getElementById('list-heroes')
    let formHero = document.querySelector("form")
  
    if(listHeroesDom == null) { return }
    let url = process.env.API_URL + "/heroes"
    formHero.setAttribute("action",url);
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic a21pdGw6YXlzdXQ3Z3c=',
        'Content-Type': 'application/json',
      }
    }).then(resp => resp.json())
      .then(data => {
        buildHeroDom(listHeroesDom, data)
        addHeaderTitleToHeroesList(listHeroesDom)
    })
  
    // Get all available jobs from backend
    let heroJobUrl = process.env.API_URL + "/hero_jobs"
    console.log(heroJobUrl)
    fetch(heroJobUrl, {
      method: "GET",
      headers: {
        'Authorization': 'Basic a21pdGw6YXlzdXQ3Z3c=',
      }
    }).then(resp => resp.json())
      .then(data => {
        
        let jobWrapper = document.getElementById('job-wrapper')
        if(jobWrapper == null) { return }
  
        console.log(data)
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