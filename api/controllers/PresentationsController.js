const Presentation = require('../models/presentationModel')
const mongoose = require('mongoose')

const slideSchema = new mongoose.Schema({
    slideNumber: Number,
    content: String,
});


// get all the data
exports.presGetAll = (req, res, next) => {
    Presentation.find().exec().then(pres => {
        console.log(pres)
        res.status(200).json(pres)
    })
        .catch(err => {
            console.error(err)
            res.status(500).json({
                error: err
            })

        })
}

//get specific title

exports.getSpecific = (req, res, next) => {
    Presentation.findOne({ Title: req.params['title'] }).exec()
        .then(result => {
            if (!result) {
                const new_err = "There is no presentation with the provided Title"
                console.log(new_err)
                return res.status(404).json({
                    error: new_err
                })
            }
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({
                error: "An error occurred",
                details: err
            })
        })
}

exports.createNewPres = (req, res, next) => {
    const pres = new Presentation({
        Title: req.body.Title,
        Authors: req.body.Authors,
        Date_of_Publishment: req.body.Date_of_Publishment,
        slides: req.body.slides,
        _id: new mongoose.Types.ObjectId()
    });

    pres.save()
        .then(result => {
            console.log(result);
            return res.status(201).json({
                createdProduct: result
            })
        })
        .catch(err => {
            console.error(err);
            if (err.code === 11000) {
                return res.status(409).json({
                    message: "This title already exists",
                    // error: err
                });
            }
            return res.status(500).json({
                message: "An error occurred",
                error: err
            })
        })
}
// changing the list of the authors in the presentation 
exports.changeAuthors = async (req, res, next) => {
    const updateAuthList = async (title, newAuthList) => {
        try {
            const presentation = await Presentation.findOne({ Title: title })
            if (!presentation) {
                return res.status(404).json({
                    message: "Presentation not found"
                })
            }
            const updateList = await Presentation.findByIdAndUpdate(presentation._id, { Authors: newAuthList }, { new: true })
            console.log(updateList, "List updated");
            return res.status(200).json({
                message: "Authors list updated successfully",
                //updatedPresentation: updateList
            })
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "An error occurred",
                error: err
            })
        }
    }

    await updateAuthList(req.body.Title, req.body.Authors)
}

//adding slide to the presentation
//the body of the reques has the presentation title the text in the slide and its 
exports.addSlide = async (req, res, next) => {
    try {
        const result = await Presentation.findOne({ Title: req.body.Title }).exec()
        var arr = result.slides
        arr.splice(req.body.index - 1, 0, req.body.slide)
        const updateSlides = await Presentation.findByIdAndUpdate(result._id, { slides: arr }, { new: true })
        console.log(updateSlides, "updated successfully")

        return res.status(200).json({
            message: "Slide added successfully "
        })
    } catch (err) {

        console.error(err);
        return res.status(500).json({
            message: "An error occurred",
            error: err
        })
    }
}

exports.modifySlide = async (req, res, next) => {
    try {
        const result = await Presentation.findOne({ Title: req.body.Title }).exec()
        var arr = result.slides
        arr[req.body.index] = req.body.slide
        const updateSlides = await Presentation.findByIdAndUpdate(result._id, { slides: arr }, { new: true })
        console.log(updateSlides, "updated successfully")

        return res.status(200).json({
            message: "Slide added successfully "
        })
    }
    catch (err) {

        console.error(err);
        return res.status(500).json({
            message: "An error occurred",
            error: err
        })
    }
}