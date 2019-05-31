const express = require('express') //imports express

const Projects = require('../data/helpers/projectModel.js') // references db file
const Actions = require ('../data/helpers/actionModel.js') //references actions db file
const router = express.Router(); //imports router use

//gets all actions
router.get('/', (req, res) => {
    Actions.get()
    .then(actions => {
        res.status(200).json({actions})
    })
    .catch(err => {
        res.status(500).json({message: err})
    })
})

router.get('/:id', validateActionId, (req, res) => { //gets all actions with that specified ID and checks if it exists
   Actions.get(req.params.id)
    .then(action => {
        res.status(200).json({action})
    })
    .catch(err => {
        res.status(500).json({message: "Error retrieving project from database"})
    })
})



router.post('/:id',  validateProjectId, validateAction, (req, res) => { //posts a new action and validates it's content and project id
    const actionInfo = { ...req.body, project_id: req.params.id };//converts the req.params.id to be passed as project_id
    console.log(actionInfo)
    Actions.insert(actionInfo)
    .then(addedAction => {
        res.status(210).json({addedAction})
    })
    .catch(err => {
        res.status(500).json({message: `Error adding action to database ${err}`})
    })
})

router.put('/:id', validateActionId, validateAction, (req, res) => { //updates action if content and id passs
    
    Actions.update(req.params.id, req.body)
    .then(updatedAction => {
        res.status(210).json({updatedAction})
    })
    .catch(err => {
        res.status(500).json({message: `Error adding action to database ${err}`})
    })
})

router.delete('/:id/', validateActionId, (req, res) => { //deletes specified action
    
    Actions.remove(req.params.id)
    .then(deletedAction => {
        res.status(210).json({message: 'You have succesfully deleted this action'})
    })
    .catch(err => {
        res.status(500).json({message: `Error adding action to database ${err}`})
    })
})

async function validateProjectId( req, res, next) { //validates the projectID
 
    const id = await Projects.get(req.params.id); // req.params.id = to id that user passed
  if (id) { //if id exists id database
    //req.user = id
    next()
  } else {
    res.status(400).json({message: "Invalid user id"})
  }
  };

  async function validateActionId( req, res, next) {
    const id = await Actions.get(req.params.id) //checks if id is present in database
    const action = Object.keys(id);//converts object to array to get length
    /** When ID didn't exist, was getting an error saying 'can't map over completed' 
     * in mappers.js, as well as an error referencing actionModel 
     * line 12 stating it couldn't map.. added catch(err) after line 12 -- this then made
     * actions return an empty object '{}' when it didn't exist. Thus concerting it to array to check length
     * and checking that against a length of greater than 0
     */
    
    console.log(id)
  if (id && action.length > 0 ) {
    //req.user = id
    next()
  } else {
    res.status(400).json({message: "Invalid action id"})
  }
  };

  function validateAction(req, res, next) {
    const body = Object.keys(req.body);//converts object to array to get length
    /** returns an empty object if body is left blank, thus checking the length*/
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