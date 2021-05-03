module.exports = (sequelize,DataTypes)=>{
    const Points = sequelize.define('Points',{
        userId :{
            type:DataTypes.STRING,
            allowNull:false,
        },
        wallet :{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    })
    return Points;
}