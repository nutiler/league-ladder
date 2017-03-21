'use strict';

/* eslint-disable max-len */

exports.up = function(knex, Promise) {
    return knex.schema.createTable('stats', (table) => {
        table.increments();
        table.text('username')
            .notNullable();
        table.text('summonerid')
            .notNullable();
        table.integer('avatar')
            .notNullable();
        table.integer('win')
            .notNullable()
            .defaultTo(0);
        table.integer('loss')
            .notNullable()
            .defaultTo(0);
        table.integer('points')
            .notNullable()
            .defaultTo(1200);
        table.integer('maxelo')
            .notNullable()
            .defaultTo(1200);
        table.timestamps(true, true);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('stats');
};

/*
   Column   |           Type           |                        Modifiers
------------+--------------------------+----------------------------------------------------------
 id         | integer                  | not null default nextval('leaguestats_id_seq'::regclass)
 username   | text                     | not null
 summonerid | text                     | not null
 wins       | integer                  | not null default 0
 loses      | integer                  | not null default 0
 points     | integer                  | not null default 0
 maxelo      | integer                  | not null default 0
 created_at | timestamp with time zone | not null default now()
 updated_at | timestamp with time zone | not null default now()
*/

// UPDATE ^
// CHANGE maxelo TO highestelo