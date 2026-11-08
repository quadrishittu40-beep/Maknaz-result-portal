const ASSET_BASE = window.API_BASE || "";
async function loadAsset(url){
const res = await fetch(url);
if(!res.ok) throw new Error("Could not load " + url);
return new Uint8Array(await res.arrayBuffer());
}
async function makePdf(student, results, label){
if(!student) throw new Error("Student not found.");
if(!results.length) throw new Error("There are no results to download yet.");
if(!window.ResultPdf) throw new Error("PDF tools did not load. Reload the page and try again.");
const files = await Promise.all([loadAsset(ASSET_BASE + "/icon-144.png"), loadAsset(ASSET_BASE + "/signature.png")]);
const bytes = ResultPdf.build({ student, results, logo: files[0], signature: files[1], date: new Date() });
const blob = new Blob([bytes], { type: "application/pdf" });
const clean = String(student.name || "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "Result-" + student.id + (clean ? "-" + clean : "") + "-" + label + ".pdf";
document.body.appendChild(a);
a.click();
setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 4000);
}
window.downloadMyPdf = async function(scope){
try{
const list = scope === "current" ? studentCurrent : studentAll;
if(!list.length) throw new Error("There are no results to download yet.");
await makePdf(currentStudent, list, scope === "current" ? "Current-Term" : "All");
}catch(err){ alert(err.message); }
};
