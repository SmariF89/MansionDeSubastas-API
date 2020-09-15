const EventEmitter = require('events');
const { Artist } = require('../data/db');

class ArtistService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_ARTISTS: 'GET_ALL_ARTISTS',
            GET_ARTIST_BY_ID: 'GET_ARTIST_BY_ID',
            CREATE_ARTIST: 'CREATE_ARTIST'
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

    getAllArtists() {
    	Artist.find({}, (err, allArtists) => {
		    if(this.existsErrorHandlerSuccess(err, allArtists, this.events.GET_ALL_ARTISTS)) {
		    	this.emit(this.events.GET_ALL_ARTISTS, allArtists);
		    }
	    });
    };

    getArtistById(id) {
    	Artist.findById(id, (err, artist) => {
    		if(this.existsErrorHandlerSuccess(err, artist, this.events.GET_ARTIST_BY_ID)) {
    			this.emit(this.events.GET_ARTIST_BY_ID, artist);
    		}
    	});
    };

    createArtist(artist) {
        Artist.create({
            name: artist.name,
            nickname: artist.nickname,
            address: artist.address,
            memberSince: artist.date
        }, (err, artistCreated) => {
            if(err) {
                this.emit(this.events.CREATE_ARTIST, 1);
                return;
            }
            this.emit(this.events.CREATE_ARTIST, artistCreated);
        });
    };
};

module.exports = ArtistService;
