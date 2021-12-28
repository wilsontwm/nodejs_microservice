const express = require('express');
const { getControllers } = require('./index')
const router = express.Router();
const checkAuthentication = require('../middleware/checkAuthentication');

const controllers = getControllers();

router.post('/register', controllers.userController.user_register);
router.post('/login', controllers.userController.user_login);
router.post('/activate/resend', controllers.userController.user_resend_activation);
router.get('/activate/:code', controllers.userController.user_activate);
// router.post('/password/forget', UserController.users_password_forget);
// router.post('/password/reset/:token', UserController.users_password_reset);
// router.post('/profile', checkAuthentication, UserController.users_profile_update);

module.exports = router;