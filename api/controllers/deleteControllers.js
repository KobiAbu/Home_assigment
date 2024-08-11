const Presentation = require('../models/presentationModel')
const mongoose = require('mongoose')

// Define a schema for a slide, including slide number and content
const slideSchema = new mongoose.Schema({
    slideNumber: Number,
    content: String,
});

// Function to delete an entire presentation by its title
exports.deletePres = (req, res, next) => {
    // Find and delete the presentation based on the title provided in the request parameters
    Presentation.findOneAndDelete({ Title: req.params['title'] }).exec().then(pres => {
        // Send a successful response with the deleted presentation
        res.status(200).json("Presentation deleted succesfully")
    }).catch(err => {
        res.status(500).json({
            message: "title not found",
        })
    })
}

// Function to delete a specific slide from a presentation
exports.deleteSlide = async (req, res, next) => {
    try {
        // Find the presentation by its title
        const result = await Presentation.findOne({ Title: req.body.Title }).exec()
        if (!(result)) {
            return res.status(400).json({
                message: "There is no presentation with the provided title",
            })
        }
        let arr = result.slides; // Get the current array of slides
        const index = req.body.index; // Get the index of the slide to be deleted
        if (arr.length === 1) {
            return res.status(400).json({
                message: "Cant delete the last slide"
            })
        }
        // Validate that the index is within range and has been provided
        if (index < 1 || index > arr.length || !index) {
            return res.status(400).json({
                message: "Your index was out of range or not provided"
            });
        }
        console.log(arr)
        // Remove the slide at the specified index (adjusting for 0-based index)
        arr.splice(index - 1, 1)
        console.log(arr)

        // Update the presentation with the modified slides array
        const updateSlides = await Presentation.findByIdAndUpdate(result._id, { slides: arr }, { new: true })

        // Send a successful response
        return res.status(200).json({
            message: "Slide removed successfully "
        })
    }
    catch (err) {
        // Send an error response with a 500 status code
        return res.status(500).json({
            message: "An error occurred",
            error: err
        })
    }
}

