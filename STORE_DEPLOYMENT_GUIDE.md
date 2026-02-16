# Digital Store Deployment Guide

## Pre-Deployment Setup

### 1. Environment Configuration

Create `.env.local` with:
```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# File Storage
FILE_STORAGE_PATH=/uploads/products
SIGNED_URL_EXPIRY=3600

# Email (Optional)
SENDGRID_API_KEY=...
FROM_EMAIL=noreply@jobhouseproduction.com

# Database
DATABASE_URL=postgresql://...
```

### 2. Database Setup

**For Supabase:**
```sql
-- Run all SQL from STORE_IMPLEMENTATION_GUIDE.md
-- Create products table
-- Create orders table
-- Create order_items table
-- Create indexes for performance
```

**For PostgreSQL/Local:**
```bash
psql -U postgres -d store_db -f database-schema.sql
```

### 3. Stripe Configuration

1. **Create Stripe Account**
   - Go to https://dashboard.stripe.com
   - Sign up or log in
   - Go to Developers > API Keys
   - Copy Publishable Key (pk_test_...)
   - Copy Secret Key (sk_test_...)

2. **Setup Webhook**
   - Go to Developers > Webhooks
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy Signing Secret

3. **Add Test Data**
   - Go to Products section
   - Create test products
   - Note: This is optional if using our mock data

### 4. Email Configuration (Optional)

If using SendGrid for email notifications:
```bash
npm install @sendgrid/mail
```

Create email service:
```typescript
// lib/email-service.ts
import sgMail from '@sendgrid/mail'

export async function sendOrderConfirmation(email: string, order: Order) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  
  await sgMail.send({
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: 'Your Digital Order Confirmation',
    html: `
      <h1>Order Confirmed!</h1>
      <p>Order ID: ${order.id}</p>
      <p>Total: $${order.amount}</p>
    `
  })
}
```

## Deployment Steps

### Step 1: Prepare Application

```bash
# Install dependencies
npm install

# Build application
npm run build

# Run tests
npm test

# Check for TypeScript errors
npm run type-check
```

### Step 2: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy project
vercel deploy --prod
```

Or use GitHub integration:
1. Push code to GitHub
2. Connect repo to Vercel
3. Vercel auto-deploys on push

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to Settings > Environment Variables
2. Add all variables from .env.local
3. Set for Production environment
4. Redeploy after adding vars

### Step 4: Test Stripe Integration

```bash
# Test checkout
curl -X POST https://yourdomain.com/api/store/checkout \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": "1", "quantity": 1}]}'

# Monitor webhooks
# Go to Stripe Dashboard > Developers > Webhooks > test endpoint
```

### Step 5: Verify Deployment

- [ ] Store page loads: https://yourdomain.com/store
- [ ] Products display correctly
- [ ] Checkout processes
- [ ] Stripe modal appears
- [ ] Webhooks deliver successfully
- [ ] Success page shows download links
- [ ] Admin pages accessible
- [ ] Database queries working

## Production Configuration

### 1. Environment Variables (Production)

```bash
# Switch to production Stripe keys
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_prod_...

# Enable features
NODE_ENV=production

# Security
SECURE_COOKIES=true
SECURE_HEADERS=true
```

### 2. Security Headers

Add to `next.config.mjs`:
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        }
      ]
    }
  ]
}
```

### 3. Database Backups

**For Supabase:**
- Automatic daily backups enabled by default
- Manual backup: Dashboard > Backups > Create backup

**For PostgreSQL:**
```bash
# Daily backup script
0 2 * * * pg_dump -U postgres store_db | gzip > /backups/store_db_$(date +\%Y\%m\%d).sql.gz

# Keep last 30 days
find /backups -name 'store_db_*.sql.gz' -mtime +30 -delete
```

### 4. Monitoring & Alerts

**Sentry Integration (Error Tracking)**
```bash
npm install @sentry/nextjs
```

In `next.config.mjs`:
```javascript
import * as Sentry from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  org: "your-org",
  project: "store-project",
});
```

**Stripe Monitoring**
- Monitor failed payments
- Track webhook failures
- Review test vs. production usage

**Database Monitoring**
- Monitor query performance
- Setup connection pool alerts
- Track storage usage

### 5. Performance Optimization

**Enable Caching**
```typescript
// app/store/page.tsx
export const revalidate = 300 // 5 minutes
```

**CDN Configuration**
- Enable Vercel Edge Network
- Configure cache rules in next.config.js
- Cache product images for 30 days

**Database Optimization**
- Add indexes (see STORE_IMPLEMENTATION_GUIDE.md)
- Run VACUUM periodically
- Monitor slow queries

## Rollback Procedure

If issues occur:

**Vercel Rollback**
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Promote to Production"

**Database Rollback**
1. Stop accepting new orders
2. Restore from backup
3. Re-process orders from backup

```bash
# Database restore
psql -U postgres store_db < backup_file.sql
```

## Monitoring Checklist

### Daily
- [ ] Check error logs
- [ ] Monitor payment success rate
- [ ] Review webhook deliveries
- [ ] Check download requests

### Weekly
- [ ] Review customer feedback
- [ ] Monitor performance metrics
- [ ] Check database size
- [ ] Review security alerts

### Monthly
- [ ] Analyze sales metrics
- [ ] Review popular products
- [ ] Check user behavior
- [ ] Plan optimizations

## Troubleshooting Deployment

### Issue: Stripe Keys Not Working

**Solution:**
1. Verify keys in Vercel environment
2. Check API keys are for correct environment (test vs. live)
3. Restart deployment after adding vars
4. Clear browser cache

### Issue: Webhooks Not Delivering

**Solution:**
1. Verify webhook URL is accessible
2. Check signing secret matches
3. Review Stripe webhook logs
4. Test with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Issue: Database Connection Failing

**Solution:**
1. Verify DATABASE_URL is correct
2. Check database credentials
3. Ensure IP whitelist configured
4. Test connection:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: Files Not Downloading

**Solution:**
1. Verify file paths are correct
2. Check file permissions
3. Verify download endpoint is accessible
4. Check signed URL hasn't expired

## Maintenance Schedule

**Daily**
- Monitor errors and alerts
- Review payment processing
- Check critical functions

**Weekly**
- Database backups verification
- Security patch updates
- Performance metrics review

**Monthly**
- Database optimization
- Security audit
- Feature planning

**Quarterly**
- Database schema review
- Stripe account audit
- Cost analysis

## Cost Optimization

**Stripe Fees**
- 2.9% + $0.30 per transaction
- Volume discounts available
- ACH transfers reduce fees

**Database Costs**
- Monitor storage usage
- Clean up old data regularly
- Archive completed orders

**Bandwidth Costs**
- Use CDN for assets
- Compress images
- Cache aggressively

## Post-Deployment Handoff

**Documentation to Provide**
- Admin quick start guide
- Troubleshooting guide
- Emergency contacts
- Backup/restore procedures

**Training**
- How to add products
- How to manage orders
- How to monitor performance
- How to handle refunds

**Access Credentials**
- Vercel dashboard access
- Stripe dashboard access
- Database access
- Email service access

## Support & Maintenance

**Monthly Maintenance Tasks**
- Review security logs
- Update dependencies
- Optimize database
- Analyze metrics

**Emergency Procedures**
- Payment processing down: Pause orders, notify customers
- Database down: Activate backup, restore last checkpoint
- Security breach: Immediate investigation, notify users
