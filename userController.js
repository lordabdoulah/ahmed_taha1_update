const User = require("./User");
const geolib = require('geolib');



// دالة للتحقق من وجود اسم المستخدم في قاعدة البيانات

exports.checkUsernameExists = async (req, res) => {
    const { username } = req.params;  // الحصول على اسم المستخدم من الـ URL
    console.log( "Checking if username exists:",username);

    try {
        // البحث عن اسم المستخدم في قاعدة البيانات
        const user = await User.findOne({ name: username });
        console.log(user);
        if (user) {
            return res.status(400).json({ exists: true, message: "Username already exists" });
        } else {
            return res.status(200).json({ exists: false, message: "Username is available" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};


// ✅ البحث عن مستخدم بالاسم ورقم الهاتف
exports.findUserByNameAndPhone = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
      console.log( "Finding user by name and phone:",name, phoneNumber);
    // تأكد ان الاتنين موجودين
    if (!name || !phoneNumber) {
      return res.status(400).json({ message: 'Name and phone number are required.' });
    }

    // البحث
    const user = await User.findOne({ name: name, phoneNumber: phoneNumber });

    if (!user) {
      console.log( "User not found:","XXXX",user);
      return res.status(404).json({ message: 'User not found.' });
    }
    await User.findOneAndUpdate({ _id: user._id }, { isOnline: true });
    // رجع بيانات اليوزر
    res.status(200).json(user);


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.createUser = async (req, res) => {
    try {
      console.log(req.body);
  
      const { name, imageUrl, phoneNumber, location } = req.body;
  
      const userData = { name, imageUrl, phoneNumber };
  
      // لو فيه location وجواه coordinates صح
      if (location && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
        userData.location = {
          type: 'Point',
          coordinates: location.coordinates
        };
      }
  
      const user = new User(userData);
  
      await user.save();
  
      res.status(201).json({
        ok: true,
        message: "User created successfully",
        userId: user._id,
        name: user.name,
        imageUrl: user.imageUrl
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, message: "Server error", error });
    }
};
  




// جلب كل المستخدمين
exports.getAllUsers = async (req, res) => {
  try {
    if (req.body.pass === "1212009009"){
      const users = await User.find();
      res.json(users);
    }
    else{
      return res.status(401).json({ message: "Unauthorized" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};





// جلب بيانات مستخدم معين بالـ ID
exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      console.log( "Getting user by id:",userId);
      const user = await User.findById(userId);
  
      if (!user) {
        console.log( "User not found:",user);
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
      console.log( "User found:",user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
      console.log( "Error getting user by id:",error);
    }
  };
  

 