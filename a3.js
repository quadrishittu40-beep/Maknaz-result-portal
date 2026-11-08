function loadStudentOptions(){
$("resultStudent").innerHTML = `<option value="">Select Student</option>` +
allStudents.map(s =>
`<option value="${escapeHTML(s.id)}">${escapeHTML(s.id)} \u2014 ${escapeHTML(s.name)}</option>`
).join("");
}
$("studentForm").addEventListener("submit", async function(e){
e.preventDefault();
try{
const data = await api("POST","/api/students",{
name: $("studentName").value.trim(),
dateOfBirth: $("dob").value,
gender: $("gender").value,
className: $("className").value.trim(),
session: $("session").value.trim(),
guardian: $("guardian").value.trim(),
phone: $("phone").value.trim(),
password: $("studentPassword").value
});
msg("registerMsg", "Student registered successfully. Student ID: " + data.student.id);
e.target.reset();
await refreshStaff();
}catch(err){
msg("registerMsg", err.message || "Could not register student.", true);
}
});
$("resultForm").addEventListener("submit", async function(e){
e.preventDefault();
try{
const totalQuestions = Number($("totalQuestions").value);
const correctAnswers = Number($("correctAnswers").value);
let score = Number($("score").value);
if(totalQuestions > 0 && correctAnswers >= 0 && correctAnswers <= totalQuestions){
score = Math.round((correctAnswers / totalQuestions) * 100);
}
await api("POST","/api/results",{
studentId: $("resultStudent").value,
session: $("resultSession").value.trim(),
term: $("term").value,
className: $("resultClass").value.trim(),
subject: $("subject").value.trim(),
examination: $("examination").value.trim(),
totalQuestions, correctAnswers, score,
grade: $("grade").value
});
msg("resultMsg", "Result saved successfully.");
e.target.reset();
await refreshStaff();
}catch(err){
msg("resultMsg", err.message || "Could not save result.", true);
}
});
