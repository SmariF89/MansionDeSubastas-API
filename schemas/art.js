const Schema = require('mongoose').Schema;

module.exports = new Schema({
	title: { type: String, required: true },
	artistId: { type: Schema.Types.ObjectId, required: true, ref: 'Artist' },
	date: { type: Date, default: new Date(), required: true },
	images: [String],
	description: String,
	isAuctionItem: { type: Boolean, default: false }
});
