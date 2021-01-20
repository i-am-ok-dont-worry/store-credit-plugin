const SearchCriteria = require('magento-searchcriteria-builder');

module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('storeCredit', (restClient) => {
            const module = {};
            module.getStoreCredit = ({ customerId, sortBy, sortDir, pageSize, currentPage }, token) => {
                const url = `/kmk-amastystorecredit/storecredit/search`;
                const query = new SearchCriteria();
                query.applyFilter('customer_id', customerId);
                query.applySort(sortBy, sortDir);
                query.setCurrentPage(currentPage);
                query.setPageSize(pageSize);

                return restClient.get(url + '?' + query.build(), token);
            };

            module.getSingleStoreCredit = (storeCreditId, token) => {
                const url = `/kmk-amastystorecredit/storecredit/${storeCreditId}`;
                return restClient.get(url, token);
            };

            module.applyCredit = (amount, cartId, token) => {
                const url = `/carts/mine/amstorecredit/apply`;
                return restClient.post(url, { amount, cartId }, token);
            };

            module.cancelCredit = (cartId, token) => {
                const url = `/carts/mine/amstorecredit/cancel`;
                return restClient.post(url, { cartId }, token);
            };

            module.myStoreCredit = (token) => {
                const url = `/customers/me/amstorecredit`;
                return restClient.get(url, token);
            };

            return module;
        });

        return client;
    };

    /**
     * Returns details about the customer credit
     * @req.query.token
     * @req.query.storeCode
     */
    router.get('/mine', (req, res) => {
        const { token } = req.query;
        const client = createMage2RestClient();
        try {
            client.storeCredit.myStoreCredit(token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Returns list of store credits per customer
     * @req.param.customerId Customer id
     * @req.query.sort - Sort by
     * @req.query.sortDir {asc|desc} - Sort direction
     * @req.query.start - Page number
     * @req.query.token
     * @req.query.storeCode
     */
    router.get('/:customerId', (req, res) => {
        const { customerId } = req.params;
        const { token, storeCode, ...restParams } = req.query;
        const client = createMage2RestClient();
        try {
            client.storeCredit.getStoreCredit({ customerId, restParams }, token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Returns list of store credits
     * @req.param.storeCreditId Store credit id
     * @req.query.token
     * @req.query.storeCode
     */
    router.get('/single/:storeCreditId', (req, res) => {
        const { storeCreditId } = req.params;
        const { token } = req.query;
        const client = createMage2RestClient();
        try {
            client.storeCredit.getSingleStoreCredit(storeCreditId, token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Applies amount of user store credit to the cart
     * @req.query.amount
     * @req.query.cartId
     * @req.query.token
     * @req.query.storeCode
     */
    router.post('/apply', (req, res) => {
        const { token, amount, cartId } = req.query;
        const client = createMage2RestClient();
        try {
            client.storeCredit.applyCredit(amount, cartId, token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Cancels user store credit on the cart
     * @req.query.cartId
     * @req.query.token
     * @req.query.storeCode
     */
    router.post('/cancel', (req, res) => {
        const { token, cartId } = req.query;
        const client = createMage2RestClient();
        try {
            client.storeCredit.cancelCredit(cartId, token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    return {
        domainName: '@grupakmk',
        pluginName: 'store-credit-plugin',
        route: '/store-credit',
        router
    };
};
