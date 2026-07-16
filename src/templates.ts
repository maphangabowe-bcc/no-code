import { MobileTemplate } from './types';

export const MOBILE_TEMPLATES: MobileTemplate[] = [
  {
    id: 'cafe-shop',
    name: 'Coffee Shop App',
    description: 'A boutique cafe app with item catalog, customized sizing, dynamic cart, and interactive checkout receipt dialog.',
    icon: 'Coffee',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boutique Brew</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      user-select: none;
    }
    .display-font {
      font-family: 'Space Grotesk', sans-serif;
    }
    ::-webkit-scrollbar {
      display: none;
    }
  </style>
</head>
<body class="bg-stone-50 text-stone-800 min-h-screen flex flex-col pb-16">

  <!-- Header -->
  <header class="bg-amber-900 text-stone-100 p-4 sticky top-0 z-10 flex justify-between items-center shadow-md">
    <div class="flex items-center gap-2">
      <i data-lucide="coffee" class="text-amber-400 w-6 h-6"></i>
      <h1 class="display-font font-bold text-lg tracking-wide">Boutique Brew</h1>
    </div>
    <button onclick="toggleCart()" class="relative p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition">
      <i data-lucide="shopping-bag" class="w-5 h-5"></i>
      <span id="cart-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center hidden">0</span>
    </button>
  </header>

  <!-- Promo Hero -->
  <div class="p-4 bg-gradient-to-r from-amber-800 to-amber-950 text-amber-50 p-6 rounded-b-2xl shadow-inner mb-4">
    <h2 class="display-font text-xl font-bold mb-1">Morning Roast is Live!</h2>
    <p class="text-stone-300 text-xs mb-3 font-light">Get 20% off your first order using code <span class="font-mono bg-amber-900/50 px-1.5 py-0.5 rounded text-amber-300">BREW20</span></p>
    <div class="inline-block bg-amber-500 text-amber-950 font-bold px-3 py-1 rounded-full text-xs">Order Now</div>
  </div>

  <!-- Main Menu -->
  <main class="flex-1 px-4 overflow-y-auto">
    <h3 class="display-font font-bold text-lg mb-3 flex items-center gap-1.5">
      <span class="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
      House Favorites
    </h3>

    <!-- Menu Items Grid -->
    <div class="space-y-3" id="menu-items">
      <!-- Item 1 -->
      <div class="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-stone-100 hover:border-amber-200 transition">
        <div class="w-16 h-16 rounded-lg bg-amber-100 flex items-center justify-center text-3xl">☕</div>
        <div class="flex-1">
          <h4 class="font-semibold text-sm">Caramel Macchiato</h4>
          <p class="text-stone-400 text-xs mt-0.5 line-clamp-1">Fresh espresso with vanilla and caramel drizzle.</p>
          <span class="text-amber-700 font-bold text-sm mt-1 inline-block">$4.95</span>
        </div>
        <button onclick="addToCart('Caramel Macchiato', 4.95, '☕')" class="bg-amber-100 text-amber-950 hover:bg-amber-500 hover:text-white transition p-2 rounded-lg">
          <i data-lucide="plus" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Item 2 -->
      <div class="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-stone-100 hover:border-amber-200 transition">
        <div class="w-16 h-16 rounded-lg bg-emerald-50 flex items-center justify-center text-3xl">🍵</div>
        <div class="flex-1">
          <h4 class="font-semibold text-sm">Matcha Oat Latte</h4>
          <p class="text-stone-400 text-xs mt-0.5 line-clamp-1">Ceremonial grade matcha whisked with oatmilk.</p>
          <span class="text-amber-700 font-bold text-sm mt-1 inline-block">$5.25</span>
        </div>
        <button onclick="addToCart('Matcha Oat Latte', 5.25, '🍵')" class="bg-amber-100 text-amber-950 hover:bg-amber-500 hover:text-white transition p-2 rounded-lg">
          <i data-lucide="plus" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Item 3 -->
      <div class="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-stone-100 hover:border-amber-200 transition">
        <div class="w-16 h-16 rounded-lg bg-orange-50 flex items-center justify-center text-3xl">🥐</div>
        <div class="flex-1">
          <h4 class="font-semibold text-sm">Butter Croissant</h4>
          <p class="text-stone-400 text-xs mt-0.5 line-clamp-1">Warm, flaky, multi-layered French pastry.</p>
          <span class="text-amber-700 font-bold text-sm mt-1 inline-block">$3.75</span>
        </div>
        <button onclick="addToCart('Butter Croissant', 3.75, '🥐')" class="bg-amber-100 text-amber-950 hover:bg-amber-500 hover:text-white transition p-2 rounded-lg">
          <i data-lucide="plus" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Item 4 -->
      <div class="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-stone-100 hover:border-amber-200 transition">
        <div class="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center text-3xl">🥤</div>
        <div class="flex-1">
          <h4 class="font-semibold text-sm">Cold Brew Nitro</h4>
          <p class="text-stone-400 text-xs mt-0.5 line-clamp-1">Slow-steeped nitrogen-infused cold brew coffee.</p>
          <span class="text-amber-700 font-bold text-sm mt-1 inline-block">$4.50</span>
        </div>
        <button onclick="addToCart('Cold Brew Nitro', 4.50, '🥤')" class="bg-amber-100 text-amber-950 hover:bg-amber-500 hover:text-white transition p-2 rounded-lg">
          <i data-lucide="plus" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  </main>

  <!-- Shopping Cart Modal overlay -->
  <div id="cart-drawer" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 flex justify-end transform translate-x-full transition-transform duration-300">
    <div class="bg-white w-5/6 max-w-md h-full flex flex-col shadow-2xl p-4">
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h2 class="display-font font-bold text-lg flex items-center gap-1.5">
          <i data-lucide="shopping-bag" class="text-amber-800"></i> My Order
        </h2>
        <button onclick="toggleCart()" class="p-1 hover:bg-stone-100 rounded-full">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
      </div>

      <!-- Cart Content -->
      <div class="flex-1 overflow-y-auto space-y-3" id="cart-items-container">
        <!-- Empty Cart -->
        <div id="cart-empty" class="text-center py-12 text-stone-400">
          <div class="text-5xl mb-3">🛒</div>
          <p class="text-sm">Your cart is currently empty.</p>
          <p class="text-xs mt-1">Add some sweet treats and warm brews!</p>
        </div>
      </div>

      <!-- Cart Footer Totals -->
      <div class="border-t pt-4 mt-4 space-y-2.5">
        <div class="flex justify-between text-xs text-stone-500">
          <span>Subtotal</span>
          <span id="subtotal-val">$0.00</span>
        </div>
        <div class="flex justify-between text-xs text-stone-500">
          <span>Tax (8%)</span>
          <span id="tax-val">$0.00</span>
        </div>
        <div class="flex justify-between font-bold text-stone-800 text-base">
          <span>Total</span>
          <span id="total-val" class="text-amber-800">$0.00</span>
        </div>

        <button onclick="checkoutOrder()" class="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold py-3 rounded-xl mt-2 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2">
          <i data-lucide="credit-card" class="w-5 h-5"></i> Confirm & Pay
        </button>
      </div>
    </div>
  </div>

  <!-- Receipt / Checkout Modal -->
  <div id="checkout-modal" class="fixed inset-0 bg-black/70 backdrop-blur-md z-30 flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl transform scale-95 opacity-0 transition-all duration-300" id="receipt-box">
      <div class="text-center mb-4">
        <div class="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-2xl mb-2">✓</div>
        <h3 class="display-font font-bold text-lg">Order Confirmed!</h3>
        <p class="text-stone-400 text-xs">Estimated prep time: 8-12 mins</p>
      </div>

      <div class="border-t border-b border-dashed border-stone-200 py-3 my-3 font-mono text-xs space-y-1.5">
        <div class="flex justify-between">
          <span class="text-stone-400">Receipt No:</span>
          <span>#BB-89271</span>
        </div>
        <div class="flex justify-between">
          <span class="text-stone-400">Date:</span>
          <span id="receipt-date">Today</span>
        </div>
        <div class="border-t border-stone-100 pt-2 my-2"></div>
        <div id="receipt-items" class="space-y-1">
          <!-- Dynamically inserted receipt items -->
        </div>
        <div class="border-t border-stone-100 pt-2 my-2"></div>
        <div class="flex justify-between font-bold text-sm">
          <span>TOTAL PAID:</span>
          <span id="receipt-total" class="text-amber-800">$0.00</span>
        </div>
      </div>

      <div class="text-center text-xs text-stone-400 mt-2">
        <p>Thank you for supporting Boutique Brew!</p>
        <button onclick="closeReceipt()" class="w-full bg-stone-100 text-stone-800 hover:bg-stone-200 font-semibold py-2.5 rounded-xl mt-4 transition">
          Close & Back to Menu
        </button>
      </div>
    </div>
  </div>

  <!-- Bottom Bar Navigation Mimic -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 py-1.5 px-6 flex justify-around items-center text-stone-400">
    <button class="flex flex-col items-center gap-0.5 text-amber-800">
      <i data-lucide="store" class="w-5 h-5"></i>
      <span class="text-[10px] font-medium">Menu</span>
    </button>
    <button onclick="alertToast('Saved to Favorites!')" class="flex flex-col items-center gap-0.5 hover:text-stone-700 transition">
      <i data-lucide="heart" class="w-5 h-5"></i>
      <span class="text-[10px]">Favorites</span>
    </button>
    <button onclick="alertToast('No reward points active')" class="flex flex-col items-center gap-0.5 hover:text-stone-700 transition">
      <i data-lucide="gift" class="w-5 h-5"></i>
      <span class="text-[10px]">Rewards</span>
    </button>
  </nav>

  <!-- Custom Toast Notifier -->
  <div id="toast" class="fixed bottom-20 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-100 text-xs px-3.5 py-2 rounded-full shadow-lg opacity-0 transform translate-y-4 pointer-events-none transition-all duration-300 z-50">
    Toast message
  </div>

  <script>
    // State
    let cart = [];

    // Initialize Lucide icons
    lucide.createIcons();

    function alertToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.classList.remove('opacity-0', 'translate-y-4');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-4');
      }, 2000);
    }

    function toggleCart() {
      const drawer = document.getElementById('cart-drawer');
      drawer.classList.toggle('translate-x-full');
    }

    function addToCart(name, price, emoji) {
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, emoji, qty: 1 });
      }
      updateCartUI();
      alertToast(\`Added \${name} to cart!\`);
    }

    function changeQty(name, delta) {
      const item = cart.find(item => item.name === name);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
          cart = cart.filter(i => i.name !== name);
        }
      }
      updateCartUI();
    }

    function updateCartUI() {
      const container = document.getElementById('cart-items-container');
      const badge = document.getElementById('cart-badge');
      const emptyMsg = document.getElementById('cart-empty');

      container.innerHTML = '';
      
      const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
      if (totalItems > 0) {
        badge.innerText = totalItems;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
        container.appendChild(emptyMsg);
      }

      cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'bg-stone-50 rounded-lg p-2.5 flex items-center justify-between border border-stone-100';
        itemEl.innerHTML = \`
          <div class="flex items-center gap-2">
            <span class="text-2xl">\${item.emoji}</span>
            <div>
              <h5 class="font-semibold text-xs text-stone-800">\${item.name}</h5>
              <span class="text-stone-500 text-[10px]">\$\${(item.price * item.qty).toFixed(2)}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="changeQty('\${item.name}', -1)" class="w-5 h-5 rounded bg-white hover:bg-stone-100 flex items-center justify-center font-bold text-xs shadow-sm">-</button>
            <span class="text-xs font-semibold w-4 text-center">\${item.qty}</span>
            <button onclick="changeQty('\${item.name}', 1)" class="w-5 h-5 rounded bg-white hover:bg-stone-100 flex items-center justify-center font-bold text-xs shadow-sm">+</button>
          </div>
        \`;
        container.appendChild(itemEl);
      });

      // Calculate totals
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      document.getElementById('subtotal-val').innerText = \`$\${subtotal.toFixed(2)}\`;
      document.getElementById('tax-val').innerText = \`$\${tax.toFixed(2)}\`;
      document.getElementById('total-val').innerText = \`$\${total.toFixed(2)}\`;
    }

    function checkoutOrder() {
      if (cart.length === 0) {
        alertToast('Add items to order first!');
        return;
      }

      // Populate Receipt
      const receiptContainer = document.getElementById('receipt-items');
      receiptContainer.innerHTML = '';
      
      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'flex justify-between';
        row.innerHTML = \`
          <span>\${item.qty}x \${item.name}</span>
          <span>\$\${(item.price * item.qty).toFixed(2)}</span>
        \`;
        receiptContainer.appendChild(row);
      });

      const totalText = document.getElementById('total-val').innerText;
      document.getElementById('receipt-total').innerText = totalText;
      document.getElementById('receipt-date').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' | ' + new Date().toLocaleDateString();

      // Show checkout modal
      const modal = document.getElementById('checkout-modal');
      const receiptBox = document.getElementById('receipt-box');
      
      modal.classList.remove('hidden');
      setTimeout(() => {
        receiptBox.classList.remove('scale-95', 'opacity-0');
        receiptBox.classList.add('scale-100', 'opacity-100');
      }, 50);

      // Reset Cart
      cart = [];
      updateCartUI();
      toggleCart();
    }

    function closeReceipt() {
      const modal = document.getElementById('checkout-modal');
      const receiptBox = document.getElementById('receipt-box');

      receiptBox.classList.add('scale-95', 'opacity-0');
      receiptBox.classList.remove('scale-100', 'opacity-100');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }
  </script>
</body>
</html>
`
  },
  {
    id: 'link-bio',
    name: 'Link-in-Bio App',
    description: 'A responsive link aggregator / landing page. Features active connection count and an interactive live contact drawer.',
    icon: 'User',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alex Rivera | Creator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
  </style>
</head>
<body class="bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-slate-100 min-h-screen p-4 flex flex-col justify-between">

  <!-- Main Profile -->
  <div class="flex-1 max-w-sm mx-auto w-full pt-6">
    <div class="text-center mb-6">
      <div class="relative inline-block">
        <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-500 p-1 mx-auto mb-3 shadow-xl">
          <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">✨</div>
        </div>
        <span class="absolute bottom-4 right-1 bg-green-500 w-4.5 h-4.5 rounded-full border-4 border-slate-900 animate-pulse"></span>
      </div>
      
      <h1 class="text-xl font-bold tracking-tight">Alex Rivera</h1>
      <p class="text-indigo-300 text-xs mt-1 font-medium">Digital Designer & Tech Storyteller</p>
      
      <p class="text-slate-400 text-xs mt-3 px-4 leading-relaxed font-light">
        Sharing weekly resources, web tips, and aesthetic tech layouts with creators around the globe.
      </p>
    </div>

    <!-- Live Social Counters Banner -->
    <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-3 flex justify-around text-center mb-5">
      <div>
        <div class="font-bold text-base text-indigo-300">124K</div>
        <div class="text-[10px] text-slate-400">Followers</div>
      </div>
      <div class="border-l border-slate-700 h-8 self-center"></div>
      <div class="cursor-pointer" onclick="clickLink('YouTube')">
        <div class="font-bold text-base text-red-400 flex items-center justify-center gap-1">32K</div>
        <div class="text-[10px] text-slate-400">Subscribers</div>
      </div>
      <div class="border-l border-slate-700 h-8 self-center"></div>
      <div class="cursor-pointer" onclick="clickLink('Coffee')">
        <div class="font-bold text-base text-amber-400 id='coffee-ctr'">2.4K</div>
        <div class="text-[10px] text-slate-400">Coffee tips</div>
      </div>
    </div>

    <!-- Interactive Links Container -->
    <div class="space-y-3" id="links-container">
      <a onclick="clickLink('Latest UI Toolkit')" href="javascript:void(0)" class="block bg-slate-800/80 hover:bg-indigo-900 border border-slate-700 hover:border-indigo-500 rounded-xl p-3.5 flex items-center gap-3.5 transition group">
        <div class="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition">
          <i data-lucide="package" class="w-5 h-5"></i>
        </div>
        <div class="flex-1 text-left">
          <h4 class="font-semibold text-xs tracking-tight text-white">Latest UI Kit (Free)</h4>
          <p class="text-[10px] text-slate-400">25+ mobile templates & layouts for designers.</p>
        </div>
        <i data-lucide="arrow-right" class="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition"></i>
      </a>

      <a onclick="clickLink('Weekly Newsletter')" href="javascript:void(0)" class="block bg-slate-800/80 hover:bg-purple-950 border border-slate-700 hover:border-purple-500 rounded-xl p-3.5 flex items-center gap-3.5 transition group">
        <div class="bg-purple-500/10 text-purple-400 p-2 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition">
          <i data-lucide="mail" class="w-5 h-5"></i>
        </div>
        <div class="flex-1 text-left">
          <h4 class="font-semibold text-xs tracking-tight text-white">Behind The Screen</h4>
          <p class="text-[10px] text-slate-400">My weekly newsletter sharing productivity secrets.</p>
        </div>
        <i data-lucide="arrow-right" class="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition"></i>
      </a>

      <a onclick="clickLink('Tech Desk Setup')" href="javascript:void(0)" class="block bg-slate-800/80 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 rounded-xl p-3.5 flex items-center gap-3.5 transition group">
        <div class="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition">
          <i data-lucide="monitor" class="w-5 h-5"></i>
        </div>
        <div class="flex-1 text-left">
          <h4 class="font-semibold text-xs tracking-tight text-white">My Desk Setup Essentials</h4>
          <p class="text-[10px] text-slate-400">Curated gear list for ultimate remote setup.</p>
        </div>
        <i data-lucide="arrow-right" class="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition"></i>
      </a>
    </div>

    <!-- Primary Message CTA Button -->
    <button onclick="toggleContactForm()" class="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-xl mt-6 shadow-lg flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]">
      <i data-lucide="message-square" class="w-5 h-5"></i> Send a Direct Message
    </button>
  </div>

  <!-- Social Icons Footer -->
  <footer class="text-center py-4 text-slate-500 space-y-2">
    <div class="flex justify-center gap-5">
      <a href="javascript:void(0)" onclick="clickLink('Twitter')" class="hover:text-indigo-400 transition"><i data-lucide="twitter" class="w-5 h-5"></i></a>
      <a href="javascript:void(0)" onclick="clickLink('Instagram')" class="hover:text-pink-400 transition"><i data-lucide="instagram" class="w-5 h-5"></i></a>
      <a href="javascript:void(0)" onclick="clickLink('GitHub')" class="hover:text-slate-100 transition"><i data-lucide="github" class="w-5 h-5"></i></a>
      <a href="javascript:void(0)" onclick="clickLink('LinkedIn')" class="hover:text-sky-400 transition"><i data-lucide="linkedin" class="w-5 h-5"></i></a>
    </div>
    <p class="text-[10px] tracking-wider text-slate-600">© Alex Rivera. Powered by No-code App Builder</p>
  </footer>

  <!-- Contact Sheet (Drawer) -->
  <div id="contact-drawer" class="fixed inset-x-0 bottom-0 bg-slate-900 border-t border-slate-700/80 z-20 rounded-t-3xl p-5 transform translate-y-full transition-transform duration-300 shadow-2xl">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-base flex items-center gap-2">
        <i data-lucide="message-square" class="text-fuchsia-400"></i> Get in Touch
      </h3>
      <button onclick="toggleContactForm()" class="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Form -->
    <form id="msg-form" onsubmit="submitForm(event)" class="space-y-3.5">
      <div>
        <label class="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Your Name</label>
        <input required type="text" id="form-name" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 transition">
      </div>
      <div>
        <label class="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Message Type</label>
        <select id="form-type" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 transition">
          <option value="Collab">Sponsorship / Collaboration</option>
          <option value="Question">General Question</option>
          <option value="Feedback">Feedback / Love</option>
        </select>
      </div>
      <div>
        <label class="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Message</label>
        <textarea required id="form-msg" rows="3" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 transition resize-none"></textarea>
      </div>

      <button type="submit" class="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2.5 rounded-lg text-xs mt-2 transition shadow-md">
        Send Message
      </button>
    </form>

    <!-- Success Message (Overlay in Drawer) -->
    <div id="form-success" class="hidden text-center py-8 space-y-3">
      <div class="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
      <h4 class="font-semibold text-sm">Message Transmitted!</h4>
      <p class="text-slate-400 text-xs px-6">I have received your message and will read it shortly. Thanks for reaching out!</p>
      <button onclick="resetContactForm()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-lg text-xs transition">
        Send another
      </button>
    </div>
  </div>

  <!-- Custom Alert Toast -->
  <div id="toast" class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl opacity-0 transform translate-y-4 pointer-events-none transition-all duration-300 z-50">
    Toast message
  </div>

  <script>
    lucide.createIcons();
    
    function alertToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.classList.remove('opacity-0', 'translate-y-4');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-4');
      }, 2000);
    }

    function clickLink(title) {
      alertToast(\`Navigating to "\${title}"...\`);
    }

    function toggleContactForm() {
      const drawer = document.getElementById('contact-drawer');
      drawer.classList.toggle('translate-y-full');
    }

    function submitForm(e) {
      e.preventDefault();
      document.getElementById('msg-form').classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
    }

    function resetContactForm() {
      document.getElementById('msg-form').reset();
      document.getElementById('msg-form').classList.remove('hidden');
      document.getElementById('form-success').classList.add('hidden');
      toggleContactForm();
    }
  </script>
</body>
</html>
`
  },
  {
    id: 'fitness-tracker',
    name: 'Fitness Log App',
    description: 'A dynamic health/gym logger. Allows adding exercise entries, selecting durations, logging calories, with a interactive progress chart.',
    icon: 'Flame',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PulseFit</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 flex flex-col justify-between">

  <!-- Header -->
  <div class="flex justify-between items-center mb-5">
    <div class="flex items-center gap-2">
      <div class="bg-rose-500 text-white p-1.5 rounded-lg">
        <i data-lucide="flame" class="w-5 h-5"></i>
      </div>
      <div>
        <h1 class="font-bold text-base leading-tight">PulseFit Log</h1>
        <p class="text-[10px] text-slate-400">Goal: 600 kcal / day</p>
      </div>
    </div>
    <div class="bg-slate-800 border border-slate-700 rounded-full px-2.5 py-1 text-xs font-semibold text-rose-400 flex items-center gap-1">
      <i data-lucide="zap" class="w-3.5 h-3.5"></i> Streak: 5d
    </div>
  </div>

  <!-- Progress Circle Section -->
  <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 text-center mb-4">
    <div class="relative w-28 h-28 mx-auto flex items-center justify-center mb-3">
      <!-- SVG Track ring -->
      <svg class="absolute w-full h-full transform -rotate-90">
        <circle cx="56" cy="56" r="48" stroke="#1e293b" stroke-width="8" fill="transparent" />
        <circle id="progress-circle" cx="56" cy="56" r="48" stroke="#f43f5e" stroke-width="8" stroke-dasharray="301.6" stroke-dashoffset="180" fill="transparent" class="transition-all duration-500 ease-out" />
      </svg>
      <div class="text-center z-10">
        <div class="font-bold text-2xl" id="burned-ctr">240</div>
        <div class="text-[9px] text-slate-400 uppercase tracking-wider">Kcal Burned</div>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-2 text-center mt-2">
      <div class="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div class="text-[9px] text-slate-400 uppercase">Minutes</div>
        <div class="font-bold text-sm text-slate-200" id="minutes-ctr">40m</div>
      </div>
      <div class="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div class="text-[9px] text-slate-400 uppercase">Progress</div>
        <div class="font-bold text-sm text-rose-400" id="percent-ctr">40%</div>
      </div>
    </div>
  </div>

  <!-- Activity Logging Panel -->
  <div class="flex-1 space-y-4">
    <!-- Log Form -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
      <h3 class="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
        <i data-lucide="plus-circle" class="w-4 h-4"></i> Log New Workout
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-[9px] text-slate-400 mb-1">Activity</label>
          <select id="log-type" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500">
            <option value="Running">🏃 Running (12 kcal/m)</option>
            <option value="Weightlifting">🏋 Weightlifting (6 kcal/m)</option>
            <option value="Cycling">🚴 Cycling (9 kcal/m)</option>
            <option value="Yoga">🧘 Yoga (4 kcal/m)</option>
          </select>
        </div>
        <div>
          <label class="block text-[9px] text-slate-400 mb-1">Duration (Min)</label>
          <input type="number" id="log-duration" value="20" min="1" max="180" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500">
        </div>
      </div>
      <button onclick="logActivity()" class="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-xl text-xs transition">
        Add Entry
      </button>
    </div>

    <!-- Workout History Log -->
    <div class="space-y-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Workout Logs</h3>
      <div class="space-y-1.5 overflow-y-auto max-h-40" id="logs-container">
        <!-- Static Default Logs -->
        <div class="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-lg">🏃</span>
            <div>
              <h5 class="text-xs font-semibold">Running</h5>
              <p class="text-[9px] text-slate-400">15 mins</p>
            </div>
          </div>
          <span class="text-xs font-bold text-rose-400">+180 kcal</span>
        </div>
        
        <div class="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-lg">🏋</span>
            <div>
              <h5 class="text-xs font-semibold">Weightlifting</h5>
              <p class="text-[9px] text-slate-400">10 mins</p>
            </div>
          </div>
          <span class="text-xs font-bold text-rose-400">+60 kcal</span>
        </div>
      </div>
    </div>
  </div>

  <script>
    lucide.createIcons();
    
    // Stats State
    let totalKcal = 240;
    let totalMins = 25;
    const goalKcal = 600;

    function updateProgress() {
      // Circle dash-offset (r=48, circumference=301.6)
      const pct = Math.min(100, Math.round((totalKcal / goalKcal) * 100));
      const dashOffset = 301.6 - (301.6 * (pct / 100));
      
      document.getElementById('progress-circle').setAttribute('stroke-dashoffset', dashOffset);
      document.getElementById('burned-ctr').innerText = totalKcal;
      document.getElementById('minutes-ctr').innerText = totalMins + 'm';
      document.getElementById('percent-ctr').innerText = pct + '%';
    }

    function logActivity() {
      const select = document.getElementById('log-type');
      const name = select.value;
      const mins = parseInt(document.getElementById('log-duration').value) || 0;

      if (mins <= 0) return;

      let kcalPerMin = 6;
      let emoji = '🏋';

      if (name === "Running") {
        kcalPerMin = 12;
        emoji = '🏃';
      } else if (name === "Cycling") {
        kcalPerMin = 9;
        emoji = '🚴';
      } else if (name === "Yoga") {
        kcalPerMin = 4;
        emoji = '🧘';
      }

      const totalGain = mins * kcalPerMin;
      totalKcal += totalGain;
      totalMins += mins;

      // Update UI log
      const logsContainer = document.getElementById('logs-container');
      const item = document.createElement('div');
      item.className = 'bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center transform scale-95 opacity-0 transition-all duration-300';
      item.innerHTML = \`
        <div class="flex items-center gap-2">
          <span class="text-lg">\${emoji}</span>
          <div>
            <h5 class="text-xs font-semibold">\${name}</h5>
            <p class="text-[9px] text-slate-400">\${mins} mins</p>
          </div>
        </div>
        <span class="text-xs font-bold text-rose-400">+\${totalGain} kcal</span>
      \`;
      
      logsContainer.insertBefore(item, logsContainer.firstChild);
      setTimeout(() => {
        item.classList.remove('scale-95', 'opacity-0');
        item.classList.add('scale-100', 'opacity-100');
      }, 50);

      updateProgress();
    }
  </script>
</body>
</html>
`
  },
  {
    id: 'clicker-game',
    name: 'Gem Clicker Game',
    description: 'An incremental clicker game. Click a central glowing gem, earn currency, and purchase multipliers or auto-click upgrades.',
    icon: 'Sparkles',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gem Clicker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body {
      user-select: none;
      -webkit-user-select: none;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 flex flex-col justify-between">

  <!-- Header Stats -->
  <div class="flex justify-between items-center bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl mb-4">
    <div class="flex items-center gap-2">
      <div class="bg-indigo-500/10 text-indigo-400 p-2 rounded-xl">
        <i data-lucide="gem" class="w-5 h-5"></i>
      </div>
      <div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wide">Wallet</div>
        <div class="font-black text-lg text-indigo-300" id="coin-ctr">0</div>
      </div>
    </div>
    <div class="text-right">
      <div class="text-[10px] text-slate-400 uppercase">Auto Earnings</div>
      <div class="font-semibold text-xs text-emerald-400" id="income-rate">+0/s</div>
    </div>
  </div>

  <!-- Core Tap Stage -->
  <div class="flex-1 flex flex-col items-center justify-center py-6">
    <button onclick="tapGem(event)" id="gem-btn" class="relative group outline-none focus:outline-none focus:ring-0 active:scale-95 transform transition-transform duration-100 cursor-pointer">
      <!-- Ambient light -->
      <div class="absolute -inset-2 bg-indigo-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition"></div>
      
      <!-- Big Gem Shape -->
      <div class="relative bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-indigo-400 w-36 h-36 rounded-full flex items-center justify-center border-4 border-indigo-300 shadow-2xl">
        <i data-lucide="sparkles" class="w-16 h-16 text-white animate-pulse"></i>
      </div>
    </button>
    <p class="text-[10px] text-slate-500 mt-5 uppercase tracking-widest animate-bounce">Tap to Extract Gems</p>
  </div>

  <!-- Upgrades Store -->
  <div class="space-y-2 mb-4">
    <h3 class="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
      <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Tool Upgrades
    </h3>

    <div class="grid grid-cols-2 gap-2">
      <!-- Upgrade 1 -->
      <button onclick="buyUpgrade('click')" id="upg-click" class="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-2.5 rounded-xl text-left transition flex flex-col justify-between h-20">
        <div class="flex justify-between items-center w-full">
          <span class="text-[10px] uppercase font-bold text-indigo-400">Super Pick</span>
          <span class="text-[9px] bg-indigo-950 text-indigo-300 px-1 py-0.2 rounded font-mono" id="upg-click-lvl">Lvl 1</span>
        </div>
        <div class="text-[9px] text-slate-400">Current: +1/tap</div>
        <div class="text-xs font-bold text-amber-400 flex items-center gap-0.5">
          <i data-lucide="gem" class="w-3 h-3"></i> <span id="upg-click-cost">15</span>
        </div>
      </button>

      <!-- Upgrade 2 -->
      <button onclick="buyUpgrade('auto')" id="upg-auto" class="bg-slate-900 border border-slate-800 hover:border-emerald-500 p-2.5 rounded-xl text-left transition flex flex-col justify-between h-20">
        <div class="flex justify-between items-center w-full">
          <span class="text-[10px] uppercase font-bold text-emerald-400">Excavator</span>
          <span class="text-[9px] bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded font-mono" id="upg-auto-lvl">Lvl 0</span>
        </div>
        <div class="text-[9px] text-slate-400">Current: +0/sec</div>
        <div class="text-xs font-bold text-amber-400 flex items-center gap-0.5">
          <i data-lucide="gem" class="w-3 h-3"></i> <span id="upg-auto-cost">50</span>
        </div>
      </button>
    </div>
  </div>

  <script>
    lucide.createIcons();

    // Game Core State
    let coins = 0;
    let clickPower = 1;
    let autoPower = 0;

    let costClick = 15;
    let lvlClick = 1;

    let costAuto = 50;
    let lvlAuto = 0;

    function tapGem(e) {
      coins += clickPower;
      updateUI();
      triggerClickFloat(e);
    }

    function triggerClickFloat(e) {
      const btn = document.getElementById('gem-btn');
      const rect = btn.getBoundingClientRect();
      const floatVal = document.createElement('div');
      floatVal.className = 'absolute font-black text-lg text-indigo-300 pointer-events-none select-none z-50 animate-bounce';
      floatVal.innerText = '+' + clickPower;
      
      // Position float
      const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY || rect.top + rect.height / 2) - rect.top;
      floatVal.style.left = x + 'px';
      floatVal.style.top = y - 20 + 'px';

      btn.appendChild(floatVal);
      setTimeout(() => {
        floatVal.remove();
      }, 800);
    }

    function buyUpgrade(type) {
      if (type === 'click') {
        if (coins >= costClick) {
          coins -= costClick;
          lvlClick++;
          clickPower += 1;
          costClick = Math.round(costClick * 1.6);
        }
      } else if (type === 'auto') {
        if (coins >= costAuto) {
          coins -= costAuto;
          lvlAuto++;
          autoPower += 1;
          costAuto = Math.round(costAuto * 1.8);
        }
      }
      updateUI();
    }

    function updateUI() {
      document.getElementById('coin-ctr').innerText = coins;
      document.getElementById('income-rate').innerText = '+' + autoPower + '/s';

      // Upgrade 1 Card
      document.getElementById('upg-click-lvl').innerText = 'Lvl ' + lvlClick;
      document.getElementById('upg-click-cost').innerText = costClick;
      document.getElementById('upg-click').style.opacity = coins >= costClick ? '1' : '0.6';

      // Upgrade 2 Card
      document.getElementById('upg-auto-lvl').innerText = 'Lvl ' + lvlAuto;
      document.getElementById('upg-auto-cost').innerText = costAuto;
      document.getElementById('upg-auto').style.opacity = coins >= costAuto ? '1' : '0.6';
    }

    // Auto earning loop
    setInterval(() => {
      if (autoPower > 0) {
        coins += autoPower;
        updateUI();
      }
    }, 1000);
  </script>
</body>
</html>
`
  }
];
