const _ = require('lodash')

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/teleray'
const ttl = process.env.TTL || (7 * 24 * 60 * 60)  // duration in seconds

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
          dataPath: 'data.mostRecentMeasurement',
          collection: 'teleray-measurements',
          pipeline: [
            { $sort: { 'properties.irsnId': 1, time: 1 } },
            {
              $group:
                {
                  _id: "$properties.irsnId",
                  lastMeasureDate: { $last: "$time" }
                }
            }
          ],
          allowDiskUse: true
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
            let measurements = []
            _.forEach(item.data.features, (feature) => {
              let existingMeasure = _.find(item.mostRecentMeasurement, (measure) => {
                const lastMeasurementDate = measure.lastMeasureDate.getTime()
                return measure._id === feature.properties.irsnId && lastMeasurementDate === feature.properties.measureDate
              })
              if (existingMeasure === undefined) measurements.push(feature)
            })
            console.log('Found ' + measurements.length + ' new measurements')
            item.data = measurements
          }
        },
        writeMeasurements: {
          hook: 'writeMongoCollection',
          collection: 'teleray-measurements',
          transform: {
            mapping: { 'properties.measureDate': 'time' },
            omit: [ 'properties.location' ],
            unitMapping: { time: { asDate: 'utc' } } 
          },
          chunkSize: 256
        },
        updateSensors: {
          hook: 'updateMongoCollection',
          collection: 'teleray-sensors',
          filter: { 'properties.irsnId': '<%= properties.irsnId %>' },
          upsert : true,
          transform: {
            omit: [ 
              'time',
              'properties.measureDate',
              'properties.measureDateFormatted', 
              'properties.value', 
              'properties.average', 
              'properties.cleanMeasure',
              'properties.libelle',
              'properties.validation' ]
          },
          chunkSize: 256
        },
        clearData: {}
      }
    },
    jobs: {
      before: {
        createStores: [{ id: 'memory' }],
        connectMongo: {
          url: dbUrl,
          // Required so that client is forwarded from job to tasks
          clientPath: 'taskTemplate.client'
        },
        createSensorsCollection: {
          hook: 'createMongoCollection',
          clientPath: 'taskTemplate.client',
          collection: 'teleray-sensors',
          indices: [
            [{ 'properties.irsnId': 1 }, { unique: true }],
            { geometry: '2dsphere' }                                                                                                              
          ],
        },
        createMeasurementsCollection: {
          hook: 'createMongoCollection',
          clientPath: 'taskTemplate.client',
          collection: 'teleray-measurements',
          indices: [
            [{ time: 1, 'properties.irsnId': 1 }, { unique: true }],
            [{ time: 1 }, { expireAfterSeconds: ttl }], // days in s
            { geometry: '2dsphere' }                                                                                                              
          ],
        }
      },
      after: {
        disconnectMongo: {
          clientPath: 'taskTemplate.client'
        },
        removeStores: ['memory']
      },
      error: {
        disconnectMongo: {
          clientPath: 'taskTemplate.client'
        },
        removeStores: ['memory']
      }
    }
  }
}
