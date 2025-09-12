// //////////////////////////////  ccategory
document.querySelectorAll(".category button").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedCategory = btn.classList.contains("easy_btn")
      ? "easy"
      : btn.classList.contains("medium_btn")
      ? "medium"
      : "high";
    console.log("category", selectedCategory);
  });
});
// ////////////////////////////////// minutt
let selectedTime = null;
let selectedCategory = null;

document.querySelectorAll(".minuts a").forEach((sec) => {
  sec.addEventListener("click", (ev) => {
    ev.preventDefault();

    if (sec.classList.contains("fifteen_minut")) selectedTime = 15;
    if (sec.classList.contains("ten_minut")) selectedTime = 10;
    if (sec.classList.contains("five_minut")) selectedTime = 5;

    console.log("time", selectedTime);
  });
});
// //////////////////////// startr

document.querySelector(".start_btn").addEventListener("click", () => {
  if (!selectedCategory || !selectedTime) {
    alert("iltimos vaqt va categoryni tanlang!");
    return;
  }
  localStorage.setItem("selectedCategory", selectedCategory);
  localStorage.setItem("selectedTime", selectedTime);
  window.location.href = "./pages/test.html";
});
