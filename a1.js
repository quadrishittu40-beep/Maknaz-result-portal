let loginType = "";
let token = "";
let currentStudent = null;
let allStudents = [];
let allResults = [];
let studentCurrent = [];
let studentAll = [];
const $ = id => document.getElementById(id);
async function api(method, url, body){
const res = await fetch((window.API_BASE || "") + url, {
method,
headers: {
"Content-Type": "application/json",
...(token ? { Authorization: "Bearer " + token } : {})
},
body: body ? JSON.stringify(body) : undefined
});
let data = {};
try { data = await res.json(); } catch(e){}
if(!res.ok) throw new Error(data.message || "Request failed (" + res.status + ")");
return data;
}
function msg(id, text, error = false){
const el = $(id);
if(!el) return;
el.textContent = text;
el.classList.remove("hidden","error","successmsg");
el.classList.add(error ? "error" : "successmsg");
}
function escapeHTML(v){
return String(v ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;")
.replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}
window.showLogin = function(type){
loginType = type;
$("landing").classList.add("hidden");
$("loginPage").classList.remove("hidden");
$("loginTitle").textContent = type === "staff" ? "STAFF / TEACHER LOGIN" : "STUDENT LOGIN";
$("loginSubtitle").textContent = type === "staff"
? "Authorized academy staff only" : "Use your Student ID and password";
$("staffEmailBox").classList.toggle("hidden", type !== "staff");
$("studentIdBox").classList.toggle("hidden", type !== "student");
$("loginEmail").required = type === "staff";
$("loginStudentId").required = type === "student";
};
window.backHome = function(){
$("loginPage").classList.add("hidden");
$("landing").classList.remove("hidden");
$("loginForm").reset();
$("loginMessage").classList.add("hidden");
};
$("loginForm").addEventListener("submit", async function(e){
e.preventDefault();
$("loginMessage").classList.add("hidden");
try{
if(loginType === "staff"){
const data = await api("POST","/api/login/staff",{
email: $("loginEmail").value.trim(),
password: $("loginPassword").value
});
token = data.token;
$("loginPage").classList.add("hidden");
$("staffPortal").classList.remove("hidden");
$("staffName").textContent = data.name;
await refreshStaff();
} else {
const data = await api("POST","/api/login/student",{
studentId: $("loginStudentId").value.trim().toUpperCase(),
password: $("loginPassword").value
});
token = data.token;
currentStudent = data.student;
$("loginPage").classList.add("hidden");
$("studentPortal").classList.remove("hidden");
await loadStudentPortal();
}
}catch(err){
console.error(err);
msg("loginMessage", err.message || "Login failed.", true);
}
});
