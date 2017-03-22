#!/usr/bin/env node

const { get } = require('http');
let [,,input] = process.argv;
const apiStock = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/JSON?parameters={"Normalized":false,"NumberOfDays":365,"DataPeriod":"Day","Elements":[{"Symbol":"${input}","Type":"price","Params":["c"]}]}`;

const getJSON = url => {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
          `Status Code: ${statusCode}`);
      } else if (!/^text\/javascript/.test(contentType)) {
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
          let sum = 0;
          let parsedData = JSON.parse(rawData);
          let { values } = parsedData.Elements[0].DataSeries.close;

          for (let i = 0; i < values.length; i++) {
            sum += values[i];
          }
          let avgPrice = (sum / values.length).toFixed(2);
          resolve(avgPrice);

          // console.log(parsedData.Elements[0].DataSeries.close.values)
        } catch (e) {
          console.log(e.message);
        }
      });
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
    });
  })
};

getJSON(apiStock).then(price => console.log(`The average price for ${input} over the past year was`, price));
