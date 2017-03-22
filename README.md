# 01-http_client

## Instructions
Write a program that performs an HTTP GET request to get the average stock
price. Use the first argument for a ticker symbol. Use the `get` method in the
`http` module with the API provided by
[MarkitOnDemand](http://dev.markitondemand.com/).

It would certainly be easier to test if you can grab the latest stock price, but
because the response is so small, there may not be an opportunity to demonstrate
chunking. On the API docs you will see an example request for data to create a
chart. This will give 365 of daily prices. Use these prices to get an average.

Expected:

```bash
$ ./stocks.js AAPL
$123.45
```

## Bonus

-   Avoid using encoded characters in your url: %22%3A%5B%22c%22%5D%7D%5D%7D
-   Full Destructuring on the API response object and `http` module
-   Abstract a getJSON function. (This is good practice for when we write our own APIs):
