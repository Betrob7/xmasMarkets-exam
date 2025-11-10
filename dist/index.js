const sectionSetup = () => {
  const sectionRefs = document.querySelectorAll(".page");
  sectionRefs.forEach((section) => section.classList.remove("active"));
  const homeSection = document.getElementById("home");
  if (homeSection) homeSection.classList.add("active");
};
const navSetup = () => {
  const navItemRefs = document.querySelectorAll(".nav-item");
  navItemRefs.forEach((navItem) => {
    navItem.addEventListener("click", (e) => {
      console.log(e.target.dataset.id);
      toggleSectionDisplay(e.target.dataset.id);
    });
  });
};
const toggleSectionDisplay = (section) => {
  const sections = document.querySelectorAll(".page");
  sections.forEach((s) => s.classList.remove("active"));
  if (section) {
    const selected = document.getElementById(section);
    if (selected) selected.classList.add("active");
    else console.log(`Sektionen "${section}" hittades inte`);
  } else {
    console.log("Ingen sektion angiven");
  }
};
const marketsSetup = async () => {
  try {
    const response = await fetch("https://betrob7.github.io/julmarknader-api/data/xmasMarkets.json");
    if (!response.ok) throw new Error("Kunde inte hämta julmarknader");
    const markets = await response.json();
    // sortera om du vill, t.ex. efter id eller datum
    markets.sort((a, b) => a.id - b.id);
    renderMarkets(markets);
  } catch (error) {
    console.error("Något gick fel vid hämtning av marknader:", error);
  }
};
const createMarketCard = (market) => {
  const cardRef = document.createElement("article");
  cardRef.classList.add("market-card");
  const template = `
    <section class="card-top">
      <img src="${market.img}" alt="${market.location}">
    </section>
    <section class="card-middle">
      <h2>${market.location}</h2>
      <h3>${market.date} • ${market.time}</h3>
    </section>
    <section class="card-bottom">
      <p>${market.address}</p>
    </section>
  `;
  cardRef.innerHTML = template;
  return cardRef;
};
const renderMarkets = (markets) => {
  const container = document.querySelector("#markets-container");
  container.innerHTML = ""; // rensa eventuell placeholder
  markets.forEach((market) => {
    const card = createMarketCard(market);
    container.appendChild(card);
  });
};
//funktion för snöfall
const createSnowfall = (count = 50) => {
  const container = document.querySelector(".snow-container");
  if (!container) return;
  const flakes = [];
  // Skapa snöflingor
  for (let i = 0; i < count; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    const size = Math.random() * 5 + 2; // storlek 2-7px
    const x = Math.random() * container.clientWidth;
    const y = Math.random() * container.clientHeight;
    const speed = Math.random() * 2 + 1;
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.left = `${x}px`;
    flake.style.top = `${y}px`;
    container.appendChild(flake);
    flakes.push({ el: flake, x, y, speed, size });
  }
  // Animation
  const animate = () => {
    flakes.forEach((f) => {
      f.y += f.speed;
      if (f.y > container.clientHeight) f.y = -f.size;
      f.el.style.top = `${f.y}px`;
    });
    requestAnimationFrame(animate);
  };
  animate();
};
//Nedräkning till julafton
const startCountdown = () => {
  const countdownRef = document.getElementById("countdown-timer");
  if (!countdownRef) return;
  const christmasDate = new Date("2025-12-24T00:00:00").getTime();
  const updateCountdown = () => {
    const now = new Date().getTime();
    const diff = christmasDate - now;
    if (diff <= 0) {
      countdownRef.textContent = "🎅 God Jul! 🎁";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdownRef.textContent = `${days} dagar ${hours} timmar ${minutes} min ${seconds} sek`;
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);
};
sectionSetup();
navSetup();
marketsSetup();
createSnowfall(100);
startCountdown();

//# sourceMappingURL=index.js.map
