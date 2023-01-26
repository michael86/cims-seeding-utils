# Cims Utils

A CLI to populate the [cims backend](https://github.com/michael86/cims-backend) database.

To use, make sure you set up the .ENV file with the relevant info for your database, aswell as the config.json with the elevant information to populate the database.

Each entry will make use of the [random-data](https://random-data-api.com/) api. Certain information isn't worth generating such as invoice footers and sku descriptions.

To use just run `node app.js` and follow the instructions shown in the CLI
