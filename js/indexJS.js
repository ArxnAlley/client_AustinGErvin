/* ============================================================
   HOMEPAGE SCRIPT

   The scene descent: light → dusk → dark, and back.

   This file is an enhancement and nothing else. Delete it and
   the page is still correct — every section carries its own
   `data-scene` and paints its own surface, so the descent is
   visible with the whole script layer removed. What this adds
   is the crossfade between those states rather than the states
   themselves. That is the mute test, and it is the reason the
   per-section attribute was kept rather than replaced by this
   body-level state. See project_memory.md §9.10.

   Two triggers, and only two: the positioning statement and the
   reviews section (DS-003). Both were chosen because they are
   the most type-sparse sections on the page, so the transition
   lands where the least reading is interrupted.

   No scroll listener anywhere in this file (PERF-008), and no
   property but `opacity` is animated (MOT-001) — the animation
   itself lives in styleIndex.css.

   Specification: Austin_MotionLanguage.md · framework DS-001
============================================================ */

(function ()
{

    'use strict';


    /* ============================================================
       SCENE DESCENT
    ============================================================ */

    /* ── Selectors ── */

    const triggers = Array.from(
        document.querySelectorAll('[data-scene-trigger]')
    );

    /* Watched only so that the callback wakes. The scene is
       computed from `triggers` alone, so this does not add a
       third scene trigger (DS-003) — it adds the guarantee that
       something is always crossing the band. See `observed`. */
    const sections = Array.from(
        document.querySelectorAll('main > section')
    );

    const backdrop = document.querySelector('[data-sceneBackdrop]');


    /* A browser without IntersectionObserver keeps the static
       descent, which is a complete page rather than a degraded
       one. Bailing out here is the whole fallback. */
    if (triggers.length === 0
        || backdrop === null
        || typeof window.IntersectionObserver !== 'function')
    {

        return;

    }


    /* ── State ── */

    let currentScene = null;


    /* ── Core functions ── */

    /**
     * The scene the reader is currently in.
     *
     * Derived from where the triggers sit rather than accumulated
     * from enter and exit events, because a fast scroll can carry
     * the reader past a trigger between two callbacks and an
     * event-counting implementation would still be one scene
     * behind. Position is the truth; the observer only decides
     * when to ask.
     */
    function sceneAtCurrentPosition()
    {

        const middle = window.innerHeight / 2;

        let scene = 'light';

        /* Document order, so the last trigger above the midline
           wins and scrolling back up reverses it exactly. */
        for (const trigger of triggers)
        {

            if (trigger.getBoundingClientRect().top <= middle)
            {

                scene = trigger.dataset.sceneTrigger;

            }

        }

        return scene;

    }


    function applyScene()
    {

        const scene = sceneAtCurrentPosition();

        if (scene === currentScene)
        {

            return;

        }

        currentScene = scene;

        document.body.dataset.scene = scene;

    }


    /* ── Observer ── */

    /* A band across the middle of the viewport.

       Watching only the two triggers looks sufficient and is not:
       a jump long enough to carry a trigger from above the
       viewport to below it — an anchor link, a restored scroll
       position, `scrollTo`, a hard flick — never intersects the
       band at all, so the callback does not run and the scene
       latches at whatever it was. Every section is observed
       instead. One of them is always under the middle of the
       viewport, so any jump lands on a change and wakes the
       callback, and no scroll listener is needed to do it
       (PERF-008). */

    const observed = sections.length > 0 ? sections : triggers;

    const observer = new window.IntersectionObserver(
        applyScene,
        { rootMargin: '-45% 0px -45% 0px' }
    );

    for (const element of observed)
    {

        observer.observe(element);

    }


    /* ── Announce ──

       The sections stop painting only once this script is running,
       so the flag is set here rather than in the markup. Set last,
       after the observer is live, so there is no frame in which
       the sections have stood down and nothing has taken over. */

    applyScene();

    document.documentElement.dataset.sceneMode = 'observed';

}());
