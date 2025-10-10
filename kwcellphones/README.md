# Device Repair Website Template

A professional, responsive website template for device repair businesses. This template has been debranded and is ready for customization with your business information.

## Template Setup Instructions

### 1. Replace Placeholder Content

Search and replace the following placeholders throughout all HTML files:

- `[Your Company Name]` - Replace with your business name
- `[Your City/Region]` - Replace with your service area
- `[Your Street Address]` - Replace with your business address
- `[Your City]` - Replace with your city
- `[Your State/Province]` - Replace with your state or province
- `[Your ZIP/Postal Code]` - Replace with your postal code
- `[Your Country Code]` - Replace with your country code (e.g., "US", "CA")
- `[Your Phone Number]` - Replace with your phone number
- `[Your Email]` - Replace with your email address
- `[yourdomain.com]` - Replace with your domain name
- `[your-form-endpoint]` - Replace with your form submission endpoint

### 2. Update Logo Files

1. Replace `images/logo-light.svg` with your light logo (for dark backgrounds)
2. Replace `images/logo-dark.svg` with your dark logo (for light backgrounds)
3. Update logo paths in `partials/header.html` if your logo files are named differently

### 3. Configure Analytics (Optional)

The Matomo analytics code is commented out in `partials/header.html`. To enable:

1. Set up your Matomo instance (self-hosted or cloud)
2. Uncomment the analytics section in `partials/header.html`
3. Replace `[your-matomo-instance]` with your Matomo URL
4. Replace `[your-site-id]` with your Matomo site ID
5. Update the cookie domain settings if needed

### 4. Configure Form Submission

The contact form requires a backend endpoint. To enable:

1. Set up your form handler endpoint (e.g., `forms.[yourdomain.com]/api/submit`)
2. Update the form `action` attribute in `contact.html` (line ~108)
3. Update the fetch URL in `js/contact-form.js` (line ~245)
4. Ensure your endpoint accepts POST requests with JSON data matching the form fields

### 5. Update Google Maps Embed

In `contact.html`, update the Google Maps iframe:

1. Replace the `src` query parameter with your business address
2. Update the `title` attribute with your location
3. Update the "View on Google Maps" link with your address

### 6. Update Structured Data (JSON-LD)

All pages contain structured data for SEO. Update the JSON-LD schemas in each HTML file with your business information:

- Business name
- Address
- Phone number
- Email (if applicable)
- Opening hours
- Service descriptions

### 7. Update Meta Tags

Update all meta tags in each HTML file:

- `<title>` tags
- Meta descriptions
- Meta keywords
- Open Graph tags
- Canonical URLs

### 8. Update Sitemap and Robots.txt

1. Update all URLs in `sitemap.xml` with your domain
2. Update the sitemap URL in `robots.txt` with your domain

## Project Structure

```
├── css/
│   ├── fonts.css
│   └── styles.css
├── images/
│   ├── logo-light.svg (replace with your logo)
│   ├── logo-dark.svg (replace with your logo)
│   ├── favicon.svg
│   └── (service images)
├── js/
│   ├── script.js
│   ├── contact-form.js
│   └── feedback.js
├── partials/
│   ├── header.html
│   └── footer.html
├── index.html
├── about.html
├── contact.html
├── services.html
├── phone-repair.html
├── laptop-repair.html
├── tablet-repair.html
├── console-repair.html
├── feedback.html
├── sitemap.xml
├── robots.txt
└── README.md
```

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern UI**: Clean interface with customizable accent colors
- **Form Validation**: Client-side validation for contact forms
- **SEO Optimized**: Structured data, meta tags, and semantic HTML
- **Performance**: WebP images with fallbacks, optimized loading
- **Partials System**: Header and footer loaded via JavaScript for consistency
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## Running Locally

### Using Python's built-in server

```bash
python3 -m http.server 8000
```

Then open your browser and navigate to `http://localhost:8000`

### Using Node.js http-server

```bash
npx http-server -p 8000
```

## Customization

### Colors

Edit CSS variables in `css/styles.css` to change the color scheme:

```css
:root {
  --primary-color: #your-color;
  --accent-color: #your-color;
  /* ... */
}
```

### Content

- Service descriptions: Edit individual service pages
- About page: Update company story and values
- Contact info: Update in `partials/footer.html` and `contact.html`

### Images

Replace images in the `images/` folder:
- Service images (phone-repair.webp, laptop-repair.webp, etc.)
- Hero image (hero-image.webp)
- Logo files (logo-light.svg, logo-dark.svg)
- Favicon (favicon.svg)

## Browser Compatibility

This template is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The partial system uses JavaScript to load header and footer - ensure JavaScript is enabled
- All forms require backend endpoints to function - update form endpoints as described above
- Analytics is disabled by default - enable and configure as needed
- Google Maps embed requires an internet connection
- WebP images are used with fallbacks for maximum browser compatibility

## Deployment to Cloudflare Pages

This template includes a GitHub Actions workflow for automatic deployment to Cloudflare Pages with support for both staging and production environments.

### Setup Instructions

1. **Get your Cloudflare credentials:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to "My Profile" → "API Tokens"
   - Create a new API token with "Cloudflare Pages:Edit" permissions
   - Copy your Account ID from the dashboard (found in the right sidebar)

2. **Create your Cloudflare Pages projects:**
   - Go to Cloudflare Dashboard → Pages
   - Create two projects:
     - **Staging project**: For `kwcellphones.motherboardrepair.ca`
     - **Production project**: For `kwcellphones.com`
   - Note the project names you choose

3. **Add GitHub Secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found in dashboard sidebar)
     - `CLOUDFLARE_STAGING_PROJECT_NAME`: Your staging Cloudflare Pages project name
     - `CLOUDFLARE_PRODUCTION_PROJECT_NAME`: Your production Cloudflare Pages project name
   - Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions - no need to create it

4. **Configure Custom Domains in Cloudflare Pages:**
   - **Staging**: In your staging project settings → Custom domains → Add `kwpc-staging.motherboardrepair.ca`
   - **Production**: In your production project settings → Custom domains → Add `kwcellphones.com`
   - Follow the DNS setup instructions for each domain

5. **Configure DNS Records:**
   
   After adding custom domains in Cloudflare Pages, you'll need to add CNAME records at your DNS provider.
   
   **For Staging (`kwpc-staging.motherboardrepair.ca`):**
   - Type: `CNAME`
   - Name/Host: `kwpc-staging`
   - Value/Target: `[staging-project].pages.dev`
   - TTL: `3600` (or use your provider's default)
   
   **For Production (`kwcellphones.com`):**
   - Type: `CNAME`
   - Name/Host: `@` (for root domain) or `www` (for www subdomain)
   - Value/Target: `[production-project].pages.dev` (e.g., `kwcellphones.pages.dev`)
   - TTL: `3600` (or use your provider's default)
   
   **Important Notes:**
   - If your DNS provider doesn't support CNAME at the root (`@`), you have two options:
     1. Use a subdomain like `www.kwcellphones.com` (which supports CNAME)
     2. Use an A record pointing to Cloudflare's IP (not recommended - use CNAME when possible)
   - For `kwcellphones.motherboardrepair.ca`, since it's a subdomain, CNAME will work fine
   - Wait for DNS propagation (usually 5-60 minutes, can take up to 48 hours)
   - You can verify the records are correct using: `dig kwcellphones.motherboardrepair.ca CNAME` or `nslookup kwcellphones.com`

### Deployment Behavior

The workflow supports dual deployments:

- **Staging Deployment** (`kwcellphones.motherboardrepair.ca`):
  - Automatically deploys on pushes to `staging` or `main` branches
  - Can be manually triggered

- **Production Deployment** (`kwcellphones.com`):
  - Automatically deploys on pushes to `main` branch
  - Can be manually triggered via workflow_dispatch

### Manual Deployment

You can manually trigger deployments from the GitHub Actions tab:
1. Go to Actions → "Deploy to Cloudflare Pages"
2. Click "Run workflow"
3. Select the environment (staging or production)
4. Click "Run workflow"

### Workflow File

The deployment workflow is located at `.github/workflows/deploy-cloudflare-pages.yml`. It:
- Triggers on pushes to `main` and `staging` branches
- Deploys to both staging and production environments
- Supports manual triggering for either environment
- Uses the Cloudflare Pages API for deployment

### Branch Strategy (Recommended)

- **`staging` branch**: Use for testing changes before production
- **`main` branch**: Production-ready code (deploys to both staging and production)

## Support

For issues or questions about customizing this template, refer to the inline comments in the code or consult web development resources.
