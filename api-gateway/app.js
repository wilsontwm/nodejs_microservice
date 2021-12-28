const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv'); // To use .env param
const bodyParser = require('body-parser'); // Parse the incoming messages
dotenv.config();

// Routes
const userRoutes = require('./routes/users');
// const leavesRoutes = require('./api/routes/leaves');

app.use(cors({
    credentials: true, 
    origin: 'http://localhost:3001',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization"
}))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     // Add header to the response
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); 
//     res.header('Access-Control-Allow-Credentials:', true); 
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     if(req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
//         return res.status(200).json({});
//     }

//     next();
// });

// Add routers below
app.use('/users', userRoutes);

// Error handling
app.use((req, res, next) => {
    const error = new Error('Invalid URL');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;