const Presentation = require('../models/presentationModel')
const mongoose = require('mongoose')

const slideSchema = new mongoose.Schema({
    slideNumber: Number,
    content: String,
});

exports.deletePres = (req, res, next) => {
    Presentation.findOneAndDelete({ Title: req.params['title'] }).exec().then(pres => {
        console.log(pres)
        res.status(200).json(pres)
    }).catch(err => {
        console.error(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.deleteSlide = async (req, res, next) => {
    try {
        const result = await Presentation.findOne({ Title: req.body.Title }).exec()
        let arr = result.slides
        const index = req.body.index

        if (index < 1 || index > arr.length || !index) {
            return res.status(400).json({
                message: "Your index was out of range or not provided"
            });
        }

        arr.splice(req.body.index - 1, 1)
        const updateSlides = await Presentation.findByIdAndUpdate(result._id, { slides: arr }, { new: true })
        console.log(updateSlides, "removed successfully")

        return res.status(200).json({
            message: "Slide removed successfully "
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

