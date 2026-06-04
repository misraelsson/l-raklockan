// Klockgeneratorn - Applikationslogik

// Svenska ord för timmarna (används för talspråksöversättning)
const swedishHours = {
  1: "ett",
  2: "två",
  3: "tre",
  4: "fyra",
  5: "fem",
  6: "sex",
  7: "sju",
  8: "åtta",
  9: "nio",
  10: "tio",
  11: "elva",
  12: "tolv"
};

// Generera svensk text för klockslaget
function getSwedishTimeText(hour, minute) {
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;
  
  let nextH12 = (h12 % 12) + 1;
  
  const currentHourText = swedishHours[h12];
  const nextHourText = swedishHours[nextH12];
  
  if (minute === 0) {
    return `Klockan ${currentHourText}`;
  } else if (minute === 5) {
    return `Fem över ${currentHourText}`;
  } else if (minute === 10) {
    return `Tio över ${currentHourText}`;
  } else if (minute === 15) {
    return `Kvart över ${currentHourText}`;
  } else if (minute === 20) {
    return `Tio i halv ${nextHourText}`;
  } else if (minute === 25) {
    return `Fem i halv ${nextHourText}`;
  } else if (minute === 30) {
    return `Halv ${nextHourText}`;
  } else if (minute === 35) {
    return `Fem över halv ${nextHourText}`;
  } else if (minute === 40) {
    return `Tio över halv ${nextHourText}`;
  } else if (minute === 45) {
    return `Kvart i ${nextHourText}`;
  } else if (minute === 50) {
    return `Tio i ${nextHourText}`;
  } else if (minute === 55) {
    return `Fem i ${nextHourText}`;
  }
  
  return `${currentHourText} och ${minute} minuter`;
}

// Slumpa en tid för en specifik svårighetsgrad
function getRandomTimeForLevel(level) {
  const hour = Math.floor(Math.random() * 24);
  let minute = 0;
  
  switch (level) {
    case "hours":
      minute = 0;
      break;
    case "half":
      minute = 30;
      break;
    case "quarter":
      const quarters = [15, 45];
      minute = quarters[Math.floor(Math.random() * quarters.length)];
      break;
    case "five":
      const fives = [5, 10, 20, 25, 35, 40, 50, 55];
      minute = fives[Math.floor(Math.random() * fives.length)];
      break;
    default:
      minute = 0;
  }
  
  return { hour, minute };
}

// Hjälpfunktion för att blanda en array (Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Skapa SVG för urtavlan
function createClockSVG(hour, minute) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 200 200");
  svg.setAttribute("class", "analog-clock-svg");
  
  // 1. Skapa urtavlans streck (ticks)
  for (let i = 0; i < 60; i++) {
    const angle = i * 6; // 360 / 60 = 6 grader per minut
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    
    const r1 = 88;
    const r2 = isMajor ? 78 : 83;
    
    const x1 = 100 + r1 * Math.sin(rad);
    const y1 = 100 - r1 * Math.cos(rad);
    const x2 = 100 + r2 * Math.sin(rad);
    const y2 = 100 - r2 * Math.cos(rad);
    
    const tick = document.createElementNS(svgNS, "line");
    tick.setAttribute("x1", x1);
    tick.setAttribute("y1", y1);
    tick.setAttribute("x2", x2);
    tick.setAttribute("y2", y2);
    tick.setAttribute("class", `clock-tick ${isMajor ? 'major' : 'minor'}`);
    svg.appendChild(tick);
  }
  
  // 2. Skapa siffror 1-12
  for (let h = 1; h <= 12; h++) {
    const angle = h * 30; // 360 / 12 = 30 grader per timme
    const rad = (angle * Math.PI) / 180;
    const r = 63; // Avstånd från centrum till siffran
    
    const x = 100 + r * Math.sin(rad);
    const y = 100 - r * Math.cos(rad);
    
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.textContent = h;
    svg.appendChild(text);
  }
  
  // 3. Skapa timvisare (hour hand)
  // Rotera timvisaren baserat på timme och minut för en realistisk vinkel
  const hourDeg = (hour % 12) * 30 + minute * 0.5;
  const hourHand = document.createElementNS(svgNS, "line");
  hourHand.setAttribute("x1", 100);
  hourHand.setAttribute("y1", 100);
  hourHand.setAttribute("x2", 100);
  hourHand.setAttribute("y2", 60); // 40px lång
  hourHand.setAttribute("class", "clock-hand hour-hand");
  hourHand.style.transform = `rotate(${hourDeg}deg)`;
  svg.appendChild(hourHand);
  
  // 4. Skapa minutvisare (minute hand)
  const minDeg = minute * 6;
  const minHand = document.createElementNS(svgNS, "line");
  minHand.setAttribute("x1", 100);
  minHand.setAttribute("y1", 100);
  minHand.setAttribute("x2", 100);
  minHand.setAttribute("y2", 42); // 58px lång
  minHand.setAttribute("class", "clock-hand minute-hand");
  minHand.style.transform = `rotate(${minDeg}deg)`;
  svg.appendChild(minHand);
  
  // 5. Skapa centrum-punkt (center dot)
  const centerDot = document.createElementNS(svgNS, "circle");
  centerDot.setAttribute("cx", 100);
  centerDot.setAttribute("cy", 100);
  centerDot.setAttribute("r", 5.5);
  centerDot.setAttribute("class", "center-dot");
  svg.appendChild(centerDot);
  
  return svg;
}

// Skapa ett klockkort (DOM-struktur)
function createClockCard(index, time, showAllAnswers) {
  const card = document.createElement("div");
  card.className = "clock-card";
  
  // Badge (t.ex. Klocka 1)
  const badge = document.createElement("div");
  badge.className = "clock-badge";
  badge.textContent = `Klocka ${index}`;
  card.appendChild(badge);
  
  // Analog klockbehållare
  const clockContainer = document.createElement("div");
  clockContainer.className = "analog-clock-container";
  const clockSVG = createClockSVG(time.hour, time.minute);
  clockContainer.appendChild(clockSVG);
  card.appendChild(clockContainer);
  
  // Svars-sektion
  const answerArea = document.createElement("div");
  answerArea.className = "answer-area";
  
  // Avslöja-knapp (används när svar döljs)
  const revealBtn = document.createElement("button");
  revealBtn.className = "answer-card-reveal-btn";
  revealBtn.textContent = "Visa svar";
  
  // Digitalt och svenskt text-svar
  const answerDetails = document.createElement("div");
  answerDetails.className = "answer-details";
  
  const digitalTimeText = document.createElement("div");
  digitalTimeText.className = "digital-time";
  
  // Formatera HH:MM med ledande nolla
  const formattedHour = String(time.hour).padStart(2, '0');
  const formattedMin = String(time.minute).padStart(2, '0');
  digitalTimeText.textContent = `${formattedHour}:${formattedMin}`;
  
  const swedishText = document.createElement("div");
  swedishText.className = "swedish-text-time";
  swedishText.textContent = getSwedishTimeText(time.hour, time.minute);
  
  answerDetails.appendChild(digitalTimeText);
  answerDetails.appendChild(swedishText);
  
  // Lägg till element i svarsbehållaren baserat på global inställning
  if (showAllAnswers) {
    revealBtn.classList.add("hidden");
  } else {
    answerDetails.classList.add("hidden");
  }
  
  revealBtn.addEventListener("click", () => {
    revealBtn.classList.add("hidden");
    answerDetails.classList.remove("hidden");
  });
  
  answerArea.appendChild(revealBtn);
  answerArea.appendChild(answerDetails);
  card.appendChild(answerArea);
  
  return card;
}

// Huvudtillstånd för appen
const state = {
  selectedIntervals: ["hours"], // Standard: hela timmar markerat
  showAllAnswers: false,        // Standard: dölj svar
  clocksData: []                // Sparar de 9 slumpade tiderna
};

// Generera och rita upp 9 nya klockor med smart distribution
function generateAndRenderClocks() {
  const grid = document.getElementById("clocksGrid");
  if (!grid) return;
  
  grid.innerHTML = "";
  state.clocksData = [];
  
  // 1. Sortera de valda intervallerna efter svårighetsgrad
  const difficultyOrder = ["hours", "half", "quarter", "five"];
  const activeLevels = difficultyOrder.filter(level => state.selectedIntervals.includes(level));
  
  // Om inget är valt av någon anledning, välj "hours" som reserv
  if (activeLevels.length === 0) {
    activeLevels.push("hours");
  }
  
  // 2. Bestäm fördelningen av de 9 urtavlorna
  let levelDistribution = [];
  const k = activeLevels.length;
  
  if (k === 1) {
    // 9 av samma
    levelDistribution = Array(9).fill(activeLevels[0]);
  } else if (k === 2) {
    // 3 lättare, 6 svårare
    levelDistribution = [
      ...Array(3).fill(activeLevels[0]),
      ...Array(6).fill(activeLevels[1])
    ];
  } else if (k === 3) {
    // 2 lättaste, 3 mellersta, 4 svåraste
    levelDistribution = [
      ...Array(2).fill(activeLevels[0]),
      ...Array(3).fill(activeLevels[1]),
      ...Array(4).fill(activeLevels[2])
    ];
  } else if (k === 4) {
    // 1-2-2-4 fördelning
    levelDistribution = [
      ...Array(1).fill(activeLevels[0]),
      ...Array(2).fill(activeLevels[1]),
      ...Array(2).fill(activeLevels[2]),
      ...Array(4).fill(activeLevels[3])
    ];
  }
  
  // 3. Blanda fördelningen så att klockorna inte alltid visas i ordning
  shuffleArray(levelDistribution);
  
  // 4. Skapa och rendera klockkorten
  for (let i = 1; i <= 9; i++) {
    const level = levelDistribution[i - 1];
    const time = getRandomTimeForLevel(level);
    state.clocksData.push(time);
    
    const card = createClockCard(i, time, state.showAllAnswers);
    grid.appendChild(card);
  }
}

// Initiera applikationen när DOM laddats
document.addEventListener("DOMContentLoaded", () => {
  // 1. Sätt upp lyssnare för kryssrutor (svårighetsgrad)
  const checkboxInputs = document.querySelectorAll('.interval-checkbox');
  
  const updateSelectedIntervals = () => {
    const selected = [];
    checkboxInputs.forEach(input => {
      if (input.checked) {
        selected.push(input.value);
      }
    });
    state.selectedIntervals = selected;
  };

  checkboxInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      // Förhindra att man klickar ur den sista svårighetsgraden
      const checkedCount = document.querySelectorAll('.interval-checkbox:checked').length;
      if (checkedCount === 0) {
        e.target.checked = true; // tvinga att förbli ikryssad
        return;
      }
      
      updateSelectedIntervals();
      generateAndRenderClocks();
    });
  });
  
  // Synkronisera initialt läge
  updateSelectedIntervals();
  
  // 2. Spara länk till "Slumpa nya klockor"-knappen
  const randomizeBtn = document.getElementById("randomizeBtn");
  if (randomizeBtn) {
    randomizeBtn.addEventListener("click", () => {
      // Lägg till en snabb rotationsanimation på knappen för feedback
      const svgIcon = randomizeBtn.querySelector("svg");
      if (svgIcon) {
        svgIcon.style.transition = "transform 0.5s ease";
        svgIcon.style.transform = `rotate(${(parseInt(svgIcon.getAttribute("data-rot") || 0) + 360)}deg)`;
        svgIcon.setAttribute("data-rot", (parseInt(svgIcon.getAttribute("data-rot") || 0) + 360));
      }
      generateAndRenderClocks();
    });
  }
  
  // 3. Svara-visa switch
  const answerSwitch = document.getElementById("answerSwitch");
  if (answerSwitch) {
    answerSwitch.addEventListener("change", (e) => {
      state.showAllAnswers = e.target.checked;
      
      const cards = document.querySelectorAll(".clock-card");
      cards.forEach((card, idx) => {
        const revealBtn = card.querySelector(".answer-card-reveal-btn");
        const details = card.querySelector(".answer-details");
        
        if (state.showAllAnswers) {
          if (revealBtn) revealBtn.classList.add("hidden");
          if (details) details.classList.remove("hidden");
        } else {
          if (revealBtn) revealBtn.classList.remove("hidden");
          if (details) details.classList.add("hidden");
        }
      });
    });
    
    // Synkronisera initialt läge
    state.showAllAnswers = answerSwitch.checked;
  }
  
  // 4. Skriv-ut knapp
  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
  
  // 5. Ljust/Mörkt tema toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    // Klicka på knappen för att växla tema
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      
      document.body.setAttribute("data-theme", newTheme);
      localStorage.setItem("clock-theme", newTheme);
    });
    
    // Läs in sparat tema eller systemtema
    const savedTheme = localStorage.getItem("clock-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      document.body.setAttribute("data-theme", savedTheme);
    } else if (systemPrefersDark) {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  }
  
  // 6. Rita upp första klockorna
  generateAndRenderClocks();
});
