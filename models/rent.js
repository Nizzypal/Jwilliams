var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var RentInfoSchema = new mongoose.Schema({
	monthlyRate: Number,
	dailyRate: Number,
	blockDateStart: Date,
	blockDateEnd: Date,
	blockDates: [{blockDateStart: Date, blockDateEnd: Date}],
	currentRenter: String,
	numberMonthsAdvance: Number,
	numberMonthsDeposit: Number,
	cancellationFee: Number,
	terminationFee: Number,
	includeUtilities: Boolean,
	includeInternet: Boolean,
	requirePassport: Boolean,
	requireAlienCard: Boolean,
	requireID: Boolean,
	unitAmenities: [String],
	buildingAmenities: [String],
    unitId: String
});

module.exports = mongoose.model("Rent", RentInfoSchema);