
import axios from 'axios'
import baseURL from './config'

// export const loginIn = (callback) => {
//     axios.get(baseURL + "/auth/facebook/")
//     .then(res => callback(res))
//     .catch(err => console.log(err))
// }

/*
 * Retrieve user info 
 *
 * URL params: id -- the user id (if id is not given then retrieve the authenticated user's info)
 * Request body:
 * Response body: {name: "Ken", avatarURL: "https://graph.facebook.com/815763312109831/picture"} 
 */
export const retrieveUserInfo = (callback, errcallback, id="") => {
    axios.get(baseURL + "/auth/retrieveUserInfo/" + id)
    .then(res => callback(res))
    .catch(err => {errcallback(err); console.log(err)})
}

/*
 * Send friend invitation
 *
 * URL params: user_id -- the user id
 * Request body:
 * Response body: Success/Failure messages 
 */
export const invite = (callback, errcallback, user_id) => {
    axios.get(baseURL + "/friend/invite/" + user_id)
    .then(res => callback(res))
    .catch(err => {errcallback(err); console.log(err)})
}

/*
 * Accept friend invitation
 * 
 * URL params: user_id -- the user id
 * Request body:
 * Response body: Success/Failure messages 
 */
export const accept = (callback, errcallback, user_id) => {
    axios.get(baseURL + "/friend/invite/accept/" + user_id)
    .then(res => callback(res))
    .catch(err => {errcallback(err); console.log(err)})
}

/*
 * Retrieve the friendlist
 *
 * URL params:
 * Request body:
 * Response body: [1, 2, 3, 4, 5] (where 1, 2, 3, 4, 5 are all user ids)
 */
export const retrieveFriendlist = (callback, errcallback) => {
    axios.get(baseURL + "/friend/retrieveAll")
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}

/*
 * Create an event and its timetable slots.
 *
 * URL params:
 * Request body: {detail: [TEXT_CONTENT, MEDIA_CONTENT_URLS, PLACE_NAME], timetable_slots: [[EVENT_NAME, EVENT_HAS_DETAIL, 
 * START_TIME, LENGTH, WEEK_OF, DAY_OF_THE_WEEK, IS_REPEATING, OBSCURED_BY, IS_EMPTY_OBSCURE], [...] ...]}
 * Request body example: {detail: ["Hello World", "IMAGE_URL1, VIDEO_URL1, VIDEO_URL2, ...", "UTSC"], timetable_slots: 
 * [["event1", true, "8:45:00", "15", "2019-03-17", 1, false, null, null], [...] ...]}
 * Response body: Success/Failure messages 
 */
export const createEvent = (callback, errcallback, data) => {
    axios.post(baseURL + "/event/create", data)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}

/*
 * Add a timetable slot for an event.
 * If any slot is obscured by this slot (specified by req.body.obscure), update the database accordingly.
 *
 * URL params:
 * Request body: {"event_id": EVENT_ID, "obscure_id": OBSCURE_ID, "timetable_slot": [EVENT_NAME, EVENT_HAS_DETAIL, 
 * START_TIME, LENGTH, WEEK_OF, DAY_OF_THE_WEEK, IS_REPEATING, OBSCURED_BY, IS_EMPTY_OBSCURE]}
 * Request body example: {"event_id": 1, "obscure_id": 2, "timetable_slot": ["event1", true, "8:45:00", "15", "2019-03-17", 1, false, null, null]}
 * Response body: Success/Failure messages 
 */
export const addTimeslot = (callback, errcallback, data) => {
    axios.post(baseURL + "/event/timetable_slot/create", data)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}

/*
 * Update an event.
 *
 * URL params:
 * Request body: {"event_id": EVENT_ID, event_detail: [TEXT_CONTENT, MEDIA_CONTENT_URLS, PLACE_NAME], event_name: EVENT_NAME}
 * Request body example: {"event_id": 1, event_detail: ["Hello World", "IMAGE_URL1, VIDEO_URL1, VIDEO_URL2, ...", "UTSC"], event_name: "event1"}
 * Response body: Success/Failure messages 
 */
export const updateEvent = (callback, errcallback, data) => {
    axios.patch(baseURL + "/event/update", data)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}

/*
 * Update a timetable slot
 *
 * URL params:
 * Request body; {"event_id": EVENT_ID, "id": "slot_id": TIMETABLE_SLOT_ID, "timetable_slot": [START_TIME, LENGTH, DAY_OF_THE_WEEK]}
 * Request body example: {"event_id": 1, "id": 1, "timetable_slot": ["8:45:00", "15", 1]}
 * Response body: Success/Failure messages 
 */
export const updateTimeslot = (callback, errcallback, data) => {
    axios.patch(baseURL + "/event/timetable_slot/update", data)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}

/*
 * Delete a timetable slot.
 * If this is actually a slot which obscures another slot, do not delete it but set all fields to null.
 *
 * URL params: slot_id -- The id of the timetable slot to delete; event_id -- The id the corresponding event
 * Request body:
 * Response body: Success/Failure messages
 */
export const deleteTimeslot = (callback, errcallback, slot_id, event_id) => {
    axios.delete(baseURL + "/event/timetable_slot/delete/" + slot_id + "/" + event_id)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}

/*
 * Delete an event and its timetable slots.
 *
 * URL params: id -- The id of the event to delete
 * Reqeust body:
 * Response body: Success/Failure messages
 */
export const deleteEvent = (callback, errcallback, event_id) => {
    axios.delete(baseURL + "/event/delete/" + event_id)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}

/* 
 * Retrieve all timetable slots for a given week.
 *
 * URL params: week_of -- The "week-of" day
 * Reqeust body:
 * Response body: [[SLOT_ID, EVENT_ID, EVENT_NAME, EVENT_HAS_DETAIL, START_TIME, LENGTH, WEEK_OF, DAY_OF_THE_WEEK, IS_REPEATING, 
 * OBSCURED_BY, IS_EMPTY_OBSCURE], [...], ...]
 * Response body example: [["1", 1", "event1", true, "8:45:00", "15", "2019-03-17", 1, false, null, null], [...], ...]
 */
export const retrieveAllSlotsInAWeek = (callback, errcallback, week_of) => {
    axios.get(baseURL + "/event/timetable_slot/retrieveAll" + week_of)
    .then(res => callback(res))
    .catch(err => {errcallback(err); console.log(err)})
}

/*
 * Retrieve the detailed information for a given event.
 *
 * URL params: id -- The id of the event
 * Request body:
 * Response body: [EVENT_ID, TEXT_CONTENT, MEDIA_CONTENT_URLS, PLACE]
 * Response body example: ["1", "Hello World", "", "UTSC"]
 */
export const retrieveDetailEvent = (callback, errcallback, event_id) => {
    axios.get(baseURL + "/event/retrieve" + event_id)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}


/*
 * Create a group event. (Add a list of invitees)
 *
 * URL params:
 * Reqeust body: {id: EVENT_ID, invitees: [USER_ID1, USER_ID2, ...]}
 * Response body: Success/Failure messages
 */
export const createGroupEvent = (callback, errcallback, data) => {
    axios.post(baseURL + "/event/group/create", data)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}

/*
 * Accept a group event.
 *
 * URL params:
 * Request body: {id: EVENT_ID} 
 * Response body: Success/Failure messages
 */
export const acceptGroupEvent = (callback, errcallback, data) => {
    axios.post(baseURL + "/event/group/accept", data)
    .then(res => callback(res))
    .catch(err =>  {errcallback(err); console.log(err)})
}


