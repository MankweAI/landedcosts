
const http = require('http');
const fs = require('fs');

const url = 'http://localhost:3000/import-duty-vat-landed-cost/lithium-batteries/from/china/to/south-africa';

http.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        fs.writeFileSync('temp_source_node.html', data);
        console.log('Done writing ' + data.length + ' bytes');
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
    fs.writeFileSync('temp_source_node.html', "Error: " + err.message);
});
