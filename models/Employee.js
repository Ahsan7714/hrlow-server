const mongoose = require("mongoose");

const EmployeSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    salary: Number,
    image: String,
    role: {
      type: String,
      default: "employee"
    },
    gender: String,
    designation: String,
    dateOfJoined: Date,
    phoneNo: {
      type: Number,
      required: true,
    },
    department: String,
    deductionForLeave: Number,
});

module.exports = mongoose.model("Employee",EmployeSchema)