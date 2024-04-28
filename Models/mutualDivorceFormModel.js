module.exports = (sequelize, DataTypes) => {
    const MutualDivorceForm = sequelize.define("mutualDivorceForm", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        he_city: {
            type: DataTypes.STRING
        },
        he_name: {
            type: DataTypes.STRING
        },
        he_religion: {
            type: DataTypes.STRING
        },
        he_fatherName: {
            type: DataTypes.STRING
        },
        he_email: {
            type: DataTypes.STRING
        },
        he_mobileNumber: {
            type: DataTypes.STRING
        },
        he_dateOfBirth: {
            type: DataTypes.DATEONLY
        },
        he_residence_address: {
            type: DataTypes.STRING(1234)
        },
        he_present_address: {
            type: DataTypes.STRING(1234)
        },
        she_husbandCity: {
            type: DataTypes.STRING(1234)
        },
        she_name: {
            type: DataTypes.STRING
        },
        she_religion: {
            type: DataTypes.STRING
        },
        she_fatherName: {
            type: DataTypes.STRING
        },
        she_dateOfBirth: {
            type: DataTypes.DATEONLY
        },
        she_mobileNumber: {
            type: DataTypes.STRING
        },
        she_email: {
            type: DataTypes.STRING
        },
        she_residence_address: {
            type: DataTypes.STRING(1234)
        },
        she_present_address: {
            type: DataTypes.STRING(1234)
        },
        cityOfMarriage: {
            type: DataTypes.STRING
        },
        marriage_date: {
            type: DataTypes.DATEONLY
        },
        placeOfMarriage: {
            type: DataTypes.STRING
        },
        post_marriage_address: {
            type: DataTypes.STRING(1234)
        },
        doYouHave_children: {
            type: DataTypes.BOOLEAN
        },
        is_maintenanceAlimony: {
            type: DataTypes.BOOLEAN
        },
        is_settlementRegardingJointAssets: {
            type: DataTypes.BOOLEAN
        },
        any_pending_ligitations: {
            type: DataTypes.BOOLEAN
        },
        comment: {
            type: DataTypes.TEXT
        }
        // childInformation_Settlement: {
        //     type: DataTypes.TEXT
        // },
        // maintenance_Settlement_Term: {
        //     type: DataTypes.TEXT
        // },
        // joint_Assets_Settlement_Term: {
        //     type: DataTypes.TEXT
        // }
    }, {
        paranoid: true
    });
    return MutualDivorceForm;
};

// userId