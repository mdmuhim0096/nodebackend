// const express = require("express");

// const app = express();

// const cors = require("cors");

// const Chat = require("./model/chat");

// const http = require('http');
// const { Server } = require('socket.io');
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: '*', 
//     methods: ['GET', 'POST'],
//   },
// });

// let onlineUser = {};

// io.on('connection', (socket) => {

//   socket.on("groupvideocall", data => {
//     socket.broadcast.emit("groupvideocall", data);
//   })

//   socket.on("register", userId => {
//     onlineUser[userId] = socket.id;
//   });

//   socket.on("incoming_call", userId => {
//     socket.broadcast.emit("incoming_call", userId);
//   })

//   socket.on("____incoming_call____", data => {
//     socket.broadcast.emit("____incoming_call____", data);
//   })

//   socket.on("____recive_call____", data => {
//     socket.broadcast.emit("____recive_call____", data);
//   })

//   socket.on("callend", userId => {
//     socket.broadcast.emit("callend", userId);
//   })

//   socket.on('send_message', async (data) => {

//     const messageObject = {
//       recevireId: data.riciver,
//       senderId: data.sender,
//       user: data.sender,
//       time: data.realtime,
//       messageText: null,
//     }

//     if (data.message.includes("https://") || data.message.includes("http://")) {
//       messageObject["link.link"] = data.message;
//       messageObject["link.isLink"] = true
//     }

//     const isLoop = data.message.match(/^\$(\d+)\s\{(.+)\}$/) || data.message.match(/^\$(\d+)\{(.+)\}$/);
//     let loopText = "",
//       next = ", ";
//     if (isLoop) {
//       messageObject.messageText = isLoop[1];
//       for (let i = 0; i < isLoop[1]; i++) {
//         if (i == isLoop[1] - 1) next = ".";
//         loopText += isLoop[2] + next;
//       }
//       messageObject.messageText = loopText;
//     } else {
//       messageObject.messageText = data.message;
//     }

//     if (data.mediaUrl) {
//       messageObject["mediaUrl"] = data.mediaUrl;
//     }

//     try {
//       if (data.call.type && data.call.duration) {
//         messageObject["call.callType"] = data.call.type;
//         messageObject["call.duration"] = data.call.duration;
//       }
//     } catch (error) {
//       console.log(error.message)
//     }

//     const newChat = new Chat(messageObject);
//     const user = await newChat.save();
//     const realchat = await Chat.findById(user.id).populate("user");
//     io.emit('receive_message', realchat);
//   });

//   socket.on("send_replay", async data => {
//     await Chat.findByIdAndUpdate(data.chatId, {
//       "replay.text": data.replay,
//       "replay.image": data.image, isReplay: true
//     }, { new: true });
//     io.emit("replay", null)
//   })

//   socket.on("__load_data__", async data => {
//     socket.broadcast.emit("__load_data__", data);
//   })

//   socket.on("see", async data => {
//     socket.broadcast.emit("see", data);
//   })

//   socket.on('disconnect', () => {
//     socket.broadcast.emit("__load_data__", null)
//     delete onlineUser;
//   });
// });

// const morgan = require("morgan");

// const databas = require("./databas/databas");

// const userRouter = require("./router/people");
// const postRouter = require("./router/post");
// const saveRouter = require("./router/save");
// const friendRouter = require("./router/friend");
// const messageRouter = require("./router/chat");
// const notificatioRouter = require("./router/notification");
// const createNotificatioRouter = require("./router/createNotifications");
// const createGroupRouter = require("./router/createGroup");
// const groupChatRouter = require("./router/groupChat");
// const shareRouter = require("./router/share");
// const cookieParser = require("cookie-parser");

// app.use(express.json());
// app.use(cookieParser())
// app.use(express.static("public"));

// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: 'GET,POST,PUT,DELETE',
//   credentials: true
// }));

// app.use("/api/people", userRouter);
// app.use("/api/post", postRouter);
// app.use("/api/save", saveRouter);
// app.use("/api/friend", friendRouter);
// app.use("/api/chat", messageRouter);
// app.use("/api/noti", notificatioRouter);
// app.use("/api/addNoti", createNotificatioRouter);
// app.use("/api/group", createGroupRouter);
// app.use("/api/gchat", groupChatRouter);
// app.use("/api/share", shareRouter);

// const port = 4000;
// server.listen(port, () => { console.log(`http://localhost:${port}`) });


const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

// MongoDB model
const Chat = require("./model/chat");

// Routers
const databas = require("./databas/databas");
const userRouter = require("./router/people");
const postRouter = require("./router/post");
const saveRouter = require("./router/save");
const friendRouter = require("./router/friend");
const messageRouter = require("./router/chat");
const notificationRouter = require("./router/notification");
const createNotificationRouter = require("./router/createNotifications");
const createGroupRouter = require("./router/createGroup");
const groupChatRouter = require("./router/groupChat");
const shareRouter = require("./router/share");

const app = express();
const server = http.createServer(app);

// ✅ Updated CORS setup for both local & deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-app.onrender.com", // Replace with your frontend deploy URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));

// ✅ Routers
app.use("/api/people", userRouter);
app.use("/api/post", postRouter);
app.use("/api/save", saveRouter);
app.use("/api/friend", friendRouter);
app.use("/api/chat", messageRouter);
app.use("/api/noti", notificationRouter);
app.use("/api/addNoti", createNotificationRouter);
app.use("/api/group", createGroupRouter);
app.use("/api/gchat", groupChatRouter);
app.use("/api/share", shareRouter);

// ✅ Socket.IO with wildcard CORS for WebSocket
const io = new Server(server, {
  cors: {
    origin: "*", // or allow only frontend in production
    methods: ["GET", "POST"],
  },
});

// ✅ Socket.IO logic
let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("groupvideocall", (data) => {
    socket.broadcast.emit("groupvideocall", data);
  });

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("incoming_call", (userId) => {
    socket.broadcast.emit("incoming_call", userId);
  });

  socket.on("____incoming_call____", (data) => {
    socket.broadcast.emit("____incoming_call____", data);
  });

  socket.on("____recive_call____", (data) => {
    socket.broadcast.emit("____recive_call____", data);
  });

  socket.on("callend", (userId) => {
    socket.broadcast.emit("callend", userId);
  });

  socket.on("send_message", async (data) => {
    const messageObject = {
      recevireId: data.riciver,
      senderId: data.sender,
      user: data.sender,
      time: data.realtime,
      messageText: null,
    };

    if (data.message?.includes("https://") || data.message?.includes("http://")) {
      messageObject["link.link"] = data.message;
      messageObject["link.isLink"] = true;
    }

    const isLoop = data.message?.match(/^\$(\d+)\s?\{(.+)\}$/);
    if (isLoop) {
      const count = parseInt(isLoop[1]);
      const text = isLoop[2];
      messageObject.messageText = Array(count).fill(text).join(", ") + ".";
    } else {
      messageObject.messageText = data.message;
    }

    if (data.mediaUrl) {
      messageObject.mediaUrl = data.mediaUrl;
    }

    if (data.call?.type && data.call?.duration) {
      messageObject["call.callType"] = data.call.type;
      messageObject["call.duration"] = data.call.duration;
    }

    try {
      const newChat = new Chat(messageObject);
      const saved = await newChat.save();
      const populated = await Chat.findById(saved._id).populate("user");
      io.emit("receive_message", populated);
    } catch (error) {
      console.log("Message Save Error:", error.message);
    }
  });

  socket.on("send_replay", async (data) => {
    try {
      await Chat.findByIdAndUpdate(data.chatId, {
        "replay.text": data.replay,
        "replay.image": data.image,
        isReplay: true,
      }, { new: true });

      io.emit("replay", null);
    } catch (err) {
      console.log("Replay Error:", err.message);
    }
  });

  socket.on("__load_data__", (data) => {
    socket.broadcast.emit("__load_data__", data);
  });

  socket.on("see", (data) => {
    socket.broadcast.emit("see", data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("__load_data__", null);
    onlineUsers = {};
  });
});

// ✅ Start Server
const port = 4000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
