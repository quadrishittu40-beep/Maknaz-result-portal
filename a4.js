function renderRecords(){
const term = ($("recordSearch").value || "").toLowerCase();
const list = allResults.filter(r => Object.values(r).join(" ").toLowerCase().includes(term));
$("recordsTable").innerHTML = list.length ? list.map(r => `
<tr>
<td>${escapeHTML(r.studentName)}</td>
<td>${escapeHTML(r.studentId)}</td>
<td>${escapeHTML(r.session)}</td>
<td>${escapeHTML(r.term)}</td>
<td>${escapeHTML(r.className)}</td>
<td>${escapeHTML(r.subject)}</td>
<td>${escapeHTML(r.score)}%</td>
<td>${escapeHTML(r.grade)}</td>
</tr>`).join("") :
`<tr><td colspan="8">No result records found.</td></tr>`;
}
$("recordSearch").addEventListener("input", renderRecords);
function resetSession(){
token = "";
currentStudent = null;
allStudents = [];
allResults = [];
}
window.staffLogout = function(){
resetSession();
$("staffPortal").classList.add("hidden");
backHome();
};
window.studentLogout = function(){
resetSession();
$("studentPortal").classList.add("hidden");
backHome();
};
window.studentSection = function(id){
document.querySelectorAll("#studentPortal .section").forEach(x => x.classList.remove("active"));
$(id).classList.add("active");
};
async function loadStudentPortal(){
const data = await api("GET","/api/me");
currentStudent = data.student;
const results = data.results.slice().sort((a,b) => new Date(b.date || 0) - new Date(a.date || 0));
$("welcomeStudent").textContent = `Welcome, ${currentStudent.name}`;
$("studentBasic").textContent =
`${currentStudent.id} \u2022 ${currentStudent.className} \u2022 ${currentStudent.session}`;
const rows = list => !list.length
? `<div class="message">No results available.</div>`
: `<table><thead><tr>
<th>Session</th><th>Term</th><th>Subject</th>
<th>Examination</th><th>Score</th><th>Grade</th>
</tr></thead><tbody>` +
list.map(x => `<tr>
<td>${escapeHTML(x.session)}</td><td>${escapeHTML(x.term)}</td>
<td>${escapeHTML(x.subject)}</td><td>${escapeHTML(x.examination)}</td>
<td>${escapeHTML(x.score)}%</td><td>${escapeHTML(x.grade)}</td>
</tr>`).join("") + `</tbody></table>`;
let current = [];
for(const term of ["Third Term","Second Term","First Term"]){
const matching = results.filter(r =>
r.session === currentStudent.session && r.term === term);
if(matching.length){ current = matching; break; }
}
const currentIds = new Set(current.map(r => r.id));
const previous = results.filter(r => !currentIds.has(r.id));
studentCurrent = current;
studentAll = results;
$("currentResult").innerHTML = rows(current);
$("previousResult").innerHTML = rows(previous);
$("entireResult").innerHTML = rows(results);
}
