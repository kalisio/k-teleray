# k-teleray

[![Latest Release](https://img.shields.io/github/v/tag/kalisio/k-teleray?sort=semver&label=latest)](https://github.com/kalisio/k-teleray/releases)
[![Build Status](https://travis-ci.com/kalisio/k-teleray.png?branch=master)](https://travis-ci.com/kalisio/k-teleray)

A [Krawler](https://kalisio.github.io/krawler/) based service to download data from the French gamma dose rate alert [Teleray](http://teleray.irsn.fr/aide.htm) network.

## Description

The **k-teleray** job allow to scrape gamma dose rate measurements from the following url: [http://teleray.irsn.fr//TelerayService/service/measure](http://teleray.irsn.fr//TelerayService/service/measure)`. The downloaded data are stored within a [MongoDB](https://www.mongodb.com/) database and more precisely in 2 collections:
* the `measurements` collection stores the measurement data 
* the `sensors` collection stores the sensor positions

All records are stored in [GeoJson](https://fr.wikipedia.org/wiki/GeoJSON) format.

The job is executed according a specific cron expression. By default, every 10 minutes.

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

This project is licensed under the MIT License - see the [license file](./LICENSE) for details