const mongoose = require("mongoose")



const adminSchema = mongoose.Schema({
    fullName : String,
    departmeemailnt : String,
    orgCode : Number,
    password : String
})

module.exports = mongoose.model("student", userSchema)