const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Email already registered",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Database error, please try again",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "All fields are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No account found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Incorrect password",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: user.name,
        role: user.role,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Database error, please try again",
    });
  }
};

module.exports = { register, login };
