const _clss = {
    active : "_active"
}

window.IP_MAIN = 'http://127.0.0.1:3000';

let burgerBTN = document.querySelector('.header__burger .plate')
let headerDown = document.querySelector('header .header__bottom')

const toggleBurgerMenu = (e) => {
    burgerBTN.classList.toggle('active')
    headerDown.classList.toggle('active')
}

burgerBTN.addEventListener('click', toggleBurgerMenu)


// AUTH area
let authContentWrapperElement = document.querySelector('.auth__area .content__wrapper')
let authLoginContent = document.querySelector('.auth__area .auth__login')
let authRegContent = document.querySelector('.auth__area .auth__reg')

let authRegContentBTN = document.querySelector('.auth__area .auth__nav .nav__reg')
let authLoginContentBTN = document.querySelector('.auth__area .auth__nav .nav__login')

const getAuthContenHeight=(_class="auth__login")=>{
    const block = document.querySelector('.auth__content._active');
    return block.getBoundingClientRect().height
}

const changeAuthContentSize=()=>{
    let blockSize = getAuthContenHeight()
    authContentWrapperElement.style.height = blockSize + 'px';
}

const changeActiveAuthContent = () => {
    changeAuthContentSize()
}

// events for open auth content   | without enum 
const openRegContent = () => {
    authLoginContent.classList.remove(_clss.active)
    authRegContent.classList.add(_clss.active)

    authLoginContentBTN.classList.remove(_clss.active)
    authRegContentBTN.classList.add(_clss.active)
    
    changeActiveAuthContent()
}
const openLoginContent = () => {
    authRegContent.classList.remove(_clss.active)
    authLoginContent.classList.add(_clss.active)

    authRegContentBTN.classList.remove(_clss.active)
    authLoginContentBTN.classList.add(_clss.active)

    changeActiveAuthContent()
}

// window.addEventListener('load', function() {
//     changeAuthContentSize()
// })


// switch auth popup

const toggleAuthPopup = (action=false) => {
    const authPopupWrapper = document.querySelector('.auth__wrapper')
    const authPopupArea = document.querySelector('.auth__wrapper .auth__area')
    if (action) {
        if (window.isLoggedIn){
            return
        }
        authPopupWrapper.classList.add(_clss.active)
        setTimeout(() => {
            authPopupArea.classList.add(_clss.active)
        }, 1);
        setTimeout(() => {
            changeAuthContentSize()
        }, 302);
    } else {
        authPopupArea.classList.remove(_clss.active)
        setTimeout(() => {
            authPopupWrapper.classList.remove(_clss.active)
        }, 100);
    }
    
}

function btnRegOpen(){ 

    toggleAuthPopup(true);
    setTimeout(() => {
        openRegContent();
    }, 200);
}
function btnLoginOpen(){ 

    toggleAuthPopup(true);
    setTimeout(() => {
        openLoginContent();
    }, 200);
}

// підгрузка даних про курси
async function getCources () {
    

    const response = await fetch(window.IP_MAIN+'/curses', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data)

    if (!response.ok) { 
        return false
    } else {
        return data
    }

    
    
}

// підгрузка тестів
async function getPDRTests () {
    

    const response = await fetch(window.IP_MAIN+'/tests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data)

    if (!response.ok) { 
        return false
    } else {
        return data
    }

    
    
}

async function getCourcesForMain () {
    let landingBlocksWrapper = document.querySelector('.landing__blocks')
    let html_area = ''

    let data = await getCources()
    if (!data) {  
        landingBlocksWrapper.innerHTML = 'Виникла помилка при завантаженні =(' 
        return
    }
    console.log(data)
    data.forEach(element => {
        landingBlockTemp = `
            <div class="landing__block" data-id="${element.id}">
                <div class="block__img">
                    <img src="./imgs/courses/${element.mainPhoto}" alt="car">
                </div>
                <div class="block__content">
                    <h3 class="block__title">${element.title}</h3>
                    <p class="block__desc">
                        ${element.desc}
                    </p>
                    <div class="block__btns">
                        <button onclick="relocateToCoursesHol('${element.path}')" class="block__btn btn" >Дізнатися більше</button>
                    </div>
                </div>
            </div>
        `
        // 
        html_area += landingBlockTemp
    });
    if (html_area.trim() == '') {
        html_area = 'Ніяких даних не було підгружено =/'
    }
    landingBlocksWrapper.innerHTML = html_area
}

async function getCourcesForList () {
    let landingBlocksWrapper = document.querySelector('.card__courses')
    let html_area = ''

    let data = await getCources()
    if (!data) {  
        landingBlocksWrapper.innerHTML = 'Виникла помилка при завантаженні =(' 
        return
    }
    data.forEach(element => {
        landingBlockTemp = `
            <div class="card" data-id="${element.id}">
                <div class="card__header">
                    <div class="card__title">${element.title}</div>
                </div>
                <div class="card__container">
                    <div class="card__img">
                        <img src="./imgs/courses/${element.mainPhoto}" alt="${element.title}">
                    </div>
                    <div class="card__info">
                        <div class="card__desc">${element.desc}</div>
                        <div class="card__btns">
                            <button onclick="window.location.href = './coursesPreview/${element.path}';"  class="card__btn block__btn btn">Дізнатися більше</button>
                        </div>
                    </div>
                </div>
            </div>
        `
        // 
        html_area += landingBlockTemp
    });
    if (html_area.trim() == '') {
        html_area = 'Ніяких даних не було підгружено =/'
    }
    landingBlocksWrapper.innerHTML = html_area
}

async function getTestsForList () {
    let landingBlocksWrapper = document.querySelector('.card__tests')
    let html_area = ''

    let data = await getPDRTests()

    if (!data) {  
        landingBlocksWrapper.innerHTML = 'Виникла помилка при завантаженні =(' 
        return
    }
    
    console.log(data)

    data.forEach(element => {
        landingBlockTemp = `
        <div class="card" data-id="${element.id}">
            <div class="card__container">
                <div class="card__img">
                    <img src="./imgs/courses/${element.img}" alt="${element.title}">
                </div>
                <div class="card__info">
                    <div class="card__title">${element.title}</div>
                    <div class="card__btns">
                        <button onclick="window.location.href = './test/${element.link}';" class="card__btn block__btn btn">Дізнатися більше</button>
                    </div>
                </div>
            </div>
        </div>
        `
        // 
        html_area += landingBlockTemp
    });
    if (html_area.trim() == '') {
        html_area = 'Ніяких даних не було підгружено =/'
    }
    landingBlocksWrapper.innerHTML = html_area
}


async function relocateToCoursesHol(id){
    window.location.href = './coursesPreview/' + id;
}

// Start event
async function getStartsCount(course_name){

} 

async function setStartsCount(course_name, score=0){
    
} 

all_stars = document.querySelectorAll('.coursesPreview__star')

function renderStars (count=0) {
    all_stars.forEach(star => {
        let totalCount = Number(star.dataset.count)
        console.log(count, totalCount)
        if (count >= totalCount){
            star.classList.add('_active')
        }else {
            star.classList.remove('_active')
        }
    })
}

function startsCountEvent(event){
    let count = Number(event.currentTarget.dataset.count)
    renderStars(count)
}  

all_stars.forEach(star => {
    star.addEventListener('click', startsCountEvent)
});



const getUserFetch = (token) => {
    return fetch('/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
}

const unLoginEvent = (token) => {
    localStorage.removeItem('token');
    checkIsLogin()
    window.location.reload();
}

let main_login_btn = document.querySelector('#Main_Login')
let main_unlogin_btn = document.querySelector('#Main_unLogin')

function checkIsLogin() {
    const token = localStorage.getItem('token');
    window.isLoggedIn = false;
    
    if (token) {
        getUserFetch(token).then(response => response.json()).then(data=>{
            if(data.user){
                window.isLoggedIn = true;
                main_login_btn.style.display = 'none'
                main_unlogin_btn.style.display = 'block'
            } else {
                main_login_btn.style.display = 'block'
                main_unlogin_btn.style.display = 'none'
            }
        })
    }else {
        main_login_btn.style.display = 'block'
        main_unlogin_btn.style.display = 'none'   
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkIsLogin()
});