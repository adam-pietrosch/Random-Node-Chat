
var input = document.querySelector('.select input')
var select = document.querySelector('.select')
var dropdown = document.querySelector('.dropdown')
var inputs = document.querySelectorAll('.dropdown > p')
var languageForm = document.querySelector('.select > form')
var submitButton = document.getElementById('submit')

var isDroped = false

input.addEventListener('click', (e) => {
    if (!isDroped) {
        showDropdown()
        isDroped = true
    }
    else {
        hideDropdown()
        isDroped = false
    }
})

inputs.forEach(input => {
    input.addEventListener('mousedown', (e) => {
        var text = e.target.innerText
        setLanguage(text)
        hideDropdown()
    })
})

submitButton.addEventListener('click', (e) => {
    languageForm.submit()
})

function setLanguage(text) {
    input.value = text
}

function showDropdown() {
    gsap.to('.dropdown', {
        duration: 0.5,
        display: 'block',
        opacity: 1,
        height: 'auto'
    })
    gsap.to('.select > i', {
        duration: 0.5,
        rotation: 180
    })
}

function hideDropdown() {
    gsap.to('.dropdown', {
        duration: 0.5,
        display: 'none',
        opacity: 0,
        height: '0'
    })
    gsap.to('.select > i', {
        duration: 0.5,
        rotation: 0
    })
}