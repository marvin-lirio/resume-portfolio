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
   10. Touch / swipe carousel navigation
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


/* ============================================================
   CENTERED CAROUSEL NAVIGATION

   CAPABILITIES

   Desktop / Tablet:
   2 cards per page

   Mobile:
   1 capability per page


   SELECTED WORK

   1 project per page on all screen sizes.


   Navigation wraps continuously.
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

   Includes:

   - Previous button
   - Next button
   - Touch / swipe navigation
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


        /* ----------------------------------------------------
           TOUCH / SWIPE

           Swipe left  = next
           Swipe right = previous

           A swipe must travel at least 50px and must be
           clearly more horizontal than vertical.

           This allows normal vertical page scrolling without
           accidentally changing carousel cards.
        ---------------------------------------------------- */

        let touchStartX =
            0;


        let touchStartY =
            0;


        track.addEventListener(
            "touchstart",
            (event) => {

                if (
                    event.touches.length !==
                    1
                ) {

                    return;

                }


                touchStartX =
                    event.touches[0].clientX;


                touchStartY =
                    event.touches[0].clientY;

            },
            {
                passive:
                    true
            }
        );


        track.addEventListener(
            "touchend",
            (event) => {

                if (
                    event.changedTouches.length !==
                    1
                ) {

                    return;

                }


                const touchEndX =
                    event.changedTouches[0].clientX;


                const touchEndY =
                    event.changedTouches[0].clientY;


                const deltaX =
                    touchEndX -
                    touchStartX;


                const deltaY =
                    touchEndY -
                    touchStartY;


                const minimumSwipeDistance =
                    50;


                const isHorizontalSwipe =
                    Math.abs(
                        deltaX
                    )
                    >=
                    minimumSwipeDistance
                    &&
                    Math.abs(
                        deltaX
                    )
                    >
                    Math.abs(
                        deltaY
                    )
                    *
                    1.2;


                if (
                    !isHorizontalSwipe
                ) {

                    return;

                }


                /*
                   Finger moves left:
                   advance carousel.

                   Finger moves right:
                   move backward.
                */

                moveCarousel(
                    track,
                    deltaX < 0
                        ? 1
                        : -1
                );

            },
            {
                passive:
                    true
            }
        );

    }
);


/* ============================================================
   RESPONSIVE CAROUSEL REFRESH

   Desktop/tablet:
   2 capability cards

   Mobile:
   1 capability card

   Projects remain 1 card at every viewport size.
============================================================ */

let previousCarouselMobileState =
    window.innerWidth <=
    700;


window.addEventListener(
    "resize",
    () => {

        const currentMobileState =
            window.innerWidth <=
            700;


        if (
            currentMobileState !==
            previousCarouselMobileState
        ) {

            horizontalTracks.forEach(
                (track) => {

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