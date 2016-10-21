'use strict';

var fs = require('fs');

// CSV Parsing
var parse = require('csv-parse');
var parser = parse({columns: true});

// Mongo
var mongoose = require('mongoose');
mongoose.Promise = global.Promise
var Models = require('./models/Models');
var dbUrl = require('./config/mongodb').url;
var documentType = String(process.argv[3]).toUpperCase();

// Sentinels
var csvReadIsDone = false;
var pendingSaves = 0;

// Upsert new record
var processRecord = function (record) {

    pendingSaves += 1;

    // Get Model reference
    var Model = Models[documentType];

    // Create an object the model can parse (allows for human usable CSVs)
    var modelObject = Model.parseCsvRecord(record)

    // Check if Model is creating its own _id else create one
    if (!modelObject._id){
        var id = mongoose.Types.ObjectId();
        modelObject._id = id;
    }
    
    // Query to check if document already exists
    var query = { _id: modelObject._id };

    // Upsert the new document
    Model.findOneAndUpdate(query, modelObject, {upsert:true}, function(err,doc){
        if(err){ console.log('Error: ' + err); return; }
        
        pendingSaves -= 1;
        if (pendingSaves === 0 && csvReadIsDone === true) {
            mongoose.connection.close(function(){
                console.log('Closed MongoDB connection');
                process.exit();
            });
        }
    });
};

// Get csv records
parser.on('readable', function () {
    var record = null;
    while (record = parser.read()) {
        processRecord(record);
    }
});

parser.on('error', function (err) {
    console.log(err.message + '\n');
});

parser.on('end', function () {
    console.log('Done reading CSV');
    csvReadIsDone = true;
});

// Start Processing (read CSV, connect to DB, pipe to parser)
var csvStream = fs.createReadStream(process.argv[2]);
csvStream.on('error', function(err){
    console.log('Error reading file');
    console.log(err);
    process.exit(1);
});

mongoose.connect(dbUrl, function(err){
    if(err){
        console.log('Error connecting to MongoDB');
        console.log(err);
        process.exit(1);
    }
});

csvStream.pipe(parser);