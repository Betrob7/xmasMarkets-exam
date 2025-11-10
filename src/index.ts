import type {Market} from "./interfaces/Market.ts"

const sectionSetup = (): void => {
    
    const sectionRefs = document.querySelectorAll<HTMLElement>('.page');
    
    
    sectionRefs.forEach(section => section.classList.remove('active'));

    
    const homeSection = document.getElementById('home');
    if (homeSection) homeSection.classList.add('active');
};


const navSetup = () : void => {
    const navItemRefs = document.querySelectorAll<HTMLUListElement>('.nav-item');

    navItemRefs.forEach((navItem: HTMLElement) => {
        navItem.addEventListener('click', (e : PointerEvent) : void => {
            console.log((e.target as HTMLElement).dataset.id);
            toggleSectionDisplay((e.target as HTMLElement).dataset.id);
        });
    });
}

const toggleSectionDisplay = (section: string | undefined): void => {
    
    const sections = document.querySelectorAll<HTMLElement>('.page');
    
  
    sections.forEach(s => s.classList.remove('active'));

    
    if (section) {
        const selected = document.getElementById(section);
        if (selected) selected.classList.add('active');
        else console.log(`Sektionen "${section}" hittades inte`);
    } else {
        console.log('Ingen sektion angiven');
    }
};


const marketsSetup = async (): Promise<void> => {
  try {
    const response = await fetch('https://betrob7.github.io/julmarknader-api/data/xmasMarkets.json');
    if (!response.ok) throw new Error('Kunde inte hämta julmarknader');

    const markets: Market[] = await response.json();

    // sortera om du vill, t.ex. efter id eller datum
    markets.sort((a, b) => a.id - b.id);

    renderMarkets(markets);
  } catch (error) {
    console.error('Något gick fel vid hämtning av marknader:', error);
  }
};


const createMarketCard = (market: Market): HTMLElement => {
  const cardRef = document.createElement('article');
  cardRef.classList.add('market-card');

  const isFavorite = getFavorites().includes(market.id);

  cardRef.innerHTML = `
    <section class="card-top">
      <img src="${market.img}" alt="${market.location}">
      <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${market.id}"><span class="not-fav">
          <img src="./assets/santa-before.svg" alt="Add to favorites">
        </span>
        <span class="fav">
          <img src="./assets/santa-after.svg" alt="Favorite">
        </span></button>
    </section>
    <section class="card-middle">
      <h2>${market.location}</h2>
      <h3>${market.date} • ${market.time}</h3>
    </section>
    <section class="card-bottom">
      <p>${market.address}</p>
    </section>
  `;

 
  const favBtn = cardRef.querySelector<HTMLButtonElement>('.favorite-btn');
  favBtn?.addEventListener('click', () => toggleFavorite(market.id, favBtn));

  return cardRef;
};

const getFavorites = (): number[] => {
  const data = localStorage.getItem('favorites');
  return data ? JSON.parse(data) : [];
};

const toggleFavorite = (id: number, btn?: HTMLElement) => {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);

  if (index > -1) {
    favorites.splice(index, 1); // ta bort
    btn?.classList.remove('active');
  } else {
    favorites.push(id); // lägg till
    btn?.classList.add('active');
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
};


const renderMarkets = (markets: Market[]) => {
  const container = document.querySelector('#markets-container') as HTMLElement;
  container.innerHTML = ''; 
  markets.forEach(market => {
    const card = createMarketCard(market);
    container.appendChild(card);
  });
};

//funktion för snöfall
const createSnowfall = (count: number = 50): void => {
    const container = document.querySelector('.snow-container') as HTMLElement;
    if (!container) return;

    const flakes: {el: HTMLElement, x: number, y: number, speed: number, size: number}[] = [];

    // Skapa snöflingor
    for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');

        const size = Math.random() * 5 + 2; // storlek 2-7px
        const x = Math.random() * container.clientWidth;
        const y = Math.random() * container.clientHeight;
        const speed = Math.random() * 2 + 1;

        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.left = `${x}px`;
        flake.style.top = `${y}px`;

        container.appendChild(flake);

        flakes.push({el: flake, x, y, speed, size});
    }

    // Animation
    const animate = () => {
        flakes.forEach(f => {
            f.y += f.speed;
            if (f.y > container.clientHeight) f.y = -f.size;
            f.el.style.top = `${f.y}px`;
        });
        requestAnimationFrame(animate);
    };

    animate();
};

//Nedräkning till julafton
const startCountdown = (): void => {
  const countdownRef = document.getElementById('countdown-timer') as HTMLElement;
  if (!countdownRef) return;

  const christmasDate = new Date('2025-12-24T00:00:00').getTime();

  const updateCountdown = (): void => {
    const now = new Date().getTime();
    const diff = christmasDate - now;

    if (diff <= 0) {
      countdownRef.textContent = '🎅 God Jul! 🎁';
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