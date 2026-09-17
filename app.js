/* ============================================================
   MARVIN LIRIO — PORTFOLIO V2.3.5
   app.js

   Handles:
   1. Theme management
   2. Mobile navigation
   3. Interactive experience timeline
   4. Responsive experience placement
   5. Role detail controls
   6. Project detail controls
   7. Scroll reveal
   8. Active navigation
   9. Header scroll state
   10. Carousel navigation
   11. Mobile carousel swipe navigation
============================================================ */


/* ============================================================
   DOM REFERENCES
============================================================ */

const root = document.documentElement;

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

const siteHeader = document.querySelector(".site-header");

const navLinks = document.querySelectorAll(".nav-link");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

const careerPath = document.querySelector(".career-path");
const careerStops = document.querySelectorAll(".career-stop[data-company]");
const companyPanels = document.querySelectorAll("[data-company-panel]");
const companyDisplay = document.querySelector(".company-display");

const roleToggles = document.querySelectorAll(".role-toggle");
const projectToggles = document.querySelectorAll(".project-toggle");

const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");

const horizontalTracks = document.querySelectorAll(".horizontal-track[id]");


/* ============================================================
   BREAKPOINTS
============================================================ */

const MOBILE_BREAKPOINT = 700;
const NAV_BREAKPOINT = 1000;

const isMobileViewport = () =>
    window.innerWidth <= MOBILE_BREAKPOINT;


/* ============================================================
   EXPERIENCE DISPLAY HOME

   The shared company display normally lives below the complete
   experience timeline.

   On mobile, it moves directly beneath the selected company.

   This placeholder preserves its original location so it can
   be restored when leaving the mobile layout.
============================================================ */

let companyDisplayHome = null;

if (companyDisplay) {
    companyDisplayHome = document.createComment("company-display-home");

    companyDisplay.parentNode.insertBefore(
        companyDisplayHome,
        companyDisplay
    );
}


/* ============================================================
   THEME MANAGEMENT

   Theme order:
   system → light → dark → system

   Manual selections are stored in localStorage.
============================================================ */

const THEME_KEY = "marvin-portfolio-theme";
const themeOrder = ["system", "light", "dark"];


function getSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    return themeOrder.includes(savedTheme)
        ? savedTheme
        : "system";
}


function updateThemeButton(theme) {
    if (!themeToggle) {
        return;
    }

    const icon = themeToggle.querySelector(".theme-icon");

    if (!icon) {
        return;
    }

    const themeSettings = {
        light: {
            icon: "☀",
            label: "Theme: light. Click to change.",
            title: "Light theme"
        },

        dark: {
            icon: "☾",
            label: "Theme: dark. Click to change.",
            title: "Dark theme"
        },

        system: {
            icon: "◐",
            label: "Theme: system. Click to change.",
            title: "System theme"
        }
    };

    const settings = themeSettings[theme] || themeSettings.system;

    icon.textContent = settings.icon;
    themeToggle.setAttribute("aria-label", settings.label);
    themeToggle.title = settings.title;
}


function applyTheme(theme) {
    root.dataset.theme = theme;
    updateThemeButton(theme);
}


function cycleTheme() {
    const currentTheme = root.dataset.theme || "system";
    const currentIndex = themeOrder.indexOf(currentTheme);

    const nextTheme =
        themeOrder[(currentIndex + 1) % themeOrder.length];

    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
}


if (themeToggle) {
    applyTheme(getSavedTheme());
    themeToggle.addEventListener("click", cycleTheme);
}


/* ============================================================
   MOBILE NAVIGATION
============================================================ */

function openMobileMenu() {
    if (!mobileNav || !menuToggle) {
        return;
    }

    mobileNav.classList.add("open");
    menuToggle.classList.add("active");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
}


function closeMobileMenu() {
    if (!mobileNav || !menuToggle) {
        return;
    }

    mobileNav.classList.remove("open");
    menuToggle.classList.remove("active");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
}


function toggleMobileMenu() {
    if (!mobileNav || !menuToggle) {
        return;
    }

    const isOpen = mobileNav.classList.contains("open");

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", toggleMobileMenu);
}


mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});


window.addEventListener("resize", () => {
    if (window.innerWidth > NAV_BREAKPOINT) {
        closeMobileMenu();
    }
});


/* ============================================================
   EXPERIENCE TIMELINE
============================================================ */

function getActiveCompanyName() {
    const activeStop = Array.from(careerStops).find((stop) =>
        stop.classList.contains("active")
    );

    return activeStop
        ? activeStop.dataset.company
        : null;
}


/* ------------------------------------------------------------
   POSITION COMPANY DISPLAY

   Desktop / Tablet:
   Display sits below the complete timeline.

   Mobile:
   Display moves directly beneath the selected company.
------------------------------------------------------------ */

function positionCompanyDisplay(
    companyName = getActiveCompanyName()
) {
    if (!companyDisplay || !companyDisplayHome) {
        return;
    }

    if (isMobileViewport() && companyName) {
        const selectedStop = Array.from(careerStops).find(
            (stop) => stop.dataset.company === companyName
        );

        if (selectedStop && selectedStop.parentNode) {
            selectedStop.insertAdjacentElement(
                "afterend",
                companyDisplay
            );
        }

        return;
    }

    if (companyDisplayHome.parentNode) {
        companyDisplayHome.parentNode.insertBefore(
            companyDisplay,
            companyDisplayHome.nextSibling
        );
    }
}


/* ------------------------------------------------------------
   CLEAR COMPANY SELECTION
------------------------------------------------------------ */

function clearCompanySelection() {
    careerStops.forEach((stop) => {
        stop.classList.remove("active");
        stop.setAttribute("aria-selected", "false");
    });

    companyPanels.forEach((panel) => {
        panel.hidden = true;
        panel.classList.remove("active");
    });

    if (companyDisplay) {
        companyDisplay.classList.remove("has-selection");
    }

    positionCompanyDisplay(null);
}


/* ------------------------------------------------------------
   SELECT COMPANY
------------------------------------------------------------ */

function selectCompany(companyName) {
    careerStops.forEach((stop) => {
        const isSelected =
            stop.dataset.company === companyName;

        stop.classList.toggle("active", isSelected);

        stop.setAttribute(
            "aria-selected",
            isSelected ? "true" : "false"
        );
    });

    companyPanels.forEach((panel) => {
        const isSelected =
            panel.dataset.companyPanel === companyName;

        panel.hidden = !isSelected;
        panel.classList.toggle("active", isSelected);
    });

    /*
       Move the shared display before revealing it so the
       animation occurs in the correct mobile location.
    */
    positionCompanyDisplay(companyName);

    if (companyDisplay) {
        companyDisplay.classList.add("has-selection");
    }
}


/* ------------------------------------------------------------
   TOGGLE COMPANY
------------------------------------------------------------ */

function toggleCompany(companyName) {
    const selectedStop = Array.from(careerStops).find(
        (stop) => stop.dataset.company === companyName
    );

    if (!selectedStop) {
        return;
    }

    const isAlreadySelected =
        selectedStop.classList.contains("active");

    if (isAlreadySelected) {
        clearCompanySelection();
    } else {
        selectCompany(companyName);
    }
}


/* ============================================================
   EXPERIENCE TIMELINE EVENTS
============================================================ */

careerStops.forEach((stop) => {
    stop.addEventListener("click", () => {
        toggleCompany(stop.dataset.company);
    });

    stop.addEventListener("keydown", (event) => {
        const stops = Array.from(careerStops);
        const currentIndex = stops.indexOf(stop);

        let nextIndex = null;

        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                nextIndex =
                    (currentIndex + 1) % stops.length;
                break;

            case "ArrowLeft":
            case "ArrowUp":
                nextIndex =
                    (currentIndex - 1 + stops.length) %
                    stops.length;
                break;

            case "Home":
                nextIndex = 0;
                break;

            case "End":
                nextIndex = stops.length - 1;
                break;

            case "Enter":
            case " ":
                event.preventDefault();
                toggleCompany(stop.dataset.company);
                return;

            default:
                return;
        }

        if (nextIndex === null) {
            return;
        }

        event.preventDefault();

        stops.forEach((timelineStop) => {
            timelineStop.tabIndex = -1;
        });

        stops[nextIndex].tabIndex = 0;
        stops[nextIndex].focus();
    });
});


/* ============================================================
   INITIAL EXPERIENCE STATE
============================================================ */

if (careerStops.length > 0 && companyPanels.length > 0) {
    clearCompanySelection();

    careerStops.forEach((stop, index) => {
        stop.tabIndex = index === 0 ? 0 : -1;
    });
}


/* ============================================================
   RESPONSIVE EXPERIENCE PLACEMENT
============================================================ */

let previousExperienceMobileState = isMobileViewport();

window.addEventListener("resize", () => {
    const currentMobileState = isMobileViewport();

    if (
        currentMobileState ===
        previousExperienceMobileState
    ) {
        return;
    }

    positionCompanyDisplay();

    previousExperienceMobileState =
        currentMobileState;
});


/* ============================================================
   EXPANDABLE CONTENT
============================================================ */

function setupExpandableControls({
    buttons,
    parentSelector,
    detailsSelector,
    labelSelector,
    symbolSelector
}) {
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const parent = button.closest(parentSelector);

            if (!parent) {
                return;
            }

            const details =
                parent.querySelector(detailsSelector);

            const label =
                button.querySelector(labelSelector);

            const symbol =
                button.querySelector(symbolSelector);

            if (!details || !label || !symbol) {
                return;
            }

            const isOpen =
                details.classList.contains("open");

            details.classList.toggle("open", !isOpen);

            button.setAttribute(
                "aria-expanded",
                isOpen ? "false" : "true"
            );

            label.textContent =
                isOpen ? "View More" : "View Less";

            symbol.textContent =
                isOpen ? "+" : "−";
        });
    });
}


/* ============================================================
   ROLE DETAILS
============================================================ */

setupExpandableControls({
    buttons: roleToggles,
    parentSelector: ".role-item",
    detailsSelector: ".role-details",
    labelSelector: ".role-toggle-label",
    symbolSelector: ".role-toggle-symbol"
});


/* ============================================================
   PROJECT DETAILS
============================================================ */

setupExpandableControls({
    buttons: projectToggles,
    parentSelector: ".project-featured",
    detailsSelector: ".project-details",
    labelSelector: ".project-toggle-label",
    symbolSelector: ".project-toggle-symbol"
});


/* ============================================================
   SCROLL REVEAL
============================================================ */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


if (prefersReducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.10
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* ============================================================
   ACTIVE NAVIGATION
============================================================ */

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const sectionId = entry.target.id;

            navLinks.forEach((link) => {
                const linkTarget =
                    link.getAttribute("href");

                link.classList.toggle(
                    "active",
                    linkTarget === `#${sectionId}`
                );
            });
        });
    },
    {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
    }
);


sections.forEach((section) => {
    sectionObserver.observe(section);
});


/* ============================================================
   HEADER SCROLL STATE
============================================================ */

function updateHeader() {
    if (!siteHeader) {
        return;
    }

    siteHeader.classList.toggle(
        "scrolled",
        window.scrollY > 20
    );
}


window.addEventListener(
    "scroll",
    updateHeader,
    {
        passive: true
    }
);


updateHeader();


/* ============================================================
   ESCAPE KEY
============================================================ */

document.addEventListener("keydown", (event) => {
    if (
        event.key !== "Escape" ||
        !mobileNav ||
        !mobileNav.classList.contains("open")
    ) {
        return;
    }

    closeMobileMenu();

    if (menuToggle) {
        menuToggle.focus();
    }
});


/* ============================================================
   CAROUSEL HELPERS

   Capabilities:
   Desktop / Tablet → 2 cards per page
   Mobile           → 1 card per page

   Selected Work:
   1 project per page at every viewport size.

   Navigation wraps continuously.
============================================================ */

function getCarouselItems(track) {
    return Array.from(track.children).filter((item) =>
        item.matches(
            ".capability-card, .project-featured"
        )
    );
}


function getCarouselIndex(track) {
    const storedIndex = Number(
        track.dataset.carouselIndex
    );

    return Number.isInteger(storedIndex)
        ? storedIndex
        : 0;
}


function getCarouselVisibleCount(track) {
    const isCapabilities =
        track.id === "capabilitiesTrack";

    if (
        isCapabilities &&
        !isMobileViewport()
    ) {
        return 2;
    }

    return 1;
}


function normalizeCarouselIndex(
    track,
    requestedIndex
) {
    const items = getCarouselItems(track);

    if (items.length === 0) {
        return 0;
    }

    const visibleCount =
        getCarouselVisibleCount(track);

    const isCapabilities =
        track.id === "capabilitiesTrack";

    if (
        isCapabilities &&
        visibleCount === 2
    ) {
        const pageCount =
            Math.ceil(items.length / 2);

        const requestedPage =
            Math.floor(requestedIndex / 2);

        const normalizedPage =
            (
                requestedPage % pageCount +
                pageCount
            ) % pageCount;

        return normalizedPage * 2;
    }

    return (
        (
            requestedIndex % items.length
        ) +
        items.length
    ) % items.length;
}


/* ============================================================
   SHOW CAROUSEL ITEM / PAGE
============================================================ */

function showCarouselItem(track, index) {
    const items = getCarouselItems(track);

    if (items.length === 0) {
        return;
    }

    const visibleCount =
        getCarouselVisibleCount(track);

    const isCapabilities =
        track.id === "capabilitiesTrack";

    const normalizedIndex =
        normalizeCarouselIndex(
            track,
            index
        );

    track.dataset.carouselIndex =
        String(normalizedIndex);

    items.forEach((item, itemIndex) => {
        let isActive;

        if (
            isCapabilities &&
            visibleCount === 2
        ) {
            isActive =
                itemIndex >= normalizedIndex &&
                itemIndex < normalizedIndex + 2;
        } else {
            isActive =
                itemIndex === normalizedIndex;
        }

        item.classList.toggle(
            "carousel-active",
            isActive
        );

        item.setAttribute(
            "aria-hidden",
            isActive ? "false" : "true"
        );
    });
}


/* ============================================================
   MOVE CAROUSEL
============================================================ */

function moveCarousel(track, direction) {
    const items = getCarouselItems(track);

    if (items.length <= 1) {
        return;
    }

    const currentIndex =
        getCarouselIndex(track);

    const visibleCount =
        getCarouselVisibleCount(track);

    const isCapabilities =
        track.id === "capabilitiesTrack";

    const step =
        isCapabilities &&
        visibleCount === 2
            ? 2
            : 1;

    showCarouselItem(
        track,
        currentIndex + direction * step
    );
}


/* ============================================================
   MOBILE SWIPE NAVIGATION

   Swipe left  → next
   Swipe right → previous

   Enabled only at <= 700px.

   Gestures beginning on interactive elements are ignored so
   links, buttons and expandable controls remain reliable.

   Vertical scrolling remains available.
============================================================ */

function setupCarouselSwipe(track) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartedOnInteractiveElement = false;

    track.addEventListener(
        "touchstart",
        (event) => {
            if (
                !isMobileViewport() ||
                event.touches.length !== 1
            ) {
                return;
            }

            touchStartedOnInteractiveElement = Boolean(
                event.target.closest(
                    "a, button, input, textarea, select, label"
                )
            );

            if (touchStartedOnInteractiveElement) {
                return;
            }

            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;
        },
        {
            passive: true
        }
    );

    track.addEventListener(
        "touchend",
        (event) => {
            if (!isMobileViewport()) {
                return;
            }

            if (touchStartedOnInteractiveElement) {
                touchStartedOnInteractiveElement = false;
                return;
            }

            if (event.changedTouches.length !== 1) {
                return;
            }

            const touchEndX =
                event.changedTouches[0].clientX;

            const touchEndY =
                event.changedTouches[0].clientY;

            const deltaX =
                touchEndX - touchStartX;

            const deltaY =
                touchEndY - touchStartY;

            const minimumSwipeDistance = 50;

            const isHorizontalSwipe =
                Math.abs(deltaX) >=
                    minimumSwipeDistance &&
                Math.abs(deltaX) >
                    Math.abs(deltaY) * 1.2;

            if (!isHorizontalSwipe) {
                return;
            }

            moveCarousel(
                track,
                deltaX < 0 ? 1 : -1
            );
        },
        {
            passive: true
        }
    );
}


/* ============================================================
   INITIALIZE CAROUSELS
============================================================ */

horizontalTracks.forEach((track) => {
    const previousButton = document.querySelector(
        `[data-track-prev="${track.id}"]`
    );

    const nextButton = document.querySelector(
        `[data-track-next="${track.id}"]`
    );

    showCarouselItem(track, 0);

    if (previousButton) {
        previousButton.addEventListener(
            "click",
            () => {
                moveCarousel(track, -1);
            }
        );
    }

    if (nextButton) {
        nextButton.addEventListener(
            "click",
            () => {
                moveCarousel(track, 1);
            }
        );
    }

    setupCarouselSwipe(track);
});


/* ============================================================
   RESPONSIVE CAROUSEL REFRESH

   Crossing the 700px breakpoint changes Capabilities between
   two-card and one-card presentation.

   Selected Work remains one card per page.
============================================================ */

let previousCarouselMobileState =
    isMobileViewport();


window.addEventListener("resize", () => {
    const currentMobileState =
        isMobileViewport();

    if (
        currentMobileState ===
        previousCarouselMobileState
    ) {
        return;
    }

    horizontalTracks.forEach((track) => {
        if (track.id === "capabilitiesTrack") {
            showCarouselItem(track, 0);
        } else {
            showCarouselItem(
                track,
                getCarouselIndex(track)
            );
        }
    });

    previousCarouselMobileState =
        currentMobileState;
});