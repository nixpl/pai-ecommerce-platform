const AuthService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const account = await AuthService.registerUser(email, password);
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await AuthService.loginUser(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const assignAdminRole = async (req, res, next) => {
  try {
    const updatedAccount = await AuthService.assignRole(req.params.id, req.body.role);
    res.json(updatedAccount);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  assignAdminRole
};
