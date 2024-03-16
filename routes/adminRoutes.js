const { createEmployee, getAllEmployees, getSingleEmployee, updateEmployee, deleteEmployee, salaryCount, employeeCount, adminLogin, createAttendance, getAllAttendance, getSingleAttendance, employeeLogin, Logout, Dashboard } = require('../controllers/adminController')
const multer = require('multer');
const path = require('path');
const router = require('express').Router()
const {isAuthenticatedUser , authorizeRoles } = require('../utils/authenticate')

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  },
});

// Create the multer upload middleware
const upload = multer({ storage: storage });

router.route('/create-employee').post(upload.single('image'), createEmployee);
router.route('/all-employees').get(getAllEmployees)
router.route('/update/:id').put(updateEmployee)
router.route('/all-employees/:id').delete(deleteEmployee)
router.route('/salary').get(salaryCount)
router.route('/total-employee').get(employeeCount)
router.route('/admin/login').post(adminLogin)
router.route('/attendance').post(createAttendance)
router.route('/all-attendance').get(getAllAttendance)
router.route('/attendance').get(getSingleAttendance)
router.route('/all-employees/:id').get(getSingleEmployee)
router.route('/employee-login').post(employeeLogin)
router.route('/logout').get(Logout)
router.route('/dashboard').get(Dashboard)






module.exports = router