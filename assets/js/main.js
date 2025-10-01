document.addEventListener('DOMContentLoaded', () => {
  // ====== Mobile Nav ======
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (hamburger) {
    hamburger.addEventListener('click', () => nav.classList.toggle('active'));
  }

  // ====== Audio Player ======
  const audio = document.getElementById('live-audio');
  const playBtn = document.getElementById('play-toggle');
  const vol = document.getElementById('volume');

  if (audio && playBtn) {
    playBtn.addEventListener('click', () => {
      if (audio.paused) { 
        audio.play(); 
        playBtn.textContent = 'Pause'; 
      } else { 
        audio.pause(); 
        playBtn.textContent = 'Play'; 
      }
    });
  }

  if (audio && vol) {
    vol.addEventListener('input', (e) => {
      audio.volume = Number(e.target.value);
    });
  }

  // ====== Carousel (Homepage Featured Content) ======
  const carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;
    let x = 0;
    setInterval(() => {
      x -= 1;
      track.style.transform = `translateX(${x}px)`;
      if (Math.abs(x) > track.scrollWidth - carousel.clientWidth) x = 0;
    }, 40);
  });

  // ====== Schedule Auto Highlight ======
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sunday
  const currentTime = now.getHours() * 60 + now.getMinutes();

  document.querySelectorAll("tr[data-day]").forEach(row => {
    const day = parseInt(row.getAttribute("data-day"));
    const start = row.getAttribute("data-start").split(":");
    const end = row.getAttribute("data-end").split(":");

    const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);

    if (day === currentDay && currentTime >= startMinutes && currentTime < endMinutes) {
      row.style.background = "rgba(255,77,0,0.2)";
      const badge = row.querySelector(".badge");
      if (badge) {
        badge.textContent = "Live Now";
        badge.classList.add("hot");
      }
    }
  });

  // ====== Events Dynamic Loader ======
  const eventsGrid = document.getElementById("events-grid");
  if (eventsGrid) {
    fetch("assets/js/events.json")
      .then(res => res.json())
      .then(events => {
        events.forEach(ev => {
          const card = document.createElement("article");
          card.className = "card";
          card.innerHTML = `
            <div class="thumb">
              <img src="${ev.img}" alt="${ev.alt}" loading="lazy">
            </div>
            <div class="pad">
              <h3>${ev.title}</h3>
              <div class="meta">${ev.date} • ${ev.location}</div>
              <p style="margin:12px 0">${ev.description}</p>
              <a class="btn primary" href="${ev.link}">${ev.cta}</a>
            </div>
          `;
          eventsGrid.appendChild(card);
        });
      })
      .catch(err => console.error("Error loading events:", err));
  }

  // ====== Merch Dynamic Loader ======
  const merchGrid = document.getElementById("merch-grid");
  if (merchGrid) {
    fetch("assets/js/merch.json")
      .then(res => res.json())
      .then(products => {
        products.forEach(item => {
          const card = document.createElement("article");
          card.className = "card";
          card.innerHTML = `
            <div class="thumb">
              <img src="${item.img}" alt="${item.alt}" loading="lazy">
            </div>
            <div class="pad">
              <h3>${item.title}</h3>
              <div class="meta">${item.price} • ${item.details}</div>
              <a class="btn primary" href="${item.link}">${item.cta}</a>
            </div>
          `;
          merchGrid.appendChild(card);
        });
      })
      .catch(err => console.error("Error loading merch:", err));
  }
});

// ====== Community Dynamic Loader ======
fetch("assets/js/community.json")
  .then(res => res.json())
  .then(data => {
    // Testimonials
    const testimonials = document.getElementById("testimonials");
    if (testimonials) {
      data.testimonials.forEach(t => {
        const div = document.createElement("div");
        div.className = "testimonial";
        div.innerHTML = `<p>${t.quote}</p><small>— ${t.author}</small>`;
        testimonials.appendChild(div);
      });
    }

    // Fan Gallery
    const gallery = document.getElementById("fan-gallery");
    if (gallery) {
      data.gallery.forEach(img => {
        const image = document.createElement("img");
        image.src = img.src;
        image.alt = img.alt;
        image.loading = "lazy"; // ✅ Lazy load
        gallery.appendChild(image);
      });
    }

    // Leaderboard
    const leaderboard = document.querySelector("#leaderboard tbody");
    if (leaderboard) {
      data.leaderboard.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${user.rank}</td><td>${user.name}</td><td>${user.points}</td>`;
        leaderboard.appendChild(row);
      });
    }
  })
  .catch(err => console.error("Error loading community data:", err));
