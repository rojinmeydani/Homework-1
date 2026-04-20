const API_BASE = "http://localhost:3000";

function createMessageBox() {
  let box = document.getElementById("campaign-message");
  if (!box) {
    box = document.createElement("div");
    box.id = "campaign-message";
    box.className = "campaign-alert";
  }
  return box;
}

function showCampaignMessage(message, isError = false) {
  const box = createMessageBox();
  box.textContent = message;
  box.className = isError
    ? "campaign-alert campaign-alert-error"
    : "campaign-alert campaign-alert-success";
}

function renderUser() {
  const userData = localStorage.getItem("loggedInUser");
  if (!userData) return;

  const user = JSON.parse(userData);

  const nameTargets = document.querySelectorAll(".profile-name, .user-name, .header-user-name");
  nameTargets.forEach((el) => {
    el.textContent = user.name;
  });
}

function ensureCampaignSection() {
  let section = document.getElementById("campaigns-section");
  if (section) return section;

  section = document.createElement("section");
  section.id = "campaigns-section";
  section.className = "campaigns-shell";

  section.innerHTML = `
    <div class="campaigns-card">
      <div class="campaigns-header">
        <div>
          <h2 class="campaigns-title">Campaigns</h2>
          <p class="campaigns-subtitle">Manage live, scheduled, and draft campaigns from your dashboard.</p>
        </div>
        <button id="add-campaign-btn" class="campaign-btn campaign-btn-primary">
          + New Campaign
        </button>
      </div>

      <div id="campaign-form-wrapper" class="campaign-form-panel campaign-hidden">
        <div class="campaign-form-top">
          <div>
            <h3 id="campaign-form-title">Add Campaign</h3>
            <p class="campaign-form-subtitle">Create or update a campaign without leaving the dashboard.</p>
          </div>
        </div>

        <form id="campaign-form" class="campaign-form-grid">
          <input type="hidden" id="campaign-id" />

          <div class="campaign-field">
            <label for="campaign-title">Title</label>
            <input id="campaign-title" type="text" placeholder="Spring Promo" required />
          </div>

          <div class="campaign-field">
            <label for="campaign-channel">Channel</label>
            <input id="campaign-channel" type="text" placeholder="Instagram" required />
          </div>

          <div class="campaign-field">
            <label for="campaign-budget">Budget</label>
            <input id="campaign-budget" type="number" placeholder="900" required />
          </div>

          <div class="campaign-field">
            <label for="campaign-status">Status</label>
            <input id="campaign-status" type="text" placeholder="active / paused / draft" required />
          </div>

          <div class="campaign-field campaign-field-full">
            <label for="campaign-start-date">Start Date</label>
            <input id="campaign-start-date" type="date" required />
          </div>

          <div class="campaign-form-actions campaign-field-full">
            <button type="submit" class="campaign-btn campaign-btn-primary">Save Campaign</button>
            <button type="button" id="cancel-campaign-btn" class="campaign-btn campaign-btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      <div class="campaign-table-wrap">
        <table id="campaigns-table" class="campaigns-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Channel</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="campaigns-body"></tbody>
        </table>
      </div>
    </div>
  `;

  const main =
    document.querySelector(".main-content") ||
    document.querySelector(".dashboard-main") ||
    document.querySelector(".dashboard-content") ||
    document.querySelector("main") ||
    document.body;

  main.appendChild(section);

  const messageBox = createMessageBox();
  section.prepend(messageBox);

  return section;
}

function formatBudget(value) {
  return `$${Number(value).toLocaleString()}`;
}

function formatStatus(status) {
  const clean = (status || "").toLowerCase().trim();

  if (clean === "active") return `<span class="campaign-badge campaign-badge-active">Active</span>`;
  if (clean === "paused") return `<span class="campaign-badge campaign-badge-paused">Paused</span>`;
  if (clean === "draft") return `<span class="campaign-badge campaign-badge-draft">Draft</span>`;
  return `<span class="campaign-badge campaign-badge-default">${status}</span>`;
}

async function loadCampaigns() {
  try {
    const response = await fetch(`${API_BASE}/api/campaigns`);
    const result = await response.json();

    if (!result.success) {
      showCampaignMessage(result.message || "Could not load campaigns", true);
      return;
    }

    const tbody = document.getElementById("campaigns-body");
    tbody.innerHTML = "";

    if (!result.data.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="campaign-empty-state">
            No campaigns yet. Create your first campaign.
          </td>
        </tr>
      `;
      return;
    }

    result.data.forEach((campaign) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>#${campaign.id}</td>
        <td class="campaign-cell-strong">${campaign.title}</td>
        <td>${campaign.channel}</td>
        <td>${formatBudget(campaign.budget)}</td>
        <td>${formatStatus(campaign.status)}</td>
        <td>${new Date(campaign.start_date).toLocaleDateString()}</td>
        <td>
          <div class="campaign-actions">
            <button class="campaign-btn campaign-btn-small campaign-btn-secondary" onclick='editCampaign(${JSON.stringify(campaign)})'>Edit</button>
            <button class="campaign-btn campaign-btn-small campaign-btn-danger" onclick='deleteCampaign(${campaign.id})'>Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Load campaigns error:", error);
    showCampaignMessage("Could not connect to server", true);
  }
}

function openCampaignForm(campaign = null) {
  document.getElementById("campaign-form-wrapper").classList.remove("campaign-hidden");
  document.getElementById("campaign-form-title").textContent = campaign ? "Edit Campaign" : "Add Campaign";

  document.getElementById("campaign-id").value = campaign?.id || "";
  document.getElementById("campaign-title").value = campaign?.title || "";
  document.getElementById("campaign-channel").value = campaign?.channel || "";
  document.getElementById("campaign-budget").value = campaign?.budget || "";
  document.getElementById("campaign-status").value = campaign?.status || "";
  document.getElementById("campaign-start-date").value = campaign?.start_date
    ? new Date(campaign.start_date).toISOString().split("T")[0]
    : "";

  document.getElementById("campaign-form-wrapper").scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeCampaignForm() {
  document.getElementById("campaign-form-wrapper").classList.add("campaign-hidden");
  document.getElementById("campaign-form").reset();
  document.getElementById("campaign-id").value = "";
}

async function saveCampaign(event) {
  event.preventDefault();

  const id = document.getElementById("campaign-id").value;
  const payload = {
    title: document.getElementById("campaign-title").value.trim(),
    channel: document.getElementById("campaign-channel").value.trim(),
    budget: document.getElementById("campaign-budget").value,
    status: document.getElementById("campaign-status").value.trim(),
    start_date: document.getElementById("campaign-start-date").value,
  };

  try {
    const url = id ? `${API_BASE}/api/campaigns/${id}` : `${API_BASE}/api/campaigns`;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.success) {
      showCampaignMessage(result.message || "Could not save campaign", true);
      return;
    }

    showCampaignMessage(result.message || "Campaign saved");
    closeCampaignForm();
    loadCampaigns();
  } catch (error) {
    console.error("Save campaign error:", error);
    showCampaignMessage("Could not connect to server", true);
  }
}

function editCampaign(campaign) {
  openCampaignForm(campaign);
}

async function deleteCampaign(id) {
  const confirmed = confirm("Are you sure you want to delete this campaign?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE}/api/campaigns/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!result.success) {
      showCampaignMessage(result.message || "Could not delete campaign", true);
      return;
    }

    showCampaignMessage(result.message || "Campaign deleted");
    loadCampaigns();
  } catch (error) {
    console.error("Delete campaign error:", error);
    showCampaignMessage("Could not connect to server", true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderUser();

  const page = window.location.pathname.split("/").pop();

  if (page !== "campaigns.html") return;

  ensureCampaignSection();
  loadCampaigns();

  document.getElementById("add-campaign-btn").addEventListener("click", () => openCampaignForm());
  document.getElementById("cancel-campaign-btn").addEventListener("click", closeCampaignForm);
  document.getElementById("campaign-form").addEventListener("submit", saveCampaign);
});

window.editCampaign = editCampaign;
window.deleteCampaign = deleteCampaign;
