let settings = JSON.parse(localStorage.getItem("nv-settings")) || {
  autoClear: true,
  confirmDelete: false,
  theme: "neon"
};

document.getElementById("autoClear").checked = settings.autoClear;
document.getElementById("confirmDelete").checked = settings.confirmDelete;
document.getElementById("themeSelect").value = settings.theme;

document.getElementById("autoClear").onchange = (e) => {
  settings.autoClear = e.target.checked;
  save();
};

document.getElementById("confirmDelete").onchange = (e) => {
  settings.confirmDelete = e.target.checked;
  save();
};

document.getElementById("themeSelect").onchange = (e) => {
  settings.theme = e.target.value;
  save();
};

document.getElementById("closeSettings").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

function save() {
  localStorage.setItem("nv-settings", JSON.stringify(settings));
}
