/* ============================================================
   MARVIN LIRIO — PORTFOLIO V2.4.0
   app.js

   Handles:
   1. Theme management
   2. Mobile navigation
   3. Interactive experience timeline
   4. Responsive experience placement
   5. Skills & Tools interaction
   6. Role detail controls
   7. Project detail controls
   8. Scroll reveal
   9. Active navigation
   10. Header scroll state
   11. Carousel navigation
   12. Mobile carousel swipe navigation
============================================================ */


/* ============================================================
   DOM REFERENCES / BREAKPOINTS
============================================================ */

const root = document.documentElement;

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const siteHeader = document.querySelector(".site-header");

const navLinks = document.querySelectorAll(".nav-link");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

const careerStops = document.querySelectorAll(".career-stop[data-company]");
const companyPanels = document.querySelectorAll("[data-company-panel]");
const companyDisplay = document.querySelector(".company-display");

const skillSystem = document.getElementById("skillsSystem");
const skillCards = document.querySelectorAll(".skill-card[data-skill]");

const roleToggles = document.querySelectorAll(".role-toggle");
const projectToggles = document.querySelectorAll(".project-toggle");

const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const horizontalTracks = document.querySelectorAll(".horizontal-track[id]");

const MOBILE_BREAKPOINT = 700;
const NAV_BREAKPOINT = 1000;

const isMobileViewport = () => window.innerWidth <= MOBILE_BREAKPOINT;


/* ============================================================
   EXPERIENCE DISPLAY HOME

   The shared company display normally lives below the complete
   experience timeline. On mobile, it moves directly beneath the
   selected company. This placeholder preserves its desktop home.
============================================================ */

let companyDisplayHome = null;

if (companyDisplay) {

    companyDisplayHome =
        document.createComment(
            "company-display-home"
        );

    companyDisplay.parentNode.insertBefore(
        companyDisplayHome,
        companyDisplay
    );

}


/* ============================================================
   THEME MANAGEMENT
   Theme order: system → light → dark → system
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

    return themeOrder.includes(
        savedTheme
    )
        ? savedTheme
        : "system";

}


function updateThemeButton(theme) {

    if (!themeToggle) return;

    const icon =
        themeToggle.querySelector(
            ".theme-icon"
        );

    if (!icon) return;

    const themeSettings = {

        light: {
            icon: "☀",
            label:
                "Theme: light. Click to change.",
            title:
                "Light theme"
        },

        dark: {
            icon: "☾",
            label:
                "Theme: dark. Click to change.",
            title:
                "Dark theme"
        },

        system: {
            icon: "◐",
            label:
                "Theme: system. Click to change.",
            title:
                "System theme"
        }

    };

    const settings =
        themeSettings[theme] ||
        themeSettings.system;

    icon.textContent =
        settings.icon;

    themeToggle.setAttribute(
        "aria-label",
        settings.label
    );

    themeToggle.title =
        settings.title;

}


function applyTheme(theme) {

    root.dataset.theme =
        theme;

    updateThemeButton(
        theme
    );

}


function cycleTheme() {

    const currentTheme =
        root.dataset.theme ||
        "system";

    const currentIndex =
        themeOrder.indexOf(
            currentTheme
        );

    const nextTheme =
        themeOrder[
            (currentIndex + 1) %
            themeOrder.length
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

    if (
        !mobileNav ||
        !menuToggle
    ) {

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

    if (
        !mobileNav ||
        !menuToggle
    ) {

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

    if (
        !mobileNav ||
        !menuToggle
    ) {

        return;

    }

    if (
        mobileNav.classList.contains(
            "open"
        )
    ) {

        closeMobileMenu();

    } else {

        openMobileMenu();

    }

}


if (
    menuToggle &&
    mobileNav
) {

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
            NAV_BREAKPOINT
        ) {

            closeMobileMenu();

        }

    }
);


/* ============================================================
   EXPERIENCE TIMELINE

   Desktop hover / keyboard focus:
   Highlights a company only.

   Click:
   Locks the company into the focal experience state.

   Click active company / outside / Escape:
   Returns to the default timeline.

   Mobile:
   Uses click selection only.
============================================================ */

let previewCompanyName =
    null;

let lockedCompanyName =
    null;


/* ============================================================
   GET DISPLAYED COMPANY

   Only a locked company may display company details.
   Hover preview does not open the shared company display.
============================================================ */

function getDisplayedCompany() {

    return lockedCompanyName;

}


/* ============================================================
   POSITION COMPANY DISPLAY

   Desktop:
   The company display is attached directly beneath the
   selected timeline card so the two surfaces can visually
   become one expanded Experience card.

   Mobile:
   The same behavior is retained beneath the selected stop.

   Reset:
   The display returns to its original home position.
============================================================ */

function positionCompanyDisplay(
    companyName =
        getDisplayedCompany()
) {

    if (
        !companyDisplay ||
        !companyDisplayHome
    ) {

        return;

    }


    /* ----------------------------------------
       No selection

       Return the shared company display to
       its original location below the timeline.
    ----------------------------------------- */

    if (!companyName) {

        if (
            companyDisplayHome.parentNode
        ) {

            companyDisplayHome.parentNode.insertBefore(
                companyDisplay,
                companyDisplayHome.nextSibling
            );

        }

        return;

    }


    /* ----------------------------------------
       Find selected timeline stop
    ----------------------------------------- */

    const selectedStop =
        Array.from(
            careerStops
        ).find(
            (stop) =>
                stop.dataset.company ===
                companyName
        );


    if (
        !selectedStop ||
        !selectedStop.parentNode
    ) {

        return;

    }


    /* ----------------------------------------
       Attach the shared company display
       directly after the selected timeline stop.

       CSS will turn the selected stop +
       company display into one continuous card.
    ----------------------------------------- */

    selectedStop.insertAdjacentElement(
        "afterend",
        companyDisplay
    );

}


/* ============================================================
   RENDER EXPERIENCE STATE
============================================================ */

function renderExperienceState() {

    const displayCompany =
        getDisplayedCompany();

    const hasLockedSelection =
        Boolean(
            lockedCompanyName
        );


    /* ----------------------------------------
       Timeline stop state

       Preview:
       Highlight only.

       Active:
       Locked focal state.
    ----------------------------------------- */

    careerStops.forEach(
        (stop) => {

            const companyName =
                stop.dataset.company;

            const isPreview =
                !hasLockedSelection &&
                companyName ===
                    previewCompanyName;

            const isActive =
                companyName ===
                    lockedCompanyName;

            stop.classList.toggle(
                "preview",
                isPreview
            );

            stop.classList.toggle(
                "active",
                isActive
            );

            stop.setAttribute(
                "aria-selected",
                isActive
                    ? "true"
                    : "false"
            );

        }
    );


    /* ----------------------------------------
       Company panel state

       Only a locked selection may reveal
       company details. Hover never opens them.
    ----------------------------------------- */

    companyPanels.forEach(
        (panel) => {

            const isDisplayed =
                hasLockedSelection &&
                panel.dataset.companyPanel ===
                    displayCompany;

            panel.hidden =
                !isDisplayed;

            panel.classList.remove(
                "preview"
            );

            panel.classList.toggle(
                "active",
                isDisplayed
            );

        }
    );


    /* ----------------------------------------
       Shared company display state
    ----------------------------------------- */

    if (companyDisplay) {

        companyDisplay.classList.toggle(
            "has-selection",
            hasLockedSelection
        );

        companyDisplay.classList.remove(
            "is-preview"
        );

        companyDisplay.classList.toggle(
            "is-locked",
            hasLockedSelection
        );

    }


    /* ----------------------------------------
       Responsive display placement
    ----------------------------------------- */

    positionCompanyDisplay(
        displayCompany
    );

}


/* ============================================================
   COMPANY PREVIEW
============================================================ */

function previewCompany(
    companyName
) {

    if (
        isMobileViewport() ||
        lockedCompanyName
    ) {

        return;

    }

    previewCompanyName =
        companyName;

    renderExperienceState();

}


function clearCompanyPreview() {

    if (
        isMobileViewport() ||
        lockedCompanyName
    ) {

        return;

    }

    previewCompanyName =
        null;

    renderExperienceState();

}


/* ============================================================
   COMPANY LOCKED SELECTION
============================================================ */

function selectCompany(
    companyName
) {

    lockedCompanyName =
        companyName;

    previewCompanyName =
        null;

    renderExperienceState();

}


function clearCompanySelection() {

    lockedCompanyName =
        null;

    previewCompanyName =
        null;

    renderExperienceState();

}


function toggleCompany(
    companyName
) {

    if (
        lockedCompanyName ===
        companyName
    ) {

        clearCompanySelection();

        return;

    }

    selectCompany(
        companyName
    );

}


/* ============================================================
   EXPERIENCE TIMELINE EVENTS
============================================================ */

careerStops.forEach(
    (stop) => {

        const companyName =
            stop.dataset.company;


        /* ----------------------------------------
           Desktop hover highlight
        ----------------------------------------- */

        stop.addEventListener(
            "mouseenter",
            () => {

                previewCompany(
                    companyName
                );

            }
        );


        stop.addEventListener(
            "mouseleave",
            () => {

                clearCompanyPreview();

            }
        );


        /* ----------------------------------------
           Keyboard focus highlight
        ----------------------------------------- */

        stop.addEventListener(
            "focus",
            () => {

                previewCompany(
                    companyName
                );

            }
        );


        stop.addEventListener(
            "blur",
            () => {

                clearCompanyPreview();

            }
        );


        /* ----------------------------------------
           Click lock / reset
        ----------------------------------------- */

        stop.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                toggleCompany(
                    companyName
                );

            }
        );


        /* ----------------------------------------
           Keyboard navigation / selection
        ----------------------------------------- */

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

                switch (
                    event.key
                ) {

                    case "ArrowRight":
                    case "ArrowDown":

                        nextIndex =
                            (
                                currentIndex +
                                1
                            ) %
                            stops.length;

                        break;


                    case "ArrowLeft":
                    case "ArrowUp":

                        nextIndex =
                            (
                                currentIndex -
                                1 +
                                stops.length
                            ) %
                            stops.length;

                        break;


                    case "Home":

                        nextIndex =
                            0;

                        break;


                    case "End":

                        nextIndex =
                            stops.length -
                            1;

                        break;


                    case "Enter":
                    case " ":

                        event.preventDefault();

                        toggleCompany(
                            companyName
                        );

                        return;


                    default:

                        return;

                }

                if (
                    nextIndex ===
                    null
                ) {

                    return;

                }

                event.preventDefault();

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

                stops[
                    nextIndex
                ].focus();

            }
        );

    }
);


/* ============================================================
   EXPERIENCE — CLICK OUT RESET
============================================================ */

document.addEventListener(
    "click",
    (event) => {

        if (
            !lockedCompanyName
        ) {

            return;

        }

        const clickedCareerStop =
            event.target.closest(
                ".career-stop"
            );

        const clickedCompanyDisplay =
            event.target.closest(
                ".company-display"
            );


        /*
         * Clicking a timeline stop is handled by
         * toggleCompany(), so do not interfere here.
         */
        if (
            clickedCareerStop
        ) {

            return;

        }


        /*
         * Keep the company locked while interacting
         * with its expanded content, including View More.
         */
        if (
            clickedCompanyDisplay
        ) {

            return;

        }


        /*
         * Anything else on the page closes the
         * locked Experience selection.
         */
        clearCompanySelection();

    }
);


/* ============================================================
   INITIAL EXPERIENCE STATE
============================================================ */

if (
    careerStops.length > 0 &&
    companyPanels.length > 0
) {

    careerStops.forEach(
        (stop, index) => {

            stop.tabIndex =
                index === 0
                    ? 0
                    : -1;

        }
    );

    clearCompanySelection();

}


/* ============================================================
   RESPONSIVE EXPERIENCE PLACEMENT
============================================================ */

let previousExperienceMobileState =
    isMobileViewport();


window.addEventListener(
    "resize",
    () => {

        const currentMobileState =
            isMobileViewport();

        if (
            currentMobileState ===
            previousExperienceMobileState
        ) {

            return;

        }


        /*
         * Desktop hover previews do not exist on mobile.
         * Clear a temporary preview when crossing into
         * the mobile breakpoint.
         */
        if (
            currentMobileState &&
            !lockedCompanyName
        ) {

            previewCompanyName =
                null;

        }

        renderExperienceState();

        previousExperienceMobileState =
            currentMobileState;

    }
);


/* ============================================================
   SKILLS & TOOLS — 2 × 2 INTERACTION

   Hover / keyboard focus:
   Temporarily previews a discipline.

   Click:
   Locks the discipline open.

   Click active card / outside / Escape:
   Returns to the full 2 × 2 grid.
============================================================ */

let previewSkillName =
    null;

let lockedSkillName =
    null;


/* ============================================================
   GET DISPLAYED SKILL
============================================================ */

function getDisplayedSkill() {

    return (
        lockedSkillName ||
        previewSkillName
    );

}


/* ============================================================
   RENDER SKILLS STATE
============================================================ */

function renderSkillsState() {

    if (!skillSystem) return;

    const displaySkill =
        getDisplayedSkill();

    const hasDisplay =
        Boolean(
            displaySkill
        );

    const hasLockedSelection =
        Boolean(
            lockedSkillName
        );


    /* ----------------------------------------
       Grid state
    ----------------------------------------- */

    skillSystem.classList.toggle(
        "is-focused",
        hasDisplay
    );

    skillSystem.classList.toggle(
        "has-selection",
        hasLockedSelection
    );

    skillSystem.dataset.activeSkill =
        lockedSkillName ||
        "";

    skillSystem.dataset.displaySkill =
        displaySkill ||
        "";


    /* ----------------------------------------
       Card state
    ----------------------------------------- */

    skillCards.forEach(
        (card) => {

            const skillName =
                card.dataset.skill;

            const isPreview =
                !hasLockedSelection &&
                skillName ===
                    previewSkillName;

            const isActive =
                skillName ===
                    lockedSkillName;

            card.classList.toggle(
                "preview",
                isPreview
            );

            card.classList.toggle(
                "active",
                isActive
            );

            card.setAttribute(
                "aria-expanded",
                (
                    isPreview ||
                    isActive
                )
                    ? "true"
                    : "false"
            );

        }
    );

}


/* ============================================================
   SKILL PREVIEW
============================================================ */

function previewSkill(
    skillName
) {

    if (
        !skillSystem ||
        lockedSkillName
    ) {

        return;

    }

    previewSkillName =
        skillName;

    renderSkillsState();

}


function clearSkillPreview() {

    if (
        !skillSystem ||
        lockedSkillName
    ) {

        return;

    }

    previewSkillName =
        null;

    renderSkillsState();

}


/* ============================================================
   SKILL LOCKED SELECTION
============================================================ */

function selectSkill(
    skillName
) {

    if (!skillSystem) return;

    lockedSkillName =
        skillName;

    previewSkillName =
        null;

    renderSkillsState();

}


function clearSkillSelection() {

    if (!skillSystem) return;

    lockedSkillName =
        null;

    previewSkillName =
        null;

    renderSkillsState();

}


function toggleSkill(
    skillName
) {

    if (!skillSystem) return;

    if (
        lockedSkillName ===
        skillName
    ) {

        clearSkillSelection();

        return;

    }

    selectSkill(
        skillName
    );

}


/* ============================================================
   SKILL CARD EVENTS
============================================================ */

skillCards.forEach(
    (card) => {

        const skillName =
            card.dataset.skill;


        /* ----------------------------------------
           Hover preview
        ----------------------------------------- */

        card.addEventListener(
            "mouseenter",
            () => {

                previewSkill(
                    skillName
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                clearSkillPreview();

            }
        );


        /* ----------------------------------------
           Keyboard focus preview
        ----------------------------------------- */

        card.addEventListener(
            "focus",
            () => {

                previewSkill(
                    skillName
                );

            }
        );


        card.addEventListener(
            "blur",
            () => {

                clearSkillPreview();

            }
        );


        /* ----------------------------------------
           Click lock / reset
        ----------------------------------------- */

        card.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                toggleSkill(
                    skillName
                );

            }
        );


        /* ----------------------------------------
           Keyboard selection
        ----------------------------------------- */

        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key !==
                        "Enter" &&
                    event.key !==
                        " "
                ) {

                    return;

                }

                event.preventDefault();

                toggleSkill(
                    skillName
                );

            }
        );

    }
);


/* ============================================================
   SKILLS — EMPTY GRID RESET
============================================================ */

if (skillSystem) {

    skillSystem.addEventListener(
        "click",
        (event) => {

            if (
                event.target.closest(
                    ".skill-card"
                )
            ) {

                return;

            }

            if (
                lockedSkillName
            ) {

                clearSkillSelection();

            }

        }
    );

}


/* ============================================================
   SKILLS — OUTSIDE CLICK RESET
============================================================ */

document.addEventListener(
    "click",
    (event) => {

        if (
            !skillSystem ||
            !lockedSkillName
        ) {

            return;

        }

        if (
            skillSystem.contains(
                event.target
            )
        ) {

            return;

        }

        clearSkillSelection();

    }
);


/* ============================================================
   INITIAL SKILLS STATE
============================================================ */

if (
    skillSystem &&
    skillCards.length > 0
) {

    clearSkillSelection();

}


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

    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const parent =
                        button.closest(
                            parentSelector
                        );

                    if (!parent) return;

                    const details =
                        parent.querySelector(
                            detailsSelector
                        );

                    const label =
                        button.querySelector(
                            labelSelector
                        );

                    const symbol =
                        button.querySelector(
                            symbolSelector
                        );

                    if (
                        !details ||
                        !label ||
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

}


setupExpandableControls({

    buttons:
        roleToggles,

    parentSelector:
        ".role-item",

    detailsSelector:
        ".role-details",

    labelSelector:
        ".role-toggle-label",

    symbolSelector:
        ".role-toggle-symbol"

});


setupExpandableControls({

    buttons:
        projectToggles,

    parentSelector:
        ".project-featured",

    detailsSelector:
        ".project-details",

    labelSelector:
        ".project-toggle-label",

    symbolSelector:
        ".project-toggle-symbol"

});


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

} else {

    const revealObserver =
        new IntersectionObserver(

            (
                entries,
                observer
            ) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

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

    if (!siteHeader) return;

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

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            mobileNav &&
            mobileNav.classList.contains(
                "open"
            )
        ) {

            closeMobileMenu();

            if (menuToggle) {

                menuToggle.focus();

            }

            return;

        }


        if (
            skillSystem &&
            lockedSkillName
        ) {

            clearSkillSelection();

        }


        if (
            lockedCompanyName
        ) {

            clearCompanySelection();

        }

    }
);


/* ============================================================
   CAROUSELS

   Selected Work:
   1 project per page at every viewport size.

   Navigation wraps continuously.
============================================================ */

function getCarouselItems(
    track
) {

    return Array.from(
        track.children
    ).filter(
        (item) =>
            item.matches(
                ".project-featured"
            )
    );

}


function getCarouselIndex(
    track
) {

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


function normalizeCarouselIndex(
    track,
    requestedIndex
) {

    const items =
        getCarouselItems(
            track
        );

    if (
        items.length ===
        0
    ) {

        return 0;

    }

    return (
        requestedIndex %
        items.length +
        items.length
    ) %
    items.length;

}


function showCarouselItem(
    track,
    index
) {

    const items =
        getCarouselItems(
            track
        );

    if (
        items.length ===
        0
    ) {

        return;

    }

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

            const isActive =
                itemIndex ===
                normalizedIndex;

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


function moveCarousel(
    track,
    direction
) {

    const items =
        getCarouselItems(
            track
        );

    if (
        items.length <=
        1
    ) {

        return;

    }

    const currentIndex =
        getCarouselIndex(
            track
        );

    showCarouselItem(
        track,
        currentIndex +
            direction
    );

}


/* ============================================================
   MOBILE CAROUSEL SWIPE

   Swipe left  → next
   Swipe right → previous

   Enabled only at <= 700px. Gestures beginning on interactive
   elements are ignored so links/buttons remain reliable.
============================================================ */

function setupCarouselSwipe(
    track
) {

    let touchStartX =
        0;

    let touchStartY =
        0;

    let touchStartedOnInteractiveElement =
        false;


    track.addEventListener(
        "touchstart",

        (event) => {

            if (
                !isMobileViewport() ||
                event.touches.length !==
                    1
            ) {

                return;

            }

            touchStartedOnInteractiveElement =
                Boolean(
                    event.target.closest(
                        "a, button, input, textarea, select, label"
                    )
                );

            if (
                touchStartedOnInteractiveElement
            ) {

                return;

            }

            touchStartX =
                event.touches[
                    0
                ].clientX;

            touchStartY =
                event.touches[
                    0
                ].clientY;

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
                !isMobileViewport()
            ) {

                return;

            }

            if (
                touchStartedOnInteractiveElement
            ) {

                touchStartedOnInteractiveElement =
                    false;

                return;

            }

            if (
                event.changedTouches.length !==
                1
            ) {

                return;

            }

            const touchEndX =
                event.changedTouches[
                    0
                ].clientX;

            const touchEndY =
                event.changedTouches[
                    0
                ].clientY;

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
                ) >=
                    minimumSwipeDistance &&

                Math.abs(
                    deltaX
                ) >
                    Math.abs(
                        deltaY
                    ) *
                    1.2;

            if (
                !isHorizontalSwipe
            ) {

                return;

            }

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

        showCarouselItem(
            track,
            0
        );


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


        setupCarouselSwipe(
            track
        );

    }
);


/* ============================================================
   RESPONSIVE CAROUSEL REFRESH
============================================================ */

let previousCarouselMobileState =
    isMobileViewport();


window.addEventListener(
    "resize",
    () => {

        const currentMobileState =
            isMobileViewport();

        if (
            currentMobileState ===
            previousCarouselMobileState
        ) {

            return;

        }

        horizontalTracks.forEach(
            (track) => {

                showCarouselItem(
                    track,
                    getCarouselIndex(
                        track
                    )
                );

            }
        );

        previousCarouselMobileState =
            currentMobileState;

    }
);


/* ============================================================
   V2.9 — UNIFIED CARD STACK
   Up to five visible cards, one coordinated transition.
============================================================ */
(function initializeDealerDeck() {
    for (const deck of document.querySelectorAll(
        "#independentDeck, #professionalDeck"
    )) {
        const cards = Array.from(
            deck.querySelectorAll(".dealer-card")
        );

        if (!cards.length) continue;

        let activeIndex = 0;
        let expanded = false;
        let moving = false;
        let movementTimer = null;

        const duration = 550;
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        function nextIndex() {
            return (activeIndex + 1) % cards.length;
        }

        function renderDeck(rearOverride = null) {
            // Display up to five cards: one front and as many as four backs.
            // A temporary rear override preserves the existing shuffle behavior.
            const remaining = [];
            for (let step = 1; step < cards.length; step++) {
                remaining.push((activeIndex + step) % cards.length);
            }
            if (rearOverride !== null && rearOverride !== activeIndex) {
                const position = remaining.indexOf(rearOverride);
                if (position > 0) {
                    remaining.splice(position, 1);
                    remaining.unshift(rearOverride);
                }
            }

            const visibleBacks = remaining.slice(0, 4);
            deck.classList.toggle("is-expanded", expanded);
            deck.classList.toggle("is-multi-stack", cards.length >= 3);

            cards.forEach((card, index) => {
                const active = index === activeIndex;
                const rank = visibleBacks.indexOf(index);
                const visibleRear = !active && rank !== -1;
                const queued = !active && !visibleRear;

                card.classList.toggle("is-face-up", active);
                card.classList.toggle("is-face-down", !active);
                card.classList.toggle("is-queued", queued);
                card.classList.remove("is-dealing");
                card.dataset.stackRank = visibleRear ? String(rank + 1) : "";
                card.style.removeProperty("transform");
                card.style.removeProperty("opacity");
                card.dataset.nextLabel = active ? "" : "NEXT PROJECT";

                const toggle = card.querySelector(".dealer-expand");
                const details = card.querySelector(".dealer-expanded-content");

                if (toggle) {
                    toggle.setAttribute("aria-expanded", String(active && expanded));
                    const label = toggle.querySelector("span");
                    if (label) label.textContent = active && expanded ? "View Less" : "View More";
                    toggle.tabIndex = active ? 0 : -1;
                }
                if (details) details.hidden = !(active && expanded);

                if (visibleRear && !expanded) {
                    card.setAttribute("role", "button");
                    card.tabIndex = 0;
                    card.setAttribute("aria-label", "Select " +
                        (card.querySelector(".dealer-card-back h3")?.textContent || "project"));
                } else {
                    card.removeAttribute("role");
                    card.removeAttribute("tabindex");
                    card.removeAttribute("aria-label");
                }

                card.setAttribute("aria-hidden", String(!active && (expanded || queued)));
            });
        }

        function finishMovement() {
            clearTimeout(movementTimer);
            movementTimer = null;
            moving = false;

            deck.classList.remove("is-stack-moving");
            renderDeck();
        }

        function selectCard(index) {
            if (
                expanded ||
                moving ||
                index === activeIndex ||
                index < 0 ||
                index >= cards.length
            ) {
                return;
            }

            if (reduceMotion.matches) {
                activeIndex = index;
                renderDeck();
                return;
            }

            moving = true;

            const outgoingIndex = activeIndex;
            const incomingIndex = index;

            // Prepare the requested card in the rear position.
            // This also handles backwards navigation in a 3-card deck.
            const currentRear = nextIndex();

            if (incomingIndex !== currentRear) {
                deck.classList.add("is-stack-preparing");
                renderDeck(incomingIndex);

                // Commit the prepared layout before transitioning.
                void deck.offsetHeight;
                deck.classList.remove("is-stack-preparing");
            }

            deck.classList.add("is-stack-moving");

            // Allow the prepared layout to paint first.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    activeIndex = incomingIndex;

                    // Keep the outgoing front card visible as
                    // the new rear card throughout the movement.
                    renderDeck(outgoingIndex);

                    movementTimer = setTimeout(
                        finishMovement,
                        duration
                    );
                });
            });
        }

        function cycleProject(direction) {
            if (expanded || moving || cards.length < 2) {
                return;
            }

            const index =
                (activeIndex + direction + cards.length)
                % cards.length;

            selectCard(index);
        }

        deck.querySelector("[data-dealer-prev]")
            ?.addEventListener("click", () => {
                cycleProject(-1);
            });

        deck.querySelector("[data-dealer-next]")
            ?.addEventListener("click", () => {
                cycleProject(1);
            });

        cards.forEach((card, index) => {
            card.addEventListener("click", event => {
                if (
                    expanded ||
                    moving ||
                    index === activeIndex ||
                    card.classList.contains("is-queued") ||
                    event.target.closest("a, button")
                ) {
                    return;
                }

                selectCard(index);
            });

            card.addEventListener("keydown", event => {
                if (
                    expanded ||
                    moving ||
                    index === activeIndex ||
                    card.classList.contains("is-queued") ||
                    event.target !== card ||
                    !["Enter", " "].includes(event.key)
                ) {
                    return;
                }

                event.preventDefault();
                selectCard(index);
            });

            card.querySelector(".dealer-expand")
                ?.addEventListener("click", event => {
                    event.stopPropagation();

                    if (index !== activeIndex || moving) {
                        return;
                    }

                    const updateExpandedState = () => {
                        expanded = !expanded;
                        renderDeck();
                    };

                    if (
                        document.startViewTransition &&
                        !reduceMotion.matches
                    ) {
                        document.startViewTransition(
                            updateExpandedState
                        );
                    } else {
                        updateExpandedState();
                    }
                });
        });

        document.addEventListener("pointerdown", event => {
            if (!expanded) return;

            const activeCard = cards[activeIndex];

            if (activeCard.contains(event.target)) return;

            expanded = false;
            renderDeck();
        });

        document.addEventListener("keydown", event => {
            if (event.key !== "Escape" || !expanded) {
                return;
            }

            expanded = false;
            renderDeck();

            cards[activeIndex]
                .querySelector(".dealer-expand")
                ?.focus();
        });

        renderDeck();
    }
})();



/* Process / Approach — independent in-card descriptions */
(function initializeProcessGrid() {
    const grid = document.getElementById("processGrid");
    if (!grid) return;
    const steps = Array.from(grid.querySelectorAll(".process-step"));
    function setExpanded(step, expanded) {
        const button = step.querySelector(".process-step-hint");
        const description = step.querySelector(".process-step-description");
        step.classList.toggle("is-active", expanded);
        button.setAttribute("aria-expanded", String(expanded));
        button.innerHTML = expanded ? 'Close step <span aria-hidden="true">×</span>' : 'Explore step <span aria-hidden="true">↗</span>';
        description.hidden = !expanded;
    }
    steps.forEach(step => {
        const button = step.querySelector(".process-step-hint");
        button.addEventListener("click", () => {
            const next = button.getAttribute("aria-expanded") !== "true";
            steps.forEach(other => setExpanded(other, other === step && next));
        });
    });
    document.addEventListener("pointerdown", event => {
        if (!grid.contains(event.target)) steps.forEach(step => setExpanded(step, false));
    });
    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        const active = steps.find(step => step.classList.contains("is-active"));
        if (active) {
            setExpanded(active, false);
            active.querySelector(".process-step-hint").focus();
        }
    });
})();


/* ============================================================
   BEYOND WORK — CONTINUOUS CAROUSEL V1
============================================================ */

(function initializeBeyondCarousel() {

    const carousel = document.querySelector(
        "#beyond .beyond-carousel"
    );

    if (!carousel) return;

    const viewport = carousel.querySelector(
        ".beyond-carousel-viewport"
    );

    const track = carousel.querySelector(
        ".beyond-carousel-track"
    );

    const previous = carousel.querySelector(
        ".beyond-prev"
    );

    const next = carousel.querySelector(
        ".beyond-next"
    );

    if (!viewport || !track) return;

    const originals = Array.from(track.children).filter(
        (element) => element.classList.contains("beyond-slide")
    );

    if (originals.length < 2) return;

    const motionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const pixelsPerSecond = 48;

    /* ----------------------------------------
       Create seamless loop
    ----------------------------------------- */

    originals.forEach((slide) => {

        const clone = slide.cloneNode(true);

        clone.setAttribute("aria-hidden", "true");

        clone.classList.add("beyond-slide-clone");

        clone.querySelectorAll(
            "a, button, input, select, textarea, [tabindex]"
        ).forEach((item) => {

            item.setAttribute("tabindex", "-1");

        });

        track.appendChild(clone);

    });

    let cycleWidth = 0;
    let offset = 0;
    let frame = 0;
    let lastTime = null;

    let hovered = false;
    let focused = false;
    let dragging = false;
    let pointerId = null;
    let pointerX = 0;
    let dragDistance = 0;
    let lastInteractionTime = 0;
    let isVisible = true;

    /* ----------------------------------------
       Position helpers
    ----------------------------------------- */

    const normalize = (value) => {

        if (cycleWidth <= 0) return 0;

        return (
            (value % cycleWidth) + cycleWidth
        ) % cycleWidth;

    };

    const paint = () => {

        track.style.transform =
            `translate3d(${-offset}px, 0, 0)`;

    };

    function measure() {

        const firstClone = track.querySelector(
            ".beyond-slide-clone"
        );

        if (!firstClone) return;

        const firstOriginal = originals[0];

        cycleWidth =
            firstClone.offsetLeft -
            firstOriginal.offsetLeft;

        offset = normalize(offset);

        paint();

    }

    /* ----------------------------------------
       Animation controls
    ----------------------------------------- */

    function paused() {

        return (
            motionPreference.matches ||
            hovered ||
            focused ||
            dragging ||
            !isVisible ||
            document.hidden ||
            performance.now() - lastInteractionTime < 1100
        );

    }

    function animate(time) {

        if (
            lastTime !== null &&
            !paused() &&
            cycleWidth > 0
        ) {

            const elapsed = Math.min(
                (time - lastTime) / 1000,
                0.05
            );

            offset = normalize(
                offset + pixelsPerSecond * elapsed
            );

            paint();

        }

        lastTime = time;

        frame = window.requestAnimationFrame(animate);

    }

    /* ----------------------------------------
       Previous / Next navigation
    ----------------------------------------- */

    function moveByCard(direction) {

        measure();

        if (!cycleWidth) return;

        const gap = parseFloat(
            window.getComputedStyle(track).columnGap
        ) || 0;

        const step =
            originals[0].getBoundingClientRect().width +
            gap;

        offset = normalize(
            offset + direction * step
        );

        lastInteractionTime = performance.now();

        paint();

    }

    previous?.addEventListener(
        "click",
        () => moveByCard(-1)
    );

    next?.addEventListener(
        "click",
        () => moveByCard(1)
    );

    /* ----------------------------------------
       Pause on hover / keyboard focus
    ----------------------------------------- */

    carousel.addEventListener(
        "mouseenter",
        () => {
            hovered = true;
        }
    );

    carousel.addEventListener(
        "mouseleave",
        () => {
            hovered = false;
        }
    );

    carousel.addEventListener(
        "focusin",
        () => {
            focused = true;
        }
    );

    carousel.addEventListener(
        "focusout",
        (event) => {

            if (!carousel.contains(event.relatedTarget)) {
                focused = false;
            }

        }
    );

    /* ----------------------------------------
       Mouse / touch dragging
    ----------------------------------------- */

    viewport.style.touchAction = "pan-y";

    viewport.addEventListener(
        "pointerdown",
        (event) => {

            if (
                event.button !== 0 ||
                event.target.closest(
                    "a, button, input, textarea, select"
                )
            ) {
                return;
            }

            dragging = true;

            pointerId = event.pointerId;

            pointerX = event.clientX;

            dragDistance = 0;

            viewport.setPointerCapture(event.pointerId);

        }
    );

    viewport.addEventListener(
        "pointermove",
        (event) => {

            if (
                !dragging ||
                event.pointerId !== pointerId
            ) {
                return;
            }

            const delta =
                event.clientX - pointerX;

            pointerX = event.clientX;

            dragDistance += Math.abs(delta);

            offset = normalize(
                offset - delta
            );

            paint();

        }
    );

    function endDrag(event) {

        if (
            !dragging ||
            event.pointerId !== pointerId
        ) {
            return;
        }

        dragging = false;

        pointerId = null;

        lastInteractionTime = performance.now();

    }

    viewport.addEventListener(
        "pointerup",
        endDrag
    );

    viewport.addEventListener(
        "pointercancel",
        endDrag
    );

    viewport.addEventListener(
        "lostpointercapture",
        () => {

            dragging = false;

            pointerId = null;

            lastInteractionTime = performance.now();

        }
    );

    /* ----------------------------------------
       Prevent accidental clicks after dragging
    ----------------------------------------- */

    viewport.addEventListener(
        "click",
        (event) => {

            if (dragDistance > 8) {

                event.preventDefault();

                event.stopPropagation();

            }

            dragDistance = 0;

        },
        true
    );

    /* ----------------------------------------
       Visibility optimization
    ----------------------------------------- */

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries) => {

                isVisible =
                    entries[0]?.isIntersecting ?? true;

                lastTime = null;

            },
            {
                threshold: 0.01
            }
        );

        observer.observe(carousel);

    }

    /* ----------------------------------------
       Responsive recalculation
    ----------------------------------------- */

    const resizeObserver =
        "ResizeObserver" in window
            ? new ResizeObserver(measure)
            : null;

    if (resizeObserver) {

        resizeObserver.observe(viewport);

    } else {

        window.addEventListener(
            "resize",
            measure,
            { passive: true }
        );

    }

    /* ----------------------------------------
       Initialize
    ----------------------------------------- */

    measure();

    frame = window.requestAnimationFrame(animate);

    /* ----------------------------------------
       Cleanup if carousel is removed
    ----------------------------------------- */

    const removalObserver = new MutationObserver(() => {

        if (document.contains(carousel)) return;

        window.cancelAnimationFrame(frame);

        resizeObserver?.disconnect();

        removalObserver.disconnect();

    });

    removalObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

})();
