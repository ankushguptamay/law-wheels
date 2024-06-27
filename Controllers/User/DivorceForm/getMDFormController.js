const db = require("../../../Models");
const MutualDivorceForm = db.mutualDivorceForm;
const { Op } = require("sequelize");

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