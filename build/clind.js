// import { io } from "socket.io-client";


// في ملف client.js (أو حيثما تقوم بإعداد الـ Socket.io في الـ Frontend)

const socket = io('http://localhost:5000'); // تأكد من تغيير الـ URL إلى الـ URL الخاص بالسيرفر الخاص بك

// عند الاتصال، أخبر السيرفر أن المستخدم متصل
socket.on('connect', () => {
  console.log('Connected to server');
  if (!window.localStorage.getItem('userid')) {
     window.location.href = '/signup'; // إذا لم يكن المستخدم متصل، يتم تحويله إلى صفحة التسجيل
  }
  const userId = window.localStorage.getItem('userid'); // هنا يمكن أن تأخذ userId من الـ LocalStorage أو من الـ Context أو أي مكان مناسب
  socket.emit('userConnected', userId);
  console.log('User connected with id:', userId);
});

// التعامل مع الرسائل القادمة من السيرفر
socket.on('receiveMessage', (data) => {
  console.log('New message received:', data);
});

// إذا تم إغلاق الاتصال أو تم إغلاق التطبيق، تأكد من إرسال إشعار عن الانفصال
window.addEventListener('beforeunload', () => {
  socket.emit('disconnect'); // إرسال إشعار بالانفصال
});
