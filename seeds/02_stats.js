'use strict';

/* eslint-disable camelcase */
/* eslint-disable max-len */

exports.seed = function(knex) {
  // Deletes ALL existing entries
    return knex('stats')
        .del()
        .then(function() {
            const players = [{
                username: 'nutiler',
                win: 69,
                points: 9001
            }, {
                username: 'klemms',
                loss: 100,
                points: -100
            }, {
                username: 'rred',
                win: 1,
                loss: 1
            }];
            return knex('stats')
                .insert(players);
        });
};
