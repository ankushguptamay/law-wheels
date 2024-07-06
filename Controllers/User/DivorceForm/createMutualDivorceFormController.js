const db = require("../../../Models");
const { createHeDetails, createSheDetails, createRequiredDetails } = require("../../../Middlewares/validate")
const MutualDivorceForm = db.mutualDivorceForm;
const User = db.user;
const { Op } = require("sequelize");
const { capitalizeFirstLetter } = require("../../../Util/capitalizeFirstLetter")

exports.createHeDetails = async (req, res) => {
    try {
        // Validate body
        const { error } = createHeDetails(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json(error.details[0].message);
        }
        const { he_mobileNumber, he_city, he_religion, he_email, he_dateOfBirth, he_residence_address, he_present_address } = req.body;
        const he_fatherName = capitalizeFirstLetter(req.body.he_fatherName);
        const he_name = capitalizeFirstLetter(req.body.he_name);
        const divorce = await MutualDivorceForm.create({
            he_city: he_city,
            he_dateOfBirth: he_dateOfBirth,
            he_email: he_email,
            he_fatherName: he_fatherName,
            he_mobileNumber: he_mobileNumber,
            he_name: he_name,
            he_present_address: he_present_address,
            he_religion: he_religion,
            he_residence_address: he_residence_address,
            userId: req.user.id
        });
        res.status(200).json({
            success: true,
            message: "He's details submited successfully!",
            data: { id: divorce.id }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.createSheDetails = async (req, res) => {
    try {
        // Validate body
        const { error } = createSheDetails(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json(error.details[0].message);
        }
        const { she_mobileNumber, she_husbandCity, she_religion, she_email, she_dateOfBirth, she_residence_address, she_present_address } = req.body;
        const she_fatherName = capitalizeFirstLetter(req.body.she_fatherName);
        const she_name = capitalizeFirstLetter(req.body.she_name);
        await MutualDivorceForm.update({
            she_dateOfBirth: she_dateOfBirth,
            she_email: she_email,
            she_fatherName: she_fatherName,
            she_husbandCity: she_husbandCity,
            she_mobileNumber: she_mobileNumber,
            she_name: she_name,
            she_present_address: she_present_address,
            she_religion: she_religion,
            she_residence_address: she_residence_address
        }, {
            where:
            {
                id: req.params.id,
                userId: req.user.id
            }
        });
        res.status(200).json({
            success: true,
            message: "She's details submited successfully!",
            data: { id: req.params.id }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.createRequiredDetails = async (req, res) => {
    try {
        // Validate body
        const { error } = createRequiredDetails(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json(error.details[0].message);
        }
        await MutualDivorceForm.update({ ...req.body }, { where: { id: req.params.id, userId: req.user.id } });
        res.status(200).json({
            success: true,
            message: "Required details submited successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.createHeDetailsByWebSite = async (req, res) => {
    try {
        // Validate body
        const { error } = createHeDetails(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json(error.details[0].message);
        }
        const { he_mobileNumber, he_city, he_religion, he_email, he_dateOfBirth, he_residence_address, he_present_address, divorceId } = req.body;
        const he_fatherName = capitalizeFirstLetter(req.body.he_fatherName);
        const he_name = capitalizeFirstLetter(req.body.he_name);
        let divorce;
        if (!divorceId) {
            // FindUser
            let user = await User.findOne({
                where: {
                    [Op.or]: [
                        { mobileNumber: req.body.he_mobileNumber },
                        { email: req.body.he_email }
                    ]
                }
            });
            if (!user) {
                // Save in DataBase
                user = await User.create({
                    name: he_name,
                    mobileNumber: he_mobileNumber,
                    email: he_email
                });
            }
            divorce = await MutualDivorceForm.create({
                he_city: he_city,
                he_dateOfBirth: he_dateOfBirth,
                he_email: he_email,
                he_fatherName: he_fatherName,
                he_mobileNumber: he_mobileNumber,
                he_name: he_name,
                he_present_address: he_present_address,
                he_religion: he_religion,
                he_residence_address: he_residence_address,
                userId: user.id
            });
        } {
            // Find Divorce form
            divorce = await MutualDivorceForm.findOne({
                where: {
                    id: divorceId
                }
            });
            if (!divorce) {
                return res.status(400).json({
                    success: false,
                    message: "This divorce from is not exist"
                });
            }
            // Update
            await divorce.update({
                ...divorce,
                he_city: he_city,
                he_dateOfBirth: he_dateOfBirth,
                he_email: he_email,
                he_fatherName: he_fatherName,
                he_mobileNumber: he_mobileNumber,
                he_name: he_name,
                he_present_address: he_present_address,
                he_religion: he_religion,
                he_residence_address: he_residence_address
            });
        }
        res.status(200).json({
            success: true,
            message: "He's details submited successfully!",
            data: { divorceId: divorce.id }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.createSheDetailsByWebSite = async (req, res) => {
    try {
        // Validate body
        const { error } = createSheDetails(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json(error.details[0].message);
        }
        const { she_mobileNumber, she_husbandCity, she_religion, she_email, she_dateOfBirth, she_residence_address, she_present_address, divorceId } = req.body;
        const she_fatherName = capitalizeFirstLetter(req.body.she_fatherName);
        const she_name = capitalizeFirstLetter(req.body.she_name);
        let divorce;
        if (!divorceId) {
            // FindUser
            let user = await User.findOne({
                where: {
                    [Op.or]: [
                        { mobileNumber: she_mobileNumber },
                        { email: she_email }
                    ]
                }
            });
            if (!user) {
                // Save in DataBase
                user = await User.create({
                    name: she_name,
                    mobileNumber: she_mobileNumber,
                    email: she_email
                });
            }
            divorce = await MutualDivorceForm.create({
                she_dateOfBirth: she_dateOfBirth,
                she_email: she_email,
                she_fatherName: she_fatherName,
                she_husbandCity: she_husbandCity,
                she_mobileNumber: she_mobileNumber,
                she_name: she_name,
                she_present_address: she_present_address,
                she_religion: she_religion,
                she_residence_address: she_residence_address,
                userId: user.id
            });
        } else {
            // Find Divorce form
            divorce = await MutualDivorceForm.findOne({
                where: {
                    id: divorceId
                }
            });
            if (!divorce) {
                return res.status(400).json({
                    success: false,
                    message: "This divorce from is not exist"
                });
            }
            // Update
            await divorce.update({
                ...divorce,
                she_dateOfBirth: she_dateOfBirth,
                she_email: she_email,
                she_fatherName: she_fatherName,
                she_husbandCity: she_husbandCity,
                she_mobileNumber: she_mobileNumber,
                she_name: she_name,
                she_present_address: she_present_address,
                she_religion: she_religion,
                she_residence_address: she_residence_address
            });
        }
        res.status(200).json({
            success: true,
            message: "She's details submited successfully!",
            data: { divorceId: divorce.id }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.createRequiredDetailsByWebSite = async (req, res) => {
    try {
        // Validate body
        const { error } = createRequiredDetails(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json(error.details[0].message);
        }
        await MutualDivorceForm.update({ ...req.body }, { where: { id: req.params.id } });
        res.status(200).json({
            success: true,
            message: "Required details submited successfully!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}