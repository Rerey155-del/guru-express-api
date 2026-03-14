const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/login', userController.login);
router.get('/', verifyToken, userController.getUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.post('/', verifyToken, userController.createUser);
router.put('/:id', verifyToken, userController.updateUser);
router.patch('/:id', verifyToken, userController.patchUser);
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
