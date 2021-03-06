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

router.get('/:id', validateProjectId, (req, res) => {
    Projects.get(req.params.id)
    .then(project => {
        res.status(200).json({project})
    })
    .catch(err => {
        res.status(500).json({message: "Error retrieving project from database"})
    })
})

router.post('/', validateProject, (req,res) => {
    
    Projects.insert(req.body)
    .then(newProject => {
        res.status(200).json({newProject})
    })
    .catch(err => {
        res.status(500).json({message: `Server cannot add project at this time ${err}`})
    })
})

router.put('/:id', validateProjectId, validateProject, (req,res) => {
    
    Projects.update(req.params.id, req.body)
    .then(updatedProject => {
        res.status(200).json({updatedProject})
    })
    .catch(err => {
        res.status(500).json({message: "Server cannot update project at this time"})
    })
})

router.delete('/:id', validateProjectId, (req,res) => {
    
    Projects.remove(req.params.id)
    .then(removedProject => {
        res.status(200).json({message: 'Successfully removed project'})
    })
    .catch(err => {
        res.status(500).json({message: "Server cannot remove project at this time"})
    })
})

async function validateProjectId( req, res, next) {
 
    const id = await Projects.get(req.params.id);
  if (id) {
    req.user = id
    next()
  } else {
    res.status(400).json({message: "Invalid user id"})
  }
  };

   function validateProject(req, res, next) {
    const body = Object.keys(req.body);//converts object to array to get length
    const project= req.body;
    if (project && req.body.name || req.body.description) {
      next();
    }
    if (body.length <= 0)  {
      res.status(400).json({message: 'missing user data'})
    }
    if ( !project.name ) {
      res.status(400).json({message: 'missing required name field'})
    }
    if ( !project.description ) {
        res.status(400).json({message: 'missing required description field'})
      }
  };

module.exports = router