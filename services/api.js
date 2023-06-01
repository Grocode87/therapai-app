import axios from "axios";
import { therapists } from "../utils/constants";
import { decryptString, encryptString } from "./encrypt";

const apiUrl = "https://whale-app-bd76v.ondigitalocean.app";
//const apiUrl: String = "https://hh-mock-api.herokuapp.com"

export async function getUserData(token, uid) {
  console.log("getUserData called");

  return axios({
    method: "get",
    url: apiUrl + "/user/" + uid,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteUser(token, uid) {
  return axios({
    method: "delete",
    url: apiUrl + "/user/" + uid,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getUserHistory(token, uid) {
  return axios({
    method: "get",
    url: apiUrl + "/user/" + uid + "/history",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function updateUserData(token, uid, data) {
  /**
   * Update user data in the backend
   */
  return axios({
    method: "put",
    url: apiUrl + "/user/" + uid,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    data: data,
  }).then((response) => {
    return response.data;
  });
}

export async function getAIResponse(messages, userData, timeZone) {
  // decrypt user context
  const user_context = await decryptString(userData.context.content || "");

  console.log("user context:", user_context);
  console.log(user_context);
  const therapist = therapists.find(
    (therapist) => therapist.name === userData.therapist
  );
  const therapist_details = {
    name: therapist.name,
    description: therapist.tagline + ": " + therapist.description,
  };

  return axios({
    method: "post",
    url: apiUrl + "/query_ai",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      chat_history: messages,
      user_context: user_context,
      user_name: userData.first_name + " " + userData.last_name,
      user_timezone: timeZone,
      session_number: userData.sessions?.length || 1,
      therapist_details: therapist_details,
    },
  }).then((response) => response.data.message);
}

export async function createSession(token, uid, therapist) {
  /**
   * Create a new session for the user, and return the response object
   *
   * @param {String} token - The user's JWT token
   * @param {String} uid - The user's id
   * @returns {Object} - The response object, contains session_id
   */

  return axios({
    method: "post",
    url: apiUrl + "/user/" + uid + "/session",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    data: {
      therapist: therapist,
    },
  }).then((response) => response.data);
}

export async function getSession(token, uid, session_id) {
  /**
   * Get the session data for the user
   * @param {String} token - The user's JWT token
   * @param {String} uid - The user's id
   * @param {String} session_id - The session id
   * @returns {Object} - The response object, contains session data
   */

  return axios({
    method: "get",
    url: apiUrl + "/user/" + uid + "/session/" + session_id,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  }).then((response) => response);
}

export async function updateSession(token, uid, session_id, session_data) {
  /**
   * Update the session data for the user
   * @param {String} token - The user's JWT token
   * @param {String} uid - The user's id
   * @param {String} session_id - The session id
   * @param {Array} chat_log - The chat log
   * @returns {Object} - The response object, contains session data
   */

  return axios({
    method: "put",
    url: apiUrl + "/user/" + uid + "/session/" + session_id,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    data: session_data,
  }).then((response) => response);
}

export async function endSession(user, userData) {
  // end the session by updating it and setting the end date to the last message's timestamp
  console.log("ending session");
  const last_message =
    userData.active_session.chat_log[
      userData.active_session.chat_log.length - 1
    ];

  const end_date =
    last_message?.timestamp || userData.active_session.start_time;

  const session_data = {
    end_date: end_date,
    chat_log: userData.active_session.chat_log,
  };

  const response = await updateSession(
    token,
    user.uid,
    userData.active_session.id,
    session_data
  );
  return response.data;
}

export async function processSession(user, userData, sessionData) {
  /**
   * Process the session data for the user
   * @param {Object} user - The user object
   * @param {Object} userData - The user data object
   * @param {Object} sessionData - The session data object
   *
   * @returns {Object} - The response object, contains session data
   *
   * @description
   * This function is triggered when an ended session is found with processed = false
   * Generates a new context based on the old context and chat log
   * And then sets the session to processed = true
   *
   */

  const token = await user.getIdToken();

  const decrypted_context = await decryptString(userData.context.content || "");
  const new_context = await axios({
    method: "post",
    url: apiUrl + "/ai/generate_context",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    data: {
      context: decrypted_context,
      chat_log: sessionData.chat_log,
    },
  }).then((response) => response.data.new_context);

  // encrypt the new context, and then upload it to the database
  const encrypted_context = await encryptString(new_context);

  await updateUserData(token, user.uid, {
    context: { content: encrypted_context },
  });

  // once this is done, set the session to processed = true
  await updateSession(token, user.uid, sessionData.id, { processed: true });
}
