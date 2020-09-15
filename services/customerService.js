const EventEmitter = require('events');
const { Customer, AuctionBid } = require('../data/db');

class CustomerService extends EventEmitter {
    constructor() {
        super();
        this.events = {
            GET_ALL_CUSTOMERS: 'GET_ALL_CUSTOMERS',
            GET_CUSTOMER_BY_ID: 'GET_CUSTOMER_BY_ID',
            GET_CUSTOMER_AUCTION_BIDS: 'GET_CUSTOMER_AUCTION_BIDS',
            CREATE_CUSTOMER: 'CREATE_CUSTOMER'
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

    getAllCustomers() {
        Customer.find({}, (err, allCustomers) => {
    	    if(this.existsErrorHandlerSuccess(err, allCustomers, this.events.GET_ALL_CUSTOMERS)) {
    	    	this.emit(this.events.GET_ALL_CUSTOMERS, allCustomers);
    	    }
        });
    };

    getCustomerById(id) {
        Customer.findById(id, (err, customer) => {
            if(this.existsErrorHandlerSuccess(err, customer, this.events.GET_CUSTOMER_BY_ID)) {
                this.emit(this.events.GET_CUSTOMER_BY_ID, customer);
            }
        });
    };

    getCustomerAuctionBids(cId) {
        AuctionBid.find({customerId: cId}, (err, customerAuctionBids) => {
            if(err || customerAuctionBids === undefined || customerAuctionBids.length == 0) {
                this.emit(this.events.GET_CUSTOMER_AUCTION_BIDS, -1);
                return;
            }
            this.emit(this.events.GET_CUSTOMER_AUCTION_BIDS, customerAuctionBids);
        });
    };

    createCustomer(customer) {
        Customer.create({
            name: customer.name,
            username: customer.username,
            email: customer.email,
            address: customer.address
        }, (err, customerCreated) => {
            if(err) {
                this.emit(this.events.CREATE_CUSTOMER, 1);
                return;
            }
            this.emit(this.events.CREATE_CUSTOMER, customerCreated);
        })
    };
};

module.exports = CustomerService;
