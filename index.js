const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const port = 3000;
const app = express();

/* TODO: Setja existsErrorHandlerSuccess í aukaskrá og exporta */

/* Services */
const ArtService = require('./services/artService');
const ArtistService = require('./services/artistService');
const CustomerService = require('./services/customerService');
const AuctionService = require('./services/auctionService');

/* ROUTES */

/* Arts */

// http://localhost:3000/api/arts
router.get('/arts', (request, response) => {
	const artService = new ArtService();
	artService.on('GET_ALL_ARTS', allArts => {
		if(allArts === -1) { return response.status(404).send(); }
		else if(allArts === 1) { return response.status(500).send(); }
		return response.json(allArts);
	});
	artService.getAllArts();
});

// http://localhost:3000/api/arts/:id
router.get('/arts/:id', (request, response) => {
	const { id } = request.params;
	const artService = new ArtService();
	artService.on('GET_ART_BY_ID', art => {
		if(art === -1) { return response.status(404).send(); }
		else if(art === 1) { return response.status(500).send(); }
		return response.json(art);
	});
	artService.getArtById(id);
});

// http://localhost:3000/api/arts
router.post('/arts', (request, response) => {
	artService = new ArtService();
	const { body } = request;
	artService.on('CREATE_ART', createdArt => {
		if(createdArt === -1) { return response.status(400).send(); }
		else if(createdArt === 1) { return response.status(500).send(); }
		return response.status(201).json(createdArt);
	});
	artService.createArt(body);
});

/* Artists */

// http://localhost:3000/api/artists/
router.get('/artists', (request, response) => {
	const artistService = new ArtistService();
	artistService.on('GET_ALL_ARTISTS', allArtists => {
		if(allArtists === -1) { return response.status(404).send(); }
		else if(allArtists === 1) { return response.status(500).send(); }
		return response.json(allArtists);
	});
	artistService.getAllArtists();
});

// http://localhost:3000/api/artists/:id
router.get('/artists/:id', (request, response) => {
	const { id } = request.params;
	const artistService = new ArtistService();
	artistService.on('GET_ARTIST_BY_ID', artist => {
		if(artist === -1) { return response.status(404).send(); }
		else if(artist === 1) { return response.status(500).send(); }
		return response.json(artist);
	});
	artistService.getArtistById(id);
});

// http://localhost:3000/api/artists
router.post('/artists', (request, response) => {
	const artistService = new ArtistService();
	const { body } = request;
	artistService.on('CREATE_ARTIST', createdArtist => {
		if(createdArtist === 1) { return response.status(500).send(); }
		return response.status(201).json(createdArtist);
	});
	artistService.createArtist(body);
});

/* Customers */

// http://localhost:3000/api/customers
router.get('/customers', (request, response) => {
	const customerService = new CustomerService();
	customerService.on('GET_ALL_CUSTOMERS', allcustomers => {
		if(allcustomers === -1) { return response.status(404).send(); }
		else if(allcustomers === 1) { return response.status(500).send(); }
		return response.json(allcustomers);
	});
	customerService.getAllCustomers();
});

// http://localhost:3000/api/customers/:id
router.get('/customers/:id', (request, response) => {
	const { id } = request.params;
	const customerService = new CustomerService();
	customerService.on('GET_CUSTOMER_BY_ID', customer => {
		if(customer === -1) { return response.status(404).send(); }
		else if(customer === 1) { return response.status(500).send(); }
		return response.json(customer);
	});
	customerService.getCustomerById(id);
});

// http://localhost:3000/api/customers/:id/auction-bids
router.get('/customers/:id/auction-bids', (request, response) => {
	const { id } = request.params;
	const customerService = new CustomerService();
	customerService.on('GET_CUSTOMER_AUCTION_BIDS', customerAuctionBids => {
		if(customerAuctionBids === -1) { return response.status(404).send(); }
		return response.json(customerAuctionBids);
	});
	customerService.getCustomerAuctionBids(id);
});

// http://localhost:3000/api/customers/
router.post('/customers', (request, response) => {
	const customerService = new CustomerService();
	const { body } = request;
	customerService.on('CREATE_CUSTOMER', createdCustomer => {
		if(createdCustomer === 1) { return response.status(500).send(); }
		return response.status(201).json(createdCustomer);
	});
	customerService.createCustomer(body);
});

/* Auctions */

// http://localhost:3000/api/auctions
router.get('/auctions', (request, response) => {
	const auctionService = new AuctionService();
	auctionService.on('GET_ALL_AUCTIONS', allAuctions => {
		if(allAuctions === -1) { return response.status(404).send(); }
		else if(allAuctions === 1) { return response.status(500).send(); }
		return response.json(allAuctions);
	});
	auctionService.getAllAuctions();
});

// http://localhost:3000/api/auctions/:id
router.get('/auctions/:id', (request, response) => {
	const { id } = request.params;
	const auctionService = new AuctionService();
	auctionService.on('GET_AUCTION_BY_ID', auction => {
		if(auction === -1) { return response.status(404).send(); }
		else if(auction === 1) { return response.status(500).send(); }
		return response.json(auction);
	});
	auctionService.getAuctionById(id);
});

// http://localhost:3000/api/auctions/:id/winner
router.get('/auctions/:id/winner', (request, response) => {
	const { id } = request.params;
	const auctionService = new AuctionService();
	auctionService.on('GET_AUCTION_WINNER', auctionWinner => {
		if(auctionWinner === -1) { return response.status(404).send(); }
		else if(auctionWinner === -2) { return response.status(409).send(); }
		else if(auctionWinner === -3) { return response.status(200).send("This auction had no bids."); }
		else if(auctionWinner === 1) { return response.status(500).send(); }
		return response.json(auctionWinner);
	});
	auctionService.getAuctionWinner(id);
});

// http://localhost:3000/api/auctions/
router.post('/auctions', (request, response) => {
	const auctionService = new AuctionService();
	const { body } = request;
	auctionService.on('CREATE_AUCTION', createdAuction => {
		if(createdAuction === -1) { return response.status(400).send(); }
		else if(createdAuction === -2) { return response.status(412).send(); }
		else if(createdAuction === 1) { return response.status(500).send(); }
		return response.status(201).json(createdAuction);
	});
	auctionService.createAuction(body);
});

// http://localhost:3000/api/auctions/:id/bids
router.get('/auctions/:id/bids', (request, response) => {
	const auctionService = new AuctionService();
	const { id } = request.params;
	auctionService.on('GET_AUCTION_BIDS_WITHIN_AUCTION', auctionBids => {
		if(auctionBids === -1) { return response.status(404).send(); }
		else if(auctionBids === 1) { return response.status(500).send(); }
		return response.json(auctionBids);
	});
	auctionService.getAuctionBidsWithinAuction(id);
});

// http://localhost:3000/api/auctions/:auctionId/bids
router.post('/auctions/:auctionId/bids', (request, response) => {
	const auctionService = new AuctionService();
	const { body } = request;
	const { auctionId } = request.params;
	auctionService.on('PLACE_NEW_BID', newBid => {
		if(newBid === -1) { return response.status(404).send(); }
		else if(newBid === -2) { return response.status(412).send(); }
		else if(newBid === -3) { return response.status(403).send(); }
		else if(newBid === 1) { return response.status(500).send(); }
		return response.json(newBid);
	});
	auctionService.placeNewBid(auctionId, body.customerId, body.price);
});


/* Configs */
app.use(bodyParser.json());
app.use('/api', router);

app.listen(port || process.env.PORT, () => {
	console.log(`Listening on port: ${port}`);
});
