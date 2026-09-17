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
   9. Centered carousel navigation
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


                    stops.forEach(
                        (timelineStop) => {

                            timelineStop.tabIndex =
                                -1;

                        }
                    );


                    stops[
                        nextIndex
                    ].tabIndex =
                        0;


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

   Each role expands independently.

   Button text:

   View More +
   View Less −
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

   Selected Work projects use the same expandable interaction
   pattern as the professional experience roles.

   Each project opens and closes independently.
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

   Elements using .reveal animate into view once.

   Reduced-motion visitors receive content immediately.
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

   Updates the desktop navigation as the visitor moves
   through major sections of the page.
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

   Escape closes the mobile menu when open.
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


/* ============================================================
   CENTERED CAROUSEL NAVIGATION

   CAPABILITIES

   Desktop / Tablet:

   Page 1:
   Quality Engineering
   Systems & Delivery

   Page 2:
   Compliance & Product
   Development

   Mobile:

   One capability at a time.


   SELECTED WORK

   One project at a time on all screen sizes.


   All navigation wraps continuously:

   first ← last
   last  → first
============================================================ */

const horizontalTracks =
    document.querySelectorAll(
        ".horizontal-track[id]"
    );


/* ============================================================
   GET CAROUSEL ITEMS
============================================================ */

function getCarouselItems(track) {

    return Array.from(
        track.children
    ).filter(
        (item) =>
            item.matches(
                ".capability-card, .project-featured"
            )
    );

}


/* ============================================================
   GET CURRENT INDEX
============================================================ */

function getCarouselIndex(track) {

    const storedIndex =
        Number(
            track.dataset.carouselIndex
        );


    return Number.isInteger(
        storedIndex
    )
        ? storedIndex
        : 0;

}


/* ============================================================
   GET VISIBLE COUNT

   Capabilities:
   2 cards above 700px
   1 card at 700px and below

   Projects:
   Always 1 card
============================================================ */

function getCarouselVisibleCount(
    track
) {

    const isCapabilities =
        track.id ===
        "capabilitiesTrack";


    if (
        isCapabilities
        &&
        window.innerWidth > 700
    ) {

        return 2;

    }


    return 1;

}


/* ============================================================
   NORMALIZE CAROUSEL INDEX

   Capabilities on desktop/tablet are treated as two
   fixed pages rather than a sliding sequence.

   Valid desktop capability indexes:

   0 = Quality Engineering + Systems & Delivery
   2 = Compliance & Product + Development

   This prevents:

   Systems & Delivery + Compliance & Product

   and prevents all four cards from appearing together.
============================================================ */

function normalizeCarouselIndex(
    track,
    requestedIndex
) {

    const items =
        getCarouselItems(
            track
        );


    if (items.length === 0) {
        return 0;
    }


    const visibleCount =
        getCarouselVisibleCount(
            track
        );


    const isCapabilities =
        track.id ===
        "capabilitiesTrack";


    if (
        isCapabilities
        &&
        visibleCount === 2
    ) {

        const pageCount =
            Math.ceil(
                items.length / 2
            );


        const requestedPage =
            Math.floor(
                requestedIndex / 2
            );


        const normalizedPage =
            (
                requestedPage %
                pageCount +
                pageCount
            )
            %
            pageCount;


        return (
            normalizedPage * 2
        );

    }


    return (
        (
            requestedIndex %
            items.length
        )
        +
        items.length
    )
    %
    items.length;

}


/* ============================================================
   SHOW CAROUSEL ITEM / PAGE
============================================================ */

function showCarouselItem(
    track,
    index
) {

    const items =
        getCarouselItems(
            track
        );


    if (items.length === 0) {
        return;
    }


    const visibleCount =
        getCarouselVisibleCount(
            track
        );


    const isCapabilities =
        track.id ===
        "capabilitiesTrack";


    const normalizedIndex =
        normalizeCarouselIndex(
            track,
            index
        );


    track.dataset.carouselIndex =
        String(
            normalizedIndex
        );


    items.forEach(
        (
            item,
            itemIndex
        ) => {

            let isActive =
                false;


            /*
               Capabilities desktop/tablet:

               Show exactly two cards belonging
               to the current fixed page.
            */

            if (
                isCapabilities
                &&
                visibleCount === 2
            ) {

                isActive =
                    itemIndex >=
                        normalizedIndex
                    &&
                    itemIndex <
                        normalizedIndex + 2;

            }


            /*
               Mobile capabilities and all projects:

               Show exactly one card.
            */

            else {

                isActive =
                    itemIndex ===
                    normalizedIndex;

            }


            item.classList.toggle(
                "carousel-active",
                isActive
            );


            item.setAttribute(
                "aria-hidden",
                isActive
                    ? "false"
                    : "true"
            );

        }
    );

}


/* ============================================================
   MOVE CAROUSEL

   Capabilities desktop/tablet:
   move 2 cards / 1 page

   Everything else:
   move 1 card
============================================================ */

function moveCarousel(
    track,
    direction
) {

    const items =
        getCarouselItems(
            track
        );


    if (
        items.length <= 1
    ) {

        return;

    }


    const currentIndex =
        getCarouselIndex(
            track
        );


    const visibleCount =
        getCarouselVisibleCount(
            track
        );


    const isCapabilities =
        track.id ===
        "capabilitiesTrack";


    const step =
        isCapabilities
        &&
        visibleCount === 2
            ? 2
            : 1;


    showCarouselItem(
        track,
        currentIndex +
        (
            direction *
            step
        )
    );

}


/* ============================================================
   INITIALIZE CAROUSELS
============================================================ */

horizontalTracks.forEach(
    (track) => {

        const previousButton =
            document.querySelector(
                `[data-track-prev="${track.id}"]`
            );


        const nextButton =
            document.querySelector(
                `[data-track-next="${track.id}"]`
            );


        /*
           Every carousel starts at its first
           card / first capability pair.
        */

        showCarouselItem(
            track,
            0
        );


        /* ----------------------------------------------------
           PREVIOUS
        ---------------------------------------------------- */

        if (previousButton) {

            previousButton.addEventListener(
                "click",
                () => {

                    moveCarousel(
                        track,
                        -1
                    );

                }
            );

        }


        /* ----------------------------------------------------
           NEXT
        ---------------------------------------------------- */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {

                    moveCarousel(
                        track,
                        1
                    );

                }
            );

        }

    }
);


/* ============================================================
   RESPONSIVE CAROUSEL REFRESH

   If the viewport crosses the 700px breakpoint:

   Desktop/tablet:
   2 capability cards

   Mobile:
   1 capability card

   Re-running showCarouselItem ensures inactive cards
   remain hidden after the layout changes.
============================================================ */

let previousCarouselMobileState =
    window.innerWidth <= 700;


window.addEventListener(
    "resize",
    () => {

        const currentMobileState =
            window.innerWidth <= 700;


        /*
           Only rebuild the carousel state when crossing
           the actual capability layout breakpoint.

           Normal resizing within desktop or mobile does
           not unnecessarily reset the cards.
        */

        if (
            currentMobileState !==
            previousCarouselMobileState
        ) {

            horizontalTracks.forEach(
                (track) => {

                    /*
                       Reset capabilities to the beginning
                       when changing between 1-card and
                       2-card layouts.

                       Project position is preserved.
                    */

                    if (
                        track.id ===
                        "capabilitiesTrack"
                    ) {

                        showCarouselItem(
                            track,
                            0
                        );

                    }

                    else {

                        showCarouselItem(
                            track,
                            getCarouselIndex(
                                track
                            )
                        );

                    }

                }
            );


            previousCarouselMobileState =
                currentMobileState;

        }

    }
);