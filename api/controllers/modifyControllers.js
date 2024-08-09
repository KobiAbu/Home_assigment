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
            if (!(action === 'add') && !(action === 'replace') && !(action === 'delete')) {

                return res.status(400).json({
                    message: "No such action"
                })
            }

            switch (action) {
                case ('add'):
                    arr = arr.concat(newAuthList)
                    arr = [...new Set(arr)]
                    break
                case ('delete'):
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
                    arr = newAuthList
                    break
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
            })
        }
    }

    await updateAuthList(req.body.Title, req.body.authors)
}

//adding slide to the presentation
//the body of the request has the presentation title the text in the slide and its 
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
        if (!slide.header || !slide.content || typeof slide.content !== 'string') {
            return handleError(res, 400, "Invalid slide format");
        }

        // if (!slide.header) {
        //     return res.status(400).json({
        //         message: "Each slide must contain a 'header'"
        //     });
        // }
        // if (!slide.content) {
        //     return res.status(400).json({
        //         message: "Each slide must contain 'content'"
        //     });
        // }
        // if (!(typeof slide.content === 'string')) {
        //     console.log(typeof slide.content)
        //     return res.status(400).json({
        //         message: "content must be string"
        //     })
        // }

        if (!index) {
            return res.status(400).json({
                message: "You have to specify index"
            });
        }

        if (index < 1 || index > arr.length + 1) {
            return res.status(400).json({
                message: "Your index is out of range"
            });
        }

        arr.splice(index - 1, 0, slide)

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

exports.modifySlide = async (req, res, next) => {
    try {
        const result = await Presentation.findOne({ Title: req.body.Title }).exec()
        if (!(result)) {
            return res.status(400).json({
                message: "There is no presentation with the provided title",
            })
        }

        let slidesArray = result.slides
        const newPhotos = req.photos
        const newText = req.text
        const newHeader = req.header
        const index = req.body.index

        if (index < 1 || index > arr.length) {
            return res.status(400).json({
                message: "there is no slides in this index"
            });
        }

        slide = slidesArray[index - 1]

        if (newHeader && typeof newHeader === 'string') {
            slide.header = newHeader
        }

        if (newText && typeof newText === 'string') {
            slide.content = newText
        }

        if (newPhotos && Array.isArray(newPhotos)) {
            if (newPhotos.length !== 0) {
                let arr = slide.photos.concat(newPhotos)
                arr = [...new Set(arr)]
                slide.photos = arr
            }
        }
        slidesArray[index - 1] = slide
        const updateSlides = await Presentation.findByIdAndUpdate(result._id, { slides: slidesArray }, { new: true })
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
