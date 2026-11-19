# Compact shop preview

## Changes

Product thumbnails are smaller, square and flush with the information beneath them. Wide screens use six columns, tablets four, ordinary phones three, and phones narrower than 375px two. The price sits in a small outlined box immediately below the image, followed by the name, a short description and confirmed size/weight information. Full photographs remain in product details. No product photograph was regenerated.

The catalogue has ten products per page. Page controls appear only when needed. The catalogue introduction/status line, “details awaiting confirmation,” repeated Wig labels and “9 styles” counter are removed. No prices were invented; unpriced products show Ask for price (or the owner's saved wording).

The texture row is now swipeable/scrollable with no automatic movement, duplicate set or pause button. Its heading sits above the row. Keyboard users can tab through the items and use arrow keys when the row itself is focused.

The finishing-touches feature and the Details, up close gallery are removed. Their photos remain in the owner's media library. A dedicated Client Cam replaces those repeated photo sections. It supports photos/videos, captions, ordering and optional links to products. It stays hidden until the owner adds real media. Video starts on tap, and playing one video pauses the others.

The footer is deliberately minimal pending the client's replacement design. The “Luxury hair. Entirely you.” tagline, Care & delivery link and About this store/AI-assistance block are removed. The editor supports optional footer text and up to eight links. Logo photos can also be selected/uploaded. Existing header, ribbon, hero masthead and other interface text controls remain available.

The hero still says Good hair. / Your energy. on two lines. The large white NETO HAIRS lettering and its styling are retained. Existing colours, customer/order records, upload limits, authentication and payment configuration remain in place.

## Owner editing

- Product pictures, cover order, name, description, prices, inches and grams: Products & stock. Save after selecting or uploading media.
- Hero, texture-row pictures/labels, Client Cam, section order/visibility and closing media: Homepage. Save draft, Preview, Publish homepage.
- Header/brand text and other interface wording: the grouped text panels in Homepage.
- Logo and footer text/link destinations: Homepage → Logo & footer. Links accept secure https:// websites, local page links, mailto: email or tel: phone destinations.
- Image/video titles and accessible descriptions: Photos & videos.

Client Cam needs real customer/model media before it appears. Confirmed prices remain the owner's responsibility. The manual WhatsApp checkout and creation of new product listings are separate outstanding work; this layout update does not enable them.

## Deployment

Apply the update to the existing Git-connected Netlify source repository at its root and let Netlify build it. No environment variables need replacing. The function adds the homepage-backup table automatically and adapts existing homepage sections. Do not rerun a database reset or replace the owner's credentials.

## Restore point

Before this change, source was tagged `neto-before-compact-shop-20261119` at commit `f94b118cd937b7fc9ccb8b2461f5501f98814f5c`. A sanitized source ZIP is retained at `/workspace/work/neto-before-compact-shop-20261119.zip`. The previous hosted preview is saved as Sites version 28.

On first deployment, existing homepage draft and published JSON are saved exactly in `site_page_backups` under `before-compact-shop-v1`, before sections are changed. Product/customer/order data is not reset. The snapshot is not overwritten by later starts or saves.

If a full revert is requested, restore the homepage snapshot using `scripts/restore-homepage-layout.mjs` with the existing database settings supplied privately through the environment, then redeploy the saved pre-compact source. The script requires NETO_RESTORE_LAYOUT=before-compact-shop-v1 to run deliberately. It also preserves the current homepage as another backup and re-enables archived media referenced by the restored homepage. This script was tested on an isolated database; it has not been run against production.

## Verification

25 backend tests pass, including exact snapshot retention, restore without changing product data, Client Cam draft/publish, logo media delivery and safe footer links. Scripted DOM checks cover the owner editor, media selection, price-card markup, all 23 synthetic products reachable over three pages, removal of the old sections/footer text, and no pause button/duplicate carousel. Node syntax, build and whitespace checks pass.

Rendered phone/device verification and a real Cloudinary upload remain deployment checks. No claim of a physical-phone visual pass is made.

## Carousel correction
The photo/video carousel now rolls directly after “Find your next obsession”, before the product filters. Its settings remain under Homepage → Photo & video carousel. Photos link to their assigned product; videos have native playback controls and an optional poster. Movement pauses for playback, hover, keyboard focus and touch interaction; reduced-motion preferences keep the row manual. Repeated visual sets are hidden from assistive technology. The closing wave overlaps the previous section with no page-colour margin exposed.

## Homepage structure correction (supersedes the prior carousel-placement note)
The order is now four texture categories beside the texture heading, a bounded product preview, an independent highlights carousel, then Client Cam. Categories have their own four image/label/texture controls; carousel picks remain separately editable. The homepage preview has four columns × up to three rows on desktop and three columns × up to two rows on phones. A catalogue with fewer products is not padded with duplicate cards. See more opens /shop.html with the full catalogue, filterable texture links and pagination. This does not change products, orders, pricing or customer data. The category entrance animation runs on intersection and respects reduced motion.
Validation: 26 backend tests and DOM interaction checks for desktop/mobile limits, complete shop pagination, independent owner controls and ordering passed. No physical-device visual QA was available.

## Continuous movement and ribbon fade correction
The rose experience ribbon now keeps an opaque rose background; only its inner text viewport is alpha-masked, preventing the white edge shown in review. Highlights scrolling accumulates subpixel distance separately from scrollLeft so browsers with integer-rounded scrolling still move at 25px/second. Hover and passive focus no longer stop movement. Playback, active touch/drag, reduced-motion preferences, offscreen or background tabs still suspend movement. Regression checks cover integer rounding, hover, video playback, mobile/desktop product limits and full shop pagination. The hero design is intentionally retained. Backend changes are in the Netlify source package; a local check cannot confirm the owner's deployment or Cloudinary credentials/uploads.

## Visible Client Cam feature
Client Cam now uses the original finishing-touches pink/wavy feature composition, with the selected video in the old image position and editable copy beside it. It sits between the product preview and spotlight carousel. Existing homepage content adopts this placement on read until the new layout is saved; later owner section reordering remains supported. Empty media no longer hides the whole feature: it displays honest editable coming-soon copy. No sample customer video was fabricated. The first video is selected ahead of legacy photos, with native controls, playsinline and optional product link; additional media can be selected below the stage. The heading, text, media, captions and buttons remain editable. Font families and the approved masthead are retained.
