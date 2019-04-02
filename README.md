## public URL
https://gogoapp.website

## Local run instructions (Mainly for CSCC09 grading purpopse):
To run this app locally, you need to install MySQL 8.0. Here is a reference for how to install MySQL 8.0 on Ubuntu machines: https://www.tecmint.com/install-mysql-8-in-ubuntu/. Once MySQL is successfully, please follow the instructions below to start the app:

* Firstly, do "git clone https://github.com/UTSCC09/project-team-gg.git" to checkout the repository, then go to directory "project-team-gg" (which is what you just cloned from this repo) and do "git checkout 689df10febcf779046735a852dd804afc8143c71". This commit is the last commit on March 31, 2019 and it is also the latest commit which has the correct configuration for local run.

* Now we have to create the database objects and set up database credentials. To set up the credentials, get into your Mysql CLI ($PATH_TO_YOUR_MYSQL_CLI -u $USERNAME -p$PASSWORD -- Note that $PATH_TO_YOUR_MYSQL_CLI can usually just be the shortcut "mysql" and there is no spacee between "-p" and "$PASSWORD") and run commands "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'wang971001'; flush privileges;". Then, to create the databases and tables, also get into the Mysql CLI and firstly do "create database CSCC09" then run all of the "create table ..." commands in file "project-team-gg/backend/database.sql".

* Since our app requires facebook authentication, you have to also create a file "project-team-gg/backend/facebook.json.nogit " to enable it. The content of this file is the following json:
```json
{
        "clientID": "373028373287102",
        "clientSecret": "ea971139d2e9f99f948eb7c0d31cd4b1",
        "callbackURL": "https://localhost:8000/auth/facebook/callback"
}
```

* If the above steps are done successfully, now we should have the correct database setup and can run the app. You need 2 terminal windows to go to 2 directories separately, "project-team-gg/backend/" and "prject-team-gg/GGFrontEnd/gg/". Then in directory "project-team-gg/backend/" do "npm install" followed by "node app.js" to start the backend Nodejs server. Similarly, in directory "prject-team-gg/GGFrontEnd/gg/" do "npm install" followed by "npm start" to start the frontend React dev server. Make sure port 3000 and port 8000 are available for HTTPS.

* Now, you can access the app at "https://localhost:3000".

## Project Title

The project title is "Go?Go!", which is abbreviated to "GG".

## Team Members

The team members are Shuang Wu and Minqi Wang.

## Project Description

### Introduction
This project is all about a social networking app. Unlike the mainstream social networking apps/sites such as Facebook, Wechat and Twitter which focus on connecting you to a bigger world, the intended purpose of this app is to provide convenience for your daily communication and interaction with the people close to you. With app "GG", you and your homies will be able to easily share each other's everyday life by providing information in each of your "GG timetable". Another powerful feature of GG is group event scheduling. The "GG map" will provide information of places to help you choose the location of events. You will also be benefited by functionalities like popular places, conflict avoidance etc.

### Key Features

The 3 major components of GG are GG Timetable, GG Map and GG coins. We plan to implement several features for each of these components.

#### 1. GG Timetable (Extended timetable)
* (a) Share text, image, music, video clips.
* (b) Post comments for timetable events.
* (c) Initialize and attend group events. (In combination with GG Map)
* (d) View time use in percentage and visual charts.

#### 2. GG Map
* (a) View geolocation of places and users.
* (b) Search for places and get search results.
* (c) See popular places from the map.
* (d) Initialize and attend group events. (In combination with GG Timetable)
* (e) Global live commenting at a place. (Everyone can see the live comments.)

#### 3. GG coins (Reward System)
* (a) Gain GG coins by making posts and comments, scheduling events etc.
* (b) Use GG coins to post global live comments, rank higher on leaderboards etc.

## Milestones

### Beta Version
Complete fundamental functionalities
* User accounts and friend list.
* Basic timetable functionalities: 1 (a), 1 (b), 1 (c) in Key Features.
* Basic map functionalities: 2 (a), 2 (b), 2 (d) in Key Features.

### Final Version
Extend the basic functionalities and optionally implement other features
* Add conflict avoidance, option (e.g. time, people etc.) suggester to help user schedule events.
* Add 1 (d) and 2 (c).
* Within the time limit, optionally complete part of 2 (e), 3 (a), 3 (b).

## Technologies

### Frontend Framework
#### React
* A JavaScript library for building user interfaces
* React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.
* Build encapsulated components that manage their own state, then compose them to make complex UIs.
* React can also render on the server using Node and power mobile apps using React Native.

### Backend Framework
#### Nodejs
* a JavaScript runtime built on Chrome's V8 JavaScript engine.
* Express RestFUL API Framework

## Top 5 challenges
### challenge 1
* Integrating several APIs(Google Maps JavaScript API, most of third party authentication API, wit.ai API)

### challenge 2 
* We are creating a responsive browser app using React(Zero Experience for Us)

### challenge 3
* Global live commenting at a place of the map. (realtime synchronizing)

### challenge 4
* The animation effect on the map. (2D, 3D)

### challenge 5
* AI assistant to help user creating their timetable, send group invitation etc.

