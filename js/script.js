// EMC Hospital: small, beginner-friendly interactions.
document.addEventListener("DOMContentLoaded", () => {
  // Keep the copyright year current.
  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  // Mobile navigation opens and closes with the menu button.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Generic live search helper. It hides cards that do not match.
  function filterCards(inputId, cardSelector, emptyId, countId, getText) {
    const input = document.getElementById(inputId);
    const cards = Array.from(document.querySelectorAll(cardSelector));
    const emptyMessage = document.getElementById(emptyId);
    const count = countId ? document.getElementById(countId) : null;
    if (!input || cards.length === 0) return;

    function update() {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const text = (getText ? getText(card) : card.textContent).toLowerCase();
        const matches = text.includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (emptyMessage) emptyMessage.hidden = visible !== 0;
      if (count) count.textContent = `${visible} department${visible === 1 ? "" : "s"}`;
    }
    input.addEventListener("input", update);
    update();
    return update;
  }

  filterCards(
    "department-search",
    "#department-list .service-card",
    "department-empty",
    "department-count",
    (card) => `${card.dataset.search || ""} ${card.textContent}`
  );

  // Doctor search and department filter work together.
  const doctorSearch = document.getElementById("doctor-search");
  const doctorFilter = document.getElementById("doctor-filter");
  const doctorCards = Array.from(document.querySelectorAll("#doctor-list .doctor-card"));
  const doctorEmpty = document.getElementById("doctor-empty");
  function updateDoctors() {
    if (!doctorCards.length) return;
    const query = doctorSearch ? doctorSearch.value.trim().toLowerCase() : "";
    const department = doctorFilter ? doctorFilter.value : "all";
    let visible = 0;
    doctorCards.forEach((card) => {
      const matchesText = `${card.dataset.name} ${card.dataset.specialty} ${card.textContent}`.toLowerCase().includes(query);
      const matchesDepartment = department === "all" || card.dataset.specialty === department;
      card.hidden = !(matchesText && matchesDepartment);
      if (!card.hidden) visible += 1;
    });
    if (doctorEmpty) doctorEmpty.hidden = visible !== 0;
  }
  if (doctorSearch) doctorSearch.addEventListener("input", updateDoctors);
  if (doctorFilter) doctorFilter.addEventListener("change", updateDoctors);

  // Demo pharmacy search and cart: information stays in this browser session only.
  filterCards("product-search", "#product-list .product-card", "product-empty", null,
    (card) => `${card.dataset.name || ""} ${card.textContent}`);

  let cartCount = 0;
  let cartTotal = 0;
  const countDisplay = document.getElementById("cart-count");
  const totalDisplay = document.getElementById("cart-total");
  const cartStatus = document.getElementById("cart-status");
  document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.closest(".product-card");
      const price = Number(product.dataset.price || 0);
      const name = product.dataset.name || "demo item";
      cartCount += 1;
      cartTotal += price;
      if (countDisplay) countDisplay.textContent = String(cartCount);
      if (totalDisplay) totalDisplay.textContent = `₹${cartTotal.toFixed(2)}`;
      if (cartStatus) cartStatus.textContent = `${name} added to your demonstration cart. No real order was placed.`;
    });
  });

  // Diagnostic form: native required/email checks happen before this handler.
  const diagnosticForm = document.getElementById("diagnostic-form");
  if (diagnosticForm) {
    diagnosticForm.addEventListener("submit", (event) => {
      event.preventDefault();
      document.getElementById("diagnostic-status").textContent =
        "Demo form validated. No information was sent or saved.";
      diagnosticForm.reset();
    });
  }

  // Appointment form: this only demonstrates client-side validation.
  const appointmentForm = document.getElementById("appointment");
  if (appointmentForm) {
    const dateInput = document.getElementById("patient-date");
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
    appointmentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      document.getElementById("appointment-status").textContent =
        "Demo confirmation: your form passed browser validation. No appointment was booked and no information was sent.";
      appointmentForm.reset();
    });
  }

  // News article search and category filtering.
  const newsSearch = document.getElementById("news-search");
  const newsFilter = document.getElementById("news-filter");
  const newsCards = Array.from(document.querySelectorAll("#news-list .news-card"));
  const newsEmpty = document.getElementById("news-empty");
  function updateNews() {
    if (!newsCards.length) return;
    const query = newsSearch ? newsSearch.value.trim().toLowerCase() : "";
    const category = newsFilter ? newsFilter.value : "all";
    let visible = 0;
    newsCards.forEach((card) => {
      const textMatches = `${card.dataset.search || ""} ${card.textContent}`.toLowerCase().includes(query);
      const categoryMatches = category === "all" || card.dataset.category === category;
      card.hidden = !(textMatches && categoryMatches);
      if (!card.hidden) visible += 1;
    });
    if (newsEmpty) newsEmpty.hidden = visible !== 0;
  }
  if (newsSearch) newsSearch.addEventListener("input", updateNews);
  if (newsFilter) newsFilter.addEventListener("change", updateNews);

  // Accessible sample article modal.
  const modal = document.getElementById("article-modal");
  const closeModal = modal ? modal.querySelector(".modal-close") : null;
  let previousFocus = null;
  function hideModal() {
    if (!modal) return;
    modal.hidden = true;
    if (previousFocus) previousFocus.focus();
  }
  document.querySelectorAll(".read-more").forEach((button) => {
    button.addEventListener("click", () => {
      if (!modal) return;
      previousFocus = button;
      document.getElementById("modal-title").textContent = button.dataset.title || "Sample article";
      document.getElementById("modal-copy").textContent = button.dataset.copy || "";
      modal.hidden = false;
      if (closeModal) closeModal.focus();
    });
  });
  if (closeModal) closeModal.addEventListener("click", hideModal);
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) hideModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) hideModal();
    });
  }
});