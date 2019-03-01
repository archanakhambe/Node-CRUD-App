const express = require('express');
const router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const ctrlUser = require('../controllers/user.controller');
//const ctrlEmployee = require('../controllers/employee.controller');
router.post('/register',upload.single('profileimage'),ctrlUser.register);
router.post('/sendemail', ctrlUser.sendemail);
router.get('/profileById',ctrlUser.profileById);
router.put('/profileupdate',ctrlUser.profileupdate);
router.delete('/deleteprofile',ctrlUser.deleteprofile);
router.post('/login',ctrlUser.login);
module.exports = router;

