This seeds directory will generate sql files based on your userId.

To use, just add the userID in the config.js then run the js file associated with what you want to generate. For intance:

config.js
userId = 84
invoiceCount = 50

node invoices.js

Will create a sql file for you to import containing 50 invoices for userId 84
