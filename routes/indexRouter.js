const express = require('express')
const router = express.Router()

const languages = ['English', 'German', 'Czech']

router.get('/', (req, res) => {
    res.render('index', {
        languages
    })
})

/*router.post('/', (req, res) => {
    res.redirect('chat')
})*/

router.get('/chat', (req, res) => {
    var language = req.query.language || 'English'
    language = (languages.includes(language)) ? language : 'English'

    res.render('chat', {
        language
    })
})


module.exports = router