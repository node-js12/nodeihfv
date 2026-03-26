module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Нове'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'Orders',
        timestamps: false
    });
};