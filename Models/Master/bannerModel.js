module.exports = (sequelize, DataTypes) => {
    const Banner = sequelize.define("banners", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        originalName: {
            type: DataTypes.STRING
        },
        path: {
            type: DataTypes.STRING(1234)
        },
        fileName: {
            type: DataTypes.STRING(1234)
        },
        bannerType: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['HomeScreen', 'MutualDivorce', 'MutualDivorceDetails']]
            }
        }
    }, {
        paranoid: true
    });
    return Banner;
};