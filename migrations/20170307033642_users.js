'use strict';

/* eslint-disable max-len */

exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('users', function(table) {
        table.increments();
        table.boolean('admin')
            .defaultTo(false);
        table.string('username')
            .unique()
            .notNullable();
        table.string('email')
            .unique()
            .notNullable();
        table.string('hashed_password')
            .notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};

/*
     Column      |           Type           |                     Modifiers
-----------------+--------------------------+----------------------------------------------------
 id              | integer                  | not null default nextval('users_id_seq'::regclass)
 admin           | boolean                  | default false
 username        | character varying(255)   |
 email           | character varying(255)   |
 hashed_password | character varying(255)   |
 created_at      | timestamp with time zone | not null default now()
 updated_at      | timestamp with time zone | not null default now()
*/

// UPDATE ^