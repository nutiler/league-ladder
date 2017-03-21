'use strict';

module.exports = {

    development: {
        client: 'pg',
        connection: {
            database: 'league-ladder',
            host: 'localhost',
            user: "postgres",
            password: "league123",        }
    },
    
    test: {
        client: 'pg',
        connection: {
            database: 'league-ladder',
            host: 'localhost',
        }
    },
    
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
    }
};
