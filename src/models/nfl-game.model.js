var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    _id: String,
    week: Number,
    ISOdate: Date, 
    awayTeam: String, 
    homeTeam: String
});

gameSchema.statics.parseCsvRecord = function (record) {
    return {
        _id: record.week + '-' + record.away + '-' + record.home,
        week: record.week,
        gameStart: record.date + ' ' + record.time + ' ' + record.timezone,
        awayTeam: record.away,
        homeTeam: record.home
    };
};

gameSchema
    .virtual('gameStart')
    .set(function (dateTimeString) {
        var ISOdate = new Date(Date.parse(dateTimeString));
        this.ISOdate = ISOdate;
    });

module.exports = mongoose.model('Game', gameSchema);