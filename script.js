// ===============================
// PORTFOLIO JAVASCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // ELEMENTS
    // ===============================

    const menuButton = document.querySelector(".menu-button");
    const navLinks = document.querySelector(".nav-links");
    const themeButton = document.querySelector(".theme-button");
    const backToTop = document.querySelector(".back-to-top");
    const year = document.querySelector("#year");

    const navigationLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section[id]");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    // ===============================
    // MOBILE NAVIGATION
    // ===============================

    const closeMobileMenu = () => {
        if (!navLinks || !menuButton) return;

        navLinks.classList.remove("active");
        menuButton.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    };


    const openMobileMenu = () => {
        if (!navLinks || !menuButton) return;

        navLinks.classList.add("active");
        menuButton.classList.add("active");

        menuButton.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
    };


    if (menuButton && navLinks) {

        // Accessibility
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-controls", "primary-navigation");

        if (navLinks.id === "") {
            navLinks.id = "primary-navigation";
        }

        // Toggle menu
        menuButton.addEventListener("click", () => {

            const isOpen = navLinks.classList.contains("active");

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });


        // Close when navigation link is clicked
        navigationLinks.forEach(link => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });


        // Close when clicking outside the navigation
        document.addEventListener("click", event => {

            const clickedInsideMenu =
                navLinks.contains(event.target);

            const clickedButton =
                menuButton.contains(event.target);

            if (
                navLinks.classList.contains("active") &&
                !clickedInsideMenu &&
                !clickedButton
            ) {
                closeMobileMenu();
            }
        });


        // Close with Escape key
        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMobileMenu();
                menuButton.focus();
            }
        });


        // Close menu if screen becomes desktop size
        window.addEventListener("resize", () => {

            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }


    // ===============================
    // SMOOTH SCROLLING
    // ===============================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const navbar = document.querySelector("nav");

            const navbarHeight = navbar
                ? navbar.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight -
                20;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

            // Update URL without jumping
            if (history.pushState) {
                history.pushState(
                    null,
                    "",
                    targetId
                );
            }
        });
    });


    // ===============================
    // SCROLL REVEAL ANIMATION
    // ===============================

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("visible");

                            observer.unobserve(
                                entry.target
                            );
                        }
                    });
                },
                {
                    threshold: 0.15,
                    rootMargin: "0px 0px -50px 0px"
                }
            );


        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }


    // ===============================
    // BACK TO TOP BUTTON
    // ===============================

    if (backToTop) {

        const updateBackToTop = () => {

            if (window.scrollY > 500) {
                backToTop.classList.add("show");
                backToTop.setAttribute(
                    "aria-hidden",
                    "false"
                );
            } else {
                backToTop.classList.remove("show");
                backToTop.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        };


        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );


        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });
        });


        updateBackToTop();
    }


    // ===============================
    // ACTIVE NAVIGATION LINK
    // ===============================

    if (sections.length && navigationLinks.length) {

        const updateActiveSection = () => {

            const scrollPosition =
                window.scrollY + 180;

            let currentSection = "";

            sections.forEach(section => {

                const sectionTop =
                    section.offsetTop;

                const sectionBottom =
                    sectionTop +
                    section.offsetHeight;


                if (
                    scrollPosition >= sectionTop &&
                    scrollPosition < sectionBottom
                ) {
                    currentSection =
                        section.getAttribute("id");
                }
            });


            navigationLinks.forEach(link => {

                const href =
                    link.getAttribute("href");

                const isActive =
                    href === `#${currentSection}`;

                link.classList.toggle(
                    "active",
                    isActive
                );

                if (isActive) {
                    link.setAttribute(
                        "aria-current",
                        "page"
                    );
                } else {
                    link.removeAttribute(
                        "aria-current"
                    );
                }
            });
        };


        // Run once immediately
        updateActiveSection();


        // Efficient scroll handling
        let ticking = false;

        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    window.requestAnimationFrame(() => {

                        updateActiveSection();

                        ticking = false;
                    });

                    ticking = true;
                }
            },
            { passive: true }
        );
    }


    // ===============================
    // DARK / LIGHT MODE
    // ===============================

    if (themeButton) {

        const savedTheme =
            localStorage.getItem("theme");

        const systemPrefersLight =
            window.matchMedia(
                "(prefers-color-scheme: light)"
            ).matches;


        // Determine initial theme
        if (
            savedTheme === "light" ||
            (!savedTheme && systemPrefersLight)
        ) {
            document.body.classList.add("light-mode");
        }


        const updateThemeButton = () => {

            const isLight =
                document.body.classList.contains(
                    "light-mode"
                );


            themeButton.setAttribute(
                "aria-pressed",
                String(isLight)
            );


            themeButton.setAttribute(
                "aria-label",
                isLight
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            );


            // Optional icon support
            const icon =
                themeButton.querySelector(
                    "i, svg"
                );

            if (icon) {

                icon.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        };


        themeButton.addEventListener(
            "click",
            () => {

                const isLight =
                    document.body.classList.toggle(
                        "light-mode"
                    );


                localStorage.setItem(
                    "theme",
                    isLight
                        ? "light"
                        : "dark"
                );


                updateThemeButton();
            }
        );


        updateThemeButton();
    }


    // ===============================
    // CURRENT YEAR
    // ===============================

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }


    // ===============================
    // PREVENT BROKEN HASH ON PAGE LOAD
    // ===============================

    if (window.location.hash) {

        const target =
            document.querySelector(
                window.location.hash
            );

        if (target) {

            // Prevent browser's default
            // instant jump
            setTimeout(() => {

                const navbar =
                    document.querySelector("nav");

                const navbarHeight =
                    navbar
                        ? navbar.offsetHeight
                        : 0;


                const position =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    navbarHeight -
                    20;


                window.scrollTo({
                    top: Math.max(0, position),
                    behavior: "auto"
                });

            }, 0);
        }
    }

});