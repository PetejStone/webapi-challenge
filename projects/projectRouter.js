const express = require('express') //imports express

const Projects = require('../data/helpers/projectModel.js') // references db file

const router = express.Router(); //imports router use

router.get('/', (req, res) => {
    Projects.get()
    .then(project => {
        res.status(200).json({project})
    })
    .catch(err => {
        res.status(500).json({message: err})
    })
})

module.exports = router