# Neto Hairs — custom Netlify store and CRM

This is the backend source project for https://netohairs.netlify.app. It is NOT the earlier drag-and-drop storefront ZIP. No WooCommerce or WordPress plugins are needed. Your existing GitHub account is QarisTech. Netlify and Turso need to be configured before the new backend will work.

## What has been built
- The approved storefront with all 11 photo-based images, 9 catalogue products and mobile layout.
- Product-specific enquiries, customer records, lead stages, notes and follow-up dates.
- Private owner login, staff login and server-enforced permissions; activity log and business export.
- Variant inches/grams, confirmed prices, available stock, enquiry-only products, optimistic edit protection.
- Nigeria delivery fees by state/city, with city overrides and no checkout for unsupported addresses.
- Server-priced cart checkout, 30-minute stock reservations, Paystack hosted checkout and signed webhook processing.
- Private customer order tracking, owner fulfilment management, carrier and tracking references.
- Return requests, owner review, partial/full refund requests and provider reconciliation.
- Suppliers, purchase orders, one-time stock receipt and manual supplier payment records.
- Paid-order value/refund reports, customer history, low-stock view and transactional email queue.

Payment status cannot be manually changed to paid. Paystack is the authority for verified payments. A redirect back from checkout is not proof of payment. Card details never pass through this application. Supplier payment recording does not transfer money. Refund and stock return are separate, deliberate actions.

## 1. Create the database
1. Sign in to https://turso.tech and choose an available free plan. Do not purchase an upgrade unless you decide it is needed.
2. Create a database named `neto-hairs` (choose a location appropriate for the store).
3. Save its database URL and create a database auth token. Keep the token private.
4. In the database SQL editor, run the contents of `commerce/bootstrap.sql`. It creates the tables and nine enquiry-only products. It is safe to rerun and does not replace existing data. If your dashboard has no SQL editor, use the Turso CLI or the optional setup command below.
5. All initial prices are unconfirmed and blank; stock is zero and purchases disabled. The original preview catalogue is not a verified stock or pricing source.

Optional terminal setup: after `npm ci`, set `LIBSQL_DATABASE_URL` and `LIBSQL_AUTH_TOKEN` securely in the local environment, then run `npm run commerce:setup`. Do not put credentials in a command that you share or commit.

## 2. Connect the source to Netlify
1. Extract the full source ZIP.
2. In your existing GitHub account, create a PRIVATE repository, e.g. `neto-hairs`.
3. Upload the extracted contents. `netlify.toml` and `package.json` must be at the top level of the repository. Do not upload `node_modules`, `.env`, tokens, generated exports or the source ZIP itself.
4. In your existing Netlify project for `netohairs.netlify.app`, connect that repository under the repository/continuous-deployment settings. UI labels can vary. A separate staging project is also possible, but its SITE_URL must use that project's exact HTTPS origin.
5. Netlify reads `netlify.toml`: build command `npm run build:netlify`, publish directory `netlify-dist`, functions directory `netlify/functions`, Node 22. The API function binds to `/api/*`.
6. Do not upload the source archive to Netlify Drop: Drop does not build and deploy these backend functions.

## 3. Set secure Netlify environment variables
Set values for the Functions runtime in the Production context, then redeploy. Build-only scope is insufficient for backend secrets.

| Name | Initial value |
|---|---|
| SITE_URL | `https://netohairs.netlify.app` (no trailing slash) |
| LIBSQL_DATABASE_URL | Your Turso database URL |
| LIBSQL_AUTH_TOKEN | Your private Turso database token |
| OWNER_EMAIL | `jessicanetochukwu@gmail.com` |
| OWNER_PASSWORD_HASH | Generate using the password helper below |
| CHECKOUT_ENABLED | `false` |
| REFUNDS_ENABLED | `false` |

Password helper: open `/setup-owner.html` on the deployed site (or the same helper provided with the existing preview). It hashes the chosen password entirely inside your browser and sends nothing to a server. Copy only the generated hash into OWNER_PASSWORD_HASH. Keep the actual password privately. A terminal alternative is `npm run commerce:password`.

Never paste database tokens, passwords or Paystack secret keys in chat or GitHub. No production secrets are included in this package. Rotating the owner password hash invalidates previous owner sessions.

## 4. Check the dashboard and data
Open https://netohairs.netlify.app/manage.html and sign in with the owner email and chosen password. `/admin` redirects there on Netlify. Check the nine listings and all 11 images. Set real names/descriptions/colour, inches, grams, prices and available quantities. Do not enable a product for online purchase until every sellable option is correct.

Enter the real delivery prices in Delivery rates. A blank city supplies a state-wide default; an exact city rate overrides that default. Do not invent a rate to enable checkout. The current preview product editor and its D1 database are separate: confirmed values edited there are NOT automatically migrated to this new database. Transfer/review them before cutover; the old database is not deleted.

Test an enquiry: it must appear under Enquiries, link to the correct customer and retain its follow-up/notes. Check staff permissions with a separate staff account. Verify private customer data is inaccessible without a valid session.

## 5. Connect Paystack TEST mode
1. Set `PAYSTACK_SECRET_KEY` to your Paystack TEST secret in Netlify (Functions scope).
2. In Paystack TEST webhook settings, use `https://netohairs.netlify.app/api/paystack/webhook`.
3. Return pages use `https://netohairs.netlify.app/order.html`; individual order references are appended automatically.
4. Confirm prices, stock and rates for a test product, then set CHECKOUT_ENABLED=`true` and redeploy. Keep REFUNDS_ENABLED=`false` until refund testing is intended.
5. Run a Paystack test transaction and verify: server-priced total, order recorded, stock reserved/consumed once, signed webhook success, order shows paid, owner dashboard shows processing. Test failed/cancelled payments and reservation expiry. Do not use a real card to simulate tests; follow Paystack's test-mode instructions.
6. Test dispatch/tracking and a return. Enable REFUNDS_ENABLED only for deliberate refund tests. A refund timeout is marked `review`; check the Paystack dashboard and use Reconcile with Paystack before retrying. Never assume a timeout means no refund was sent.
7. After successful deployed tests and policy/product review, switch to the LIVE secret and LIVE webhook settings deliberately. Live sales have not been enabled or tested by preparing this package.

## 6. Transactional email
Optional: use a transactional-email provider account with a verified sending domain. This implementation uses Resend's HTTP API. Set RESEND_API_KEY and EMAIL_FROM only after verifying the sender. Paid receipts, enquiry notices, order-created private tracking links and fulfilment notices are queued. Successful POST requests attempt to send two pending emails; the Email queue tab provides manual retry. Stored customer/order data persists even if email is unavailable. No scheduled email retry service is configured by default. Delayed queues need owner monitoring.

## Maintenance and limits
- Monitor Netlify credits and Turso usage. Free quotas do not guarantee availability through every traffic spike.
- Avoid repeated production deploys during development; use local tests and previews, then one reviewed publish.
- Owner business export contains personal customer/order data. Download regularly and store securely. Also use database-provider backups and test recovery. No automatic external backup service is configured by this package.
- Pending stock reservations expire after 30 minutes and are released when the next checkout or owner overview runs. There is no cron job consuming credits.
- Customer order links are bearer secrets. Keep them private. Referrer policy excludes URL fragments and tracking requires the private token.
- Returned stock is NOT automatically resold. Inspect it before changing available stock.
- Customer email delivery and courier status synchronization are different things. Carrier/tracking entry is implemented; automatic courier API polling is not configured.
- Order and customer lists currently show up to 500 recent records; activity/email/refund lists have smaller caps. Add pagination before exceeding those operational limits.
- Reports show paid order totals including delivery and refunds separately; they are not tax accounting, bank settlement reconciliation or a profit-and-loss statement.
- The owner must supply real policies, business contact details, return terms and any applicable tax requirements before live sales. The current preview is not a legal-policy source.
- Automated backend tests pass locally; live Netlify/Paystack end-to-end tests, rendered mobile/browser verification, email delivery and courier integration remain to be performed.

## Later Cloudflare migration
`commerce/core.mjs` holds application logic separately from the Netlify entrypoint and frontend. Database records are SQL-based and exportable; media is kept outside the database. Migration still requires adapting the entrypoint and database transaction adapter, moving data/auth settings, changing Paystack webhook/return URLs and repeating payment/inventory tests. It is not a zero-work switch.

## Local checks
`npm ci`
`npm run test:commerce`
`npm run build:netlify`

The runtime source ZIP contains all 11 edited photographs and their placement manifest. The unedited originals remain in your uploaded Telegram Desktop.7z and the retained project source; they are not duplicated in the runtime ZIP.

No paid service, Netlify site connection, external database or payment credential has been provisioned automatically. This source package is ready for account configuration and staging validation; it is not a claim that the production commerce system is already running.

## Connection diagnostics
The backend accepts both LIBSQL_DATABASE_URL/LIBSQL_AUTH_TOKEN and Turso’s TURSO_DATABASE_URL/TURSO_AUTH_TOKEN names. Open /api/store/config: missing_runtime_settings means the function cannot read settings; database_connection_failed means settings exist but connection/authentication failed; schema_not_initialized means Turso is connected and bootstrap.sql still needs running; ready means connection and application tables work. Diagnostics show presence flags only, never credential values.

Login settings fix: each request now builds its authentication service from current runtime settings, avoiding an old password hash retained by a warm function. Diagnostics version 3 adds a short SHA-256-derived fingerprint of the saved hash; compare it with the browser-only checker fingerprint, never share the password/hash itself. A matching fingerprint confirms both tools use the same saved hash.

## Mobile dashboard, media library and homepage editor

Update the complete source in your Git-connected Netlify repository and deploy. Existing database records stay intact; the function automatically adds the three media/homepage tables. No replacement bootstrap or new password is needed for this update.

Sign in at `/manage.html`. The phone menu opens each dashboard section. Record tables become labelled cards on small screens; product forms and media controls support touch.

- **Photos & videos:** all 11 supplied output product/detail photographs and the current hero are available immediately. Upload real photos or videos, enter descriptions, preview, and archive unused media. Archiving retains the Cloudinary source; files in use cannot be archived.
- **Products:** choose up to 12 photos/videos, arrange them with Up/Down and save. The first becomes the cover; customers see the gallery alongside size, grams and price options in the product details dialog.
- **Homepage:** edit hero media/text, carousel choices and order, feature, collection priorities, gallery, care text, closing, section order/visibility and supported fonts/colours. Save draft privately, preview with the owner session, then publish. This is a structured editor, not a freeform page builder. Simultaneous stale saves are rejected to protect newer changes.

### Connect uploads once

Create a Cloudinary account. In its dashboard, open API Keys and find Cloud name, API key and API secret. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to Netlify environment variables with **Functions** scope, then redeploy. Keep the API secret in Netlify only; no unsigned upload preset is needed. Existing library selection works before these settings are added.

Uploads go directly from the phone to Cloudinary using short-lived signed requests, avoiding Netlify function upload size limits. The server verifies registered assets with Cloudinary. Limits: photos 10 MB; videos 100 MB and two minutes. Cloudinary storage/bandwidth and transformations use the account's allowance; review its current plan before launch. Videos play on request; optional hero autoplay is muted and respects reduced motion. Photos are delivered with automatic compression. An interrupted registration can be retried using “Finish saving uploaded file.”

Verify on the deployed site: upload a real photo and a short video, assign them to a product, check the gallery on a phone, save a homepage draft (public site unchanged), preview, publish and reload the public site. Automated tests mock Cloudinary; a real account upload still needs this deployment check. Payments and shipping retain their existing settings.
