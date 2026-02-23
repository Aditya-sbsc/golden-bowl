/* ======================================================
   GOLDEN BOWL — AI Restaurant Concierge
   Built-in chat assistant with knowledge base
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const assistant = document.getElementById('ai-assistant');
    const toggle = document.getElementById('ai-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatClose = document.getElementById('ai-chat-close');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const messagesContainer = document.getElementById('ai-chat-messages');

    // ---- Toggle Chat ----
    function openChat() {
        assistant.classList.add('open');
        chatWindow.setAttribute('aria-hidden', 'false');
        chatInput.focus();
    }
    function closeChat() {
        assistant.classList.remove('open');
        chatWindow.setAttribute('aria-hidden', 'true');
    }
    toggle.addEventListener('click', () => {
        assistant.classList.contains('open') ? closeChat() : openChat();
    });
    chatClose.addEventListener('click', closeChat);

    // ---- Quick Action Buttons ----
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ai-quick-btn')) {
            const query = e.target.getAttribute('data-query');
            if (query) handleUserMessage(query);
        }
    });

    // ---- Form Submit ----
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        handleUserMessage(msg);
        chatInput.value = '';
    });

    // ---- Handle User Message ----
    function handleUserMessage(text) {
        appendMessage(text, 'user');
        showTyping();
        const delay = 800 + Math.random() * 800;
        setTimeout(() => {
            removeTyping();
            const response = generateResponse(text);
            appendMessage(response, 'bot');
        }, delay);
    }

    // ---- Append Message ----
    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `ai-message ai-message-${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'ai-message-avatar';
        avatar.textContent = sender === 'bot' ? '🍜' : 'You';

        const bubble = document.createElement('div');
        bubble.className = 'ai-message-bubble';
        bubble.innerHTML = `<p>${text}</p>`;

        div.appendChild(avatar);
        div.appendChild(bubble);
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ---- Typing Indicator ----
    function showTyping() {
        const div = document.createElement('div');
        div.className = 'ai-message ai-message-bot';
        div.id = 'ai-typing-indicator';
        div.innerHTML = `
      <div class="ai-message-avatar">🍜</div>
      <div class="ai-message-bubble">
        <div class="ai-typing">
          <span></span><span></span><span></span>
        </div>
      </div>`;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    function removeTyping() {
        const el = document.getElementById('ai-typing-indicator');
        if (el) el.remove();
    }

    // ---- Knowledge Base & Response Generator ----
    const KB = {
        popular: [
            'Our most popular dishes are:',
            '• <strong>Tonkotsu Heritage</strong> — 18-hour pork bone broth with hand-pulled noodles and truffle oil ($24)',
            '• <strong>Spicy Miso Dragon</strong> — fermented miso with Szechuan chili and house chili crisp ($22)',
            '• <strong>Golden Dragon Bowl</strong> — our signature saffron and gold leaf wagyu masterpiece ($48)',
            'Would you like to know more about any of these?'
        ],
        vegan: [
            'Absolutely! We offer several plant-based options:',
            '• <strong>Garden Zen</strong> — crystal-clear kombu dashi, seasonal vegetables, silken tofu ($20)',
            '• <strong>Mushroom Forest</strong> — five-mushroom medley in rich vegetable broth ($19)',
            '• <strong>Spicy Tofu Thunder</strong> — crispy tofu in our house chili miso ($18)',
            'All vegan dishes are clearly marked on our menu. We also accommodate gluten-free requests!'
        ],
        reservation: [
            'I would love to help you with a reservation! You can:',
            '1. Scroll down to our <strong>Reservation section</strong> on this page and fill out the form',
            '2. Call us directly at <strong>+1 (555) 888-9999</strong>',
            '3. Email us at <strong>hello@goldenbowl.com</strong>',
            'We recommend booking at least 2 days in advance, especially for weekend dining.'
        ],
        signature: [
            'The <strong>Golden Dragon Bowl</strong> is our crown jewel — a true culinary masterpiece.',
            'It features a 72-hour bone broth infused with saffron and edible gold leaf, topped with A5 wagyu beef tartare, black truffle shavings, and hand-pulled noodles made fresh each morning.',
            'Starting at <strong>$48</strong>, it is an unforgettable experience we highly recommend.',
            'Would you like to reserve a table to try it?'
        ],
        hours: [
            'Our operating hours are:',
            '• <strong>Monday — Friday:</strong> 11:30 AM — 10:00 PM',
            '• <strong>Saturday:</strong> 12:00 PM — 11:00 PM',
            '• <strong>Sunday:</strong> 12:00 PM — 9:00 PM',
            'Last seating is 45 minutes before closing.'
        ],
        dietary: [
            'We take dietary needs very seriously. We offer:',
            '• <strong>Vegan & Vegetarian</strong> options',
            '• <strong>Gluten-free</strong> noodle alternatives',
            '• <strong>Nut-free</strong> preparations on request',
            '• <strong>Low-sodium</strong> broth options',
            'Please inform your server of any allergies, and our chef will accommodate you.'
        ],
        location: [
            'We are located at <strong>123 Sakura Lane, Downtown District</strong>.',
            'Easy access by public transport — 5 minutes walk from Central Station.',
            'We have validated parking available for guests.',
            'You can also find us on Google Maps by searching "Golden Bowl Restaurant."'
        ],
        greeting: [
            'Welcome to Golden Bowl! I am here to help you discover your perfect dining experience. Feel free to ask me about our menu, dietary options, reservations, or anything else!'
        ]
    };

    function generateResponse(input) {
        const q = input.toLowerCase();

        if (/popular|best|recommend|favorite|top/i.test(q)) return KB.popular.join('<br/>');
        if (/vegan|vegetarian|plant[\s-]?based/i.test(q)) return KB.vegan.join('<br/>');
        if (/reserv|book|table|seat/i.test(q)) return KB.reservation.join('<br/>');
        if (/signature|golden.?dragon|special|masterpiece|wagyu/i.test(q)) return KB.signature.join('<br/>');
        if (/hour|open|close|time|when/i.test(q)) return KB.hours.join('<br/>');
        if (/diet|allerg|gluten|nut[\s-]?free|intoleran/i.test(q)) return KB.dietary.join('<br/>');
        if (/where|location|address|direction|parking|find/i.test(q)) return KB.location.join('<br/>');
        if (/hi|hello|hey|greet|good\s/i.test(q)) return KB.greeting.join('<br/>');

        if (/price|cost|how much|expensive/i.test(q)) {
            return 'Our dishes range from <strong>$18 — $48</strong>. Appetizers start at $12, and our premium tasting menu is $85 per person. Would you like to see our most popular options?';
        }
        if (/spicy|hot|chili/i.test(q)) {
            return 'Our <strong>Spicy Miso Dragon</strong> ($22) is our most popular spicy dish — fermented miso with Szechuan chili and house chili crisp. We also offer adjustable spice levels on most ramen bowls!';
        }
        if (/dessert|sweet/i.test(q)) {
            return 'We have exquisite desserts including <strong>Matcha Lava Cake</strong>, <strong>Black Sesame Panna Cotta</strong>, and <strong>Yuzu Sorbet with Gold Leaf</strong>. All handcrafted by our pastry chef.';
        }
        if (/drink|wine|sake|cocktail|beverage/i.test(q)) {
            return 'Our beverage menu features premium <strong>Japanese sake</strong>, curated <strong>wines</strong>, signature <strong>cocktails</strong>, and artisanal <strong>teas</strong>. Our sommelier can pair the perfect drink with your meal!';
        }
        if (/kid|child|family/i.test(q)) {
            return 'We welcome families! We offer a <strong>Kids Menu</strong> with smaller portions and milder flavors. High chairs are available, and our staff is always happy to accommodate families.';
        }
        if (/takeout|delivery|take[\s-]?away/i.test(q)) {
            return 'Yes, we offer both <strong>takeout and delivery</strong>! You can order through our website or call us at <strong>+1 (555) 888-9999</strong>. Please note that our signature Gold Dragon Bowl is dine-in only.';
        }
        if (/thank/i.test(q)) {
            return 'You are most welcome! It is my pleasure to assist you. If you have any other questions, do not hesitate to ask. We look forward to welcoming you at Golden Bowl! 🍜';
        }

        // Default
        return 'Thank you for your question! While I may not have the specific answer right now, I would be happy to help with our <strong>menu recommendations</strong>, <strong>dietary options</strong>, <strong>reservations</strong>, or <strong>operating hours</strong>. What would you like to know?';
    }
});
