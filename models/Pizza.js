module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pizza', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Pizzas',
        timestamps: false
    });
};