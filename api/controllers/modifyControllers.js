const Presentation = require('../models/presentationModel')
const mongoose = require('mongoose')


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
            let action = req.body.action
            let authors = req.body.authors
            let arr = presentation.Authors
            console.log(action)
            console.log(authors)

            if (!action || !(authors instanceof Array) || !(authors)) {
                return res.status(400).json({
                    message: "not the right format"
                })
            }

            if (newAuthList.length === 0) {
                return res.status(400).json({
                    message: "Author list is empty"
                })
            }
            if (!(action === 'add') && !(action === 'replace') && !(action === 'delete')) {

                return res.status(400).json({
                    message: "No such action"
                })
            }
            else {
                if (action === 'add') {
                    arr = arr.concat(newAuthList)
                    arr = [...new Set(arr)]
                }
                if (action === 'delete') {
                    console.log("hey")
                    newAuthList.forEach(element => {
                        if (arr.includes(element)) {
                            const index = arr.indexOf(element)
                            arr.splice(index, 1)
                        }
                        else {
                            return res.status(400).json({
                                message: "There is no " + element + "in the authors list"
                            })
                        }

                    });
                }
                if (action === 'replace')
                    arr = newAuthList

            }
            if (arr.length === 0) {
                return res.status(400).json({
                    message: "cant delete all the authors"
                })
            }

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
                error: err
            })
        }
    }

    await updateAuthList(req.body.Title, req.body.authors)
}

//adding slide to the presentation
//the body of the reques has the presentation title the text in the slide and its 
exports.addSlide = async (req, res, next) => {
    try {
        const result = await Presentation.findOne({ Title: req.body.Title }).exec()
        if (!(result)) {
            return res.status(400).json({
                message: "There is no presentation with the provided title",
            })
        }
        let arr = result.slides
        const slide = req.body.slide
        const index = req.body.index

        //checks the format
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
        if (index < 1) {
            return res.status(400).json({
                message: "index cant be less than 1"
            });
        }
        arr.splice(index - 1, 0, slide)
        console.log(arr.length)

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
        if (!(result)) {
            return res.status(400).json({
                message: "There is no presentation with the provided title",
            })
        }
        let arr = result.slides
        const slide = req.body.slide
        const index = req.body.index

        //checks the format
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
        if (index < 1 || index > arr.length) {
            return res.status(400).json({
                message: "there is no slides in this index"
            });
        }

        arr[index - 1] = slide
        const updateSlides = await Presentation.findByIdAndUpdate(result._id, { slides: arr }, { new: true })
        console.log(updateSlides, "updated successfully")

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
