const db = require('../../Models');
const Banner = db.banner;
const { Op } = require("sequelize");
const { deleteSingleFile } = require('../../Util/deleteFile');

exports.addBanner = async (req, res) => {
    try {
        // File should be exist
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Please choose an image!"
            });
        }
        await Banner.create({
            originalName: req.file.originalname,
            path: req.file.path,
            fileName: req.file.filename,
            bannerType: req.file.fieldname
        });
        res.status(200).json({
            success: true,
            message: `${req.file.fieldname} banner added successfully!`
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.softDeleteBanner = async (req, res) => {
    try {
        const id = req.params.id;
        const banner = await Banner.findOne({
            where: {
                id: id
            }
        });
        if (!banner) {
            return res.status(400).json({
                success: false,
                message: "This image is not present!"
            });
        }
        // Soft delete
        await banner.destroy();
        res.status(200).json({
            success: true,
            message: `${banner.bannerType} banner deleted successfully!`
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getHomeScreen = async (req, res) => {
    try {
        const banner = await Banner.findAll({
            where: {
                bannerType: "HomeScreen"
            }
        });
        res.status(200).json({
            success: true,
            message: "Home screen banner fetched successfully!",
            data: banner
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getMutualDivorce = async (req, res) => {
    try {
        const banner = await Banner.findAll({
            where: {
                bannerType: "MutualDivorce"
            }
        });
        res.status(200).json({
            success: true,
            message: "Mutual divorce banner fetched successfully!",
            data: banner
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getMutualDivorceDetail = async (req, res) => {
    try {
        const banner = await Banner.findAll({
            where: {
                bannerType: "MutualDivorceDetails"
            }
        });
        res.status(200).json({
            success: true,
            message: "Mutual divorce detail banner fetched successfully!",
            data: banner
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}