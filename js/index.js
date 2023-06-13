// control active navbar
const allLinksNav = document.querySelectorAll("nav ul li a");
const textarea = document.querySelector("#input-text");
let countCharchtars = document.querySelector(".count-char");
const generateBtn = document.querySelector(".generate");
const cancelBtn = document.querySelector(".cancel");
const mcqQuestionsDiv = document.getElementById("mcq-questions");
const spinner = document.querySelector(".sk-fading-circle");
const spinnerOverlay = document.querySelector(".overlay");
const errorMessage = document.querySelector(".error-message");
const menue = document.querySelector(".menue .bar");
const menueClose = document.querySelector(".menue .close");
const menueOptions = document.querySelector(".pages");
const switchNav = document.querySelector(".switch");

const scrollBottom=document.querySelector(".scroll");
document.querySelector(".logo").addEventListener("click", () => {
  window.location.href = "../index.html";
});
// Add click event listeners to the navbar links
allLinksNav.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove active class from all navbar links
    allLinksNav.forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to the clicked navbar link
    link.classList.add("active");
  });
});

// toggle menue
menue.addEventListener("click", () => {
  menueOptions.style.display = "flex";
  menue.style.display = "none";
  menueClose.style.display = "flex";
});
menueClose.addEventListener("click", () => {
  menueOptions.style.display = "none";
  menue.style.display = "flex";
  menueClose.style.display = "none";
});

// msg error
function displayErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";

  setTimeout(() => {
    errorMessage.style.opacity = "0";
    setTimeout(() => {
      errorMessage.style.display = "none";
      errorMessage.style.opacity = "1";
    }, 300);
  }, 2000);
}



function storeMCQData(data) {
  localStorage.setItem("mcqData", JSON.stringify(data));
  console.log(localStorage.getItem("mcqData"));
}
function generateMCQsAndRedirect(text) {
  if (!text) {
    displayErrorMessage("Please enter valid input!");
    return;
  }
  spinner.style.display = "block";
  spinnerOverlay.style.display = "block";

  const apiUrl = "http://164.92.191.184:5000/generate-mcq";
  const textData = text;
  const requestData = {
    text: textData,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Save the data in local storage
      storeMCQData(data);

      // Redirect to the results page
      console.log(switchNav.textContent);

      window.location.href = "results.html";
    })
    .catch((error) => {
      console.error("Error fetching MCQ data:", error);
      displayErrorMessage("Failed to fetch MCQ data");
    })
    .finally(() => {
      spinner.style.display = "none";
      spinnerOverlay.style.display = "none";
    });
}


function retrieveMCQData() {
  const mcqData = JSON.parse(localStorage.getItem("mcqData"));

  if (mcqData) {
    displayMCQs(mcqData);
  } else {
    console.error("No MCQ data found in local storage.");
  }
}

function displayMCQs(data) {
  const questions = data;
  let i = 1;
  const mcqQuestionsDiv = document.getElementById("mcq-questions");

  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionStatement = document.createElement("p");
    questionStatement.textContent = `Q${i++}: ${question.question_statement}`;
    questionDiv.appendChild(questionStatement);

    const choicesList = document.createElement("ul");
    choicesList.classList.add("choices");
    question.choices.forEach((choice, choiceIndex) => {
      const choiceItem = document.createElement("li");
      const choiceLabel = String.fromCharCode(97 + choiceIndex); // 'a', 'b', 'c', 'd'
      choiceItem.textContent = choiceLabel + ") " + choice;
      choicesList.appendChild(choiceItem);
    });
    questionDiv.appendChild(choicesList);

    const correctAnswer = document.createElement("p");
    correctAnswer.classList.add("correct-answer");
    correctAnswer.textContent =
      "Correct Answer: " + JSON.stringify(question.correct_answer);
    questionDiv.appendChild(correctAnswer);

    mcqQuestionsDiv.appendChild(questionDiv);
  });
  console.log("end display");
}

// download pdf
// ("Machine learning is a branch of artificial intelligence (AI) and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy.IBM has a rich history with machine learning. One of its own, Arthur Samuel, is credited for coining the term, “machine learning” with his research");
function generatePDF() {
  const element = document.body; // Replace this with the desired element containing your content

  // Exclude the navigation content
  const navigationElement = document.querySelector("nav"); // Replace "navigation" with the ID of your navigation element
  const downloadBtn = document.querySelector("#download-btn");
  if (navigationElement || downloadBtn) {
    navigationElement.style.display = "none";
    downloadBtn.style.display = "none";
  }

  // Generate the PDF content
  const pdfContent = [
    {
      text: element.innerText,
      fontSize: 12,
      margin: [0, 0, 0, 10],
    },
  ];

  // Create the PDF document
  const documentDefinition = {
    content: pdfContent,
  };

  // Generate the PDF and initiate the download
  pdfMake.createPdf(documentDefinition).download("mcq.pdf");

  // Restore the display of the navigation element
  if (navigationElement || downloadBtn) {
    navigationElement.style.display = "flex";
    downloadBtn.style.display = "block";
  }
}



 // scroling

window.onscroll=function(){
   // console.log(this.scrollY)

   this.scrollY>=200?scrollBottom.style.display="none": scrollBottom.style.display="block";
}
scrollBottom.onclick=function(){
  console.log('ok');
  window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
}
