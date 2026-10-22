// Interacciones del reproductor, el cuestionario y elementos globales.
document.addEventListener("DOMContentLoaded", () => {
  const currentYear = document.getElementById("currentYear");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  const localVideo = document.getElementById("localVideo");
  const videoMessage = document.getElementById("videoMessage");

  document.querySelectorAll("#mainNavigation .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const navigation = document.getElementById("mainNavigation");
      if (navigation.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navigation).hide();
      }
    });
  });

  localVideo.addEventListener("error", () => {
    if (!localVideo.currentSrc) return;
    videoMessage.textContent = "No se pudo reproducir el video. Comprueba que el archivo esté disponible y use un códec compatible con tu navegador.";
  });

  // Preguntas y explicaciones visibles solo después de finalizar.
  const questions = [
    {
      question: "¿Qué caracteriza principalmente a una arquitectura de microservicios?",
      answers: ["Una aplicación dividida en servicios pequeños y autónomos", "Un único proceso que contiene toda la lógica", "Una base de datos compartida obligatoriamente por todos", "Una aplicación que no utiliza redes"],
      correct: 0,
      explanation: "Cada microservicio implementa una capacidad concreta y puede evolucionar o desplegarse de forma independiente."
    },
    {
      question: "¿Cuál es una diferencia habitual entre un monolito y microservicios?",
      answers: ["El monolito siempre es más lento", "El monolito se publica como una unidad; los servicios pueden publicarse por separado", "Los microservicios no tienen lógica de negocio", "Un monolito no puede usar una API"],
      correct: 1,
      explanation: "En un monolito, los componentes suelen construirse y desplegarse como una unidad; los microservicios permiten despliegues independientes."
    },
    {
      question: "¿Cómo suelen comunicarse servicios de una arquitectura distribuida?",
      answers: ["Solo mediante archivos impresos", "A través de contratos como API y protocolos de mensajería", "Compartiendo siempre las mismas variables en memoria", "Sin intercambiar información"],
      correct: 1,
      explanation: "Las API y los mensajes permiten intercambiar información mediante contratos explícitos."
    },
    {
      question: "¿Cuál es una función común de un API Gateway?",
      answers: ["Reemplazar todas las bases de datos", "Servir como punto de entrada y dirigir solicitudes a los servicios", "Garantizar que nunca ocurran fallos", "Escribir el código de cada microservicio"],
      correct: 1,
      explanation: "El gateway puede centralizar la entrada, enrutar peticiones y aplicar políticas comunes."
    },
    {
      question: "¿Qué significa que un servicio sea independiente?",
      answers: ["Que no debe comunicarse con ningún otro servicio", "Que puede cambiar o desplegarse con pocas dependencias directas del resto", "Que no necesita mantenimiento", "Que todos deben estar escritos en el mismo lenguaje"],
      correct: 1,
      explanation: "La autonomía reduce el acoplamiento, aunque los servicios todavía pueden colaborar mediante contratos."
    },
    {
      question: "¿Qué permite la escalabilidad independiente?",
      answers: ["Aumentar recursos solo en el servicio que lo necesita", "Duplicar siempre todos los servicios", "Evitar cualquier planificación de capacidad", "Unificar todas las cargas de trabajo"],
      correct: 0,
      explanation: "Se pueden asignar más recursos a los servicios con mayor demanda sin escalar necesariamente el sistema completo."
    },
    {
      question: "¿Qué práctica suele favorecer el desacoplamiento de datos?",
      answers: ["Permitir que todos modifiquen las tablas de todos", "Asignar responsabilidad sobre los datos a cada servicio", "Guardar todos los datos en el navegador", "Eliminar las copias de seguridad"],
      correct: 1,
      explanation: "Cada servicio debería ser responsable de sus datos; el almacenamiento concreto depende de los requisitos del sistema."
    },
    {
      question: "¿Cuál es un reto frecuente al adoptar microservicios?",
      answers: ["No es posible actualizar sus componentes", "La observabilidad y el diagnóstico de errores distribuidos", "No se pueden escalar servicios por separado", "Solo se pueden escribir en un lenguaje"],
      correct: 1,
      explanation: "Distribuir una aplicación añade complejidad para rastrear solicitudes y diagnosticar fallos entre varios servicios."
    },
    {
      question: "¿Qué ayuda a limitar el impacto de un fallo en un servicio?",
      answers: ["Ignorar los errores de comunicación", "Diseñar aislamiento, tiempos límite y estrategias de resiliencia", "Hacer que todos compartan el mismo proceso", "Desactivar el monitoreo"],
      correct: 1,
      explanation: "Patrones de resiliencia y límites adecuados ayudan a contener fallos y evitar que se propaguen."
    },
    {
      question: "¿Cuándo puede ser apropiado considerar microservicios?",
      answers: ["En todo proyecto, sin importar su tamaño", "Cuando el dominio y los equipos requieren evolución y escalado independientes", "Solo para sitios sin usuarios", "Cuando se quiere evitar toda operación técnica"],
      correct: 1,
      explanation: "Son útiles cuando existe una necesidad real de autonomía, escala o despliegue independiente, y se pueden asumir sus costes operativos."
    }
  ];

  const quizPanel = document.getElementById("quizPanel");
  const quizForm = document.getElementById("quizForm");
  const quizResult = document.getElementById("quizResult");
  const questionCounter = document.getElementById("questionCounter");
  const progressLabel = document.getElementById("progressLabel");
  const quizProgress = document.getElementById("quizProgress");
  const quizProgressBar = document.getElementById("quizProgressBar");
  const questionText = document.getElementById("questionText");
  const answerOptions = document.getElementById("answerOptions");
  const quizFeedback = document.getElementById("quizFeedback");
  const previousQuestion = document.getElementById("previousQuestion");
  const nextQuestion = document.getElementById("nextQuestion");
  const finishQuiz = document.getElementById("finishQuiz");
  const retryQuizFooter = document.getElementById("retryQuizFooter");
  let currentQuestion = 0;
  let selectedAnswers = Array(questions.length).fill(null);

  const renderQuestion = () => {
    const item = questions[currentQuestion];
    const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);
    questionCounter.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
    progressLabel.textContent = `Progreso: ${progress}%`;
    quizProgress.setAttribute("aria-valuenow", String(progress));
    quizProgressBar.style.width = `${progress}%`;
    questionText.textContent = item.question;
    answerOptions.replaceChildren();
    item.answers.forEach((answer, index) => {
      const label = document.createElement("label");
      label.className = `answer-option${selectedAnswers[currentQuestion] === index ? " selected" : ""}`;
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "quizAnswer";
      input.value = String(index);
      input.checked = selectedAnswers[currentQuestion] === index;
      input.setAttribute("aria-label", `Opción ${String.fromCharCode(65 + index)}: ${answer}`);
      input.addEventListener("change", () => {
        selectedAnswers[currentQuestion] = index;
        answerOptions.querySelectorAll(".answer-option").forEach((option) => option.classList.remove("selected"));
        label.classList.add("selected");
        quizFeedback.textContent = "";
      });
      const text = document.createElement("span");
      text.textContent = answer;
      label.append(input, text);
      answerOptions.append(label);
    });
    previousQuestion.disabled = currentQuestion === 0;
    nextQuestion.classList.toggle("d-none", currentQuestion === questions.length - 1);
    finishQuiz.classList.toggle("d-none", currentQuestion !== questions.length - 1);
    quizFeedback.textContent = "";
  };

  previousQuestion.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion -= 1;
      renderQuestion();
      questionText.focus();
    }
  });
  nextQuestion.addEventListener("click", () => {
    if (selectedAnswers[currentQuestion] === null) {
      quizFeedback.textContent = "Selecciona una respuesta para continuar.";
      return;
    }
    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
      questionText.focus();
    }
  });
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const unanswered = selectedAnswers.findIndex((answer) => answer === null);
    if (unanswered !== -1) {
      currentQuestion = unanswered;
      renderQuestion();
      quizFeedback.textContent = "Responde todas las preguntas antes de finalizar. Aquí tienes la primera pendiente.";
      return;
    }
    const correctCount = questions.reduce((total, item, index) => total + Number(selectedAnswers[index] === item.correct), 0);
    const score = Math.round((correctCount / questions.length) * 100);
    const incorrectCount = questions.length - correctCount;
    let feedback;
    if (score >= 90) feedback = "¡Excelente dominio del tema! Comprendes muy bien los fundamentos.";
    else if (score >= 70) feedback = "Buen conocimiento, pero puedes reforzar algunos conceptos.";
    else if (score >= 50) feedback = "Tienes un conocimiento básico; conviene repasar algunos temas.";
    else feedback = "Revisa el contenido y vuelve a intentarlo para fortalecer tus conocimientos.";

    quizPanel.classList.add("d-none");
    quizResult.classList.remove("d-none");
    quizResult.innerHTML = `
      <span class="eyebrow">Resultado final</span>
      <h2 id="resultTitle" class="section-title">Cuestionario completado</h2>
      <div class="result-score" aria-label="${score} puntos de 100">${score}<small>/100</small></div>
      <div class="result-stats">
        <span class="result-stat correct"><i class="bi bi-check-circle-fill me-1" aria-hidden="true"></i>${correctCount} correctas</span>
        <span class="result-stat incorrect"><i class="bi bi-x-circle-fill me-1" aria-hidden="true"></i>${incorrectCount} incorrectas</span>
      </div>
      <p class="result-feedback">${feedback}</p>
      <button class="btn btn-primary" type="button" id="retryQuiz"><i class="bi bi-arrow-repeat me-1" aria-hidden="true"></i> Volver a intentarlo</button>
      <div class="review-list" aria-label="Respuestas y explicaciones">
        ${questions.map((item, index) => {
          const isCorrect = selectedAnswers[index] === item.correct;
          return `<article class="review-item">
            <h3>${index + 1}. ${item.question}</h3>
            <p class="${isCorrect ? "review-answer" : ""}">${isCorrect ? "Correcta" : "Tu respuesta"}: ${item.answers[selectedAnswers[index]]}</p>
            ${isCorrect ? "" : `<p class="review-answer">Respuesta correcta: ${item.answers[item.correct]}</p>`}
            <p>${item.explanation}</p>
          </article>`;
        }).join("")}
      </div>`;
    document.getElementById("retryQuiz").addEventListener("click", resetQuiz);
    quizResult.focus();
  });

  function resetQuiz() {
    currentQuestion = 0;
    selectedAnswers = Array(questions.length).fill(null);
    quizResult.classList.add("d-none");
    quizResult.replaceChildren();
    quizPanel.classList.remove("d-none");
    renderQuestion();
    document.getElementById("cuestionario").scrollIntoView({ behavior: "smooth", block: "start" });
    questionText.focus();
  }

  retryQuizFooter.addEventListener("click", () => {
    resetQuiz();
  });
  renderQuestion();
});
