const Presentation = require('../models/presentationModel')
const mongoose = require('mongoose')


// Function to update the authors list in a presentation 

exports.changeAuthors = async (req, res, next) => {
    // Internal function to update the authors list
    const updateAuthList = async (title, newAuthList) => {
        try {
            // Find the presentation by title
            const presentation = await Presentation.findOne({ Title: title })
            if (!presentation) {
                // If the presentation is not found, return a 404 error with a custom message to the user
                return res.status(404).json({
                    message: "Presentation not found"
                })
            }
            // Extract action and authors list from request body
            let action = req.body.action
            let authors = req.body.authors
            let arr = presentation.Authors

            //Validate the input -if the authors arr is realy an array and if there are action and authors fields
            if (!action || !(Array.isArray(authors)) || !(authors)) {
                return res.status(400).json({
                    message: "Invalid input format or empty author list"
                })
            }

            if (newAuthList.length === 0) {
                return res.status(400).json({
                    message: "Author list is empty"
                })
            }
            // Validate action type
            if (!(action === 'add') && !(action === 'replace') && !(action === 'delete')) {

                return res.status(400).json({
                    message: "No such action"
                })
            }
            // Perform the action based on the request
            switch (action) {
                case ('add'):
                    // Add new authors and ensure no duplicates
                    arr = arr.concat(newAuthList)
                    arr = [...new Set(arr)]
                    break
                case ('delete'):
                    // Delete specified authors, ensure no complete deletion
                    newAuthList.forEach(element => {
                        if (arr.includes(element)) {
                            arr = arr.filter(a => a !== element)
                            const index = arr.indexOf(element)
                            arr.splice(index, 1)
                            if (arr.length === 0) {
                                return res.status(400).json({
                                    message: "cant delete all the authors"
                                })
                            }
                        }
                        else {
                            return res.status(400).json({
                                message: "There is no " + element + "in the authors list"
                            })
                        }
                    })

                    break
                case ('replace'):
                    // Replace the entire authors list
                    arr = newAuthList
                    break
            }
            // Update the presentation with the new authors list
            const updateList = await Presentation.findByIdAndUpdate(presentation._id, { Authors: arr }, { new: true })
            console.log(updateList, "List updated");
            return res.status(200).json({
                message: "Authors list updated successfully",
                //updatedPresentation: updateList
            })
        } catch (err) {
            //console.error(err);
            return res.status(500).json({
                message: "An error occurred",
            })
        }
    }
    // Call the internal function to perform the update
    await updateAuthList(req.body.Title, req.body.authors)
}

// Function to add a new slide to a presentation
exports.addSlide = async (req, res, next) => {
    try {
        // Find the presentation by title
        const result = await Presentation.findOne({ Title: req.body.Title }).exec()
        if (!(result)) {
            return res.status(400).json({
                message: "There is no presentation with the provided title",
            })
        }

        let arr = result.slides; // Get the current slides array
        const slide = req.body.slide; // Get the new slide data
        const index = req.body.index; // Get the index where the slide should be inserted


        //Validate the format
        if (!slide.header || !slide.content || typeof slide.content !== 'string') {
            return handleError(res, 400, "Invalid slide format");
        }
        // Ensure an index is provided
        if (!index) {
            return res.status(400).json({
                message: "You have to specify index"
            });
        }

        // Validate the index range
        if (index < 1 || index > arr.length + 1) {
            return res.status(400).json({
                message: "Your index is out of range"
            });
        }
        // Insert the new slide at the specified index
        arr.splice(index - 1, 0, slide)

        // Update the presentation with the new slides array
        const updateSlides = await Presentation.findByIdAndUpdate(result._id, { slides: arr }, { new: true })

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

// Function to modify an existing slide in a presentation
exports.modifySlide = async (req, res, next) => {
    try {
        // Find the presentation by title
        const result = await Presentation.findOne({ Title: req.body.Title }).exec()
        if (!(result)) {
            return res.status(400).json({
                message: "There is no presentation with the provided title",
            })
        }

        let slidesArray = result.slides; // Get the current slides array
        const newPhotos = req.body.photos; // Get the new photos array
        const newText = req.body.text; // Get the new text content
        const newHeader = req.body.header; // Get the new header
        const index = req.body.index; // Get the slide index to modify

        // Validate the slide index range
        if (index < 1 || index > slidesArray.length) {
            return res.status(400).json({
                message: "there is no slides in this index"
            });
        }

        //Get the slide that needed to be edited
        slide = slidesArray[index - 1]

        // Update the slide header if provided
        if (newHeader && typeof newHeader === 'string') {
            slide.header = newHeader
        }

        // Update the slide content if provided
        if (newText && typeof newText === 'string') {
            slide.content = newText
        }

        // Update the slide photos if provided and valid and remove duplicates
        if (newPhotos && Array.isArray(newPhotos)) {
            if (newPhotos.length !== 0) {
                let arr = slide.photos_url.concat(newPhotos)
                arr = [...new Set(arr)]
                slide.photos_url = arr
            }
        }
        // Save the modified slide back into the array
        slidesArray[index - 1] = slide
        // Ensure that at least one field has been modified
        if (!newHeader && !newPhotos && !newText) {
            return res.status(400).json({
                message: "You have to choose a field to change"
            });
        }
        // Update the presentation with the modified slides array
        const updateSlides = await Presentation.findByIdAndUpdate(result._id, { slides: slidesArray }, { new: true })
        // console.log(updateSlides, "updated successfully")

        return res.status(200).json({
            message: "Slide altered successfully "
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
