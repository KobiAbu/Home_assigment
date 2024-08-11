const Presentation = require('../models/presentationModel')
const mongoose = require('mongoose')

// Function to retrieve all presentations
exports.presGetAll = (req, res, next) => {
    Presentation.find().exec().then(pres => {
        // Send a successful response with all the presentations
        res.status(200).json(pres)
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })

        })
}

// Function to retrieve a specific presentation by title
exports.getSpecific = (req, res, next) => {
    Presentation.findOne({ Title: req.params['title'] }).exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    error: "There is no presentation with the provided Title"
                })
            }
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: "An error occurred",
                details: err
            })
        })
}

// Function to create a new presentation
exports.createNewPres = (req, res, next) => {
    // Create a new presentation object using the request body data
    const pres = new Presentation({
        Title: req.body.Title,
        Authors: req.body.Authors,
        Date_of_Publishment: req.body.Date_of_Publishment,
        slides: req.body.slides,
        _id: new mongoose.Types.ObjectId()
    })
    // Regex to validate the date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    // Check if the publication date is provided
    if (!(pres.Date_of_Publishment)) {
        return res.status(400).json({
            message: "There is no date"
        })
    }
    // Convert the date to a standardized ISO string and remove the time portion
    let dateString = new Date(pres.Date_of_Publishment).toISOString()
    dateString = dateString.split('T')[0]

     // Validate the date format using the regex
    if (!dateRegex.test(dateString)) {
        return res.status(400).json({
            message: "Date_of_Publishment must be in the format yyyy-mm-dd and valid"
        })
    }
    // Extract year, month, and day
    const [year, month, day] = dateString.split('-').map(Number);
    const currentYear = new Date().getFullYear();

    // Validate the year (must be within the last 100 years)
    if (year < currentYear - 100 || year > currentYear) {
        return res.status(400).json({
            message: "Year is not accaptable"
        });
    }

    // Validate the month (must be between 1 and 12)
    if (month < 1 || month > 12) {
        return res.status(400).json({
            message: "Month must be between 1 and 12"
        });
    }

    // Validate the day (must be within the correct range for the given month)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return res.status(400).json({
            message: `Day must be between 1 and ${daysInMonth} for the given month`
        });
    }

    // Check that the slides array is not empty
    if (pres.slides.length === 0) {
        return res.status(400).json({
            message: "there are no slides in this presentation"
        })
    }

    // Check that the authors array is not empty
    if (pres.Authors.length === 0) {
        return res.status(400).json({
            message: "there are no Authors in this presentation"
        })
    }

    // Validate each slide to ensure it contains a header and content
    for (let slide of pres.slides) {
        if (!slide.header) {
            return res.status(400).json({
                message: "Each slide must contain a 'header'"
            });
        }
        if (!slide.content) {
            return res.status(400).json({
                message: "Each slide must contain 'content'"
            });
        }
    }
    // Save the new presentation to the database
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
                });
            }
            return res.status(500).json({
                message: "An error occurred",
                error: err
            })
        })
}
