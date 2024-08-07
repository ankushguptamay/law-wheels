module.exports = (sequelize, DataTypes) => {
    const ReactOut = sequelize.define("reachOuts", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        message: {
            type: DataTypes.STRING(1234)
        }
    })
    return ReactOut;
}