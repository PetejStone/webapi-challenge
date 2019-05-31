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

router.get('/:id', validateUserId, (req, res) => {
    Projects.get(req.params.id)
    .then(project => {
        res.status(200).json({project})
    })
    .catch(err => {
        res.status(500).json({message: "Error retrieving project from database"})
    })
})

router.post('/', (req,res) => {
    
    Projects.insert(req.body)
    .then(newProject => {
        res.status(200).json({newProject})
    })
    .catch(err => {
        res.status(500).json({message: "Server cannot add project at this time"})
    })
})

router.put('/:id', (req,res) => {
    
    Projects.update(req.params.id, req.body)
    .then(updatedProject => {
        res.status(200).json({updatedProject})
    })
    .catch(err => {
        res.status(500).json({message: "Server cannot update project at this time"})
    })
})

router.delete('/:id', (req,res) => {
    
    Projects.remove(req.params.id)
    .then(removedProject => {
        res.status(200).json({message: 'Successfully removed project'})
    })
    .catch(err => {
        res.status(500).json({message: "Server cannot remove project at this time"})
    })
})

async function validateUserId( req, res, next) {
 
    const id = await Projects.get(req.params.id);
  if (id) {
    req.user = id
    next()
  } else {
    res.status(400).json({message: "Invalid user id"})
  }
  };

module.exports = router