/* ============================================================
   BUILD REVIEWS

   Renders data/reviews.json into index.html between marker
   comments. The markup is committed, so testimonials are real
   DOM text with no runtime fetch and no JavaScript dependency —
   but the text has exactly one source, and that source is the
   dataset.

   Run after any change to data/reviews.json:

     node scripts/buildReviews.mjs

   Two treatments come out of the one dataset:

     heroReviews     three individual cards on the hero's lower
                     edge, curated by dimension
     reviewMarquee   two tracks, each following its own sequence
                     from carouselOrder

   Review text is escaped and never transformed. These are real
   people's words, including their spelling.
============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const data = JSON.parse(readFileSync(join(root, "data/reviews.json"), "utf8"));
const page = join(root, "index.html");

let html = readFileSync(page, "utf8");


function escapeHtml (value)
{

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* The small Google mark, repeated per card. Kept as a builder
   rather than inlined a dozen times by hand. */
function googleMark (className)
{

    return `<svg class="${className}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">`
        + `<path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>`
        + `<path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>`
        + `<path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>`
        + `<path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>`
        + `</svg>`;

}


/* Five marks, lit as far as the record says and no further. A
   record with no rating gets no stars at all rather than a
   flattering guess — the mark alone still says where the review
   came from. */
function starRow (rating)
{

    if (typeof rating !== "number")
    {

        return "";

    }

    const marks = Array.from({ length: 5 }, (unused, i) =>
        `<svg class="${i < rating ? "isLit" : "isUnlit"}" viewBox="0 0 20 19" focusable="false"><use href="#starGlyph"/></svg>`
    ).join("");

    return `<span class="heroProofStars" role="img" aria-label="Rated ${rating} out of 5 on Google">${marks}</span>`;

}


/* ── Hero: three individual cards on the hero's lower edge ──

   Not a panel with columns in it. Three separate objects, each
   with its own ground and its own shadow, sitting across the
   bottom of the dark scene.

   The mark and the stars sit in the card's top corner, so each
   card states its own provenance and the group no longer needs a
   shared rating line above it. */

const heroReviews = data.reviews.filter((r) => r.hero);

if (heroReviews.length !== 3)
{

    throw new Error(`The hero composition holds exactly three cards; the dataset flags ${heroReviews.length}.`);

}

const heroMarkup = heroReviews.map((r) => `
                        <li class="heroProofCard" data-scene="light">

                            <p class="heroProofBadge">
                                ${googleMark("heroProofMark")}
                                ${starRow(r.rating)}
                            </p>

                            <div class="heroProofBody">

                                <blockquote class="heroProofQuote">
                                    <p>${escapeHtml(r.text)}</p>
                                </blockquote>

                                <figcaption class="heroProofMeta">
                                    <span class="heroProofName">${escapeHtml(r.author)}</span>
                                    <span class="heroProofSource">Google review</span>
                                </figcaption>

                            </div>

                        </li>`).join("\n");


/* ── Marquee: every written review, in two different orders ──

   The sequences are data, not code. Each row follows its own
   list from carouselOrder, so the two rows are different reels
   rather than one reel shown twice — and adding a review later
   is an edit to the dataset, never to the template. */

const byId = new Map(data.reviews.filter((r) => r.carousel).map((r) => [r.id, r]));

function sequence (name)
{

    const ids = data.carouselOrder[name];

    if (!Array.isArray(ids) || ids.length === 0)
    {

        throw new Error(`carouselOrder.${name} is missing or empty.`);

    }

    return ids.map((id) =>
    {

        const record = byId.get(id);

        if (!record)
        {

            throw new Error(`carouselOrder.${name} names "${id}", which is not a carousel review.`);

        }

        return record;

    });

}


/* Every card carries what the detail dialog needs, and — where
   the record admits it — where the rest of the words actually
   live.

   `truncated` is the honest flag. When it is true the dataset
   holds only the part Google showed before "… More", so the card
   must not offer to expand something we do not have. It gets a
   link to the source instead, and only if a `sourceUrl` was
   supplied. A truncated record with no URL gets neither control:
   an excerpt with no route to the rest is still better than a
   dead button or an invented link. */

function card (r)
{

    const truncated = r.truncated === true;

    const source = typeof r.sourceUrl === "string" && r.sourceUrl.length > 0
        ? r.sourceUrl
        : "";

    const attrs = [
        `class="reviewCard"`,
        `data-reviewId="${escapeHtml(r.id)}"`,
        typeof r.rating === "number" ? `data-rating="${r.rating}"` : "",
        truncated ? `data-truncated` : "",
        truncated && source ? `data-sourceUrl="${escapeHtml(source)}"` : ""
    ].filter(Boolean).join(" ");

    return `
                        <li ${attrs}>

                            <blockquote class="reviewText">
                                <p>${escapeHtml(r.text)}</p>
                            </blockquote>

                            <figcaption class="reviewMeta">
                                <span class="reviewAuthor">${escapeHtml(r.author)}</span>
                                <span class="reviewSource">
                                    ${googleMark("reviewMark")}
                                    Google review
                                </span>
                            </figcaption>

                        </li>`;

}

const top = sequence("top");
const bottom = sequence("bottom");

const marqueeMarkup = `
                <div class="reviewTrackViewport">
                    <ul class="reviewTrack isLeadingLeft" role="list" data-track>${top.map(card).join("\n")}
                    </ul>
                </div>

                <div class="reviewTrackViewport">
                    <ul class="reviewTrack isLeadingRight" role="list" data-track>${bottom.map(card).join("\n")}
                    </ul>
                </div>`;


/* ── Inject ── */

function inject (source, name, markup)
{

    const open = `<!-- BUILD:${name} -->`;
    const close = `<!-- /BUILD:${name} -->`;

    const start = source.indexOf(open);
    const end = source.indexOf(close);

    if (start < 0 || end < 0)
    {

        throw new Error(`Markers for ${name} not found in index.html`);

    }

    return source.slice(0, start + open.length) + "\n" + markup + "\n                " + source.slice(end);

}

html = inject(html, "heroReviews", heroMarkup);
html = inject(html, "reviewMarquee", marqueeMarkup);

writeFileSync(page, html);


/* ── Report ── */

const usable = byId.size;
const shared = top.filter((r) => bottom.includes(r)).length;

console.log(`written reviews in dataset   ${data.reviews.length}  ·  usable in carousel ${usable}`);
console.log(`hero cards                   ${heroReviews.length}  (${heroReviews.map((r) => r.author).join(", ")})`);
console.log(`top track                    ${top.length} unique  →  ${top.map((r) => r.author).join(" · ")}`);
console.log(`bottom track                 ${bottom.length} unique  →  ${bottom.map((r) => r.author).join(" · ")}`);
console.log(`sequences differ             ${top.some((r, i) => bottom[i] !== r) ? "yes" : "NO — the rows are the same reel"}`);

const truncated = data.reviews.filter((r) => r.truncated === true);
const truncatedWithSource = truncated.filter((r) => typeof r.sourceUrl === "string" && r.sourceUrl.length > 0);

console.log(`complete reviews             ${data.reviews.length - truncated.length}  → these expand in the detail dialog`);
console.log(`truncated by Google's "More" ${truncated.length}  → ${truncatedWithSource.length} carry a sourceUrl and link out`);

if (truncated.length > truncatedWithSource.length)
{

    console.log(`NOTE                         ${truncated.length - truncatedWithSource.length} truncated review(s) have no sourceUrl, so they show no control at all.`);

}

if (shared > 0 && usable > top.length)
{

    console.log(`WARNING                      ${shared} review(s) appear in both rows while unused reviews remain.`);

}
