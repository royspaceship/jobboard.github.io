# jobboard.github.io
The Jobboard is a free, single-file job board website built with HTML, CSS &amp; JavaScript. Features real-time search, filters by job type, location &amp; experience, job detail views, save jobs, and a post-a-job form. Zero dependencies, no setup needed,  just open in a browser or drop onto any hosting platform.
[README.md](https://github.com/user-attachments/files/26885165/README.md)
# JobBoard — Full README

A fully functional, single-file job posting website built with plain HTML, CSS, and JavaScript. No frameworks, no dependencies, no build tools required.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [How to Deploy](#how-to-deploy)
- [How to Use](#how-to-use)
- [Customization Guide](#customization-guide)
- [Sample Data](#sample-data)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

JobBoard is a lightweight, zero-dependency job board website contained entirely in a single `jobboard.html` file. It runs in any modern web browser and can be hosted on any static hosting platform — no server, database, or backend required to get started.

It is designed to be a clean, professional starting point for anyone who wants to launch a job listing site quickly, without the complexity of a full-stack application.

---

## Features

### For Job Seekers
- **Search** — Filter jobs by title, keyword, or company name in real time
- **Location filter** — Narrow down jobs by city or remote work
- **Sidebar filters** — Filter by job type (Full-time, Part-time, Contract, Internship) and experience level (Entry, Mid, Senior)
- **Remote-only toggle** — Instantly show only remote positions
- **Sort jobs** — Sort by most recent, highest salary, or featured first
- **Job detail view** — Click any job card to open a full detail modal with description, skills, and salary
- **Save jobs** — Bookmark jobs with a Save button (persists during the session)
- **Apply** — Apply button links to the job's application URL or sends an email if an address is provided

### For Employers
- **Post a job** — Fill out a form to add a new job listing instantly
- **Required fields validation** — Prevents incomplete listings from being submitted
- **Skills/tags** — Add comma-separated skills that display as tags on the listing
- **Featured badge** — Sample featured listings are highlighted with a left border accent

### General
- **Responsive design** — Works on mobile, tablet, and desktop
- **Live job count** — Shows how many jobs match the current filters
- **Toast notifications** — Confirmation messages for saving and posting jobs
- **8 pre-loaded sample jobs** — Ready to demonstrate the site immediately

---

## File Structure

The entire project is a single file:

```
jobboard.html       ← The complete website (HTML + CSS + JS in one file)
README.md           ← This documentation file
```

No `node_modules`, no `package.json`, no build step. Open the HTML file in a browser and it works.

---

## Getting Started

### Run locally

1. Download `jobboard.html`
2. Double-click the file to open it in your browser

That's it. No installation required.

### Run with a local server (optional)

If you prefer to run it via a local server (e.g. to avoid browser security restrictions):

```bash
# Using Python
python -m http.server 8000

# Then open http://localhost:8000/jobboard.html
```

Or use the VS Code **Live Server** extension.

---

## How to Deploy

### Option 1 — Netlify (Recommended, Free)

1. Go to [netlify.com](https://netlify.com) and create a free account
2. Rename `jobboard.html` to `index.html`
3. Drag and drop the file onto the Netlify dashboard
4. Your site is live at a URL like `https://yoursite.netlify.app`

**Custom domain:** In Netlify's settings, go to Domain Management → Add a custom domain.

### Option 2 — GitHub Pages (Free)

1. Create a free account at [github.com](https://github.com)
2. Create a new repository (e.g. `jobboard`)
3. Upload `jobboard.html` and rename it to `index.html`
4. Go to **Settings → Pages → Source** → select `main` branch
5. Your site will be live at `https://yourusername.github.io/jobboard`

### Option 3 — Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New → Project**
3. Drag and drop your file, or connect a GitHub repository
4. Deploy — your site is live at `https://yourproject.vercel.app`

### Option 4 — Any Web Host

Upload `index.html` to the root of any web hosting service (e.g. Hostinger, Bluehost, cPanel hosting). It works on any host that serves static files.

---

## How to Use

### Searching for Jobs

- Type a job title, keyword, or company name into the search bar
- Select a location from the dropdown, or leave it as "All locations"
- Results update instantly as you type

### Filtering Jobs

Use the left sidebar to filter by:

- **Job type** — Check or uncheck Full-time, Part-time, Contract, Internship
- **Experience level** — Check or uncheck Entry, Mid, Senior
- **Remote only** — Check this box to show only remote jobs

### Sorting Jobs

Use the dropdown in the top right of the job list to sort by:

- **Most recent** — Newest postings first (default)
- **Highest salary** — Highest-paying jobs first
- **Featured first** — Featured listings shown at the top

### Viewing Job Details

Click anywhere on a job card to open the full detail view. This shows the complete description, required skills, salary, and an Apply button.

### Saving a Job

Click the **Save** button on any job card to bookmark it for the session. Saved jobs are highlighted in blue. Note: saved jobs are not persisted across page refreshes (see Limitations).

### Applying for a Job

- If the job has a URL, the Apply button opens the company's application page in a new tab
- If the job has an email address, it opens your default email client with a pre-filled subject line
- If neither is provided, a toast confirmation message is shown

### Posting a Job

1. Click **+ Post a job** in the top navigation bar
2. Fill in the required fields (marked with a red asterisk): Job title, Company name, Location, and Description
3. Optionally add salary range, experience level, skills (comma-separated), and an apply link or email
4. Click **Post job** — the listing appears immediately at the top of the job list

---

## Customization Guide

All customization is done by editing `jobboard.html` in any text editor (VS Code, Notepad, etc.).

### Change the site name and branding

Find this line in the HTML:

```html
<div class="nav-logo"><span>Job</span>Board</div>
```

Replace `Job` and `Board` with your own brand name. The `<span>` wraps the colored portion.

### Change the primary color

Find this CSS variable in the `<style>` block and replace `#378ADD` with your preferred color:

```css
/* Search for #378ADD and replace all instances */
background: #378ADD;
```

For example, to use green: replace `#378ADD` with `#16a34a` and `#185FA5` with `#15803d`.

### Edit or remove sample jobs

Find the `let jobs = [...]` array in the `<script>` block. Each job object looks like this:

```javascript
{
  id: 1,
  title: 'Senior Frontend Engineer',
  company: 'Stripe',
  location: 'Remote',
  type: 'Full-time',       // Full-time | Part-time | Contract | Internship
  exp: 'Senior',           // Entry | Mid | Senior
  salary: '$150,000',
  salaryNum: 150000,       // Numeric value used for salary sorting
  desc: 'Job description here...',
  tags: ['React', 'TypeScript'],
  date: '2 days ago',
  daysAgo: 2,              // Used for "New" badge (shows if <= 3)
  featured: true,          // true = left blue border accent
  applyUrl: 'https://stripe.com/jobs'
}
```

To remove all sample jobs and start fresh, replace the array with an empty array: `let jobs = [];`

### Add more location options

Find the location `<select>` element and add more `<option>` tags:

```html
<select id="location-filter" onchange="filterJobs()">
  <option value="">All locations</option>
  <option>Remote</option>
  <option>New York</option>
  <option>Your City Here</option>
</select>
```

### Change the hero text

Find and edit these lines in the `.hero` section:

```html
<h1>Find your next opportunity</h1>
<p>Browse thousands of jobs from top companies worldwide</p>
```

---

## Sample Data

The site ships with 8 pre-loaded jobs to demonstrate the layout:

| Title | Company | Location | Type | Salary |
|---|---|---|---|---|
| Senior Frontend Engineer | Stripe | Remote | Full-time | $150,000 |
| Product Designer | Notion | San Francisco | Full-time | $120,000 |
| Backend Engineer | Vercel | Remote | Full-time | $160,000 |
| Data Analyst | Airbnb | New York | Full-time | $105,000 |
| Marketing Intern | Linear | Remote | Internship | $25/hr |
| iOS Engineer | Figma | San Francisco | Full-time | $140,000 |
| DevOps Engineer | Cloudflare | London | Full-time | £100,000 |
| UX Researcher | Atlassian | Remote | Contract | $80/hr |

To replace these with real jobs, edit the `jobs` array in the JavaScript section of the file.

---

## Known Limitations

Since this is a static, single-file site with no backend, there are a few things to be aware of:

- **No persistent storage** — Jobs posted through the form and saved jobs disappear when the page is refreshed. All data lives in memory only.
- **No user accounts** — There is no login, authentication, or user management.
- **No email notifications** — The site cannot send emails to applicants or employers.
- **No admin panel** — There is no way to moderate, approve, or delete posted jobs from a UI (you would edit the HTML directly).
- **No database** — All job data is hardcoded in the JavaScript array.

These limitations are by design for simplicity. See the next section for how to address them.

---

## Future Improvements

To turn this into a fully production-ready job board, consider adding:

- **Supabase or Firebase** — Free backend databases that can store jobs and applications persistently with just a few lines of JavaScript
- **User authentication** — Add sign-in with Supabase Auth or Firebase Auth so employers can manage their own listings
- **Email notifications** — Use EmailJS or Resend to send confirmation emails on application or job post
- **Admin dashboard** — A separate page to approve, feature, or delete job listings
- **Payment for featured listings** — Integrate Stripe to charge employers for featured placement
- **SEO optimization** — Add meta tags and structured data (JSON-LD) so job listings appear in Google search results
- **Pagination** — For large numbers of listings, add page navigation instead of infinite scroll

---

## License

This project is free to use, modify, and distribute for personal or commercial purposes. No attribution required.

---

*Built with plain HTML, CSS, and JavaScript. No frameworks were harmed in the making of this website.*
