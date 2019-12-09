# k-teleray

[![Build Status](https://travis-ci.org/kalisio/k-teleray.png?branch=master)](https://travis-ci.org/kalisio/k-teleray)

A [Krawler](https://kalisio.github.io/krawler/) based service to download data from the French gamma dose rate alert [Teleray](http://teleray.irsn.fr/aide.htm) network.

## Description

The **k-teleray** job allow to scrape gamma dose rate measurements from the following url: `http://teleray.irsn.fr//TelerayService/service/measure`.

The downloaded data are stored in 2 [MongoDB](https://www.mongodb.com/) collections:
* `measurements`: stores the measurements as an array of [GeoJSON features](https://fr.wikipedia.org/wiki/GeoJSON)
* `sensors`: stores the sensor positions as an array of **GeoJson** features.

By default, the job is executed every 10 minutes.

## Configuration

| Variable | Description |
|--- | --- |
| `DB_URL` | The mongoDB database URL. The default value is `mongodb://127.0.0.1:27017/teleray` |
| `TTL` | The observations data time to live. It must be expressed in seconds and the default value is `604 800` (7 days) | 
| `DEBUG` | Enables debug output. Set it to `krawler*` to enable full output. By default it is undefined. |

## Deployment

We personally use [Kargo](https://kalisio.github.io/kargo/) to deploy the service.

## Contributing

Please refer to [contribution section](./CONTRIBUTING.md) for more details.

## Authors

This project is sponsored by 

![Kalisio](https://s3.eu-central-1.amazonaws.com/kalisioscope/kalisio/kalisio-logo-black-256x84.png)

## License

This project is licensed under the MIT License - see the [license file](./LICENCE) for details