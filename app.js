// REPLACE THIS WITH YOUR ACTUAL CLOUDFLARE WORKER URL
// Example: "https://my-worker.my-name.workers.dev"
const WORKER_URL = "YOUR_WORKER_URL_HERE";

async function generateEmail() {
    const prefixInput = document.getElementById("prefix").value.trim().toLowerCase();
    const btn = document.getElementById("generateBtn");
    const resultBox = document.getElementById("result");
    const emailText = document.getElementById("emailText");
    const message = document.getElementById("message");

    // Prevent empty input
    if (!prefixInput) {
        alert("Please enter a name!");
        return;
    }

    // Sanitize input (only allow letters, numbers, and dots)
    const cleanPrefix = prefixInput.replace(/[^a-z0-9.]/g, "");
    
    if (cleanPrefix.length === 0) {
        alert("Please use valid characters (a-z, 0-9, .)");
        return;
    }

    // Update UI while loading
    btn.disabled = true;
    btn.innerText = "Generating...";
    resultBox.style.display = "none";
    resultBox.classList.remove("error");

    try {
        // Send request to Cloudflare Worker
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prefix: cleanPrefix })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to generate email");
        }

        // Show success
        emailText.innerText = data.email;
        
        if (data.message === "Email already exists and is active.") {
            message.innerText = "This email already exists and is ready to use.";
        } else {
            message.innerText = "Email created and forwarding to your inbox!";
        }
        
        resultBox.style.display = "block";

    } catch (error) {
        // Show error
        message.innerText = error.message;
        emailText.innerText = "";
        resultBox.classList.add("error");
        resultBox.style.display = "block";
    } finally {
        // Reset button
        btn.disabled = false;
        btn.innerText = "Generate Email";
    }
}

function copyEmail() {
    const email = document.getElementById("emailText").innerText;
    if (email) {
        navigator.clipboard.writeText(email).then(() => {
            const copyBtn = document.querySelector(".copy-btn");
            copyBtn.innerText = "Copied!";
            setTimeout(() => { copyBtn.innerText = "Copy to Clipboard"; }, 2000);
        });
    }
}
