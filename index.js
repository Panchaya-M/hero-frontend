require('dotenv').config()
import './src/style.scss'

document.addEventListener('DOMContentLoaded', function() {
    let listHeroesDom = document.getElementById('list-heroes')
    let formHero = document.querySelector("form")
    let btnSubmitHero = document.querySelector('#btn-submit-hero')
    if(listHeroesDom == null) { return }
    let url = process.env.API_URL + "/heroes"
    formHero.setAttribute("action",url);
    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': process.env.API_CREDENTIAL,
        'Content-Type': 'application/json',
      }
    }).then(resp => resp.json())
      .then(data => {
        buildHeroDom(listHeroesDom, data)
        addHeaderTitleToHeroesList(listHeroesDom)
    })
  
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
          console.log("WOW")
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
              //use response hero to update the hero list table
              //-Taget heroList
              //-Build heroItem from the new hero data
              //-Insert the heroItem DOM into the first position of the hero list

              insertNewHero(listHeroesDom, data)
          })
      }

      let profileUrl = url
      fetch(profileUrl, {
        method: "GET",
        headers: {
          'Authorization': process.env.API_CREDENTIAL,
          'Content-Type': 'application/json',
      }
      }).then(resp => resp.json())
        .then(data =>{
          let hero = document.querySelectorAll('.hero-name')
          hero.forEach(item => {
            item.addEventListener('click', function() {
              let id = item.id
              fetch(profileUrl + "/" + id, {
                method: "GET",
                headers: {
                  'Authorization': process.env.API_CREDENTIAL,
                  'Content-Type': 'application/json',
                }
              }).then(resp => resp.json())
                .then(data => {
                  let profileHero = document.getElementById('profile-hero')
                  if(profileHero == null) { return }
                  buildprofileHero(profileHero,data)
                })
            })
          })
        })
    })
    
    function insertNewHero(heroList, hero){
        let htmlStr = `
          <div class="hero">
              <div id="${hero.id}" class="hero-name">${hero.name}</div>
              <div>${hero.level}</div>
              <div>${hero.hp}</div>
              <div>${hero.mp}</div>
              <div>${hero.job}</div>
          </div>
        `
        heroList.insertAdjacentHTML('afterbegin', htmlStr)
    } 
    

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
                <div id="${hero.id}" class="hero-name">${hero.name}</div>
                <div>${hero.level}</div>
                <div>${hero.hp}</div>
                <div>${hero.mp}</div>
                <div>${hero.job}</div>
              </div>
            `
            targetDom.insertAdjacentHTML('beforeend', htmlStr)
        })
    }

    function buildprofileHero(targetDom,data) {
      targetDom.textContent = ''
      let imgUrl = data.image_thumbnail_url.replace('http://localhost:3002', process.env.API_URL)
      let htmlStr = `
          <div class="profile">
            <div class="profile-level">Lv. ${data.level}</div>
            <div class="profile-image">
              <img class="hero-image" src="${imgUrl}" alt="" />
            </div>
            <div class="profile-name">${data.name}</div>
            <div class="profile-job">${data.job}</div>
            <div class="profile-hp">hp ${data.hp}</div>
            <div class="profile-mp">mp ${data.mp}</div>

            <div class="bnt">
              <input type="submit" value="update">
              <input type="submit" value="delete">
            </div>
          </div>
        `
        targetDom.insertAdjacentHTML('beforeend', htmlStr)      
    }