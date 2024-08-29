const port = 9090;
const app = require('./app.js');


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});