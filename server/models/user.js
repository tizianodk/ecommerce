const  mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    nombre : String,
    apellido : String,
    email : String,
    password : String,
      rol: {
    type: String,
    enum: ["cliente", "admin"], 
    default: "cliente",
  },

})


const User = mongoose.model("usuarios",UserSchema)

module.exports=User
