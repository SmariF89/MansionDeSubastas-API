const EventEmitter = require('events');
const { Art, Artist } = require('../data/db');

class ArtService extends EventEmitter {
	constructor() {
		super();
		this.events = {
			GET_ALL_ARTS: 'GET_ALL_ARTS',
			GET_ART_BY_ID: 'GET_ART_BY_ID',
			CREATE_ART: 'CREATE_ART'
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

	getAllArts() {
		Art.find({}, (err, allArts) => {
			if(this.existsErrorHandlerSuccess(err, allArts, this.events.GET_ALL_ARTS)) {
				this.emit(this.events.GET_ALL_ARTS, allArts);
			}
		});
	}

	getArtById(id) {
		Art.findById(id, (err, art) => {
			if(this.existsErrorHandlerSuccess(err, art, this.events.GET_ART_BY_ID)) {
				this.emit(this.events.GET_ART_BY_ID, art);
			}
		});
	}

	createArt(art) {
		// Check if artist exists.
		Artist.findById(art.artistId, (err, artist) => {
			if(this.existsErrorHandlerSuccess(err, artist, this.events.CREATE_ART)) {
				// If artist exists, art is created.
				Art.create({
					title: art.title,
					artistId: art.artistId,
					date: art.date,
					images: art.images,
					description: art.description,
					isAuctionItem: art.isAuctionItem
				}, (err, artCreated) => {
					if(err) {
						this.emit(this.events.CREATE_ART, 1);
						return;
					}
					this.emit(this.events.CREATE_ART, artCreated);
				});
			}
		});
	}
};

module.exports = ArtService;
