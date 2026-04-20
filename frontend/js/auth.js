const API_BASE = "http://localhost:3000";

function showMessage(message, isError = false) {
  let messageBox = document.getElementById("form-message");

  if (!messageBox) {
    messageBox = document.createElement("div");
    messageBox.id = "form-message";
    messageBox.style.marginTop = "16px";
    messageBox.style.padding = "12px";
    messageBox.style.borderRadius = "8px";
    messageBox.style.fontSize = "14px";
    messageBox.style.fontWeight = "500";

    const form =
      document.querySelector("form") ||
      document.querySelector(".auth-container") ||
      document.body;

    form.appendChild(messageBox);
  }

  messageBox.textContent = message;
  messageBox.style.background = isError ? "#3a1f1f" : "#1f3a28";
  messageBox.style.color = isError ? "#ffb3b3" : "#b9f6ca";
  messageBox.style.border = isError
    ? "1px solid #ff6b6b"
    : "1px solid #4caf50";
}

async function handleSignup(event) {
  event.preventDefault();

  const inputs = document.querySelectorAll("input");
  const name = inputs[0]?.value?.trim();
  const email = inputs[1]?.value?.trim();
  const password = inputs[2]?.value?.trim();

  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role: "marketing",
      }),
    });

    const result = await response.json();

    if (!result.success) {
      showMessage(result.message || "Signup failed", true);
      return;
    }

    showMessage("Signup successful. Redirecting to login...");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  } catch (error) {
    console.error("Signup error:", error);
    showMessage("Could not connect to server", true);
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const inputs = document.querySelectorAll("input");
  const email = inputs[0]?.value?.trim();
  const password = inputs[1]?.value?.trim();

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      showMessage(result.message || "Login failed", true);
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(result.data));
    showMessage("Login successful. Redirecting...");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } catch (error) {
    console.error("Login error:", error);
    showMessage("Could not connect to server", true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop();

  const form = document.querySelector("form");

  if (!form) return;

  if (page === "signup.html") {
    form.addEventListener("submit", handleSignup);
  } else if (page === "index.html" || page === "") {
    form.addEventListener("submit", handleLogin);
  }
});
