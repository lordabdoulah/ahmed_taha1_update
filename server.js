const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./Db')
const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');
const path = require('path');
const geolib = require('geolib');

dotenv.config();
connectDB();


const io = new Server(server, {
  cors: { origin: '*' }
});




app.use(cors());
app.use(express.json());


app.use('/api/users', require('./userRoutes'))

app.use(express.static(path.join(__dirname, 'build')));

// إرسال الصفحة الرئيسية عند الوصول إلى '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



const User = require('./User'); // تأكد من المسار الصحيح

io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    // 📍 دخول المستخدم وربطه بالسوكيت
    socket.on('userConnected', async ({ userId }) => {
      const user = await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: Date.now()
      }, { new: true });
      if (!user){
        console.log(`❌ User ${userId} not found.`);
        return;
      }
      socket.userId = userId;
      console.log(`✅ User ${userId} is online.`);

      // بث للي موجودين إن فيه مستخدم بقى أونلاين
      socket.broadcast.emit('userStatusUpdated', user);

      // إرسال كل المستخدمين الأونلاين لهذا المستخدم
      const onlineUsers = await User.find({ isOnline: true, _id: { $ne: userId } });
      socket.emit('allOnlineUsers', onlineUsers);
      console.log(`✅ Sent ${onlineUsers.length} online users to ${userId}.`);
    });

    socket.on('userDirectionUpdated',async ({ userId, direction }) => {
      const user = await User.findById(userId);
      if (!user) return;
      user.direction = direction;
      await user.save();
      console.log(`✅ User ${userId} direction updated to ${direction}.`);

      socket.broadcast.emit('someuserDirectionUpdated', {
        userId,
        direction
      });
    })

    // 📌 تحديث اللوكيشن
    socket.on('updateLocation', async ({ userId, location }) => {
      const user = await User.findById(userId);
      if (!user) return;

      const oldCoords = user.location?.coordinates;
      let distance = 10000;

      if (oldCoords && oldCoords.length === 2) {
        distance = geolib.getDistance(
          { latitude: oldCoords[1], longitude: oldCoords[0] },
          { latitude: location.coordinates[1], longitude: location.coordinates[0] }
        );
      }

      if (distance >= 5) {
        user.location = location;
        await user.save();

        // بث للمستخدمين كلهم بالتحديث الجديد
        socket.broadcast.emit('userLocationUpdated', {
          userId,
          location: user.location
        });
      }
    });

    // ❌ قطع الاتصال
    socket.on('userDisconnected', async () => {
      if (socket.userId) {
        const user = await User.findByIdAndUpdate(socket.userId, { isOnline: false }, { new: true });
        console.log(`🔴 User ${socket.userId} is offline.`);
        socket.broadcast.emit('userStatusOffline', user);
      }
    });
    // ❌ قطع الاتصال
    socket.on('disconnect', async () => {
      if (socket.userId) {
        const user = await User.findByIdAndUpdate(socket.userId, { isOnline: false }, { new: true });
        console.log(`🔴 User ${socket.userId} is offline.`);
        socket.broadcast.emit('userStatusOffline', user);
      }
    });
  });




server.listen(5000, () => console.log('🚀 Server on http://localhost:3000'));
