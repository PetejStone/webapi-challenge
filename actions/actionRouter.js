const express = require('express') //imports express

const Projects = require('../data/helpers/projectModel.js') // references db file
const Actions = require ('../data/helpers/actionModel.js')
const router = express.Router(); //imports router use



router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.params.id)
    .then(projectActions => {
        res.status(200).json({projectActions})
    })
    .catch(err => {
        res.status(500).json({message: 'Could not retrieve project actions at this time'})
    })
})

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    const actionInfo = { ...req.body, project_id: req.params.id };
    console.log(actionInfo)
    Actions.insert(actionInfo)
    .then(addedAction => {
        res.status(210).json({addedAction})
    })
    .catch(err => {
        res.status(500).json({message: `Error adding action to database ${err}`})
    })
})

router.put('/:id/actions', validateProjectId, validateAction, (req, res) => {
    
    Actions.update(req.params.id, req.body)
    .then(updatedAction => {
        res.status(210).json({updatedAction})
    })
    .catch(err => {
        res.status(500).json({message: `Error adding action to database ${err}`})
    })
})

router.delete('/:id/actions', validateProjectId, (req, res) => {
    
    Actions.remove(req.params.id)
    .then(deletedAction => {
        res.status(210).json({message: 'You have succesfully deleted this action'})
    })
    .catch(err => {
        res.status(500).json({message: `Error adding action to database ${err}`})
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

  function validateAction(req, res, next) {
    const body = Object.keys(req.body);//converts object to array to get length
    const project= req.body;
    if (project && req.body.notes || req.body.description) {
      next();
    }
    if (body.length <= 0)  {
      res.status(400).json({message: 'missing user data'})
    }
    if ( !project.notes ) {
      res.status(400).json({message: 'missing required notes field'})
    }
    if ( !project.description ) {
        res.status(400).json({message: 'missing required description field'})
      }
  };

module.exports = router