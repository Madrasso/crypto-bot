module.exports = (Model, Sequelize, sequelize) => {
    class model extends Model {};

    model.init(
        {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },

            uid: {
                type: Sequelize.BIGINT,
                allowNull: true
            },

            name: {
                type: Sequelize.STRING,
                allowNull: true
            },

            balance: {
                type: Sequelize.BIGINT,
                allowNull: false,
                defaultValue: 0
            },

            minBalance: {
                type: Sequelize.BIGINT,
                allowNull: false,
                defaultValue: 0
            },

            blocked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            access_token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, 
        {
            modelName: 'accounts',
            sequelize,
            timestamps: true
        }
    );
    return model
}