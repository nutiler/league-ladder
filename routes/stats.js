'use strict';

/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable-next-line new-cap */

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var request = require('request');

var riotkey = "RGAPI-39e5e407-b361-4ff5-b6d2-2feeb112b168"; // HIDE ME

// Check if user logged is admin.
function authorizedAdmin(req, res, next) {
    let userID = req.session.user;
    knex('users')
        .where('id', userID.id)
        .first()
        .then(function(admin) {
            if (admin.admin) {
                next();
            }
            else {
                res.render('admin');
            }
        });
}

// Set views for client.
function respondAndRender(id, res, viewName) {
    if (validId(id)) {
        knex('stats')
            .select()
            .where('id', id)
            .first()
            .then(stats => {
                res.render(viewName, stats);
            });
    }
    else {
        res.status(500);
        res.render('error', {
            message: 'Invalid id'
        });
    }
}

// Verification for cases.
function validId(id) {
    return !isNaN(id);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function validAdd(num) {
    return typeof num.username == 'string' &&
        num.username.trim() != '' &&
        isNumeric(num.win) &&
        isNumeric(num.loss);
}

function validatestatsRenderError(req, res, callback) {
    if (validAdd(req.body)) {
        const player = {
            username: req.body.username,
            win: req.body.win,
            loss: req.body.loss,
        };
        callback(player);
    }
    else {
        res.status(500);
        res.render('error', {
            message: 'Invalid Player.'
        });
    }
}

// Display all users to page.
router.get('/', (req, res) => {
    knex('stats')
        .select()
        .then(stats => {
            res.render('all', {
                stats: stats
            });
        });
});

router.get('/add', authorizedAdmin, (req, res) => {
    res.render('add');
});

// Submit match scores to update match players.
router.get('/match', (req, res) => {
    knex('stats')
        .select()
        .then(stats => {
            res.render('match', {
                stats: stats
            });
        });
});

// Redirect to individual page.
router.get('/:id', (req, res) => {
    const id = req.params.id;
    respondAndRender(id, res, 'single');
});

// Redirect to edit page.
router.get('/:id/edit', (req, res) => {
    const id = req.params.id;
    respondAndRender(id, res, 'edit');
});

// Creating a new player to the database.
router.post('/', (req, res) => {
    console.log('Requesting to add: ' + req.body.username);
    if (validAdd(req.body)) {
        let player = {
            win: req.body.win,
            loss: req.body.loss,
            points: (1200 + ((20 * req.body.win) - (18 * req.body.loss))),
            maxelo: (1200 + ((20 * req.body.win) - (18 * req.body.loss)))
        };
        
        request(`https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${req.body.username}?api_key=${riotkey}`, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(JSON.parse(body));
                player.username = JSON.parse(body)[`${req.body.username.toLowerCase().replace(/\s+/g, '')}`].name; //remove un
                player.summonerid = JSON.parse(body)[`${req.body.username.toLowerCase().replace(/\s+/g, '')}`].id;
                player.avatar = JSON.parse(body)[`${req.body.username.toLowerCase().replace(/\s+/g, '')}`].profileIconId;
                
                knex('stats')
                    .insert(player, 'id')
                    .then(ids => {
                        const id = ids[0];
                        res.redirect(`/stats/${id}`);
                    });
                console.log(player);
            }
            // Send to error page if it's not a valid username.
            else {
                console.log("This is not a valid username.")
                res.redirect(`stats/add`);
            }
        });
    }

    else {
        console.log('Failed to add Player.');
        res.status(500);
        res.render('error', new Error());
    }
});

// Update 10 players.
router.post('/match', (req, res) => {
    let win, loss, points, maxelo, username, avatar;
    console.log(req.body)
    console.log("\nMatch Final Scores Submitted: \n");
    for (var i = 0; i < req.body.t1.length; i++) {
        addWin(req.body.t1[i]);
        addLoss(req.body.t2[i]);
    }

    function addWin(name) {
        setTimeout(function() { // Readability for debugging.
            console.log(name + " has won a match.");
            // Select required stats.
            knex('stats')
                .select("username", "summonerid", "avatar", "loss", "win", "points", "maxelo")
                .where('username', name)
                .then(function(val) {
                    // Update stats with formula.
                    win = val[0].win + 1;
                    loss = val[0].loss;
                    points = (1200 + ((20 * win) - (18 * loss)));
                    maxelo = val[0].maxelo;
                    if (maxelo <= points) {
                        maxelo = points;
                    }
                    request(`https://na.api.pvp.net/api/lol/na/v1.4/summoner/${val[0].summonerid}?api_key=${riotkey}`, function(error, response, body) {
                        username = JSON.parse(body)[`${val[0].summonerid}`].name;
                        avatar = JSON.parse(body)[`${val[0].summonerid}`].profileIconId;
                        // Send to database.
                        knex('stats')
                            .where('username', name)
                            .update({
                                "username": username,
                                "win": win,
                                "loss": loss,
                                "points": points,
                                "maxelo": maxelo,
                                "avatar": avatar
                            })
                            .then(function(confirm) {
                                // console.log("Successful: " + confirm)
                            });
                    });
                });
        }, 0);
    }

    function addLoss(name) {
        setTimeout(function() { // Readability for debugging.
            console.log(name + " has lost a match.");
            // Select required stats.
            knex('stats')
                .select("username", "summonerid", "avatar", "loss", "win", "points", "maxelo")
                .where('username', name)
                .then(function(val) {
                    // Update stats with formula.
                    win = val[0].win;
                    loss = val[0].loss + 1;
                    points = (1200 + ((20 * win) - (18 * loss)));
                    maxelo = val[0].maxelo;
                    if (maxelo <= points) {
                        maxelo = points;
                    }
                    request(`https://na.api.pvp.net/api/lol/na/v1.4/summoner/${val[0].summonerid}?api_key=${riotkey}`, function(error, response, body) {
                        username = JSON.parse(body)[`${val[0].summonerid}`].name;
                        avatar = JSON.parse(body)[`${val[0].summonerid}`].profileIconId;
                        // Send to database.
                        knex('stats')
                            .where('username', name)
                            .update({
                                "username": username,
                                "win": win,
                                "loss": loss,
                                "points": points,
                                "maxelo": maxelo,
                                "avatar": avatar
                            })
                            .then(function(confirm) {
                                // console.log("Successful: " + confirm)
                            });
                    });
                });
        }, 500);
    }
    res.redirect(`/stats/`);
});

// Updating individual stats.
router.put('/:id', authorizedAdmin, (req, res) => {
    validatestatsRenderError(req, res, (stats) => {
        const id = req.params.id;
        const player = {
            username: req.body.username,
            summonerid: req.body.summonerid,
            win: req.body.win,
            loss: req.body.loss,
            maxelo: req.body.maxelo,
            points: (1200 + ((20 * req.body.win) - (18 * req.body.loss)))
        };
        if (req.body.maxelo <= player.points) {
            player.maxelo = player.points;
        }
        // console.log(player);
        knex('stats')
            .where('id', id)
            .update(player, 'id')
            .then(() => {
                res.redirect(`/stats/${id}`);
            });
    });
});

// Remove the player from the database.
router.delete('/:id', authorizedAdmin, (req, res) => {
    const id = req.params.id;
    if (validId(id)) {
        knex('stats')
            .where('id', id)
            .del()
            .then(() => {
                res.redirect('/stats');
            });
    }
    else {
        res.status(500);
        res.render('error', {
            message: 'Invalid id'
        });
    }
});

module.exports = router;
