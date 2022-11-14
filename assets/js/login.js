import userListSocket from "./userList.js";
console.log(userListSocket);
let loginSocket = null; 
document.addEventListener("DOMContentLoaded", function() {
    loginSocket = new WebSocket("ws://localhost:8080/loginWs/");
    console.log("JS attempt to connect to login");
    loginSocket.onopen = () => console.log("login connected");
    loginSocket.onclose = () => console.log("Bye login");
    loginSocket.onerror = (err) => console.log("login ws Error!");
    loginSocket.onmessage = (msg) => {
        const resp = JSON.parse(msg.data);
        console.log({resp});
        if (resp.label === "greet") {
            console.log(resp.content);
        } else if (resp.label === "login") {
            console.log("uid: ",resp.cookie.uid, "sid: ", resp.cookie.sid, "age: ", resp.cookie.max_age);
            document.cookie = `session=${resp.cookie.sid}; max-age=${resp.cookie.max_age}`;

            // update user list after a user login
            if (resp.pass) {
                let uListPayload = {};
                uListPayload["label"] = "update";
                uListPayload["cookie_value"] = resp.cookie.sid;
                console.log("login UL sending: ", uListPayload);
                userListSocket.send(JSON.stringify(uListPayload));
            }
            
        }
    }
});

const loginHandler = function(e) {
    e.preventDefault();
    const formFields = new FormData(e.target);
    const payloadObj = Object.fromEntries(formFields.entries());
    payloadObj["label"] = "login";
    console.log({payloadObj});
    loginSocket.send(JSON.stringify(payloadObj));
};


const loginForm = document.createElement("form");
loginForm.addEventListener("submit", loginHandler);

// login form
// name label
const nameLabelDiv = document.createElement('div');
const nameLabel = document.createElement('label');
nameLabel.textContent = "Please Enter Your Nickname or Email:";
nameLabel.setAttribute("for", "name");
nameLabelDiv.append(nameLabel);
// name input
const nameInputDiv = document.createElement('div');
const nameInput = document.createElement('input');
nameInput.setAttribute("type", "text");
nameInput.setAttribute("name", "name");
nameInput.setAttribute("id", "name");
nameInput.setAttribute("placeholder", "eg: Nick or abc@def.com")
nameInputDiv.append(nameInput);

// pw label
const pwLabelDiv = document.createElement('div');
const pwLabel = document.createElement('label');
pwLabel.textContent = "Please Enter Your Password:";
pwLabel.setAttribute("for", "pw");
pwLabelDiv.append(pwLabel);
// password input
const pwInputDiv = document.createElement('div');
const pwInput = document.createElement('input');
pwInput.setAttribute("type", "password");
pwInput.setAttribute("name", "pw");
pwInput.setAttribute("id", "pw");
pwInputDiv.append(pwInput);

const loginSubmitDiv = document.createElement('div');
const loginSubmit = document.createElement("button");
loginSubmit.textContent = "Login";
loginSubmit.setAttribute("type", "submit");
loginSubmitDiv.append(loginSubmit);

loginForm.append(nameLabelDiv, nameInputDiv, pwLabelDiv, pwInputDiv, loginSubmitDiv);

export default loginForm;