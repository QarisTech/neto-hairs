# Neto Hairs — store layout and launch review

## Changes in this update
- Hero: “Good hair.” followed by “Your energy.” The texture heading keeps its separate two-line wording.
- Catalogue images use equal square frames, with four columns on wide screens, three on tablets and two on phones. Portrait photographs fit inside the frames without cropping off the hair. Square tiles are a design choice, not an e-commerce requirement; they suit this compact catalogue.
- Removed the drifting pink gradient behind the collection. Phone and touch-screen hero parallax is disabled. The existing rolling texture carousel and desktop hover feedback remain.
- Catalogue cards show “From” only when confirmed option prices differ. The chosen option keeps its exact price in product details; no prices are invented.

## Recommended section order
1. Hero — one portrait, two-line headline, one clear shop button. Keep the message short.
2. Texture introduction — compact selection; avoid featuring the same photograph repeatedly in adjacent sections.
3. Product collection — this is the buying section, so it should appear before the packaging feature. Use the existing Homepage section-order controls to move it upward and preview first.
4. Client Cam — the separately requested customer/model video section, still to build. Start with 4–6 short clips, user-controlled playback, customer permission and product links.
5. One short detail/brand feature — optional; avoid repeating the same product images. The current homepage controls can hide sections that add length without useful information.
6. Care, delivery and returns — short practical answers with the actual policies before launch.
7. Footer — verified business contact details, WhatsApp, social links and policy links. Current editor changes text labels; arbitrary new contact/policy links still require implementation.

## Prices and product data
The public store check for this review showed nine products, 12 size options without prices, no configured delivery rates and checkout disabled. Enquiries were enabled. These are a snapshot, not a stock audit.

In Products & stock, enter the correct name, description, colour, inches, grams, naira price and real available quantity for every option, then save. Price each size/weight separately. Blank prices stay on request; zero stock is a recorded number, not proof of the owner's physical inventory. Do not replace unknown prices with zero. Card “From” prices represent the lowest confirmed option price; the customer sees the chosen size price in the product dialog. Confirm whether delivery is additional, then provide actual state/city rates or explain that delivery is quoted manually.

## Outstanding work before a complete manual-order launch
- WhatsApp order checkout: the requested cart-to-message flow, saved pending order reference, manual payment confirmation and order tracking are not implemented yet. The vendor's WhatsApp number is still needed. Do not label an order paid just because WhatsApp opened or a customer uploaded a receipt.
- Add new product: the dashboard currently edits existing listings. Uploading a photo adds media, not a new product. A dedicated product-creation workflow is still needed.
- Pagination/search for the growing product and media lists is still to implement.
- Client Cam is still separate work; the current product/gallery video support is not the dedicated client section.
- Business contact details, delivery timing/rates, returns policy and real product specifications need owner confirmation.
- Test the complete flow on a real iPhone and Android: choose a photo, upload, change a cover, save, preview/publish homepage text, select sizes and use the final manual checkout once implemented.

The current update includes 23 passing automated backend tests and scripted DOM checks. It has not been visually verified on physical phones. It does not enable Paystack or manual WhatsApp checkout.
