module.exports = (sequelize, DataTypes) => {
    const TrandingOfferImage = sequelize.define("trandingOfferImages", {
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
        }
    }, {
        paranoid: true
    });
    return TrandingOfferImage;
};