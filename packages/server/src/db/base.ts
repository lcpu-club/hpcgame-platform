import { MongoClient } from 'mongodb'
import { MONGO_URI } from '../config/index.js'

export const client = new MongoClient(MONGO_URI)
export const db = client.db()
