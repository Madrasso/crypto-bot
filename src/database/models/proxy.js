module.exports = (Model, Sequelize, sequelize) => {
    class model extends Model {};

    model.init(
        {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },

            host: {
                type: Sequelize.STRING,
                allowNull: true
            },

            port: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 80
            },
            
            protocol: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'http'
            },

            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, 
        {
            modelName: 'proxy',
            sequelize,
            timestamps: true
        }
    );
    return model
}