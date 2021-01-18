# Store credit plugin
Provides registered customers with a flexible credit system. 
Lets customers spend their credit balance on product purchase.

## API
Plugin exposes 2 endpoints to handle order return:
* `GET /vendor/store-credit/{{customerId}}` - returns list of customer store credits
* `GET /vendor/store-credit/single/{{storeCreditId}}` - returns single store credit

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
