const express = require('express') //imports express

const Projects = require('../data/helpers/projectModel.js') // references db file
const Actions = require ('../data/helpers/actionModel.js')
const router = express.Router(); //imports router use



router.get('/:id/actions', validateUserId, (req, res) => {
    Projects.getProjectActions(req.params.id)
    .then(projectActions => {
        res.status(200).json({projectActions})
    })
    .catch(err => {
        res.status(500).json({message: 'Could not retrieve project actions at this time'})
    })
})

router.post('/:id/actions', validateUserId, (req, res) => {
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

router.put('/:id/actions', validateUserId, (req, res) => {
    
    Actions.update(req.params.id, req.body)
    .then(updatedAction => {
        res.status(210).json({updatedAction})
    })
    .catch(err => {
        res.status(500).json({message: `Error adding action to database ${err}`})
    })
})

router.delete('/:id/actions', validateUserId, (req, res) => {
    
    Actions.remove(req.params.id)
    .then(deletedAction => {
        res.status(210).json({message: 'You have succesfully deleted this action'})
    })
    .catch(err => {
        res.status(500).json({message: `Error adding action to database ${err}`})
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