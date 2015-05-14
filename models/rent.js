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

RentInfoSchema.path('blockDates').validate(validateBlockDate, 'validation of `{PATH}` failed with value `{VALUE}`');

//Block Date validator
function validateBlockDate(blockDate){
	RentInfoSchema.blockDates.forEach(function(element, index){
		if (element.blockDateStart <= blockDate.blockDateStart <= element.blockDateEnd) {
			if (element.blockDateStart <= blockDate.blockDateEnd <= element.blockDateEnd) continue;
		} else return false;

		return true;
	}, 'Date invalid');
}

module.exports = mongoose.model("Rent", RentInfoSchema);