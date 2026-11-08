async function refreshStaff(){
allStudents = await api("GET","/api/students");
allResults = await api("GET","/api/results");
$("totalStudents").textContent = allStudents.length;
$("totalResults").textContent = allResults.length;
$("activeStudents").textContent = allStudents.filter(x => x.status === "Active").length;
$("graduatedStudents").textContent = allStudents.filter(x => x.status === "Graduated").length;
renderStudents();
renderRecords();
loadStudentOptions();
}
window.staffSection = function(id){
document.querySelectorAll("#staffPortal .section").forEach(x => x.classList.remove("active"));
$(id).classList.add("active");
if(id === "students") renderStudents();
if(id === "records") renderRecords();
if(id === "addResult") loadStudentOptions();
};
function renderStudents(){
const term = ($("studentSearch").value || "").toLowerCase();
const list = allStudents.filter(s =>
(s.name || "").toLowerCase().includes(term) ||
(s.id || "").toLowerCase().includes(term));
$("studentTable").innerHTML = list.length ? list.map(s => `
<tr>
<td>${escapeHTML(s.id)}</td>
<td>${escapeHTML(s.name)}</td>
<td>${escapeHTML(s.className)}</td>
<td>${escapeHTML(s.session)}</td>
<td>${escapeHTML(s.status || "Active")}</td>
<td>
<button class="secondary" data-view="${escapeHTML(s.id)}">View</button>
<button class="secondary" data-pdf="${escapeHTML(s.id)}">PDF</button>
<button class="secondary" data-promote="${escapeHTML(s.id)}">Promote</button>
${s.status === "Graduated" ? "" :
`<button class="secondary" data-graduate="${escapeHTML(s.id)}">Graduate</button>`}
</td>
</tr>`).join("") :
`<tr><td colspan="6">No students found.</td></tr>`;
}
$("studentSearch").addEventListener("input", renderStudents);
$("studentTable").addEventListener("click", async function(e){
const b = e.target.closest("button");
if(!b) return;
try{
if(b.dataset.view){
const s = allStudents.find(x => x.id === b.dataset.view);
if(s) alert(
"Student ID: " + s.id + "\nName: " + s.name +
"\nClass: " + s.className + "\nSession: " + s.session +
"\nStatus: " + (s.status || "Active") +
"\nGuardian: " + (s.guardian || "") + "\nPhone: " + (s.phone || ""));
} else if(b.dataset.pdf){
const s = allStudents.find(x => x.id === b.dataset.pdf);
await makePdf(s, allResults.filter(r => r.studentId === s.id), "All");
} else if(b.dataset.promote){
const s = allStudents.find(x => x.id === b.dataset.promote);
const className = prompt("New class:", s.className);
if(!className) return;
const session = prompt("New session:", s.session);
if(!session) return;
await api("PUT","/api/students/" + encodeURIComponent(s.id) + "/promote",{ className, session });
await refreshStaff();
} else if(b.dataset.graduate){
if(!confirm("Mark this student as graduated?")) return;
await api("PUT","/api/students/" + encodeURIComponent(b.dataset.graduate) + "/graduate");
await refreshStaff();
}
}catch(err){ alert(err.message); }
});
