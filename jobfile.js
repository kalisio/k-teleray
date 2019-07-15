const config = require('./config')

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/teleray'

module.exports = {
  id: 'teleray',
  store: 'memory',
  options: {
    workersLimit: 1
  },
  tasks: [{
    id: 'teleray',
    type: 'http',
    options: {
      url: 'http://teleray.irsn.fr//TelerayService/service/measure'
    }
  }],
  hooks: {
    tasks: {
      after: {
        readJson: {},
        convertToGeoJson: {
          latitude: 'location.lat',
          longitude: 'location.lon'
        },
        /* For DEBUG purpose
        writeJsonFS: {
          hook: 'writeJson',
          store: 'fs'
        },
        */
        writeMongoCollection: {
		      faultTolerant: true,
          chunkSize: 256,
          collection: 'teleray',
          transform: {
            transformPath: 'features',
            mapping: { 'properties.measureDate': 'time' },
            omit: [ 'properties.location' ],
            unitMapping: { time: { asDate: 'utc' } } 
          }
        },
        clearData: {}
      }
    },
    jobs: {
      before: {
        createStores: [{
          id: 'memory'
        }, {
          id: 'fs',
          options: {
            path: __dirname
          }
        }],
        connectMongo: {
          url: dbUrl,
          // Required so that client is forwarded from job to tasks
          clientPath: 'taskTemplate.client'
        },
        createMongoCollection: {
          clientPath: 'taskTemplate.client',
          collection: 'teleray',
          indices: [
            [{ time: 1, 'properties.irsnId': 1 }, { unique: true }],
            [{ time: 1 }, { expireAfterSeconds: config.expirationPeriod }], // days in s
            { geometry: '2dsphere' }                                                                                                              
          ],
        }
      },
      after: {
        disconnectMongo: {
          clientPath: 'taskTemplate.client'
        },
        removeStores: ['memory', 'fs']
      }
    }
  }
}
