const MANIFEST_URL = "/content/manifest.json";

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, String(v));
  }
  for (const child of children) node.append(child);
  return node;
}

function formatType(type) {
  if (!type) return "link";
  return String(type).toUpperCase();
}

function setupAdminLogin() {
  const adminBtn = document.getElementById("adminBtn");
  const logoutBtn = document.getElementById("adminLogoutBtn");
  const panel = document.getElementById("adminPanel");
  if (!adminBtn || !panel) return;

  const ident = window.netlifyIdentity;

  const setAuthed = (user) => {
    if (user) {
      adminBtn.textContent = "Admin";
      adminBtn.setAttribute("aria-pressed", "true");
      panel.hidden = false;
    } else {
      adminBtn.textContent = "Admin login";
      adminBtn.setAttribute("aria-pressed", "false");
      panel.hidden = true;
    }
  };

  if (!ident) {
    // Still show a helpful message if not running on Netlify / Identity not enabled.
    adminBtn.textContent = "Admin (Identity not enabled)";
    adminBtn.disabled = true;
    adminBtn.style.cursor = "not-allowed";
    setAuthed(null);
    return;
  }

  // Initial state
  setAuthed(ident.currentUser());

  adminBtn.addEventListener("click", () => {
    const user = ident.currentUser();
    if (user) ident.open("user");
    else ident.open("login");
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => ident.logout());
  }

  ident.on("init", setAuthed);
  ident.on("login", (user) => {
    setAuthed(user);
    ident.close();
  });
  ident.on("logout", () => setAuthed(null));
}

async function loadManifest() {
  const res = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load manifest (${res.status})`);
  return res.json();
}

function renderGrid(manifest) {
  const grid = document.getElementById("materialsGrid");
  const meta = document.getElementById("materialsMeta");
  if (!grid || !meta) return;

  const items = Array.isArray(manifest?.items) ? manifest.items : [];
  meta.textContent = `${items.length} item${items.length === 1 ? "" : "s"} · source: content/manifest.json`;

  grid.replaceChildren(
    ...items.map((item) => {
      const href = `/viewer/?id=${encodeURIComponent(item.id)}`;
      const tile = el(
        "a",
        { class: "tile", href },
        [
          el("div", { class: "tile__kicker", text: item.label ?? "Material" }),
          el("h3", { class: "tile__title", text: item.title ?? item.id }),
          el("div", { class: "tile__meta", text: `${formatType(item.type)} · open` }),
        ],
      );
      return tile;
    }),
  );
}

function renderError(err) {
  const grid = document.getElementById("materialsGrid");
  const meta = document.getElementById("materialsMeta");
  if (meta) meta.textContent = "Failed to load materials.";
  if (!grid) return;

  grid.replaceChildren(
    el("div", { class: "card" }, [
      el("h2", { class: "card__title", text: "Could not load materials" }),
      el("p", { class: "muted", text: String(err?.message ?? err) }),
      el("p", { class: "muted", text: "Check that content/manifest.json exists and is valid JSON." }),
    ]),
  );
}

setupAdminLogin();
loadManifest().then(renderGrid).catch(renderError);

