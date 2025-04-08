document.addEventListener("DOMContentLoaded", function () {
    console.log(" DOM Loaded");

    //  Handle Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log(" Login Form Submitted");

            const email = document.getElementById("loginEmail")?.value.trim();
            const password = document.getElementById("loginPassword")?.value.trim();

            if (!email || !password) {
                alert(" Please enter both email and password.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();
                console.log(" Login Response:", result);

                if (response.ok) {
                    alert("Login successful! Redirecting...");
                    window.location.href = "index.html";
                } else {
                    alert(" " + (result.error || "Login failed."));
                }
            } catch (error) {
                console.error(" Login Error:", error);
                alert("⚠️ Server not responding. Please try again later.");
            }
        });
    }

    //  Handle Registration
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log(" Registration Form Submitted");

            const email = document.getElementById("email")?.value.trim();
            const password = document.getElementById("password")?.value.trim();

            if (!email || !password) {
                alert(" All fields are required.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();
                console.log(" Registration Response:", result);

                if (response.ok) {
                    alert("Registration successful! Redirecting to login...");
                    window.location.href = "login.html";
                } else {
                    alert(" " + (result.error || "Registration failed."));
                }
            } catch (error) {
                console.error(" Registration Error:", error);
                alert(" Server not responding. Please try again later.");
            }
        });
    }

    //  Handle Donation
    const donationForm = document.getElementById("donationForm");
    if (donationForm) {
        donationForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(donationForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch("http://localhost:5000/donate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                const result = await res.json();
                alert(result.message || "Thanks for donating!");
                donationForm.reset();
            } catch (err) {
                console.error(" Submission error:", err);
                alert("Something went wrong");
            }
        });
    }

    // Handle Request
    const requestForm = document.getElementById("requestForm");
    if (requestForm) {
        requestForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log(" Request Form Submitted");

            const requesterName = document.getElementById("requesterName")?.value.trim();
            const requesterEmail = document.getElementById("requesterEmail")?.value.trim();
            const size = document.getElementById("requestSize")?.value.trim();
            const itemType = document.getElementById("requestItemType")?.value.trim();
            const pickupAddress = document.getElementById("requestPickupAddress")?.value.trim();

            console.log(" Field Values:", {
                requesterName,
                requesterEmail,
                size,
                itemType,
                pickupAddress
            });

            if (!requesterName || !requesterEmail || !size || !itemType || !pickupAddress) {
                alert("All fields are required.");
                return;
            }

            try {
                const payload = {
                    name: requesterName,
                    email: requesterEmail,
                    size: size,
                    address: pickupAddress,
                    itemType: itemType
                };

                console.log(" Sending Payload:", payload);

                const response = await fetch("http://localhost:5000/request", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                console.log(" Request Response:", result);

                if (response.ok) {
                    alert("✅ Request recorded successfully!");
                    requestForm.reset();
                } else {
                    alert(" " + (result.error || "Request failed."));
                }
            } catch (error) {
                console.error(" Request Error:", error);
                alert(" Server not responding. Please try again later.");
            }
        });
    }
});
