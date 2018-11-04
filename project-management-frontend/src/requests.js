const BASE_URL = "https://2uk4b5ib89.execute-api.us-east-1.amazonaws.com/dev/";

let getHeaders = token => ({
  headers: { Authorization: token }
});

export let getProjects = token =>
  fetch(`${BASE_URL}projects`, {
    ...getHeaders(token)
  }).then(res => res.json());

export let updateProject = (token, newProject) =>
  fetch(`${BASE_URL}projects/`, {
    method: "PUT",
    body: JSON.stringify(newProject),
    ...getHeaders(token)
  }).then(res => res.json());

export let createProject = (token, newProject) =>
  fetch(`${BASE_URL}projects`, {
    method: "POST",
    body: JSON.stringify(newProject),
    ...getHeaders(token)
  }).then(res => res.json());

export let deleteProject = (token, id) =>
  fetch(`${BASE_URL}projects/${id}`, {
    method: "DELETE",
    ...getHeaders(token)
  }).then(res => res.json());

export let getUser = (token, username) =>
  fetch(`${BASE_URL}users/${username}`, {
    ...getHeaders(token)
  }).then(res => res.json());

export let updateRole = (token, username, oldRole, newRole) =>
  fetch(`${BASE_URL}users/${username}`, {
    method: "PUT",
    ...getHeaders(token),
    body: JSON.stringify({
      oldRole,
      newRole
    })
  }).then(res => res.json());

export let getUsers = token =>
  fetch(`${BASE_URL}users`, {
    method: "GET",
    ...getHeaders(token)
  }).then(res => res.json());

export let deleteUser = (token, username) =>
  fetch(`${BASE_URL}users/${username}`, {
    method: "DELETE",
    ...getHeaders(token)
  }).then(res => res.json());

export let getSkills = (token, username) =>
  fetch(`${BASE_URL}profile/${username}`, {
    method: "GET",
    ...getHeaders(token)
  }).then(res => res.json());

export let updateProfile = (token, username, skills, birthdate) =>
  fetch(`${BASE_URL}profile/${username}`, {
    method: "PUT",
    ...getHeaders(token),
    body: JSON.stringify({ skills, birthdate })
  }).then(res => res.json());
