const express = require('express')
const router = express.Router()
const Presentation = require('../models/presentationModel')
const mongoose = require('mongoose')
const controller = require('../controllers/PresentationsController')
const deletController = require('../controllers/deleteControllers')
const modifyControllers = require('../controllers/modifyControllers')

//gets all the presentations
router.get('/get/all', controller.presGetAll)
router.get('/get/:title', controller.getSpecific)

//create new presentation
//if the title is already exist it returns an error that the title is already in use
//(mongo error code 11000 is the error that an unique field is already exist )
router.post('/new', controller.createNewPres)

//change the authors list
router.patch('/modify/authors', modifyControllers.changeAuthors)
//add a new slide to the presentation
router.patch('/new/slide', modifyControllers.addSlide)
//alter a slide within the presentation
router.patch('/modify/slide', modifyControllers.modifySlide)
// delete specific presentation - giving the title as parameter
router.delete('/delete/:title', deletController.deletePres)
//delete specific slides 
router.delete('/delete/slide', deletController.deleteSlide)
module.exports = router