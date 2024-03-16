const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8000 ;
const {connectDB} = require('./database/database')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const path = require('path');

connectDB();

// Serve static files from the client/dist directory
// app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(
  cors({
    // origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../client/dist")));

 
const admin = require('./routes/adminRoutes')
app.use('/api/v1', admin);


// Catch-all route to serve index.html
// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "../client/dist/index.html"),
//     function (err) {
//       res.status(500).send(err);
//     }
//   );
// });


app.listen(port, () => {
    console.log(`server is running on localhost ${port}`);
});
