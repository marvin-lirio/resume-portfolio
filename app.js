/* ============================================================
   MARVIN LIRIO — PORTFOLIO V2.2
   app.js

   Handles:

   1. Theme management
   2. Mobile navigation
   3. Interactive experience timeline
   4. Role-level View More controls
   5. Selected Work View More controls
   6. Scroll reveal
   7. Active navigation
   8. Header scroll state
============================================================ */


/* ============================================================
   DOM REFERENCES
============================================================ */

const root =
    document.documentElement;


const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const menuToggle =
    document.getElementById(
        "menuToggle"
    );


const mobileNav =
    document.getElementById(
        "mobileNav"
    );


const siteHeader =
    document.querySelector(
        ".site-header"
    );


const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const mobileNavLinks =
    document.querySelectorAll(
        ".mobile-nav a"
    );


const careerStops =
    document.querySelectorAll(
        ".career-stop[data-company]"
    );


const companyPanels =
    document.querySelectorAll(
        "[data-company-panel]"
    );


const companyDisplay =
    document.querySelector(
        ".company-display"
    );


const roleToggles =
    document.querySelectorAll(
        ".role-toggle"
    );


const projectToggles =
    document.querySelectorAll(
        ".project-toggle"
    );


const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const sections =
    document.querySelectorAll(
        "main section[id]"
    );


/* ============================================================
   THEME MANAGEMENT

   Theme order:

   system → light → dark → system

   "system" follows the visitor's OS/browser preference.

   A manual selection is saved using localStorage.
============================================================ */

const THEME_KEY =
    "marvin-portfolio-theme";


const themeOrder = [
    "system",
    "light",
    "dark"
];


function getSavedTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (
        themeOrder.includes(
            savedTheme
        )
    ) {

        return savedTheme;

    }


    return "system";

}


function applyTheme(theme) {

    root.dataset.theme =
        theme;


    updateThemeButton(
        theme
    );

}


function updateThemeButton(theme) {

    if (!themeToggle) {
        return;
    }


    const icon =
        themeToggle.querySelector(
            ".theme-icon"
        );


    if (!icon) {
        return;
    }


    if (theme === "light") {

        icon.textContent =
            "☀";


        themeToggle.setAttribute(
            "aria-label",
            "Theme: light. Click to change."
        );


        themeToggle.title =
            "Light theme";

    }


    else if (theme === "dark") {

        icon.textContent =
            "☾";


        themeToggle.setAttribute(
            "aria-label",
            "Theme: dark. Click to change."
        );


        themeToggle.title =
            "Dark theme";

    }


    else {

        icon.textContent =
            "◐";


        themeToggle.setAttribute(
            "aria-label",
            "Theme: system. Click to change."
        );


        themeToggle.title =
            "System theme";

    }

}


function cycleTheme() {

    const currentTheme =
        root.dataset.theme ||
        "system";


    const currentIndex =
        themeOrder.indexOf(
            currentTheme
        );


    const nextIndex =
        (
            currentIndex + 1
        )
        %
        themeOrder.length;


    const nextTheme =
        themeOrder[
            nextIndex
        ];


    localStorage.setItem(
        THEME_KEY,
        nextTheme
    );


    applyTheme(
        nextTheme
    );

}


if (themeToggle) {

    applyTheme(
        getSavedTheme()
    );


    themeToggle.addEventListener(
        "click",
        cycleTheme
    );

}


/* ============================================================
   MOBILE NAVIGATION
============================================================ */

function openMobileMenu() {

    if (!mobileNav || !menuToggle) {
        return;
    }


    mobileNav.classList.add(
        "open"
    );


    menuToggle.classList.add(
        "active"
    );


    document.body.classList.add(
        "menu-open"
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );


    menuToggle.setAttribute(
        "aria-label",
        "Close navigation"
    );

}


function closeMobileMenu() {

    if (!mobileNav || !menuToggle) {
        return;
    }


    mobileNav.classList.remove(
        "open"
    );


    menuToggle.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "menu-open"
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    menuToggle.setAttribute(
        "aria-label",
        "Open navigation"
    );

}


function toggleMobileMenu() {

    if (!mobileNav || !menuToggle) {
        return;
    }


    const isOpen =
        mobileNav.classList.contains(
            "open"
        );


    if (isOpen) {

        closeMobileMenu();

    }

    else {

        openMobileMenu();

    }

}


if (menuToggle && mobileNav) {

    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );

}


mobileNavLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    }
);


window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >
            1000
        ) {

            closeMobileMenu();

        }

    }
);


/* ============================================================
   EXPERIENCE TIMELINE

   Timeline behavior:

   - Nothing is selected on initial page load.
   - Selecting a company displays that company.
   - Selecting the active company again closes it.
   - Selecting another company switches directly to it.
============================================================ */

function clearCompanySelection() {

    careerStops.forEach(
        (stop) => {

            stop.classList.remove(
                "active"
            );


            stop.setAttribute(
                "aria-selected",
                "false"
            );

        }
    );


    companyPanels.forEach(
        (panel) => {

            panel.hidden =
                true;


            panel.classList.remove(
                "active"
            );

        }
    );


    if (companyDisplay) {

        companyDisplay.classList.remove(
            "has-selection"
        );

    }

}


function selectCompany(companyName) {

    careerStops.forEach(
        (stop) => {

            const isSelected =
                stop.dataset.company ===
                companyName;


            stop.classList.toggle(
                "active",
                isSelected
            );


            stop.setAttribute(
                "aria-selected",
                isSelected
                    ? "true"
                    : "false"
            );

        }
    );


    companyPanels.forEach(
        (panel) => {

            const isSelected =
                panel.dataset.companyPanel ===
                companyName;


            panel.hidden =
                !isSelected;


            panel.classList.toggle(
                "active",
                isSelected
            );

        }
    );


    if (companyDisplay) {

        companyDisplay.classList.add(
            "has-selection"
        );

    }

}


function toggleCompany(companyName) {

    const selectedStop =
        Array.from(
            careerStops
        ).find(
            (stop) =>
                stop.dataset.company ===
                companyName
        );


    if (!selectedStop) {
        return;
    }


    const isAlreadySelected =
        selectedStop.classList.contains(
            "active"
        );


    if (isAlreadySelected) {

        clearCompanySelection();

    }

    else {

        selectCompany(
            companyName
        );

    }

}


/* ============================================================
   EXPERIENCE TIMELINE EVENTS
============================================================ */

careerStops.forEach(
    (stop) => {

        stop.addEventListener(
            "click",
            () => {

                toggleCompany(
                    stop.dataset.company
                );

            }
        );


        stop.addEventListener(
            "keydown",
            (event) => {

                const stops =
                    Array.from(
                        careerStops
                    );


                const currentIndex =
                    stops.indexOf(
                        stop
                    );


                let nextIndex =
                    null;


                if (
                    event.key ===
                    "ArrowRight"
                    ||
                    event.key ===
                    "ArrowDown"
                ) {

                    nextIndex =
                        (
                            currentIndex + 1
                        )
                        %
                        stops.length;

                }


                if (
                    event.key ===
                    "ArrowLeft"
                    ||
                    event.key ===
                    "ArrowUp"
                ) {

                    nextIndex =
                        (
                            currentIndex -
                            1 +
                            stops.length
                        )
                        %
                        stops.length;

                }


                if (
                    event.key ===
                    "Home"
                ) {

                    nextIndex =
                        0;

                }


                if (
                    event.key ===
                    "End"
                ) {

                    nextIndex =
                        stops.length - 1;

                }


                if (
                    nextIndex !==
                    null
                ) {

                    event.preventDefault();


                    stops[
                        nextIndex
                    ].focus();


                    return;

                }


                if (
                    event.key ===
                    "Enter"
                    ||
                    event.key ===
                    " "
                ) {

                    event.preventDefault();


                    toggleCompany(
                        stop.dataset.company
                    );

                }

            }
        );

    }
);


/* ============================================================
   INITIAL EXPERIENCE STATE

   The timeline intentionally starts with no company selected
   and no company display visible.
============================================================ */

if (
    careerStops.length > 0
    &&
    companyPanels.length > 0
) {

    clearCompanySelection();


    careerStops.forEach(
        (stop, index) => {

            stop.tabIndex =
                index === 0
                    ? 0
                    : -1;

        }
    );

}


/* ============================================================
   ROLE DETAILS

   Each role independently controls its own expandable
   job-duty section.
============================================================ */

roleToggles.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const role =
                    button.closest(
                        ".role-item"
                    );


                if (!role) {
                    return;
                }


                const details =
                    role.querySelector(
                        ".role-details"
                    );


                const label =
                    button.querySelector(
                        ".role-toggle-label"
                    );


                const symbol =
                    button.querySelector(
                        ".role-toggle-symbol"
                    );


                if (
                    !details
                    ||
                    !label
                    ||
                    !symbol
                ) {

                    return;

                }


                const isOpen =
                    details.classList.contains(
                        "open"
                    );


                if (isOpen) {

                    details.classList.remove(
                        "open"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    label.textContent =
                        "View More";


                    symbol.textContent =
                        "+";

                }

                else {

                    details.classList.add(
                        "open"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "true"
                    );


                    label.textContent =
                        "View Less";


                    symbol.textContent =
                        "−";

                }

            }
        );

    }
);


/* ============================================================
   PROJECT DETAILS

   Selected Work cards use the same expandable pattern:

   - Summary, stack and public links remain visible.
   - View More expands the additional project details.
   - Each project opens and closes independently.
============================================================ */

projectToggles.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const project =
                    button.closest(
                        ".project-featured"
                    );


                if (!project) {
                    return;
                }


                const details =
                    project.querySelector(
                        ".project-details"
                    );


                const label =
                    button.querySelector(
                        ".project-toggle-label"
                    );


                const symbol =
                    button.querySelector(
                        ".project-toggle-symbol"
                    );


                if (
                    !details
                    ||
                    !label
                    ||
                    !symbol
                ) {
                    return;
                }


                const isOpen =
                    details.classList.contains(
                        "open"
                    );


                details.classList.toggle(
                    "open",
                    !isOpen
                );


                button.setAttribute(
                    "aria-expanded",
                    isOpen
                        ? "false"
                        : "true"
                );


                label.textContent =
                    isOpen
                        ? "View More"
                        : "View Less";


                symbol.textContent =
                    isOpen
                        ? "+"
                        : "−";

            }
        );

    }
);


/* ============================================================
   SCROLL REVEAL
============================================================ */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (prefersReducedMotion) {

    revealElements.forEach(
        (element) => {

            element.classList.add(
                "visible"
            );

        }
    );

}


else {

    const revealObserver =
        new IntersectionObserver(
            (
                entries,
                observer
            ) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold:
                    0.10
            }
        );


    revealElements.forEach(
        (element) => {

            revealObserver.observe(
                element
            );

        }
    );

}


/* ============================================================
   ACTIVE NAVIGATION
============================================================ */

const sectionObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        !entry.isIntersecting
                    ) {

                        return;

                    }


                    const sectionId =
                        entry.target.id;


                    navLinks.forEach(
                        (link) => {

                            const linkTarget =
                                link.getAttribute(
                                    "href"
                                );


                            link.classList.toggle(
                                "active",
                                linkTarget ===
                                `#${sectionId}`
                            );

                        }
                    );

                }
            );

        },

        {
            rootMargin:
                "-30% 0px -60% 0px",

            threshold:
                0
        }
    );


sections.forEach(
    (section) => {

        sectionObserver.observe(
            section
        );

    }
);


/* ============================================================
   HEADER SCROLL STATE
============================================================ */

function updateHeader() {

    if (!siteHeader) {
        return;
    }


    if (
        window.scrollY >
        20
    ) {

        siteHeader.classList.add(
            "scrolled"
        );

    }

    else {

        siteHeader.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    updateHeader,
    {
        passive:
            true
    }
);


updateHeader();


/* ============================================================
   ESCAPE KEY
============================================================ */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
            &&
            mobileNav
            &&
            mobileNav.classList.contains(
                "open"
            )
        ) {

            closeMobileMenu();


            if (menuToggle) {

                menuToggle.focus();

            }

        }

    }
);