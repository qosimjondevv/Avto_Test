window.addEventListener("DOMContentLoaded", () => {
  let timeSpan = document.querySelector(".time");
  const question = document.querySelector(".question");
  const questionBox = document.querySelector(".question_box");

  const modal = document.querySelector(".modal");
  let restartBtn = document.querySelector(".restart_btn");
  const homeBtn = document.querySelector(".home_btn");

  let correctSpan = document.querySelector(".check .correct");
  let wrongSpan = document.querySelector(".check .wrong");

  let selectedQuest = [];
  let countindex = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let timer;
  let secunds;

  function loadQuest() {
    fetch("../data/data.json")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("allData", JSON.stringify(data));

        const category = localStorage.getItem("selectedCategory");
        let count = category === "easy" ? 20 : category === "medium" ? 40 : 60;

        let shuffled = shuffleArray(data);
        selectedQuest = shuffled.slice(0, count);

        countindex = 0;
        correctCount = 0;
        wrongCount = 0;
        correctSpan.textContent = "To'g'ri: 0";
        wrongSpan.textContent = "Nato'g'ri: 0";

        showQuest();
        startTimer();
      });
  }

  function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function showQuest() {
    if (!question) return;
    questionBox.innerHTML = "";

    if (countindex >= selectedQuest.length) {
      finishTest();
      return;
    }

    const q = selectedQuest[countindex];
    question.textContent = `${countindex + 1}. ${q.question}`;

    let allData = JSON.parse(localStorage.getItem("allData"));
    let wrongOptions = allData
      .filter((quest) => quest.id !== q.id)
      .map((item) => item.answer);

    wrongOptions = shuffleArray(wrongOptions);

    const category = localStorage.getItem("selectedCategory");
    let optionCount =
      category === "easy" ? 19 : category === "medium" ? 39 : 59;

    wrongOptions = wrongOptions.slice(0, optionCount);

    let options = [...wrongOptions, q.answer];

    options = shuffleArray(options);

    options.forEach((opt) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("question_item");

      const qImg = document.createElement("img");
      qImg.src = opt;
      qImg.alt = q.question;

      qImg.addEventListener("click", () => {
        if (opt === q.answer) {
          correctCount++;
          correctSpan.textContent = `To'g'ri: ${correctCount}`;
          countindex++;
          showQuest();
        } else {
          wrongCount++;
          wrongSpan.textContent = `Nato'g'ri: ${wrongCount}`;
          qImg.style.opacity = "0.3";
          qImg.style.pointerEvents = "none";

          checkLimit();
        }
        if (correctCount + wrongCount >= selectedQuest.length) {
          finishTest();
          // return;
        }

        // countindex++;
        // showQuest();
      });

      wrapper.appendChild(qImg);
      questionBox.appendChild(wrapper);
    });
  }

  function checkLimit() {
    const category = localStorage.getItem("selectedCategory");
    let limit = category === "easy" ? 5 : category === "medium" ? 8 : 12;

    if (wrongCount >= limit) {
      alert("Siz o‘ta olmadingiz");
      restartTest();
    }
  }

  function startTimer() {
    clearInterval(timer);
    let minuts = parseInt(localStorage.getItem("selectedTime"));
    secunds = minuts * 60;

    function updateTimer() {
      const min = Math.floor(secunds / 60);
      let sec = secunds % 60;
      timeSpan.textContent = `${min}:${sec.toString().padStart(2, 0)}`;

      if (secunds <= 0) {
        clearInterval(timer);
        finishTest();
        return;
      }
      secunds--;
    }

    timer = setInterval(updateTimer, 1000);
    updateTimer();
  }

  function finishTest() {
    modal.style.display = "flex";
    const correctResult = modal.querySelector(".correct_result");
    const wrongResult = modal.querySelector(".wrong_result");

    correctResult.textContent = `To'g'ri: ${correctCount}`;
    wrongResult.textContent = `Noto'g'ri: ${wrongCount}`;
    clearInterval(timer);
  }

  function restartTest() {
    modal.style.display = "none";
    loadQuest();
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      modal.style.display = "none";
      restartTest();
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  loadQuest();
});
