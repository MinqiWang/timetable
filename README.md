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

## public URL
https://gogoapp.website