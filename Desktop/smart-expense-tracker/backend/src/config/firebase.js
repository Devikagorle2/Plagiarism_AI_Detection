const admin = require('firebase-admin');

// Check if Firebase credentials are available
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.warn('Firebase credentials not found in environment variables. Please set up your .env file.');
  console.warn('Using mock mode for development...');
  
  // Mock implementations for development
  const createMockSnapshot = (docs = []) => ({
    docs: docs.map(doc => ({ id: doc.id, data: () => doc })),
    empty: docs.length === 0,
    forEach: (callback) => docs.forEach(doc => callback({ id: doc.id, data: () => doc }))
  });

  const mockDb = {
    collection: () => ({
      add: async () => ({ id: 'mock-id-' + Date.now() }),
      get: async () => createMockSnapshot(),
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => {},
        update: async () => {},
        delete: async () => {}
      }),
      where: () => ({
        where: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => ({
                offset: () => ({
                  get: async () => createMockSnapshot()
                })
              })
            }),
            limit: () => ({
              offset: () => ({
                get: async () => createMockSnapshot()
              })
            }),
            get: async () => createMockSnapshot()
          }),
          orderBy: () => ({
            limit: () => ({
              offset: () => ({
                get: async () => createMockSnapshot()
              })
            })
          }),
          limit: () => ({
            offset: () => ({
              get: async () => createMockSnapshot()
            })
          }),
          get: async () => createMockSnapshot()
        }),
        orderBy: () => ({
          limit: () => ({
            offset: () => ({
              get: async () => createMockSnapshot()
            })
          })
        }),
        limit: () => ({
          offset: () => ({
            get: async () => createMockSnapshot()
          })
        }),
        get: async () => createMockSnapshot()
      }),
      orderBy: () => ({
        limit: () => ({
          offset: () => ({
            get: async () => createMockSnapshot()
          })
        })
      })
    })
  };
  
  const mockAuth = {
    verifyIdToken: async () => ({ uid: 'mock-user', email: 'test@example.com' }),
    getUser: async () => ({ email: 'test@example.com', displayName: 'Test User' })
  };
  
  module.exports = { db: mockDb, auth: mockAuth };
} else {
  const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  const db = admin.firestore();
  const auth = admin.auth();

  module.exports = { db, auth };
}
