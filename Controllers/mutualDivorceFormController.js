const db = require("../Models");
const { createHeDetails, createSheDetails } = require("../Middlewares/validate")
const MutualDivorceForm = db.mutualDivorceForm;

exports.createHeDetails = async (req, res) => {
    try {
        // Validate body
        const { error } = createHeDetails(req.body);
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
        const divorce = await MutualDivorceForm.create({ ...req.body, userId: req.user.id });
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
        await MutualDivorceForm.update({ ...req.body, userId: req.user.id }, { where: { id: req.params.id } });
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

// exports.getAllMutualDivorceForm = async (req, res) => {
//     try {
//         const mutualDivorceForm = await MutualDivorceForm.findAll();
//         res.status(200).json({
//             success: true,
//             message: "Mutual divorce form fetched successfully!",
//             data: mutualDivorceForm
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// }