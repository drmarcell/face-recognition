const BASE_URL = 'https://face-recognition-1ziy.onrender.com/v1/user/';

export const callUserApi = (relativeUrl, method, bodyObj) =>
  fetch(BASE_URL + relativeUrl, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        bodyObj
      )
    })
      .then(response => response.json())
      .then(data => data);

export const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user'));
}
