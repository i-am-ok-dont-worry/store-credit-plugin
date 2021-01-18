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

            return module;
        });

        return client;
    };

    /**
     * Returns list of store credits per customer
     * @req.param.customerId Customer id
     * @req.query.sort - Sort by
     * @req.query.sortDir {asc|desc} - Sort direction
     * @req.query.start - Page number
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

    return {
        domainName: '@grupakmk',
        pluginName: 'store-credit-plugin',
        route: '/store-credit',
        router
    };
};
