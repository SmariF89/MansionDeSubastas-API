const { Art, Artist, Auction, AuctionBid, Customer, connection } = require('./db');
// const cliProgress = require('cli-progress');

const getResourceIdByName = (resources, prop, value) => resources.find(elem => elem[prop] === value);
// const bar = new cliProgress.Bar({}, cliProgress.Presets.rect);
// bar.start(100, 0);

// Drop all collections before execution
Object.keys(connection.collections).forEach(collection => {
    if (collection === 'arts') { Art.collection.drop(); }
    if (collection === 'artists') { Artist.collection.drop(); }
    if (collection === 'auctions') { Auction.collection.drop(); }
    if (collection === 'auctionbids') { AuctionBid.collection.drop(); }
    if (collection === 'customers') { Customer.collection.drop(); }
});

// Insert Artists
Artist.insertMany([
    { 
        name: "Johnny Sven Haraldsson" ,
        nickname: "Johnny Fire",
        address: "Histon street 42a, Oslo, Norway",
        memberSince: new Date()
    },
    { 
        name: "Linda Weathers Petersen" ,
        nickname: "Linda WP",
        address: "Tea street 554r, LA, United States",
        memberSince: new Date()
    },
    { 
        name: "Carlo Peter Davidsson" ,
        nickname: "Carlo the Parlo",
        address: "Taco street 423sr, Mexico city, Mexico",
        memberSince: new Date()
    },
    { 
        name: "Tara Jordan" ,
        nickname: "Sahara",
        address: "Trailroad hill 411, Dublin, Ireland",
        memberSince: new Date()
    },
    { 
        name: "Jenna Johnsson" ,
        nickname: "Jenna Snowshow",
        address: "Mearstreet 20t, Texas, United States",
        memberSince: new Date()
    },
    { 
        name: "Smari Freyr Gudmundsson" ,
        nickname: "Clover",
        address: "Cloverstreet 200e, Bleek town, New Zealand",
        memberSince: new Date()
    }
], (err) => {
    if (err) { throw new Error(err); }
    Artist.find({}, (err, artists) => { 
        if (err) { throw new Error(err); }

        // Insert Arts
        Art.insertMany([
            { 
                title: "Scary faces",
                artistId: getResourceIdByName(artists, 'name', "Jenna Johnsson"),
                date: new Date(), 
                images: ["http://imageExamples.com/ScaryFaces1.jpg", "http://imageExamples.com/ScaryFaces2.jpg"] ,
                description: "Scary faces in scary houses." ,
                isAuctionItem: true 
            },
            { 
                title: "Funny oranges",
                artistId: getResourceIdByName(artists, 'name', "Johnny Sven Haraldsson" ),
                date: new Date(), 
                images: ["http://imageExamples.com/FunnyOranges1.jpg", 
                        "http://imageExamples.com/FunnyOranges2.jpg",
                        "http://imageExamples.com/FunnyOranges3.jpg"] ,
                description: "Funny oranges in funny situations." ,
                isAuctionItem: false 
            },
            { 
                title: "Flying dogs in the summer house",
                artistId: getResourceIdByName(artists, 'name', "Smari Freyr Gudmundsson"),
                date: new Date(), 
                images: ["http://imageExamples.com/FlyingDogsInTheSummerHouse1.jpg"] ,
                description: "Real dog heroes with deep moral values." ,
                isAuctionItem: true 
            },
            { 
                title: "Ghost cows",
                artistId: getResourceIdByName(artists, 'name', "Carlo Peter Davidsson"),
                date: new Date(), 
                images: ["http://imageExamples.com/GhostCows1.jpg", "http://imageExamples.com/GhostCows2.jpg"] ,
                description: "A farming story with a ghost twist.",
                isAuctionItem: true 
            },
            { 
                title: "Puppy lawn movers",
                artistId: getResourceIdByName(artists, 'name', "Jenna Johnsson"),
                date: new Date(), 
                images: ["http://imageExamples.com/PuppyLawnMovers1.jpg", "http://imageExamples.com/PuppyLawnMovers2.jpg"] ,
                description: "Puppy lawn moving animals running with lemons.",
                isAuctionItem: true
            }
        ], (err) => {
            if (err) { throw new Error(err); }
            Art.find({}, (err, arts) => { 
                if (err) { throw new Error(err); }

                // Insert Customers
                Customer.insertMany([
                    {
                        name: "John Wilson",
                        username: "JohnW",
                        email: "John@John.com",
                        address: "JohnWstreet 10"
                    },
                    { 
                        name: "Stella Anderson",
                        username: "StellaA",
                        email: "Stella@Stella.com",
                        address: "StellaAstreet 132"
                    },
                    { 
                        name: "Carl Petersen",
                        username: "CarlP",
                        email: "Carl@Carl.com",
                        address: "CarlPstreet 133"
                    },
                    { 
                        name: "Jenna Karponi",
                        username: "JennaK",
                        email: "Jenna@Jenna.com",
                        address: "JennaKstreet 1"
                    },
                    { 
                        name: "Kenny Rogers",
                        username: "KennyR",
                        email: "Kenny@Kenny.com",
                        address: "Kennystreet 32"
                    },
                    { 
                        name: "Peter Maluskay",
                        username: "PeterM",
                        email: "Peter@Peter.com",
                        address: "Peterstreet 14"
                    }
                ], (err) => {
                    if (err) { throw new Error(err); }
                    Customer.find({}, (err, customers) => { 
                        if (err) { throw new Error(err); }
                        
                        // Insert Auction
                        Auction.insertMany([
                            {
                                artId: getResourceIdByName(arts, 'title', "Scary faces"),
                                minimumPrice: 10,
                                endDate: "2017-10-10T14:40:22.813Z",
                                auctionWinner: getResourceIdByName(customers, 'username', "PeterM")
                            },
                            {
                                artId: getResourceIdByName(arts, 'title', "Flying dogs in the summer house"),
                                minimumPrice: 1000000,
                                endDate: "2015-10-10T14:40:22.813Z",
                                auctionWinner: getResourceIdByName(customers, 'username', "JennaK")
                            },
                            {
                                artId: getResourceIdByName(arts, 'title', "Ghost cows"),
                                minimumPrice: 50000,
                                endDate: "2020-10-10T14:40:22.813Z",
                                auctionWinner: getResourceIdByName(customers, 'username', "StellaA")
                            },
                            {
                                artId: getResourceIdByName(arts, 'title', "Puppy lawn movers"),
                                minimumPrice: 8000,
                                endDate: "2022-10-10T14:40:22.813Z",
                                auctionWinner: getResourceIdByName(customers, 'username', "CarlP")
                            }
                        ], (err) => {
                            if (err) { throw new Error(err); }
                            Auction.find({}, (err, auctions) => { 
                                if (err) { throw new Error(err); }
                                
                                // Insert AuctionBid
                                AuctionBid.insertMany([
                                    {
                                        auctionId: getResourceIdByName(auctions, 'minimumPrice', 10),
                                        customerId: getResourceIdByName(customers, 'username', "PeterM"),
                                        price: 1200
                                    },
                                    {
                                        auctionId: getResourceIdByName(auctions, 'minimumPrice', 1000000),
                                        customerId: getResourceIdByName(customers, 'username', "JennaK"),
                                        price: 1030000
                                    },
                                    {
                                        auctionId: getResourceIdByName(auctions, 'minimumPrice', 50000),
                                        customerId: getResourceIdByName(customers, 'username', "StellaA"),
                                        price: 50090
                                    },
                                    {
                                        auctionId: getResourceIdByName(auctions, 'minimumPrice', 50000),
                                        customerId: getResourceIdByName(customers, 'username', "KennyR"),
                                        price: 60000
                                    },
                                    {
                                        auctionId: getResourceIdByName(auctions, 'minimumPrice', 50000),
                                        customerId: getResourceIdByName(customers, 'username', "StellaA"),
                                        price: 60001
                                    },
                                    {
                                        auctionId: getResourceIdByName(auctions, 'minimumPrice', 8000),
                                        customerId: getResourceIdByName(customers, 'username', "JennaK"),
                                        price: 5520
                                    },
                                    {
                                        auctionId: getResourceIdByName(auctions, 'minimumPrice', 8000),
                                        customerId: getResourceIdByName(customers, 'username', "CarlP"),
                                        price: 5550
                                    }
                                ], (err) => {
                                    if (err) { throw new Error(err); }
                                    AuctionBid.find({}, (err, auctionbids) => { 
                                        if (err) { throw new Error(err); } 
                                        connection.close();
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})