
const http = require('http');

http.get('http://localhost:3000/', (resp) => {
    console.log('StatusCode:', resp.statusCode);
    console.log('Headers:', JSON.stringify(resp.headers));
});
