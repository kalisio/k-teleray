const _ = require('lodash')

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
      before: {
        createMongoAggregation: {
          dataPath: 'data.mostRecentMeasures',
          pipeline: [
            { $sort: { 'properties.irsnId': 1, time: 1 } },
            {
              $group:
                {
                  _id: "$properties.irsnId",
                  lastMeasureDate: { $last: "$time" }
                }
            }
          ]
        }
      },
      after: {
        readJson: {},
        convertToGeoJson: {
          latitude: 'location.lat',
          longitude: 'location.lon'
        },
        apply: {
          function: (item) => {
            let features = []
            _.forEach(item.data.features, (feature) => {
              let existingMeasure = _.find(item.mostRecentMeasures, (measure) => {
                const lastMeasureDate = measure.lastMeasureDate.getTime()
                return measure._id === feature.properties.irsnId && lastMeasureDate === feature.properties.measureDate
              })
              if (existingMeasure === undefined) features.push(feature)
            })
            console.log('Found ' + features.length + ' new measures')
            item.data = features
          }
        },
        /* For DEBUG purpose
        writeJsonFS: {
          hook: 'writeJson',
          store: 'fs'
        },
        */
        writeMongoCollection: {
          chunkSize: 256,
          collection: 'teleray',
          transform: {
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
