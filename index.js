require('dotenv').config()
import './src/style.scss'

document.addEventListener('DOMContentLoaded', function() {
    let listHeroTag = getListOfHeroTag()
    if(listHeroTag == null) { return }

    displayListOfHero()

    let formHero = document.querySelector("#form-hero")
    let btnSubmitHero = document.querySelector('#btn-submit-hero')
    let url = process.env.API_URL + "/heroes"
    formHero.setAttribute("action",url);
  
    // Get all available jobs from backend
    let heroJobUrl = process.env.API_URL + "/hero_jobs"
    //console.log(heroJobUrl)
    fetch(heroJobUrl, {
      method: "GET",
      headers: {
        'Authorization': process.env.API_CREDENTIAL,
        'Content-Type': 'application/json',
      }
    }).then(resp => resp.json())
      .then(data => {
        
        let jobWrapper = document.getElementById('job-wrapper')
        if(jobWrapper == null) { return }
        buildJobDropdown(jobWrapper, data)
      })
   
      btnSubmitHero.onclick=()=>{
          createHero()
      }

      function createHero(){
          let name = formHero.querySelector('#name').value
          let job = formHero.querySelector('#jobs').value
          let image = formHero.querySelector('#image').files[0]
          
          let formData = new FormData()
          formData.append('hero[name]',name)
          formData.append('hero[job]',job)
          formData.append('hero[image]',image)
          
          let createHeroUrl = url
          fetch(createHeroUrl, {
              method: 'POST',
              headers:{
                'Authorization': process.env.API_CREDENTIAL,
              },
              body: formData,
              mode: 'cors'
          })
          .then(resp => resp.json())
          .then(data =>{
              insertNewHero(listHeroesDom, data)
          })
      }

        window.deleteHeroItem = function(heroId) {
          if(confirm('Are you sure?')) {
            let heroItem = document.querySelector(`[data-id="${heroId}"]`)
            let heroProfileWrapper = document.getElementById('profile')

            if(heroItem != null) {
              heroItem.remove()
              heroProfileWrapper.innerHTML = ''
              let heroUrl = url + "/" + heroId
              fetch(heroUrl, {
                method: "DELETE",
                headers: {
                  'Authorization': process.env.API_CREDENTIAL,
                  'Content-Type': 'application/json',
                }
              }).then(resp => resp.json())
                .then(data => alert("Delete Hero Complete!!!"))
            }
          }
        }
    })

    function heroUrl() {
      return process.env.API_URL + "/heroes"
    }

    function getListOfHeroTag() {
      return document.getElementById('list-heroes')
    }

    function displayListOfHero() {
      fetch(heroUrl(), {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.API_CREDENTIAL
        }
      }).then(resp => resp.json())
        .then(data => {
          buildHeroList(data)
          addHeaderTitleToHeroesList()
          assignClickEventForHeroItem()
      })
    }

    function assignClickEventForHeroItem() {
      let heroItems = document.querySelectorAll('.hero')
      heroItems.forEach(hero => {
        hero.addEventListener('click', function(){
          console.log(hero)
          displayHeroProfile(hero)
        })
      })
    }
    
    function insertNewHero(heroList, hero){
        let htmlStr = `
          <div class="hero" data-id="${hero.id}">
              <div id="${hero.id}" class="hero-name">${hero.name}</div>
              <div>${hero.level}</div>
              <div>${hero.hp}</div>
              <div>${hero.mp}</div>
              <div>${hero.job}</div>
          </div>
        `
        heroList.insertAdjacentHTML('afterend', htmlStr)
    } 
    

      function buildJobDropdown(targetDom, data) {
        targetDom.insertAdjacentHTML('afterbegin', `
          <select id="jobs" name="hero[job]">
            ${ data.jobs.map(item => { return `<option value=${item}>${item}</option>` }) }
            <option value=""></option>
          </select>
        `) 
      }
  
  function addHeaderTitleToHeroesList() {
      getListOfHeroTag().insertAdjacentHTML('afterbegin', `
        <div class="hero-header">
          <div>Name</div>
          <div>Level</div>
          <div>HP</div>
          <div>MP</div>
          <div>Job</div>
        </div>
      `)
    }
    
    
    function buildHeroList(data) {
        let listHeroTag = getListOfHeroTag()
        data.forEach(hero => {
            let heroData = {
              id: hero.id,
              name: hero.name,
              level: hero.level,
              hp: hero.hp,
              mp: hero.mp,
              job: hero.job,
              image_medium_url: hero.image_medium_url.replace('http://localhost:3002', process.env.API_URL)
            }
            let htmlStr = `
              <div class="hero" data-id="${hero.id}" data-hero='${JSON.stringify(heroData)}'>
                <div id="${hero.id}" class="hero-name">${hero.name}</div>
                <div>${hero.level}</div>
                <div>${hero.hp}</div>
                <div>${hero.mp}</div>
                <div>${hero.job}</div>
              </div>
            `
            listHeroTag.insertAdjacentHTML('beforeend', htmlStr)
        })
    }

    function displayHeroProfile(hero) {
      let heroProfileWrapper = document.getElementById('profile-hero')
      let heroData = JSON.parse(hero.dataset.hero)
      let heroPhoto = heroData.image_medium_url

      heroProfileWrapper.innerHTML = `
          <div class="profile" id="profile">
            <div class="profile-level">Lv. ${heroData.level}</div>
            <div class="profile-image">
              <img class="hero-image" src="${heroPhoto}" alt="${heroData.name}" />
            </div>
            <div class="profile-name">${heroData.name}</div>
            <div class="profile-job">${heroData.job}</div>
            <div class="profile-hp">hp ${heroData.hp}</div>
            <div class="profile-mp">mp ${heroData.mp}</div>

            <div class="bnt">
            <button class="btn-hero-update">Update</button>
            <button class="btn-hero-delete" onclick="deleteHeroItem(${heroData.id})">Delete</button>
            </div>
          </div>
        ` 
    }