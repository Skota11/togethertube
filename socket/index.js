const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require('cors')

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain)

app.use(cors())

/**
 * [イベント] ユーザーが接続
 */

let data = {};

io.on("connection", (socket) => {
    console.log("connect")


  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Join to ${room}`)
    io.to(room).emit("join" , data[room]);  
  })

  socket.on('emitid' , (ytid) => {
    console.log(ytid)
    data[ytid.room] = {}
    data[ytid.room].id = ytid.value
    console.log(data)

    io.to(ytid.room).emit("selectid" , ytid.value);  
  })
  socket.on("pause", (msg) => {
    io.to(msg.room).emit("pause", msg);
    data[msg.room].seek = msg.seek;
  });
  socket.on("play", (msg) => {
    console.log(msg)
    io.to(msg.room).emit("play" , msg);
    data[msg.room].seek = msg.seek;
  });

  socket.on("disconnect", () => {


    io.emit("member-post", "ユーザーの切断がありました")
  });
});

/**
 * 3000番でサーバを起動する
 */
http.listen(10000, () => {
  console.log("listening on *:10000");
});