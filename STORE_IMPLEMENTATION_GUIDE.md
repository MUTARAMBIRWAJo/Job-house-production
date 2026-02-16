# Digital Worship Store - Implementation Guide

## Overview
Complete digital store implementation for selling gospel music, production resources, and worship materials. Features product catalog, Stripe checkout, order management, and secure downloads.

## Architecture Overview

### Core Components

#### 1. **Product Management**
- `/app/store/page.tsx` - Product listing with filters & search
- `/app/store/[slug]/page.tsx` - Individual product detail page
- `/components/ProductCard.tsx` - Reusable product card component
- `/components/ProductForm.tsx` - Admin form for creating/editing products

#### 2. **Checkout & Payments**
- `/app/checkout/page.tsx` - Shopping cart and checkout interface
- `/app/api/store/checkout/route.ts` - Stripe session creation
- `/lib/stripe.ts` - Stripe utilities and configuration

#### 3. **Order Management**
- `/app/success/page.tsx` - Post-purchase success page with download links
- `/app/my-downloads/page.tsx` - Customer download history
- `/app/api/store/orders/route.ts` - Order retrieval and creation

#### 4. **Admin Dashboard**
- `/app/admin/products/page.tsx` - Product list management
- `/app/admin/products/new/page.tsx` - Create new product
- `/app/admin/products/[id]/edit/page.tsx` - Edit product details
- `/app/admin/store/page.tsx` - Store analytics dashboard
- `/app/admin/store/orders/page.tsx` - Order management view

#### 5. **Security & Downloads**
- `/app/api/store/download/[...file]/route.ts` - Secure download handler
- `/app/api/webhooks/stripe/route.ts` - Stripe webhook processor

## Data Models

### Product
```typescript
interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  cover_image: string
  file_url: string
  category: string
  is_active: boolean
  created_at: string
  updated_at?: string
}
```

### Order
```typescript
interface Order {
  id: string
  user_email: string
  stripe_payment_id: string
  amount: number
  status: 'pending' | 'paid' | 'failed'
  created_at: string
  updated_at?: string
}
```

### OrderItem
```typescript
interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
}
```

## Database Schema (SQL)

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  cover_image VARCHAR(255),
  file_url VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  stripe_payment_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_email ON orders(user_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_id ON orders(stripe_payment_id);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

## API Endpoints

### Products
- `GET /api/store/products` - List products with filtering
- `GET /api/store/products/[slug]` - Get product by slug
- `GET /api/store/products/id/[id]` - Get product by ID
- `GET /api/store/products/related/[id]` - Get related products
- `GET /api/store/categories` - Get all categories
- `POST /api/store/products/create` - Create product (admin)
- `PATCH /api/store/products/[id]` - Update product (admin)

### Checkout & Payments
- `POST /api/store/checkout` - Create Stripe checkout session
- `POST /api/store/orders` - Create order
- `GET /api/store/orders` - Get user orders

### Downloads
- `GET /api/store/download/[...file]` - Secure download endpoint
- `GET /api/store/stats` - Get store statistics

### Webhooks
- `POST /api/webhooks/stripe` - Stripe event processor

## Implementation Steps

### 1. Setup Stripe
```bash
npm install stripe @stripe/stripe-js
```

Set environment variables:
```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

### 2. Setup Products
- Add products via `/admin/products/new`
- Set category, price, and file URL
- Upload cover image and product file
- Publish when ready

### 3. Configure Downloads
- Store product files in secure location
- Generate signed URLs with expiry
- Track download access in database

### 4. Setup Webhooks
- Configure Stripe webhook to send events to `/api/webhooks/stripe`
- Handle payment success and failure events
- Update order status in database

## Features

### Customer Features
- Browse products by category
- Search and filter products
- View detailed product information
- Secure checkout with Stripe
- Order confirmation and download links
- Download history management
- Email receipts

### Admin Features
- Create, edit, delete products
- Manage product categories
- Track orders and revenue
- View customer information
- Export order data
- Monitor store analytics
- Manage inventory status

## Security Considerations

### File Downloads
- Verify user has purchased product before allowing download
- Use signed URLs with expiry times (1 hour)
- Log all download access
- Prevent direct file access

### Payment Processing
- Use Stripe for PCI compliance
- Never store payment information
- Validate webhook signatures
- Secure environment variables

### Data Protection
- Use HTTPS for all requests
- Validate user permissions
- Sanitize all user inputs
- Implement rate limiting

## Responsive Design

### Mobile (< 768px)
- Single column product grid
- Full-width cards
- Collapsible filters
- Touch-friendly buttons

### Tablet (768-1024px)
- Two column product grid
- Side filters visible
- Responsive forms

### Desktop (> 1024px)
- Three column product grid
- Full filter sidebar
- Optimized layouts

## Performance Optimization

### Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Serve optimized formats

### Caching Strategy
- Cache product data (5 minutes)
- Cache category data (1 hour)
- Cache order data (real-time)

### Database Indexes
- Index on `slug` for fast lookups
- Index on `category` for filtering
- Index on `is_active` for listing
- Index on `email` for order retrieval

## Testing Checklist

### Functional Tests
- [ ] Product listing and filtering works
- [ ] Search functionality returns correct results
- [ ] Product detail page displays correctly
- [ ] Checkout form validates input
- [ ] Stripe integration processes payments
- [ ] Success page shows download links
- [ ] Downloads work correctly
- [ ] Order history displays accurate data

### Security Tests
- [ ] Non-purchased users cannot download
- [ ] Download links expire after 1 hour
- [ ] Webhook signatures are validated
- [ ] No payment info is logged
- [ ] Admin pages require authentication

### Performance Tests
- [ ] Product page loads < 2 seconds
- [ ] Checkout loads < 3 seconds
- [ ] Download initiates < 1 second
- [ ] Admin dashboard loads < 2 seconds

## Deployment

### Pre-deployment Checklist
- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Stripe account setup complete
- [ ] Webhook URL configured
- [ ] Security headers configured
- [ ] SSL certificate installed

### Deployment Steps
1. Build the application: `npm run build`
2. Run tests: `npm test`
3. Deploy to Vercel/hosting platform
4. Configure production environment variables
5. Test checkout with Stripe test cards
6. Monitor webhook deliveries
7. Setup monitoring and alerts

## Troubleshooting

### Common Issues

**Stripe Payment Fails**
- Check API keys are correct
- Verify webhook secret is configured
- Check card is valid for testing (4242 4242 4242 4242)

**Downloads Don't Work**
- Verify file URL is accessible
- Check download link hasn't expired
- Ensure user email matches order

**Products Don't Display**
- Check products are marked as active
- Verify category spelling is correct
- Clear browser cache

**Webhooks Not Processing**
- Verify webhook URL is correct
- Check webhook secret matches
- Review Stripe webhook logs

## Future Enhancements

- Cart functionality with multiple products
- Digital licenses and expiry
- Subscription products
- Affiliate/reseller program
- Customer reviews and ratings
- Recommendation engine
- Advanced analytics
- Multi-currency support
