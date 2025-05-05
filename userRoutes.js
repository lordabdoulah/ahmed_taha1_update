const express = require("express");
const router = express.Router();
const { createUser, loginUser,findUserByNameAndPhone, getUserById, updateUserStatus, getAllUsers,getNearbyUsers, updateUserLocation ,checkUsernameExists, getOnlineUsers} = require('./userController');
// تسجيل الدخول
router.post("/signup", createUser);
// تحديث حالة المستخدم


router.post('/login', findUserByNameAndPhone);


// جلب أقرب المستخدمين للموقع الحالي

router.get('/check-username/:username', checkUsernameExists);

// تحديث الموقع الجغرافي للمستخدم
// router.put("/:userId/location", updateUserLocation);

// جلب كل المستخدمين
router.get("/", getAllUsers);




// جلب كل المستخدمين المتصلين
// router.get('/online', getOnlineUsers);


// router.post("/updateUserStatus/:userId/:status", updateUserStatus);


router.get('/getUserById/:id', getUserById);
module.exports = router;
