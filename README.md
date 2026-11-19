# NOVARA ESTATES

Premium real-estate showcase demo built with React, Vite, TypeScript, Tailwind CSS, React Router, Lucide and React Three Fiber.

## Run locally
1. Install Node.js 18+.
2. Extract this project.
3. Run `npm install`.
4. Run `npm run dev` to start the Express API and Vite frontend together.
5. Open the local frontend URL printed by Vite. Enquiries are stored in `data/novara.sqlite`.

The development server proxies `/api` requests to Express on port 3001. The API can also run by itself with `npm run dev:server`.

### One-click start on Windows
Double-click `Start NOVARA ESTATES.bat` in the project folder. It starts the frontend and API in a minimized server window, then opens the website in your default browser. Keep the minimized window open while using the site; close it to stop the server. Dependencies must be installed once with `npm install` before using the shortcut.

To add a desktop shortcut, right-click the batch file and choose **Show more options → Send to → Desktop (create shortcut)**. The `start-novara.ps1` launcher checks for an existing running site and opens it instead of starting another copy.

## Production build
Run `npm run build`, then `npm start`. Express serves the built frontend and API on `http://127.0.0.1:3001` by default. Set `PORT`, `HOST`, or `DATABASE_PATH` to override the defaults.

## Included
- Home, properties, dynamic property/project detail, upcoming, about and contact pages.
- Centralized 14-listing property inventory (5 plots, 5 villas and 4 homes) and 3 proposed project concepts.
- Working category/location/budget filters, sorting and grid/list modes.
- Per-listing dynamic detail routes, five selectable 60-plot sample masterplans, cardinal plot boundaries and demo land-use totals.
- Unique generated architectural walkthrough video for each sample listing; 30-second NOVARA brand demonstration video.
- Property-specific procedural exterior/interior tours, furnished cutaway dollhouses for all villas and homes, and sample floor plans.
- Interactive 3D plotted-site scenes with selectable plots, a nearby-landmarks context mode and illustrative direction/distance labels.
- Gallery lightbox, responsive location/plot experiences and interactive Three.js viewers.
- Express API with SQLite-backed enquiry storage, server-side validation, JSON size limits, security headers and request rate limiting.
- Client/server enquiry validation, consent checkbox, and a clear saved-enquiry response. The API does not send email or WhatsApp messages.
- WhatsApp enquiry deep links (placeholder phone number).
- Responsive mobile navigation and layouts.

## Demo-content notice
NOVARA ESTATES is fictional. All listings, prices, plot availability, testimonials/brand statements, addresses, team profiles, contact details, project plans, measurements, distances, 3D models and generated videos are sample content only. They are not verified offers, market valuations, approvals, title information, surveys, real-world locations or actual completed properties. Enquiry details are stored locally in the SQLite database and are not emailed or sent to WhatsApp. Keep the database private, configure backups and access controls before deploying with real customer data, and replace all placeholder company information.

## External media
Property photos and font files are loaded from external providers and require an internet connection. Original generated MP4 demonstration clips are bundled under `public/media`. Replace external photos and all illustrative media with licensed, verified company assets before commercial deployment.
