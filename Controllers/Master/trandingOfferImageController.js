const db = require('../../Models');
const TrandingOfferImage = db.trandingOfferImage;
const { Op } = require("sequelize");
const { deleteSingleFile } = require('../../Util/deleteFile');

exports.addTrandingImage = async (req, res) => {
    try {
        // File should be exist
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Please choose an image!"
            });
        }
        await TrandingOfferImage.create({
            originalName: req.file.originalname,
            path: req.file.path,
            fileName: req.file.filename
        });
        res.status(200).json({
            success: true,
            message: "Tranding offer image added successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.softDeleteTrandingImage = async (req, res) => {
    try {
        const id = req.params.id;
        const trandingOfferImage = await TrandingOfferImage.findOne({
            where: {
                id: id
            }
        });
        if (!trandingOfferImage) {
            return res.status(400).json({
                success: false,
                message: "This image is not present!"
            });
        }
        // Soft delete
        await trandingOfferImage.destroy();
        res.status(200).json({
            success: true,
            message: "Tranding offer image deleted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getTrandingImage = async (req, res) => {
    try {
        const trandingOfferImage = await TrandingOfferImage.findAll();
        res.status(200).json({
            success: true,
            message: "Tranding offer image fetched successfully!",
            data: trandingOfferImage
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}