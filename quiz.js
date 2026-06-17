const QUESTIONS = [
  {
    title: "Qual sua relação com o crochê hoje?",
    options: [
      { label: "Nunca comecei, estou do zero", score: { iniciante: 3, evolucao: 1 } },
      { label: "Sei o básico, mas travo em peças bonitas", score: { evolucao: 3, acabamento: 1 } },
      { label: "Já faço peças e quero vender melhor", score: { renda: 3, acabamento: 1 } },
      { label: "Tenho experiência e quero modelos novos", score: { acabamento: 3, renda: 1 } }
    ]
  },
  {
    title: "Hoje, qual é seu maior objetivo com sousplats?",
    options: [
      { label: "Aprender sem complicação", score: { iniciante: 3 } },
      { label: "Deixar a mesa mais bonita", score: { acabamento: 2, evolucao: 2 } },
      { label: "Ganhar renda extra", score: { renda: 4 } },
      { label: "Fazer para presentear", score: { evolucao: 2, acabamento: 1 } }
    ]
  },
  {
    title: "O que mais te atrapalha hoje?",
    options: [
      { label: "Não sei por onde começar", score: { iniciante: 4 } },
      { label: "Fico confusa nos pontos e acabamentos", score: { evolucao: 3, acabamento: 1 } },
      { label: "Não sei quais materiais comprar", score: { iniciante: 2, evolucao: 2 } },
      { label: "Até faço, mas não consigo vender", score: { renda: 4 } }
    ]
  },
  {
    title: "Quanto tempo por semana você consegue dedicar?",
    options: [
      { label: "Menos de 1 hora", score: { iniciante: 2, evolucao: 2 } },
      { label: "1 a 3 horas", score: { evolucao: 3, renda: 1 } },
      { label: "3 a 5 horas", score: { renda: 2, acabamento: 2 } },
      { label: "Mais de 5 horas", score: { acabamento: 3, renda: 2 } }
    ]
  },
  {
    title: "Qual resultado te deixaria mais orgulhosa agora?",
    options: [
      { label: "Fazer meu primeiro sousplat bonito", score: { iniciante: 4 } },
      { label: "Criar peças com acabamento profissional", score: { acabamento: 4 } },
      { label: "Ter elogios e encomendas", score: { renda: 3, acabamento: 1 } },
      { label: "Montar uma coleção para vender", score: { renda: 4 } }
    ]
  },
  {
    title: "Seu próximo passo ideal seria...",
    options: [
      { label: "Ter um método simples passo a passo", score: { iniciante: 4 } },
      { label: "Aulas práticas para evoluir sem travar", score: { evolucao: 4 } },
      { label: "Modelos que vendem de verdade", score: { renda: 4 } },
      { label: "Aprender acabamento para cobrar mais", score: { acabamento: 4 } }
    ]
  }
];

const PROFILES = {
  iniciante: {
    title: "Perfil: Início Seguro",
    text: "Você precisa de um passo a passo muito claro para sair do zero sem medo e já criar suas primeiras peças com confiança.",
    benefits: [
      "Aulas sem linguagem difícil, feitas para iniciantes",
      "Lista de materiais para comprar certo desde o começo",
      "Primeiros sousplats com acabamento bonito já na 1ª semana"
    ]
  },
  evolucao: {
    title: "Perfil: Artesã em Evolução",
    text: "Você já começou, mas precisa de direção para destravar técnica e ganhar consistência nas peças.",
    benefits: [
      "Método com começo, meio e fim para não travar",
      "Sequência prática para evoluir sem pular etapa",
      "Modelos para aumentar confiança e velocidade"
    ]
  },
  acabamento: {
    title: "Perfil: Acabamento Premium",
    text: "Seu foco é deixar as peças com cara profissional para impressionar e valorizar seu trabalho.",
    benefits: [
      "Técnicas de acabamento que elevam a percepção de valor",
      "Variações modernas de sousplats para se destacar",
      "Estrutura de peça que permite cobrar mais"
    ]
  },
  renda: {
    title: "Perfil: Renda Extra Inteligente",
    text: "Você está pronta para usar o crochê de forma estratégica e transformar habilidade em encomendas.",
    benefits: [
      "Modelos com alta procura para vender",
      "Dicas de posicionamento para captar primeiras clientes",
      "Plano prático para criar e divulgar suas peças"
    ]
  }
};

const TRACKING_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "utm_id", "utm_campaign_id", "utm_adset_id", "utm_ad_id", "utm_placement",
  "campaign_id", "adset_id", "ad_id", "fbclid", "gclid", "ttclid", "src"
];

const state = {
  step: 0,
  answers: new Array(QUESTIONS.length).fill(null)
};

const introView = document.getElementById("intro");
const quizView = document.getElementById("quiz");
const loadingView = document.getElementById("loading");
const resultView = document.getElementById("result");

const startBtn = document.getElementById("start-quiz");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const optionsWrap = document.getElementById("options");
const questionTitle = document.getElementById("question-title");
const stepLabel = document.getElementById("step-label");
const progressBar = document.getElementById("progress-bar");

const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const resultBenefitsList = document.getElementById("result-benefits-list");
const offerLink = document.getElementById("offer-link");
const timerEl = document.getElementById("timer");

const trackFbq = (event, params) => {
  if (typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
};

const showView = (view) => {
  [introView, quizView, loadingView, resultView].forEach((item) => {
    item.classList.remove("is-active");
    item.hidden = true;
  });

  view.hidden = false;
  view.classList.add("is-active");
};

const renderQuestion = () => {
  const current = QUESTIONS[state.step];
  const answered = state.answers[state.step];

  questionTitle.textContent = current.title;
  stepLabel.textContent = `Pergunta ${state.step + 1} de ${QUESTIONS.length}`;

  const progress = Math.round((state.step / QUESTIONS.length) * 100);
  progressBar.style.width = `${progress}%`;

  optionsWrap.innerHTML = "";
  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = option.label;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(answered === index));

    if (answered === index) {
      button.classList.add("is-selected");
    }

    button.addEventListener("click", () => {
      state.answers[state.step] = index;
      renderQuestion();
    });

    optionsWrap.appendChild(button);
  });

  prevBtn.disabled = state.step === 0;
  nextBtn.disabled = state.answers[state.step] === null;
  nextBtn.textContent = state.step === QUESTIONS.length - 1 ? "Ver resultado 🎉" : "Próxima →";
};

const calculateProfile = () => {
  const tally = { iniciante: 0, evolucao: 0, acabamento: 0, renda: 0 };

  state.answers.forEach((answer, stepIndex) => {
    const option = QUESTIONS[stepIndex].options[answer];
    Object.entries(option.score).forEach(([key, value]) => {
      tally[key] += value;
    });
  });

  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
};

const buildOfferLink = () => {
  const target = new URL("index.html", window.location.href);
  const query = new URLSearchParams(window.location.search);

  TRACKING_KEYS.forEach((key) => {
    const value = query.get(key);
    if (value) target.searchParams.set(key, value);
  });

  target.searchParams.set("src", "quiz");
  target.searchParams.set("quiz_result", "1");
  return target.toString();
};

const runTimer = (seconds = 600) => {
  let remaining = seconds;

  const paint = () => {
    const min = String(Math.floor(remaining / 60)).padStart(2, "0");
    const sec = String(remaining % 60).padStart(2, "0");
    timerEl.textContent = `${min}:${sec}`;
  };

  paint();
  const timer = setInterval(() => {
    remaining -= 1;
    paint();
    if (remaining <= 0) clearInterval(timer);
  }, 1000);
};

startBtn.addEventListener("click", () => {
  trackFbq("Lead", {
    content_name: "Quiz Sousplat - Iniciado",
    content_category: "Quiz"
  });
  showView(quizView);
  renderQuestion();
});

prevBtn.addEventListener("click", () => {
  if (state.step === 0) return;
  state.step -= 1;
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  if (state.answers[state.step] === null) return;

  if (state.step < QUESTIONS.length - 1) {
    state.step += 1;
    renderQuestion();
    return;
  }

  showView(loadingView);
  window.setTimeout(() => {
    const profileKey = calculateProfile();
    const profile = PROFILES[profileKey];

    resultTitle.textContent = profile.title;
    resultText.textContent = profile.text;
    resultBenefitsList.innerHTML = "";
    profile.benefits.forEach((benefit) => {
      const li = document.createElement("li");
      li.textContent = `✓ ${benefit}`;
      resultBenefitsList.appendChild(li);
    });

    offerLink.href = buildOfferLink();

    trackFbq("CompleteRegistration", {
      content_name: `Quiz Sousplat - ${profile.title}`,
      status: true
    });

    runTimer();
    showView(resultView);
  }, 1200);
});

offerLink.addEventListener("click", () => {
  trackFbq("InitiateCheckout", {
    content_name: "Quiz Sousplat - Clique para Oferta",
    value: 19.9,
    currency: "BRL"
  });
});
