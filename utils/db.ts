import mongoose, { Connection } from 'mongoose'

const connection = {
  isConnected: 0,
}

async function connect(): Promise<Connection> {
  if (connection.isConnected === 1) {
    console.log('already connected')
    return mongoose.connection
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState

    if (connection.isConnected === 1) {
      console.log('use previous connection')
      return mongoose.connection
    }

    await mongoose.disconnect()
  }

  const db = mongoose.connection

  db.on('connected', () => {
    console.log('new connection')
    connection.isConnected = db.readyState
  })

  await mongoose.connect(process.env.MONGODB_URL!)

  return db
}

async function disconnect(): Promise<void> {
  if (connection.isConnected === 1) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect()
      connection.isConnected = 0
    } else {
      console.log('not disconnected')
    }
  }
}

const db = { connect, disconnect }
export default db
