# DNS Setup Guide for Cloudflare Pages

This guide explains how to configure DNS records to point your domains to Cloudflare Pages.

## Prerequisites

1. You've created your Cloudflare Pages projects (staging and production)
2. You've added the custom domains in Cloudflare Pages dashboard
3. You have access to your DNS provider's control panel

## Step-by-Step DNS Configuration

### 1. Get Your Cloudflare Pages URLs

After creating your projects in Cloudflare Pages, you'll get URLs like:
- Staging: `https://kwcellphones-staging.pages.dev`
- Production: `https://kwcellphones.pages.dev`

**Note:** The exact `.pages.dev` URL will be shown in your Cloudflare Pages project settings.

### 2. Configure DNS Records

#### For Staging: `kwcellphones.motherboardrepair.ca`

Since this is a subdomain, you can use a CNAME record:

```
Type: CNAME
Name/Host: kwcellphones
Value/Target: [your-staging-project].pages.dev
TTL: 3600 (or Auto)
```

**Example:**
```
Type: CNAME
Name: kwcellphones
Value: kwcellphones-staging.pages.dev
TTL: 3600
```

#### For Production: `kwcellphones.com`

**Option A: Root Domain (kwcellphones.com)**

Some DNS providers support CNAME at the root (`@`), others don't:

**If CNAME is supported at root:**
```
Type: CNAME
Name/Host: @
Value/Target: [your-production-project].pages.dev
TTL: 3600
```

**If CNAME is NOT supported at root:**
You'll need to use a subdomain like `www`:
```
Type: CNAME
Name/Host: www
Value/Target: [your-production-project].pages.dev
TTL: 3600
```

Then set up a redirect in Cloudflare Pages to redirect `kwcellphones.com` → `www.kwcellphones.com`

**Option B: Use www Subdomain**

If you prefer to use `www.kwcellphones.com`:
```
Type: CNAME
Name/Host: www
Value/Target: [your-production-project].pages.dev
TTL: 3600
```

### 3. Common DNS Provider Instructions

#### Cloudflare (if using Cloudflare DNS)
1. Go to your domain in Cloudflare dashboard
2. Click "DNS" → "Records"
3. Click "Add record"
4. Select "CNAME"
5. Enter the name and target
6. Click "Save"

#### Namecheap
1. Go to Domain List → Manage
2. Click "Advanced DNS"
3. Click "Add New Record"
4. Select "CNAME Record"
5. Enter Host and Value
6. Click the checkmark to save

#### GoDaddy
1. Go to My Products → DNS
2. Click "Add" under Records
3. Select "CNAME"
4. Enter Name and Value
5. Click "Save"

#### Google Domains / Squarespace Domains
1. Go to DNS settings
2. Click "Add" or "Create new record"
3. Select "CNAME"
4. Enter Hostname and Data
5. Save

#### Route 53 (AWS)
1. Go to Route 53 → Hosted zones
2. Select your domain
3. Click "Create record"
4. Select "CNAME"
5. Enter Record name and Value
6. Create record

### 4. Verify DNS Configuration

After adding the records, verify they're working:

**Using Command Line:**
```bash
# Check staging
dig kwcellphones.motherboardrepair.ca CNAME

# Check production
dig kwcellphones.com CNAME
# or
dig www.kwcellphones.com CNAME
```

**Using Online Tools:**
- https://dnschecker.org
- https://www.whatsmydns.net

**What to Look For:**
- The CNAME record should point to your `.pages.dev` domain
- DNS propagation can take 5-60 minutes (sometimes up to 48 hours)

### 5. SSL/TLS Certificate

Cloudflare Pages automatically provisions SSL certificates for custom domains. Once your DNS records are configured and propagated:
1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. The domain should show as "Active" with SSL enabled
4. This may take a few minutes after DNS propagation

### 6. Troubleshooting

**Domain not resolving:**
- Wait for DNS propagation (can take up to 48 hours)
- Verify the CNAME record is correct
- Check for typos in the target domain
- Ensure the custom domain is added in Cloudflare Pages

**SSL certificate not issued:**
- Wait 10-15 minutes after DNS propagation
- Verify DNS is pointing to the correct `.pages.dev` domain
- Check Cloudflare Pages dashboard for any errors

**Subdomain not working:**
- Ensure the CNAME record name matches exactly (e.g., `kwcellphones` not `kwcellphones.`)
- Check that the parent domain's DNS is configured correctly

## Example Complete DNS Setup

For a typical setup with both staging and production:

```
# Staging subdomain
kwcellphones.motherboardrepair.ca  CNAME  →  kwcellphones-staging.pages.dev

# Production root (if supported)
kwcellphones.com  CNAME  →  kwcellphones.pages.dev

# Production www (alternative or additional)
www.kwcellphones.com  CNAME  →  kwcellphones.pages.dev
```

## Need Help?

- Check Cloudflare Pages documentation: https://developers.cloudflare.com/pages/platform/custom-domains/
- Verify your DNS provider's documentation for CNAME record setup
- Contact your DNS provider's support if you encounter issues

