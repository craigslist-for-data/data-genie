# data-genie

## Install Postgres on local machine

1. Follow instructions here to install Postgres on your local machine: https://dataschool.com/learn-sql/how-to-start-a-postgresql-server-on-mac-os-x/


## Create local Postgres Database called "data_genie"

1. From the command line, run `createdb -h localhost -p 5432 -U $USER data_genie` to create a new local Postgres database called "data_genie".

2. Download Postico: https://eggerapps.at/postico/

3. From the command line, run `echo $USER` to print your local machine's username

4. Set up connection to database in Postico:

  ```
    Host = localhost
    Port = 5432
    User = (username from step 3 above)
    Database = data_genie
  ```


## Clone Git Repo to local machine:

1. From the command line, clone repo locally `git clone https://github.com/craigslist-for-data/data-genie.git`

2. Create a `secrets.js` file in your repository's root directory + add secrets to it


## Option 1: Run backend locally (no containers)

1. From the command line, navigate to your repository's root directory

2. Run `DB_HOST=localhost node app.js` to run the backend server locally

2. (Optional) Run `npm test` to run database tests (**Note:** this will replace all the contents of your local Postgres database)

3. **Note:** Use host `http://0.0.0.0:8080` when connecting to the backend -- e.g. if you run `curl -i 'http://0.0.0.0:8080/posts/?index=1&batchSize=10'` from the command line, it should return the most recent 10 posts


## Option 2: Run backend in a local container

1. Download Docker Desktop for Mac

2. From the command line, navigate to your repository's root directory

3. Substitute `mcinali` for your Docker username in the `dockerize.sh` file

3. Run `./dockerize.sh` to run the backend server in a local container

4. **Note:** Use host `http://0.0.0.0:49160` when connecting to the backend -- e.g. if you run `curl -i 'http://0.0.0.0:49160/posts/?index=1&batchSize=10'` from the command line, it should return the most recent 10 posts
