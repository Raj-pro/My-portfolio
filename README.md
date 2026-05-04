# Raj Nayan — Portfolio

Live site: https://rajnayan.netlify.app/

A modern, dark, single-page portfolio website built with HTML, CSS, and vanilla JavaScript.

## Highlights

- Starfield background + subtle film-grain overlay
- Preloader, scroll progress bar, smooth scrolling, scroll-reveal animations
- Custom cursor + magnetic hover interactions
- Typed “role” headline animation
- Project/certificate sections + image lightbox
- Contact form UI (client-side only by default)

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## Quick Start (Local Preview)

This is a static site, so you can preview it without a build step.

### Option A — Open the file

Open `index.html` in your browser.

### Option B — Run a local web server (recommended)

Using Node:

```bash
npx http-server . -p 3000
```

Or using Python:

```bash
python3 -m http.server 3000
```

Then visit `http://localhost:3000`.

## Customize Content

- Page content/sections: `index.html`
- Styling:
	- `assets/css/style.css`
	- `assets/css/star.css`
- Interactions/animations: `assets/js/main.js`
- Images/icons: `assets/images/`

### Contact form note

The contact form currently shows a “Sent!” success state and resets the form, but it does not send an email.
To make it functional, connect it to a provider like Netlify Forms, Formspree, or a small backend endpoint.

## Optional: Express Health Server (CI/CD scaffold)

This repository also contains a small Express server for health-check style endpoints.

Install and run:

```bash
npm install
npm start
```

Endpoints:

- `GET /health` → JSON health response
- `GET /` → simple HTML message

Note: the Express server currently does **not** serve the portfolio UI. The portfolio is served as a static site (see “Quick Start”).

## Deployment

### Netlify

- Build command: (none)
- Publish directory: `/` (project root)

### GitHub Pages

- Use the repository root as the site source (where `index.html` lives)

## Project Structure

```
.
├── index.html
├── assets/
│   ├── css/
│   ├── images/
│   └── js/
├── server.js
└── package.json
```

## License

No license file is included. If you want this to be reusable by others, add a LICENSE (MIT is common for portfolios).
