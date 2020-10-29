const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express();

// connect to database
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => console.log('DB Connected....'))
.catch((err) => console.log('DB Connection Error:', err))

// import routes
const authRoutes = require('./routes/auth')

// app middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
// app.use(cors()); // allows all origins
if((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: `http://locahost:3000`}))
}

  app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next(); 
}
);

// middleware
app.use('/api', authRoutes)


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`)
})
