/* ============================================================
   HOMEPAGE SCRIPT

   Three jobs, in order of how much they matter:

     1. The load curtain — and getting rid of it, reliably
     2. The header, which takes the scene of whatever chapter is
        passing beneath it
     3. One reveal, on the statement

   Everything here is an enhancement. The curtain is `hidden` in
   the markup, so with this file deleted it never appears and
   the page is simply there. The chapter dissolves are CSS
   gradients and need no script at all.

   No scroll listener anywhere in this file: a sentinel and an
   IntersectionObserver do the same work without running code on
   every frame of every scroll.
============================================================ */

(function ()
{

    'use strict';


    const root = document.documentElement;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ============================================================
       LOAD CURTAIN

       The rule that shapes all of this: there is no state in
       which a visitor is held on the curtain. A hard timer
       removes it regardless of what any asset is doing, and it
       is armed before anything else runs, so a later exception
       cannot strand anyone behind it.
    ============================================================ */

    const curtain = document.querySelector('[data-loadCurtain]');

    /* The curtain holds until `window.load`, so the page is never
       revealed mid-decode with half its imagery painted. MIN_SHOW
       keeps a fast connection from producing a flash that reads
       as a glitch rather than as an entrance. FAILSAFE is the
       promise that none of this can strand anyone: it is armed
       before any other work and never cleared. */

    const MIN_SHOW = reduceMotion ? 260 : 1600;

    const FAILSAFE = 7000;


    function removeCurtain()
    {

        if (!curtain || curtain.hidden)
        {

            return;

        }

        curtain.hidden = true;

        root.classList.remove('noScroll');

        document.body.classList.remove('noScroll');

    }


    function liftCurtain()
    {

        if (!curtain || curtain.hidden || curtain.classList.contains('isLifting'))
        {

            return;

        }

        curtain.classList.add('isLifting');

        window.setTimeout(removeCurtain, reduceMotion ? 220 : 950);

    }


    function runCurtain()
    {

        /* Second visits get the page, not the ceremony. */
        let seen = false;

        try
        {

            seen = window.sessionStorage.getItem('aeCurtainSeen') === '1';

            window.sessionStorage.setItem('aeCurtainSeen', '1');

        }
        catch
        {

            /* Private mode: treat as a first visit and rely on the timers. */
        }

        if (seen)
        {

            return;

        }

        curtain.hidden = false;

        root.classList.add('noScroll');

        document.body.classList.add('noScroll');

        /* Armed first, and never cleared: whatever else happens,
           the curtain is gone by FAILSAFE. */
        window.setTimeout(removeCurtain, FAILSAFE);

        const started = Date.now();

        function finish()
        {

            const waited = Date.now() - started;

            window.setTimeout(liftCurtain, Math.max(0, MIN_SHOW - waited));

        }

        /* `window.load` is the whole condition: it fires only once
           every stylesheet, font and image the document
           references has settled. Waiting for it is what
           guarantees nothing is revealed half-painted. */
        if (document.readyState === 'complete')
        {

            finish();

        }
        else
        {

            window.addEventListener('load', finish, { once: true });

        }

        /* Any intent to interact ends it immediately. */
        for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart'])
        {

            window.addEventListener(type, liftCurtain, { once: true, passive: true });

        }

    }


    if (curtain)
    {

        runCurtain();

    }


    /* ============================================================
       HEADER

       `isStuck` comes from a sentinel rather than a scroll
       handler, and the header's scene is read from the geometry
       of the chapters rather than accumulated from events, so a
       fast scroll or a jump to an anchor cannot leave it
       describing the wrong chapter.
    ============================================================ */

    const header = document.querySelector('[data-siteHeader]');

    const chapters = Array.from(document.querySelectorAll('[data-chapter]'));


    function applyHeaderScene()
    {

        const probe = header.getBoundingClientRect().height * 0.5;

        let scene = chapters[0].dataset.scene;

        for (const chapter of chapters)
        {

            const box = chapter.getBoundingClientRect();

            if (box.top <= probe && box.bottom > probe)
            {

                scene = chapter.dataset.scene;

            }

        }

        if (header.dataset.scene !== scene)
        {

            header.dataset.scene = scene;

        }

    }


    if (header && chapters.length > 0 && typeof window.IntersectionObserver === 'function')
    {

        /* A band across the top of the viewport. Every chapter is
           watched, so any jump lands on a change and wakes the
           callback rather than leaving the header behind. */
        const sceneObserver = new window.IntersectionObserver(
            applyHeaderScene,
            { rootMargin: '0px 0px -88% 0px', threshold: [0, 1] }
        );

        for (const chapter of chapters)
        {

            sceneObserver.observe(chapter);

        }

        applyHeaderScene();

        /* Sentinel for the stuck state. One pixel at the very top
           of the document; when it leaves, the header has lifted
           off the page. */
        const sentinel = document.createElement('div');

        sentinel.setAttribute('aria-hidden', 'true');

        sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';

        document.body.prepend(sentinel);

        new window.IntersectionObserver(
            function (entries)
            {

                header.classList.toggle('isStuck', !entries[0].isIntersecting);

                applyHeaderScene();

            },
            { threshold: 0 }
        ).observe(sentinel);

    }


    /* ============================================================
       MEGA MENU — ENHANCEMENT ONLY

       The panel already opens on hover and on focus-within in
       CSS. This adds the two things CSS cannot express: the
       state announced to assistive technology, and Escape to
       close. `aria-expanded` is written here rather than in the
       markup, because an attribute that never changes is worse
       than an absent one.
    ============================================================ */

    for (const megaItem of document.querySelectorAll('[data-megaItem]'))
    {

        const megaTrigger = megaItem.querySelector('[data-megaTrigger]');

        if (!megaTrigger)
        {

            continue;

        }

        megaTrigger.setAttribute('aria-expanded', 'false');

        megaTrigger.setAttribute('aria-haspopup', 'true');

        /* Mirrors the CSS condition exactly rather than
           re-deriving it. Testing `document.activeElement`
           instead let the attribute disagree with what was on
           screen whenever the page itself was not the focused
           surface. */
        const report = function ()
        {

            const open = megaItem.matches(':hover, :focus-within');

            megaTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');

        };

        for (const type of ['pointerenter', 'pointerleave', 'focusin', 'focusout'])
        {

            megaItem.addEventListener(type, function ()
            {

                /* focusout lands before the incoming element takes
                   focus, so the read is deferred a tick. */
                window.setTimeout(report, 0);

            });

        }

        megaItem.addEventListener('keydown', function (event)
        {

            if (event.key === 'Escape')
            {

                megaTrigger.focus();

                megaTrigger.setAttribute('aria-expanded', 'false');

            }

        });

    }


    /* ============================================================
       REVIEW MARQUEE

       The seam is the whole problem with a marquee, and the fix
       is arithmetic rather than measurement: each track is given
       a second copy of its cards, and the animation translates
       exactly -50%. The second copy therefore arrives precisely
       where the first began, so the loop closes on itself and
       nothing has to be measured, corrected, or recalculated on
       resize.

       The duplicate is `inert`, so the same testimonial is never
       announced twice and none of its controls can be tabbed to.

       Speed is derived from content width, not fixed, so adding
       reviews later changes how long a lap takes and never how
       fast the cards travel.
    ============================================================ */

    const PIXELS_PER_SECOND = 26;


    /**
     * Clamps a review and gives it the control that undoes the
     * clamp. Runs on originals BEFORE they are duplicated, so the
     * two halves of a track are identical — a clone left at full
     * length would make the halves different heights and the
     * -50% translate would no longer land where it started.
     */
    function clampReview(quote)
    {

        const body = quote.querySelector('p');

        if (!body)
        {

            return;

        }

        quote.classList.add('isClamped');

        /* Nothing to expand if it already fits. */
        if (body.scrollHeight <= body.clientHeight + 1)
        {

            quote.classList.remove('isClamped');

            return;

        }

        const button = document.createElement('button');

        button.type = 'button';

        button.className = 'reviewExpand';

        button.textContent = 'Read full review';

        button.setAttribute('aria-expanded', 'false');

        button.addEventListener('click', function ()
        {

            const open = quote.classList.toggle('isExpanded');

            button.textContent = open ? 'Show less' : 'Read full review';

            button.setAttribute('aria-expanded', open ? 'true' : 'false');

        });

        quote.insertAdjacentElement('afterend', button);

    }


    /* ── The hero's three ──

       Same problem, different shape. One of the three testimonies
       is half again as long as the others; left at full length it
       set the height of all three, and the two shorter cards
       carried a hole where their text had run out.

       The cap is measured rather than declared. A fixed number of
       lines is only ever right at one card width: five lines is
       the shorter reviews' natural length at 1440, but at 1024 —
       where the same three cards are a hundred pixels narrower —
       every one of them ran past five and the row grew three
       "Read full review" links, which reads as broken content
       rather than as an excerpt. Taking the median natural height
       of the three instead means the cap is whatever the middle
       testimony needs, at any width, and only a review genuinely
       longer than its neighbours is ever cut.

       With no script the full text is simply there. Nothing is
       behind the clamp that is not also reachable without it. */

    const heroQuotes = Array.from(document.querySelectorAll('.heroProofQuote'));


    function fitHeroQuotes()
    {

        for (const quote of heroQuotes)
        {

            quote.classList.remove('isClamped', 'isExpanded');

            quote.style.removeProperty('--heroQuoteCap');

            const stale = quote.nextElementSibling;

            if (stale && stale.classList.contains('reviewExpand'))
            {

                stale.remove();

            }

        }

        const cards = document.querySelector('.heroProofCards');

        if (!cards || heroQuotes.length < 3)
        {

            return;

        }

        /* Only while they are a row. Stacked, each card is its own
           height and there is nothing to reconcile. */
        const columns = getComputedStyle(cards).gridTemplateColumns.split(' ').length;

        if (columns < 3)
        {

            return;

        }

        const natural = heroQuotes.map(function (quote)
        {

            return quote.querySelector('p').scrollHeight;

        });

        const cap = natural.slice().sort(function (a, b) { return a - b; })[Math.floor(natural.length / 2)];

        heroQuotes.forEach(function (quote, index)
        {

            if (natural[index] <= cap + 2)
            {

                return;

            }

            quote.style.setProperty('--heroQuoteCap', `${cap}px`);

            clampReview(quote);

        });

    }


    fitHeroQuotes();


    /* Re-measured on resize, because the cap depends on how wide
       the cards happen to be. */

    let refit = 0;

    window.addEventListener('resize', function ()
    {

        clearTimeout(refit);

        refit = setTimeout(fitHeroQuotes, 180);

    });


    for (const marquee of document.querySelectorAll('[data-marquee]'))
    {

        for (const track of marquee.querySelectorAll('[data-track]'))
        {

            const cards = Array.from(track.children);

            if (cards.length === 0)
            {

                continue;

            }

            for (const card of cards)
            {

                const quote = card.querySelector('.reviewText');

                if (quote)
                {

                    clampReview(quote);

                }

            }

            /* Measured after clamping and before duplication, so
               it is the settled width of exactly one lap. */
            const lapWidth = track.scrollWidth;

            for (const card of cards)
            {

                const clone = card.cloneNode(true);

                clone.setAttribute('data-clone', '');

                clone.setAttribute('aria-hidden', 'true');

                clone.setAttribute('inert', '');

                track.appendChild(clone);

            }

            track.style.setProperty(
                '--marqueeDuration',
                `${Math.round(lapWidth / PIXELS_PER_SECOND)}s`
            );

        }

        marquee.setAttribute('data-ready', '');

    }


    /* ── Pause on touch ──

       Hover covers a mouse and `:focus-within` covers a keyboard.
       A finger has neither, so holding the section still is what
       stands in for both. */

    const reviewSection = document.querySelector('[data-reviews]');


    if (reviewSection)
    {

        reviewSection.addEventListener(
            'pointerdown',
            function (event)
            {

                if (event.pointerType !== 'mouse')
                {

                    reviewSection.setAttribute('data-paused', '');

                }

            },
            { passive: true }
        );

        for (const type of ['pointerup', 'pointercancel', 'pointerleave'])
        {

            reviewSection.addEventListener(
                type,
                function ()
                {

                    reviewSection.removeAttribute('data-paused');

                },
                { passive: true }
            );

        }

    }


    /* ============================================================
       REVEAL

       One moment, on the statement, and nothing else. A page
       where every section enters the same way has no emphasis
       left to spend.
    ============================================================ */

    const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'));


    if (revealTargets.length > 0 && typeof window.IntersectionObserver === 'function')
    {

        root.classList.add('jsReady');

        const revealObserver = new window.IntersectionObserver(
            function (entries)
            {

                for (const entry of entries)
                {

                    if (entry.isIntersecting)
                    {

                        entry.target.classList.add('isRevealed');

                        revealObserver.unobserve(entry.target);

                    }

                }

            },
            { rootMargin: '0px 0px -18% 0px' }
        );

        for (const target of revealTargets)
        {

            revealObserver.observe(target);

        }

    }

}());
