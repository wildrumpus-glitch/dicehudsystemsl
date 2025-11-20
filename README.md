# Dice HUD Project

This repository contains a **Node.js + SQLite backend** and a **dashboard** for tracking dice rolls for Second Life.

## Features

* Track dice rolls (d10, d20, d100) from Second Life HUDs
* Record account name, character name, die type, result, and timestamp
* Dashboard displays roll history with search and filtering
* Auto-delete rolls older than 6 months
* Simple setup for deployment on Render

## Files

* `server.js` — Main server file handling API requests and SQLite database
* `package.json` — Node.js dependencies
* `Procfile` — For deployment (Render)
* `public/index.html` — Dashboard interface
* `.gitignore` — Ignore node_modules and database file

## Deployment

1. Upload files to GitHub (root of the repository)
2. Connect the GitHub repo to [Render](https://render.com)
3. Use the following commands:

   * **Build command:** `npm install`
   * **Start command:** `npm start`
4. Choose the free plan and deploy
5. Access dashboard via the Render URL provided

## Notes

* Make sure the `public` folder is included and contains `index.html`
* No special configuration needed for SQLite; the database will be created automatically
* Optional: Add a README for future reference or documentation
