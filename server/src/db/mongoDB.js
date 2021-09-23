const mongoose = require('mongoose')
const {
  NODE_ENV,
  MONGO_LOCAL_CONNECTION,
  MONGO_PRODUCTION,
} = require('../constants')

const connectDB = async () => {
  try {
    await mongoose.connect(
      NODE_ENV === 'development' ? MONGO_LOCAL_CONNECTION : MONGO_PRODUCTION,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    console.log('MongoDB Connected')
  } catch (error) {
    console.log(error.message)
  }
}

// mongoose.set('useCreateIndex', true)

module.exports = {
  mongoDB: connectDB,
}
