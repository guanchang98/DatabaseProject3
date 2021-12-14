## Using it

1) Clone the repo
2) Restore data from dump file to MongoDB

1.Unzip dump.zip in folder 3.Database
2.Find the dump file
3.Restore data to MongoDB
```
mongorestore dump
```
4.You can find data in Mongo Shell or Mongo Compass

3) Install the dependencies

```
npm install
```
```
npm install redis
```
```
npm install mongo
```

4) Load data from MongoDB to Redis
```
node load.js
```

5) Start the server

```
npm start
```

6) Point your browser to http://locahost:3000


