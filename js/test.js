window.addEventListener("DOMContentLoaded", () => {
  let timeSpan = document.querySelector(".time");
  const question = document.querySelector(".question");
  const questBox = document.querySelector(".question_box");

  const modal = document.querySelector(".modal");
  let restartBtn = document.querySelector(".restart_btn");
  const homeBtn = document.querySelector(".home_btn");

  let correctSpan = document.querySelector(".check .correct");
  let wrongSpan = document.querySelector(".check .wrong");

  let selectQuest = [];
  let countindex = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let totalAnswers = 0;
  let timer;
  let secunds;
  let currentQuest = 0;
  let remainingQuest = 0;
  function loadQuest() {
    fetch("../data/data.json")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("alData", JSON.stringify(data));

        const category = localStorage.getItem("selectedCategory");
        let count = category === "easy" ? 20 : category === "medium" ? 40 : 60;

        let shuffled = shuffleArray(data);
        selectQuest = shuffled.slice(0, count);

        countindex = 0;
        correctCount = 0;
        wrongCount = 0;
        totalAnswers = 0;
        currentQuest = 0;
        remainingQuest = count;
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

    if (remainingQuest <= 0) {
      finishTest();
      return;
    }

    const q = selectQuest[countindex];
    question.textContent = `${countindex + 1}. ${q.question}`;

    questBox.innerHTML = "";

    let alData = JSON.parse(localStorage.getItem("alData"));
    let wrongOptions = alData
      .filter((quest) => quest.id !== q.id)
      .map((item) => item.answer);

    wrongOptions = shuffleArray(wrongOptions);

    let optionCount = remainingQuest - 1;

    wrongOptions = wrongOptions.slice(0, optionCount);

    let currentOptions = [...wrongOptions, q.answer];
    currentOptions = shuffleArray(currentOptions);

    currentQuest = 0;

    currentOptions.forEach((opt, index) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("question_item");
      wrapper.setAttribute("data-answer", opt);
      wrapper.setAttribute("data-index", index);

      const qImg = document.createElement("img");
      qImg.src = opt;
      qImg.alt = q.question;

      qImg.addEventListener("click", () => {
        document.querySelectorAll(".question_item img").forEach((img) => {
          img.style.pointerEvents = "none";
        });

        const currentQuestion = selectQuest[countindex];
        const correctAnswer = currentQuestion.answer;

        if (opt === correctAnswer) {
          correctCount++;
          totalAnswers++;
          remainingQuest--;
          correctSpan.textContent = `To'g'ri: ${correctCount}`;
          qImg.style.border = "3px solid green";
          qImg.style.opacity = "1";

          if (totalAnswers >= selectQuest.length) {
            setTimeout(finishTest, 500);
            return;
          }

          if (remainingQuest <= 0) {
            setTimeout(() => {
              finishTest();
            }, 500);
            return;
          }

          setTimeout(() => {
            countindex++;
            showQuest();
          }, 500);
        } else {
          if (qImg.dataset.clicked === "true") return; //
          // qImg.dataset.clicked = "true"; //
          currentQuest++;
          wrongCount++;
          totalAnswers++;
          remainingQuest--;
          wrongSpan.textContent = `Nato'g'ri: ${wrongCount}`;
          qImg.style.border = "3px solid red";
          qImg.style.opacity = "0.7";

          document.querySelectorAll(".question_item img").forEach((img) => {
            if (img.src === correctAnswer) {
              img.style.border = "3px solid green";
              img.style.opacity = "1";
            }
          });

          if (totalAnswers >= selectQuest.length) {
            setTimeout(() => {
              finishTest();
            }, 500);
            return;
          }
          if (remainingQuest <= 0) {
            setTimeout(() => {
              finishTest();
            }, 500);
            return;
          }

          checkLimit();

          setTimeout(() => {
            document.querySelectorAll(".question_item img").forEach((img) => {
              img.style.pointerEvents = "auto";
            });
          }, 500);
        }
      });

      wrapper.appendChild(qImg);
      questBox.appendChild(wrapper);
    });
  }

  function checkLimit() {
    const category = localStorage.getItem("selectedCategory");
    let limit = category === "easy" ? 5 : category === "medium" ? 8 : 12;

    if (wrongCount >= limit) {
      alert(`Siz ${limit} ta xato qildingiz. Test tugadi!`);
      finishTest();
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
