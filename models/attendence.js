const mongoose = require('mongoose')

const attendanceSchema = mongoose.Schema({
    employeeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Employee'
    },
    date : {
        type : Date,
        required : true,
    },
    status : String
})

module.exports = mongoose.model('Attendance',attendanceSchema)