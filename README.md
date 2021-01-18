# Store credit plugin
Provides registered customers with a flexible credit system. 
Lets customers spend their credit balance on product purchase.

Plugin is compatible with [Amasty Store Credit Magento Extension](https://amasty.com/store-credit-and-refund-for-magento-2.html)

## API
Plugin exposes 2 endpoints to handle order return:
* `GET /vendor/store-credit/{{customerId}}` - returns list of customer store credits
* `GET /vendor/store-credit/single/{{storeCreditId}}` - returns single store credit
* `POST /vendor/store-credit/apply?amount={{amount}}&cartId={{cartId}}&token={{token}}&storeCode={{storeCode}}` - applies credit to the cart 
* `POST /vendor/store-credit/cancel?cartId={{cartId}}&token={{token}}&storeCode={{storeCode}}` - cancels credit on the cart 

## Filtering list
Store credit list list can be filtered and sorted via additional query parameters on 
endpoint `GET /store-credit/{{customerId}}`:
* pageSize - `{number}`
* currentPage - `{number}`
* sortBy - field by which list will be sorted
* sortDir - sort direction `{asc|desc}`

## Entry point
Entry point for plugin is a /src/index.js file. It contains a template function
for api plugin.
