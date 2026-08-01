/* ============================================================
   SITE SCRIPT

   Behaviour that is not motion: the mobile menu.

   Everything here is an enhancement. The menu markup renders as
   a reachable block with this file deleted — it is hidden by
   the `hidden` attribute, which this script owns, rather than by
   CSS that would leave it permanently invisible if the script
   never ran.

   The phone number is a plain `tel:` link in the document and is
   never gated on any of this.

   Specification: Austin_Phase1_ImplementationPlan.md §7.3
============================================================ */

(function ()
{

    'use strict';


    /* ============================================================
       MOBILE MENU
    ============================================================ */

    /* ── Selectors ── */

    const menuToggle = document.querySelector('[data-menuToggle]');

    const menuClose = document.querySelector('[data-menuClose]');

    const mobileMenu = document.querySelector('[data-mobileMenu]');

    const mainContent = document.querySelector('main');

    const siteFooter = document.querySelector('footer');


    /* ── State ── */

    let scrollPosition = 0;


    /* ── Utility functions ── */

    function focusableWithin(container)
    {

        return Array.from(
            container.querySelectorAll('a[href], button:not([disabled])')
        );

    }


    function setBackgroundInert(isInert)
    {

        for (const region of [mainContent, siteFooter])
        {

            if (!region)
            {

                continue;

            }

            if (isInert)
            {

                region.setAttribute('inert', '');

            }
            else
            {

                region.removeAttribute('inert');

            }

        }

    }


    /* ── Core functions ── */

    function openMobileMenu()
    {

        /* Captured before the lock is applied, because `overflow:
           hidden` on the document loses the position on iOS and the
           reader comes back to the top of the page. */
        scrollPosition = window.scrollY;

        mobileMenu.hidden = false;

        document.documentElement.classList.add('noScroll');

        document.body.classList.add('noScroll');

        setBackgroundInert(true);

        menuToggle.setAttribute('aria-expanded', 'true');

        menuToggle.setAttribute('aria-label', 'Close menu');

        if (menuClose)
        {

            menuClose.focus();

        }

    }


    function closeMobileMenu()
    {

        mobileMenu.hidden = true;

        document.documentElement.classList.remove('noScroll');

        document.body.classList.remove('noScroll');

        setBackgroundInert(false);

        menuToggle.setAttribute('aria-expanded', 'false');

        menuToggle.setAttribute('aria-label', 'Open menu');

        window.scrollTo(0, scrollPosition);

        menuToggle.focus();

    }


    function trapFocus(event)
    {

        if (event.key !== 'Tab' || mobileMenu.hidden)
        {

            return;

        }

        const focusable = focusableWithin(mobileMenu);

        if (focusable.length === 0)
        {

            return;

        }

        const first = focusable[0];

        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first)
        {

            event.preventDefault();

            last.focus();

            return;

        }

        if (!event.shiftKey && document.activeElement === last)
        {

            event.preventDefault();

            first.focus();

        }

    }


    /* ── Event listeners ── */

    if (menuToggle && mobileMenu)
    {

        menuToggle.addEventListener(
            'click',
            openMobileMenu
        );

        if (menuClose)
        {

            menuClose.addEventListener(
                'click',
                closeMobileMenu
            );

        }

        document.addEventListener(
            'keydown',
            function (event)
            {

                if (event.key === 'Escape' && !mobileMenu.hidden)
                {

                    closeMobileMenu();

                    return;

                }

                trapFocus(event);

            }
        );

        /* Following a link inside the menu must leave the document in a
           scrollable state, or the destination page loads locked. */
        for (const link of mobileMenu.querySelectorAll('a[href]'))
        {

            link.addEventListener(
                'click',
                function ()
                {

                    document.documentElement.classList.remove('noScroll');

                    document.body.classList.remove('noScroll');

                }
            );

        }

    }

}());
