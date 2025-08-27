document.addEventListener("input", function (e) {
  if (e.target.tagName.toLowerCase() === "textarea") {
    e.target.style.height = "auto"; // reseta
    e.target.style.height = e.target.scrollHeight + "px"; // ajusta
  }
});
