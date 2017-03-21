'use strict';

/* eslint-disable max-len */
/* eslint-disable camelcase */

// ALTER SEQUENCE seq RESTART WITH 1;
// UPDATE t SET idcolumn=nextval('seq');

exports.seed = function(knex) {
  // Deletes ALL existing entries
    return knex('users')
        .del()
        .then(function() {
            return Promise.all([
                // Inserts seed entries
                knex('users')
                .insert({
                    id: 1,
                    username: 'josh',
                    admin: true,
                    email: 'josh@stormheart.net'
                }),
                knex('users')
                .insert({
                    id: 2,
                    username: 'test',
                    admin: false,
                    email: 'test@example.com'
                }),
            ]);
        });
};
