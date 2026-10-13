// Backend API Connection for MySQL database
    (function() {
      const contactForm = document.getElementById('contactForm');
      const statusMessage = document.getElementById('statusMessage');

      function loadOutbox() { try { return JSON.parse(localStorage.getItem('contactOutbox') || '[]'); } catch { return []; } }
      function saveOutbox(queue) { localStorage.setItem('contactOutbox', JSON.stringify(queue)); }

      async function postContactTo(url, formData) {
        const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        return resp;
      }

      async function postContact(formData) {
        const apiBase = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';
        const apiUrl = `${apiBase}/api/contacts`;
        try {
          const response = await postContactTo(apiUrl, formData);
          if (response.ok) return await response.json();
          const text = await response.text();
          return { error: `Server responded: ${response.status} ${text}` };
        } catch (error) {
          console.error('API request failed:', error);
          return { error: 'Connection error. Backend server is not available.' };
        }
      }

      async function flushOutbox() {
        const queue = loadOutbox();
        if (!queue.length) return;
        const apiBase = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';
        const apiUrl = `${apiBase}/api/contacts`;
        const remaining = [];
        for (const item of queue) {
          try {
            const response = await postContactTo(apiUrl, item);
            if (!response.ok) remaining.push(item);
          } catch (e) { remaining.push(item); }
        }
        saveOutbox(remaining);
        if (remaining.length === 0 && queue.length > 0) {
          statusMessage.style.display = 'block';
          statusMessage.style.color = 'green';
          statusMessage.textContent = `✓ ${queue.length} queued message(s) synced to server.`;
          setTimeout(() => statusMessage.style.display = 'none', 5000);
        }
      }

      // Try flushing queued items on load and every 30s
      flushOutbox();
      setInterval(flushOutbox, 30000);

      if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = {
            name: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
          };
          if (!formData.name || !formData.email || !formData.message) {
            statusMessage.style.display = 'block'; statusMessage.style.color = 'red'; statusMessage.textContent = '✗ Please fill all required fields'; return;
          }
          statusMessage.style.display = 'block'; statusMessage.style.color = '#0f172a'; statusMessage.textContent = '⏳ Sending...';
          const result = await postContact(formData);
          if (result && result.success) {
            statusMessage.style.display = 'block'; statusMessage.style.color = 'green'; statusMessage.textContent = '✓ Message sent successfully and saved to database!'; contactForm.reset(); setTimeout(flushOutbox, 1000);
          } else {
            const queue = loadOutbox(); queue.push(formData); saveOutbox(queue);
            statusMessage.style.display = 'block'; statusMessage.style.color = 'orange'; statusMessage.textContent = '⚠ Message saved locally. It will be sent automatically when the server is available.'; contactForm.reset();
          }
          setTimeout(() => { statusMessage.style.display = 'none'; }, 7000);
        });
      }
    })();

// Typing Animation
    const text = "Hi, I am Vikki Kumar.";
    const typingElement = document.querySelector(".typing");
    let index = 0;
    let isDeleting = false;

    function type() {
      if (!isDeleting) {
        typingElement.textContent = text.substring(0, index + 1);
        index++;
        if (index === text.length) {
          isDeleting = true;
          setTimeout(type, 1500);
          return;
        }
      } else {
        typingElement.textContent = text.substring(0, index - 1);
        index--;
        if (index === 0) {
          isDeleting = false;
        }
      }
      setTimeout(type, isDeleting ? 60 : 100);
    }

    type();

    const portrait = document.querySelector(".about-img");
    const portraitInner = document.querySelector(".about-img-inner");
    if (portrait && portraitInner) {
      const bodyViews = [...portraitInner.querySelectorAll(".about-img-view")];
      let rotation = 0;
      let dragStartX = 0;
      let dragStartRotation = 0;
      let activePointer = null;

      function angleDelta(angle, viewAngle) {
        const normalized = ((angle % 360) + 360) % 360;
        return ((normalized - viewAngle + 540) % 360) - 180;
      }

      function setPortraitRotation(angle) {
        rotation = angle;
        const normalized = ((rotation % 360) + 360) % 360;
        const activeIndex = Math.round(normalized / 90) % 4;

        bodyViews.forEach((view, index) => {
          const viewAngle = Number(view.dataset.angle);
          view.style.setProperty("--view-turn", angleDelta(rotation, viewAngle) + "deg");
          view.style.opacity = index === activeIndex ? "1" : "0";
          view.style.zIndex = index === activeIndex ? "2" : "1";
          view.setAttribute("aria-hidden", index === activeIndex ? "false" : "true");
        });
      }

      setPortraitRotation(0);

      portrait.addEventListener("pointerdown", (event) => {
        if (!event.isPrimary || (event.button !== undefined && event.button !== 0)) return;
        activePointer = event.pointerId;
        dragStartX = event.clientX;
        dragStartRotation = rotation;
        portrait.classList.add("is-dragging");
        portrait.setPointerCapture(activePointer);
      });

      portrait.addEventListener("pointermove", (event) => {
        if (event.pointerId !== activePointer) return;
        setPortraitRotation(dragStartRotation + (event.clientX - dragStartX) * 0.9);
      });

      function endPortraitDrag(event) {
        if (event.pointerId !== activePointer) return;
        activePointer = null;
        portrait.classList.remove("is-dragging");
      }

      portrait.addEventListener("pointerup", endPortraitDrag);
      portrait.addEventListener("pointercancel", endPortraitDrag);
      portrait.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setPortraitRotation(rotation - 15);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          setPortraitRotation(rotation + 15);
        } else if (event.key === "Home") {
          event.preventDefault();
          setPortraitRotation(0);
        }
      });

      document.querySelectorAll(".photo-controls [data-rotate], .photo-controls [data-yaw]").forEach((button) => {
        button.addEventListener("click", () => {
          if (button.dataset.yaw !== undefined) {
            setPortraitRotation(Number(button.dataset.yaw));
          } else {
            setPortraitRotation(0);
          }
          portrait.focus();
        });
      });
    }
