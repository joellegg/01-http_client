#!/usr/bin/env node

const { get } = require('http');

// http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A365%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22AAPL%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D
get('http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={"Normalized":false,"NumberOfDays":365,"DataPeriod":"Day","Elements":[{"Symbol":"AAPL","Type":"price","Params":["c"]}]}', (res) => {
  const statusCode = res.statusCode;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.log(error.message);
    // consume response data to free up memory, since we won't use the request body.
    // Until the data is consumed, the 'end' event will not fire.
    // Also, until the data is read it will consume memory that can eventually lead to a 'process out of memory' error.
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => rawData += chunk);
  res.on('end', () => {
    try {
      let parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.log(e.message);
    }
  });
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});
