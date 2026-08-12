<!--
@component
BEAT 5 · DISCLOSURE — the reference's own legal footer, verbatim.

EVIDENCE. Read directly out of /tmp/momentum-slices/pretty.html, the footer
template (elementor id 20496):
  :7693  <a href="https://tricktrades.com/privacy-policy/">Privacy Policy</a>
  :7693  a literal " | " separator between the two anchors
  :7694  <a href="https://tricktrades.com/terms-and-conditions/">Terms &amp; Conditions</a>
  :7696-7716  the full risk disclaimer, one <p>
Both hrefs keep their TRAILING SLASH, which is what the capture shows;
src/lib/data/site.ts:38-39 omits it, so content.ts hardcodes the captured URLs
and this component reads them from there. Every string on screen comes from
data/content.ts — nothing is inlined, paraphrased, shortened or "improved".

WHY THIS STAYS EVEN THOUGH THE GLOBAL FOOTER ALSO CARRIES A RISK BLOCK. Both
were read side by side in this pass. They are not duplicates: Footer.svelte:55-65
renders a five-sentence in-house summary ("Trading is purely and 100% education.
We do not trade your money, send alerts, or give financial advice. ..."), while
this section renders the reference's own 1,700-character legal text. The two
share exactly one clause word for word — "Most people lose or never make any
money day trading", which the Footer continues as "; results shown are not
typical" and the disclaimer states as a standalone sentence. A summary is not a
substitute for the captured legal text, and the captured text is not a substitute
for the site-wide notice, so both stand. Footer.svelte is not this page's to edit;
if the owner wants the overlap resolved it belongs in that component.

DELIBERATE OMISSION, logged as a knowing deviation: pretty.html:7717 carries a
third footer paragraph, "©2121926 Alberta ltd" (lowercase "ltd"). It is NOT
rendered here, and content.ts deliberately does not export it. The site's global
Footer.svelte:99 already stamps "© {year} 2121926 Alberta Ltd. All rights
reserved." a few elements below this section, and two copyright lines for the
same legal entity on one page is a defect. The string is preserved in prose at
the bottom of data/content.ts so the evidence survives.

MOTION. The text does not animate at all — deliberately. It previously carried a
reveal({ y: 16 }), i.e. an opacity 0 -> 1 tween gated on a ScrollTrigger, which
is precisely the thing legal fine print must not do: a reader who lands on this
section must be able to read it the instant it is on screen, not one entrance
later. Removing it also takes GSAP out of this component entirely.

The section's one moving part is its boundary hairline, which draws itself in
across the top edge on a CSS scroll timeline. It touches no text, it cannot
delay reading, it runs off the main thread, and where the timeline is not
supported the hairline is simply a full-width rule from first paint.
-->
<script lang="ts">
	import { disclaimer, legalLinks, legalSeparator } from '$lib/pages/momentum/data/content';

	/* legalLinks is a readonly 2-tuple. Indexing it rather than looping keeps the
	   captured " | " separator sitting between the two anchors as a literal text
	   node, exactly as pretty.html:7693-7694 has it. */
	const [privacy, terms] = legalLinks;
</script>

<section id="disclosure" class="mo-section mo-section--tight mo-disclosure">
	<div class="mo-wrap">
		<div class="mo-disclosure__inner">
			<p class="mo-disclosure__links">
				<a href={privacy.href}>{privacy.label}</a>
				{legalSeparator}
				<a href={terms.href}>{terms.label}</a>
			</p>
			<p class="mo-disclosure__text">{disclaimer}</p>
		</div>
	</div>
</section>

<style>
	/* THE BAND. The page ground, --tt-black, declared rather than inherited so the
	   light/dark score is authored in the sections that make it up.

	   This is the one section on the page that could have taken the reference's
	   fourth band (post-73938.pretty.css:186-195 makes element-916db3b #FFFFFF
	   with padding 30px 0 0), and it deliberately does not. That element is an
	   EMPTY container in the capture — it holds no content at all — so there is no
	   evidence about what white would do to a text block, and putting a bright
	   white band under the two CTAs would hand the loudest surface on the page to
	   the risk disclaimer. Fine print is structurally recessive; the page's one
	   white beat belongs to Voice. Recorded here so the omission reads as a
	   decision. */
	.mo-disclosure {
		background: var(--tt-black);
	}

	/* THE SINGLE HAIRLINE at the Close/Disclosure boundary. Close deliberately does
	   not draw its own bottom border, so this rule is painted once, not twice.

	   It is a ::before rather than a border-top so the modern path below has
	   something to scale. `.mo-section` already sets position: relative
	   (momentum.css:129-132), so this positions against the section.
	   FALLBACK STATE — and the state every non-supporting engine sees — is exactly
	   what the old `border-top: 1px solid var(--tt-line)` produced: a full-width
	   hairline, present from first paint. */
	.mo-disclosure::before {
		content: '';
		position: absolute;
		inset-block-start: 0;
		inset-inline: 0;
		height: 1px;
		background: var(--tt-line);
		transform-origin: left center;
	}

	/* ------------------------------------------------------------------------
	   THE HAIRLINE DRAW — a CSS scroll-driven animation.

	   BASELINE (verified 12 Aug 2026): scroll-driven animations are Baseline
	   LIMITED — Chrome 115+ and Safari 26+ ship them; Firefox keeps them behind
	   layout.css.scroll-driven-animations.enabled (Nightly only). ADOPT-WITH-FALLBACK.

	   MODERN PATH  — everything inside @supports (animation-timeline: view()).
	   FALLBACK PATH — the static full-width hairline declared above.

	   The @supports wrapper is required, not stylistic: MDN records that Firefox
	   drops `animation-timeline` but keeps the `animation` shorthand, so an
	   unguarded rule would play this once as a time-based animation on load.
	   `animation-timeline` is declared AFTER the shorthand because the shorthand
	   resets it to `auto`.

	   The range ends at `entry 40%` so the rule is complete well before the
	   section is fully on screen — this is punctuation, not a thing to wait for. */
	@keyframes mo-rule-draw {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		@supports (animation-timeline: view()) {
			.mo-disclosure::before {
				animation: mo-rule-draw linear both;
				animation-timeline: view();
				animation-range: entry 0% entry 40%;
			}
		}
	}

	/* A legal-fine-print measure, narrower than .mo-wrap's 1200px container, so it
	   is applied to an inner box rather than fighting .mo-wrap's max-width. */
	.mo-disclosure__inner {
		max-width: 74ch;
		margin-inline: auto;
	}

	/* Fine print, deliberately recessive but READABLE: this is a single
	   1,700-character paragraph, so it is set at 0.875rem (14px at the default
	   root) with 1.75 leading rather than the 0.82rem/1.7 it carried before — the
	   smallest size that does not turn a wall of legal text into a texture.
	   --tt-mute-2 is the repo's AA-verified small-text grey: 5.18:1 on --tt-black
	   (app.css:34-35). The reference's own footer typography is in post-20496.css,
	   which is 685 bytes on disk and has NOT been read by anyone in this chain —
	   these are therefore page-scope values, not captured ones. */
	.mo-disclosure__links,
	.mo-disclosure__text {
		font-size: 0.875rem;
		line-height: 1.75;
		color: var(--tt-mute-2);
	}

	.mo-disclosure__links {
		margin-bottom: 1.1rem;
	}

	/* Underlined and in --tt-fog, NOT red: --tt-red is #b22725, which is 3.02:1 on
	   --tt-black and fails AA for small text. On this page it is a button fill and
	   nothing else. */
	.mo-disclosure__links a {
		color: var(--tt-fog);
		text-decoration: underline;
		text-underline-offset: 0.22em;
		text-decoration-thickness: 1px;
		transition: color 0.25s ease;
	}

	.mo-disclosure__links a:hover {
		color: var(--tt-white);
	}
</style>
