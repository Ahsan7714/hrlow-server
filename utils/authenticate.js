const jwt = require('jsonwebtoken');
const { compare } = require('bcrypt'); // Use bcrypt for password comparison
const Employee = require('../models/Employee');

exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Please login to access this resource" });
    }

    try {

        // Check if the decoded email and password match the admin credentials
        const adminEmail = 'admin@gmail.com';
        const adminPasswordHash = 'adminpassword'; // Replace with the actual hashed password

        if (decodedData.email === adminEmail && await compare(decodedData.password, adminPasswordHash)) {
            // Attach user information to the request object for future use
            req.user = { email: decodedData.email }; // Modify as needed
            next();
        } else {
            throw new Error("Invalid email or password");
        }
    } catch (err) {
        return res.status(401).json({ message: "Invalid token, email, or password" });
    }
};

exports.authorizeRoles = (...role) => {
    return async (req, res, next) => {
        try {
            if (!role.includes(req.Employee.role)) {
                throw new Error(`Role: ${req.Employee.role} is not allowed to access this resource`);
            }

            next();
        } catch (error) {
            res.status(403).json({ message: error.message || "Forbidden" });
        }
    };
};
