const express = require('express');
const { getControllers, getMiddlewares } = require('./index')
const router = express.Router();

const middleware = getMiddlewares();
const controllers = getControllers();

router.post('/register', controllers.userController.user_register);
router.post('/login', controllers.userController.user_login);
router.post('/activate/resend', controllers.userController.user_resend_activation);
router.get('/activate/:code', controllers.userController.user_activate);
router.post('/password/forget', controllers.userController.user_forget_password);
router.post('/password/reset/:code', controllers.userController.user_reset_password);
router.post('/google/oauth', controllers.userController.user_google_oauth);
router.get('/google/oauth/callback', controllers.userController.user_google_oauth_callback);
router.get('/profile', middleware.authentication.check_user_authentication, controllers.userController.user_get_profile);

module.exports = router;