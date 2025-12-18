const { Sequelize } = require('sequelize');

const isTest = process.env.NODE_ENV === 'test';

let sequelize;
if (isTest) {
  // Fast, zero-setup DB for tests
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });
} else {
  if (!process.env.DB_URL) {
    throw new Error('Missing DB_URL environment variable');
  }
<<<<<<< HEAD
  
  if (isTest) {
    // Fast, zero-setup in-memory MongoDB for tests
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.info('Connected to in-memory MongoDB for testing');
  } else {
    if (!process.env.MONGODB_URL) {
      throw new Error('Missing MONGODB_URL environment variable');
    }
    
    await mongoose.connect(process.env.MONGODB_URL, {
      maxPoolSize: 5,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    
    console.info('Connected to MongoDB');
  }
  
  return mongoose;
}

/**
 * Disconnect from MongoDB and cleanup
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  await mongoose.disconnect();
  
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

/**
 * Clear all collections (useful for tests)
 * @returns {Promise<void>}
 */
async function clearDatabase() {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
=======
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'mysql', // Assurez-vous que le dialecte est correct
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // don't add the timestamp attributes (updatedAt, createdAt)
    define: {
      timestamps: false
    },
    // The retry config if Deadlock Happened
    retry: {
      match: [/Deadlock/i],
      max: 3, // Maximum retry 3 times
      backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
      backoffExponent: 1.5 // Exponent to increase backoff each try. Default: 1.1
    }
  });
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
}

module.exports = {
  sequelize
};
