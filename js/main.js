
// --- Intro Loader ---
const introText = "Let's Start My Portfolio";
const introTextDiv = document.querySelector('.intro-text');

introText.split("").forEach((char, i) => {
    const span = document.createElement('span');
    span.innerText = char === " " ? "\u00A0" : char;
    span.className = "il";
    // "Let's Start My " has 15 characters
    if (i >= 15) span.classList.add('accent');
    span.style.transitionDelay = `${i * 0.06}s`;
    introTextDiv.appendChild(span);
});

window.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        document.querySelectorAll('.il').forEach(el => el.style.opacity = '1');
        document.querySelectorAll('.il').forEach(el => el.style.transform = 'rotateX(0)');
    }, 100);

    const fill = document.querySelector('.intro-fill');
    fill.style.transition = 'width 2.5s linear';
    setTimeout(() => fill.style.width = '100%', 100);

    setTimeout(() => {
        document.getElementById('intro').style.transform = 'translateY(-100%)';
        setTimeout(() => {
            document.getElementById('intro').remove();
            document.body.style.overflow = 'auto';
            // Trigger hero animations
            document.getElementById('home').classList.add('on');
            document.querySelectorAll('#home .rv').forEach(el => el.classList.add('on'));
        }, 900);
    }, 3200);
});

// --- Theme Toggle ---
function toggleTheme() {
    const html = document.documentElement;
    const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.querySelector('.toggle-knob').innerText = theme === 'dark' ? '🌙' : '☀️';
}

(function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    window.addEventListener('DOMContentLoaded', () => {
        document.querySelector('.toggle-knob').innerText = savedTheme === 'dark' ? '🌙' : '☀️';
    });
})();

// --- Custom Cursor ---
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-r');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cur.style.left = mouseX + 'px';
    cur.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    curR.style.left = ringX + 'px';
    curR.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .theme-toggle, .offer-card, .project-card, .available-badge').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cur.style.width = '40px';
        cur.style.height = '40px';
        curR.style.width = '52px';
        curR.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
        cur.style.width = '10px';
        cur.style.height = '10px';
        curR.style.width = '36px';
        curR.style.height = '36px';
    });
});

// --- Scroll Logic ---
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('prog').style.width = scrolled + "%";

    // Parallax
    const hbox = document.getElementById('hbox');
    if (hbox) {
        hbox.style.transform = `translateY(${window.scrollY * 0.1}px)`;
    }

    // Update Nav Active Link
    const sections = document.querySelectorAll('section');
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
});

// --- Intersection Observer for Reveals ---
const observerOptions = { threshold: 0.08 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('on');
            if (entry.target.classList.contains('about-right')) startStats();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.rv, .rl, .rr').forEach(el => observer.observe(el));

// Safety fallback
setTimeout(() => {
    document.querySelectorAll('.rv, .rl, .rr').forEach(el => el.classList.add('on'));
}, 5000);

// --- Stats Count Up ---
function startStats() {
    const counts = document.querySelectorAll('.count');
    counts.forEach(count => {
        const target = +count.getAttribute('data-target');
        const duration = 1500;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                count.innerText = Math.ceil(current) + (target === 100 ? "%" : "+");
                requestAnimationFrame(updateCount);
            } else {
                count.innerText = target + (target === 100 ? "%" : "+");
            }
        };
        updateCount();
    });
}

// --- Mobile Menu ---
const hbg = document.getElementById('hbg');
const mob = document.getElementById('mob');
hbg.addEventListener('click', () => {
    mob.classList.toggle('open');
    hbg.innerHTML = mob.classList.contains('open') ? '<i class="fa-solid fa-xmark" style="color:#ffcc00"></i>' : '<i class="fa-solid fa-bars-staggered"></i>';
});

document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        mob.classList.remove('open');
        hbg.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
    });
});

// --- Tabs ---
function switchTab(paneId, btn) {
    document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(paneId).classList.add('active');
    btn.classList.add('active');
}

// --- Accordion ---
function toggleAccordion(card) {
    const isOpen = card.classList.contains('open');
    document.querySelectorAll('.offer-card').forEach(c => c.classList.remove('open'));
    if (!isOpen) card.classList.add('open');
}

// --- Contact Form ---
function toggleForm() {
    const form = document.getElementById('contactform');
    const btn = document.getElementById('sayHelloBtn');
    if (form.style.display === 'block') {
        form.style.display = 'none';
        btn.innerText = 'Say Hello';
    } else {
        form.style.display = 'block';
        btn.innerText = '✕ Close';
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

// function sendForm(e) {
//     e.preventDefault();
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const subject = document.getElementById('subject').value;
//     const message = document.getElementById('message').value;

//     const mailto = `mailto:nehlan488@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message)}`;
//     window.location.href = mailto;

//     setTimeout(() => {
//         const wa = `https://wa.me/9645883490?text=${encodeURIComponent("Hello Nehla! 👋\n\nName: " + name + "\nEmail: " + email + "\nSubject: " + subject + "\nMessage: " + message)}`;
//         window.open(wa, '_blank');
//     }, 800);
// }