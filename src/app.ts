import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; 
import cookieParser from 'cookie-parser';
import {Request,Response} from 'express'
import cors from 'cors';
import  dbConnect  from './config/db'
import userRouter from './routes/userRoute'
import adminRouter from './routes/adminRoute';  
import config from './config/config';
import {refreshTokenController} from './controllers/refreshToken'
import { UserService } from './services/userService';
import { INotification } from './model/notificationModel';
import { IUser } from './model/userModel';
import { IBooks } from './model/bookModel'; 
import { BookService } from './services/bookService';
import { ChatService } from './services/chatService';
// import morgan  from 'morgan'

const userService = new UserService()
const bookService = new BookService()
const chatService = new ChatService()

const app = express()

const corsOptions = {
  origin:'http://localhost:5173', 
  credentials: true,
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
   cors: {
     origin:'http://localhost:5173',
     methods:['GET','POST','PUT'],
     credentials: true,   
  },
});

app.set('io', io);

dbConnect()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  
// app.use(morgan('dev'))
app.use(express.static('public/'))


const userSockets = new Map<string, string>();
const onlineUsers = new Map<string, string>(); 
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id); 
  
    socket.on('register', (userId) => {
      if (userId) {
        console.log(userId,'userId at socket ')
        userSockets.set(userId, socket.id);
        onlineUsers.set(userId, socket.id);
        io.emit('user-status', { userId, isOnline: true });

      }
    });
  
    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
            onlineUsers.delete(userId);
            io.emit('user-status', { userId, online: false }); 
            break;
        }
    }
    });

    socket.on('send-notification', (data) => {
      const receiverSocketId = userSockets.get(data.receiverId);
      if (receiverSocketId) {
          io.to(receiverSocketId).emit('notification', data.notification);
          console.log(`reply notification sent to ${data.receiverId}`);
      }
  });
  
    socket.on('requestBook', async (notification) => {
      try {
      
        const { senderId,receiverId, userId, bookId, content,type } = notification;
        const receiverSocketId = userSockets.get(receiverId);
        const user: IUser | null = await userService.getUserById(userId);
        const book: IBooks | null = await bookService.getBookById(bookId);
        const receiver: IUser | null = await userService.getUserById(receiverId);

        // console.log(user,'user')
        // console.log(book,'book')
        // console.log(receiver,'receiver')

        if (!user || !book || !receiver) {
          console.error('User, book, or receiver not found');
          return;
        }

        const notificationData = {
          senderId: senderId,
          receiverId: receiver._id!,
          bookId: book._id!,
          userName: user.name!,
          userImage: user.image!,
          bookTitle: book.bookTitle!,
          bookImage: book.images[0]!, 
          content: content!,
          type:type
        };
  
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('notification', notificationData);
          console.log(`request notification is sent to  ${receiverId}`);
          

        } else {
          console.log(`No active socket found for user ${receiverId}`);
        }
      } catch (error) {
        console.error('Error handling requestBook event:', error);
      }
    });
    socket.on('send-message', async (data) => {
      try {
          const { senderId, receiverId, content, chatRoomId } = data;
          if (!content.trim()) {
              return;
          }

          const message = {
              senderId,
              receiverId,
              content,
              chatRoomId,
              createdAt: new Date()
          };
          console.log(message,'message')
          const chatRoom = await chatService.getChatRoom(senderId,receiverId);
          if (!chatRoom) {
              console.error('Chat room not found');
              return;
          }

          socket.emit('receive-message', message);

          const receiverSocketId = userSockets.get(receiverId);
          if (receiverSocketId) {

              io.to(receiverSocketId).emit('receive-message', message);
          } else {
              console.log(`No active socket found for user ${receiverId}`);
          }

      } catch (error) {
          console.error('Error handling send-message event:', error);
      }
  });
  });

  // const isUserOnline = (userId: string): boolean => {
  //   return userOnlineStatus.get(userId) || false;
  // };
  
  // app.get('/api/user/:userId/online-status', (req, res) => {
  //   const userId = req.params.userId;
  //   const onlineStatus = isUserOnline(userId);
  //   res.json({ online: onlineStatus });
  // });

 app.use((req, res, next) => {
 
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
 });
app.use('/api/user',userRouter) 
app.use('/api/admin',adminRouter)
app.post('/api/refresh-token', refreshTokenController);


server.listen(config.PORT,()=>{
   console.log(`Server running at ${config.PORT}`)
})



  
