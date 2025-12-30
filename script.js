// Form submission handler
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnLoading = document.getElementById("btnLoading");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Reset status
      formStatus.className = "form-status";
      formStatus.style.display = "none";

      // Clear previous errors
      document.querySelectorAll(".error-message").forEach((el) => {
        el.textContent = "";
      });
      document.querySelectorAll(".form-input").forEach((el) => {
        el.classList.remove("error");
      });

      // Validate form
      let isValid = true;

      // Validate name
      const nameInput = document.getElementById("name");
      const nameError = document.getElementById("name-error");
      if (!nameInput.value.trim()) {
        nameInput.classList.add("error");
        nameError.textContent = "Please enter your name";
        isValid = false;
      }

      // Validate email
      const emailInput = document.getElementById("email");
      const emailError = document.getElementById("email-error");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        emailInput.classList.add("error");
        emailError.textContent = "Please enter your email";
        isValid = false;
      } else if (!emailPattern.test(emailInput.value)) {
        emailInput.classList.add("error");
        emailError.textContent = "Please enter a valid email address";
        isValid = false;
      }

      // Validate message
      const messageInput = document.getElementById("message");
      const messageError = document.getElementById("message-error");
      if (!messageInput.value.trim()) {
        messageInput.classList.add("error");
        messageError.textContent = "Please enter your message";
        isValid = false;
      }

      if (!isValid) return;

      // Show loading state
      submitBtn.disabled = true;
      btnText.style.display = "none";
      btnLoading.style.display = "inline";

      try {
        // Prepare form data
        const formData = new FormData(contactForm);

        // Submit to Formspree
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // Success
          formStatus.textContent =
            "Thank you! Your message has been sent successfully.";
          formStatus.className = "form-status success";
          formStatus.style.display = "block";
          contactForm.reset();
        } else {
          // Formspree error
          const errorData = await response.json();
          let errorMessage = "Oops! There was a problem submitting your form.";

          if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = errorData.errors
              .map((error) => error.message)
              .join(", ");
          }

          formStatus.textContent = errorMessage;
          formStatus.className = "form-status error";
          formStatus.style.display = "block";
        }
      } catch (error) {
        // Network error
        formStatus.textContent =
          "Network error. Please check your connection and try again.";
        formStatus.className = "form-status error";
        formStatus.style.display = "block";
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoading.style.display = "none";

        // Auto-hide status message after 5 seconds
        if (formStatus.style.display === "block") {
          setTimeout(() => {
            formStatus.style.display = "none";
          }, 5000);
        }
      }
    });

    // Real-time validation as user types
    const formInputs = contactForm.querySelectorAll(".form-input");
    formInputs.forEach((input) => {
      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          this.classList.remove("error");
          const errorId = this.id + "-error";
          const errorElement = document.getElementById(errorId);
          if (errorElement) {
            errorElement.textContent = "";
          }
        }
      });
    });
  }

  // Smooth scroll with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Parallax effect on scroll
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    const gradient1 = document.querySelector(".gradient-1");
    const gradient2 = document.querySelector(".gradient-2");

    if (gradient1 && gradient2) {
      gradient1.style.transform = `translateY(${rate * 0.3}px)`;
      gradient2.style.transform = `translateY(${rate * 0.5}px)`;
    }
  });

  // Add scroll-based header background
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
      header.style.background = "rgba(10, 10, 10, 0.95)";
    } else {
      header.style.background = "rgba(10, 10, 10, 0.8)";
    }
  });

  // Project card animations
  document.querySelectorAll(".project-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 300 + index * 200);
  });

  // Project image hover effect
  document.querySelectorAll(".project-image").forEach((img) => {
    img.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    img.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
});
