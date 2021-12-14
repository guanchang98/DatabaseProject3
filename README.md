# Project3

# Driving School Scheduling System
An Application Using Node + Express + Redis + EJS implementing a Driving School Scheduling System for both students and managers.

## 1. Requirements

Design a scheduling application for a driving school. 


## 2. Conceptual Model

![alt text](https://github.com/guanchang98/DatabaseProject2/blob/main/2.ConceptualModel(MongoDB).png?raw=true)

	
## 3. Database

### (1) Unzip the file dump.zip in folder 3.Database

### (2) Find the location of folder dump

### (3) Run in the command line

```
mongorestore dump
```

### (4) You can find the database in Mongo Compass or Mongo Shell (import mongo in command line and then import show dbs or other command) in localhost:27017


## 4. What is the project? & What was the original proposal?

The project is to implement a web application for a driving school scheduling system allowing both managers and students to use it. The original proposal was that managers can create, read, update, and edit the courses' information from the manager page. Besides, students can create an account, register for courses, and find information about them.

## 5. Contribution


Chang Guan completed the Project3 independantly.

	




## 6. Using it

1) Clone the repo
2) Install the dependencies

```
npm install
```
```
npm install redis
```
```
npm install mongo
```

3) Load data from MongoDB to Redis
```
node load.js
```

4) Start the server

```
npm start
```

5) Point your browser to http://locahost:3000


