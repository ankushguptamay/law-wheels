const db = require("../Models");
const { createHeDetails, createSheDetails, createRequiredDetails } = require("../Middlewares/validate")
const MutualDivorceForm = db.mutualDivorceForm;
const { Op } = require("sequelize");
const { capitalizeFirstLetter } = require("../Util/capitalizeFirstLetter")

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
        // if (doYouHave_Children === true) {
        //     if (!childInformation_Settlement) {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Child Settlement is required!"
        //         });
        //     }
        // }
        // if (is_MaintenanceAlimony === true) {
        //     if (!maintenance_Settlement_Term) {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Maintenance settlement term is required!"
        //         });
        //     }
        // }
        // if (is_SettlementRegardingJointAssets === true) {
        //     if (!joint_Assets_Settlement_Term) {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Joint asstes settlement is required!"
        //         });
        //     }
        // }
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

exports.getAllMutualDivorceForm = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        // Pagination
        const recordLimit = parseInt(limit) || 10;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * recordLimit;
            currentPage = parseInt(page);
        }
        const condition = [];
        // Search
        if (search) {
            condition.push({
                [Op.or]: [
                    { he_name: { [Op.substring]: search } },
                    { she_name: { [Op.substring]: search } },
                    { he_email: { [Op.substring]: search } },
                    { she_email: { [Op.substring]: search } }
                ]
            })
        }
        // Count All mutualDivorceForm
        const totalMutualDivorceForm = await MutualDivorceForm.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get All mutualDivorceForm
        const mutualDivorceForm = await MutualDivorceForm.findAll({
            limit: recordLimit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        // Final response
        res.status(200).send({
            success: true,
            message: "Mutual divorce form fetched successfully!",
            totalPage: Math.ceil(totalMutualDivorceForm / recordLimit),
            currentPage: currentPage,
            data: mutualDivorceForm
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getAllMutualDivorceFormForUser = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        // Pagination
        const recordLimit = parseInt(limit) || 10;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * recordLimit;
            currentPage = parseInt(page);
        }
        const condition = [{ userId: req.user.id }];
        // Search
        if (search) {
            condition.push({
                [Op.or]: [
                    { he_name: { [Op.substring]: search } },
                    { she_name: { [Op.substring]: search } },
                    { he_email: { [Op.substring]: search } },
                    { she_email: { [Op.substring]: search } }
                ]
            })
        }
        // Count All mutualDivorceForm
        const totalMutualDivorceForm = await MutualDivorceForm.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get All mutualDivorceForm
        const mutualDivorceForm = await MutualDivorceForm.findAll({
            limit: recordLimit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        // Final response
        res.status(200).send({
            success: true,
            message: "Mutual divorce form fetched successfully!",
            totalPage: Math.ceil(totalMutualDivorceForm / recordLimit),
            currentPage: currentPage,
            data: mutualDivorceForm
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}