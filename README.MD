database offline?
sudo service postgresql start

add logic to calculate points
leave total points blank and update each time

remove total- worthless


p1 > p5
update get score += 20 for win
win++;
p6>p10
update get score -= 18 for loss
loss++;

points = (1200 + ((20 * win) - (18 * loss)))

summonerid = entered username into db > get id


http://michaelavila.com/knex-querylab/

match.hbs make


check name method
summoner ID to name
name to summoner id

pretty application start message


show who has went up and who has dropped ^ V ^ V



createdb league-ladder

psql
\password postgres
knex migrate:latest