const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Attendance = require("../models/attendence");
const verifyUser = require("../utils/middleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      salary,
      gender,
      designation,
      dateOfJoined,
      phoneNo,
      department,
      deductionForLeave,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // Create a new Employee with the Cloudinary URL
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      address,
      salary,
      image: req.file.filename, // Assuming upload middleware is used correctly
      gender,
      designation,
      dateOfJoined,
      phoneNo,
      department,
      deductionForLeave,
    });

    // Save the new Employee to the database
    await newEmployee.save();

    return res.json({ Status: "User created" });
  } catch (error) {
    console.error(error);
    return res.json({ Error: "Error in query" });
  }
};
// get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ role: "employee" });
    return res.json({ employees });
  } catch (error) {
    console.log(error);
    return res.json({ Error: "employee not found" });
  }
};

// get single employee
exports.getSingleEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    return res.json({ employee });
  } catch (error) {
    return res.json({ Error: "error" });
  }
};

// update employee
exports.updateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      salary,
      gender,
      designation,
      dateOfJoined,
      phoneNo,
      department,
      deductionForLeave,
    } = req.body;
    console.log(req.body);
    const updatedEmployee = {
      name,
      email,
      address,
      salary,
      gender,
      designation,
      dateOfJoined,
      phoneNo,
      department,
      deductionForLeave,
    };
    await Employee.findByIdAndUpdate(req.params.id, updatedEmployee);
    return res.json({updatedEmployee });
  } catch (error) {
    return res.json({ Error: "error" });
  }
};

// delete user
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    return res.json({ Status: "Employee Deleted" });
  } catch (err) {
    return res.json({ Error: "Delete employee error " });
  }
};

// salary count
exports.salaryCount = async (req, res) => {
  try {
    // Find employees with role "employee" using $match stage
    const employees = await Employee.aggregate([
      {
        $match: { role: "employee" },
      },
      {
        $group: {
          _id: null,
          sumOfSalary: { $sum: "$salary" },
        },
      },
    ]);

    if (employees.length === 0) {
      return res.json({ sumOfSalary: 0 });
    }

    return res.json({ sumOfSalary: employees[0].sumOfSalary });
  } catch (err) {
    return res.json({ Error: "Error in running query" });
  }
};

// employee count
exports.employeeCount = async (req, res) => {
  try {
    const employeecount = await Employee.find({ role: "employee" });
    return res.json(employeecount.length);
  } catch (err) {
    return res.json({ Error: "Error in Employee count" });
  }
};

//login
exports.adminLogin = async (req, res) => {
  try {
    if (
      req.body.email == "admin@gmail.com" &&
      req.body.password == "adminpassword"
    ) {
      const token = jwt.sign({ email: req.body.email }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        Status: "Success",
      });
    } else {
      return res.json({ Status: "Error", Error: "Invalid Email or Password" });
    }
  } catch (err) {
    console.log(err);
    return res.json({ Status: "Error", Error: "Error in login" });
  }
};

// create attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;
    console.log(employeeId, date, status);

    const newAttendance = new Attendance({
      employeeId: employeeId,
      date: date,
      status: status,
    });
    console.log(newAttendance);
    await newAttendance.save();
    return res.json({ Success: "Attendance added" });
  } catch (err) {
    return res.json({ Error: "Error in attendance" });
  }
};

// get all attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const attendances = await Attendance.find({});
    return res.json({ attendances });
  } catch (err) {
    console.log(err);
    return res.json({ Status: "Error", Error: "Error in running query" });
  }
};

// get single attendance
exports.getSingleAttendance = async (req, res) => {
  const { id } = req.query;
  try {
    const attendance = await Attendance.find({
      employeeId: id,
    });
    return res.json({ attendance });
  } catch (err) {
    console.log(err);
    return res.json({ Status: "Error", Error: "Error in running query" });
  }
};

// employee login
exports.employeeLogin = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email });
    if (!employee) {
      return res
        .status(401)
        .json({ Status: "Error", Error: "Wrong Email or Password" });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password.toString(),
      employee.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ Status: "Error", Error: "Wrong Email or Password" });
    }
    const token = jwt.sign(
      { role: "employee", id: employee._id },
      "jwt-secret-key",
      { expiresIn: "1d" }
    );

    const options = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      Status: "Success",
      id: employee._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ Status: "Error", Error: "Error in running query" });
  }
};

// logout
exports.Logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
};

// Dashboard
exports.Dashboard = (req, res) => {
  return res.json({ Status: "Success", email: req.email, id: req.id });
};
