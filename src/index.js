require('dotenv').config();

const app = require('./api/config/express.config');
const mongoose = require('mongoose').default;

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

mongoose.connect(process.env.LOCALMONGO)
    .then(() => {
        app.listen(port, () => {
            console.log(`running on port ${port} !`);
        });
    })
    .catch((error) => {
        console.log(error);
    })

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}