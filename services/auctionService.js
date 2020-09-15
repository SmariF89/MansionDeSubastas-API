EventEmitter = require('events');
const { Auction, AuctionBid, Art, Customer } = require('../data/db');

class AuctionService extends EventEmitter {
	constructor() {
		super();
		this.events = {
			GET_ALL_AUCTIONS: 'GET_ALL_AUCTIONS',
			GET_AUCTION_BY_ID: 'GET_AUCTION_BY_ID',
			GET_AUCTION_WINNER: 'GET_AUCTION_WINNER',
			CREATE_AUCTION: 'CREATE_AUCTION',
			GET_AUCTION_BIDS_WITHIN_AUCTION: 'GET_AUCTION_BIDS_WITHIN_AUCTION',
			PLACE_NEW_BID: 'PLACE_NEW_BID'
		};
	}

	existsErrorHandlerSuccess(err, existObj, event) {
		if(existObj == null) {
			this.emit(event, -1);
			return false;
		}
		if(err) {
			if(err.message.indexOf('Cast to ObjectId failed') !== -1) {
				this.emit(event, -1);
				return false;
			}
			this.emit(event, 1);
			return false;
		}
		return true;
	}

	getAllAuctions() {
		Auction.find({}, (err, allAuctions) => {
			if(this.existsErrorHandlerSuccess(err, allAuctions, this.events.GET_ALL_AUCTIONS)) {
				this.emit(this.events.GET_ALL_AUCTIONS, allAuctions);
			}
		});
	};

	getAuctionById(id) {
		Auction.findById(id, (err, auction) => {
			if(this.existsErrorHandlerSuccess(err, auction, this.events.GET_AUCTION_BY_ID)) {
				this.emit(this.events.GET_AUCTION_BY_ID, auction);
			}
		});
	};

	getAuctionWinner(auctionId) {
		Auction.findById(auctionId, (err, auction) => {
			if(this.existsErrorHandlerSuccess(err, auction, this.events.GET_AUCTION_WINNER)) {
				// Now auction has been found. 
				// If the auction is not finished the number -2 is emitted.
				if(Date.now() <= auction.endDate) {
					this.emit(this.events.GET_AUCTION_WINNER, -2);
					return;
				}
				if(auction.auctionWinner == undefined) {
					this.emit(this.events.GET_AUCTION_WINNER, -3);
					return;
				}
				
				// If auction is finished, the customer with the highest bid is the auction winner.
				Customer.find({_id: auction.auctionWinner}, (err, auctionWinner) => {
					// Could not find the customer.
					if(err) {
						this.emit(this.events.GET_AUCTION_WINNER, -1);
						return;
					}
					// Found the costumer with the highest bid when the auction was finished.
					this.emit(this.events.GET_AUCTION_WINNER, auctionWinner);
				});
				
			}
		});
	};

	createAuction(auction) {
		// Check if art exists.
		Art.findById(auction.artId, (err, art) => {
			if(this.existsErrorHandlerSuccess(err, art, this.events.CREATE_AUCTION)) {
				if(!art.isAuctionItem) {
					this.emit(this.events.CREATE_AUCTION, -2);
					return;
				}
				// If art exists and it is an auction item, auction is created.
				Auction.create({
					artId: auction.artId,
					minimumPrice: auction.minimumPrice,
					endDate: auction.endDate
				}, (err, auctionCreated) => {
					if(err) {
						this.emit(this.events.CREATE_AUCTION, 1);
						return;
					}
					this.emit(this.events.CREATE_AUCTION, auctionCreated);
				});
			}
		});
	};

	getAuctionBidsWithinAuction(auctionId) {
		// Check if auction exists.
		Auction.findById(auctionId, (err, auction) => {
			if(this.existsErrorHandlerSuccess(err, auction, this.events.GET_AUCTION_BIDS_WITHIN_AUCTION)) {
				// If auction exists, get all bids associated with it.
				AuctionBid.find({ auctionId: auctionId }, (err, auctionBids) => {
					if(this.existsErrorHandlerSuccess(err, auctionBids, this.events.GET_AUCTION_BIDS_WITHIN_AUCTION)) {
						if(auctionBids.length == 0) {
							this.emit(this.events.GET_AUCTION_BIDS_WITHIN_AUCTION, -1);
							return;
						}
						this.emit(this.events.GET_AUCTION_BIDS_WITHIN_AUCTION, auctionBids);
					}
				});
			}
		});
	};

	placeNewBid(auctionId, customerId, price) {
		// Find auction.
		Auction.findById(auctionId, (err, auction) => {
			// Check if auction exists.
			if(this.existsErrorHandlerSuccess(err, auction, this.events.PLACE_NEW_BID)) {
				// Find auction bids with the inputted auction id.
				AuctionBid.find({ auctionId: auctionId }, (err, auctionBids) => {
					if(this.existsErrorHandlerSuccess(err, auctionBids, this.events.PLACE_NEW_BID)) {	
						let highestBid = 0;

						auctionBids.map(abit => { 
							if(abit.price > highestBid) { 
								highestBid = abit.price; 
							}
						});

						if(price <= auction.minimumPrice || price <= highestBid) { 
							this.emit(this.events.PLACE_NEW_BID, -2); 
							return;
						}

						if(Date.now() >= auction.endDate) {
							this.emit(this.events.PLACE_NEW_BID, -3);
							return;
						}

						// Check if customer exists.
						Customer.findById(customerId, (err, customer) => {
							if(this.existsErrorHandlerSuccess(err, customer, this.events.PLACE_NEW_BID)) {
								
								// Create auction bid.
								AuctionBid.create({
									auctionId: auctionId,
									customerId: customerId,
									price: price
								}, (err, createdAuctionBid) => {
									if(err) {
										this.emit(this.events.PLACE_NEW_BID, 1);
										return;
									}
									
									// Update the auction.
									auction.auctionWinner = customerId;
									auction.save((err, updatedAuction) => {
										if(err) {
											this.emit(this.events.PLACE_NEW_BID, 1);
											return;
										}
										this.emit(this.events.PLACE_NEW_BID, createdAuctionBid);
									});
								});
							}
						});
					}
				});
			}
		});
	};

};

module.exports = AuctionService;
