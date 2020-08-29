const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socket = require('socket.io');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('DB connection established!')
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

const io = socket(server, {});

io.on('connection', socket => {
    console.log('Socket connection established. Socket:', socket.id);
    // Handle chat event
    socket.on('subscribe', (room) => {
        console.log('joining room', room);
        socket.join(room);
    })
    socket.on('send', function(data){
        console.log(data);
        io.sockets.in(data.room).emit('chat', data);
    });
});