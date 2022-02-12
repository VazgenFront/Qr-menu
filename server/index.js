const { graphqlHTTP } = require('express-graphql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/configs');
const log4js = require('./helpers/logger');
const corsHandler = require('./helpers/corsHandler');
const schema = require('./schema/schema');
const log = log4js.getLogger();
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(corsHandler);

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use('/up-images', express.static(path.resolve(__dirname, './server/up-images')));

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

const apiRoutes = require('./api_v1/routes/accountApi');
app.use('/api/account', apiRoutes(express));

app.get('*', (req, res) => {
    res.redirect('/api/error');
});

// Server uncaught error handlers
process.on('uncaughtException', (err) => {
    console.log('An uncaught exception detected', err);
    process.exit(-1);
});

process.on('unhandledRejection', (err) => {
    console.log('An unhandled rejection detected', err);
    process.exit(-1);
});

// START THE SERVER
// ====================================
app.listen(config.port, ()=> {
    console.log(`Node server started on port ${config.port}`)
    log.info(`Node server started on port ${config.port}`);
});