# Digital Store Testing Guide

## Manual Testing Procedures

### 1. Product Listing & Search

**Test Case 1.1: Browse Products**
- Navigate to `/store`
- Verify all 6 products display correctly
- Check product cards show title, price, and category
- Verify images load properly

**Test Case 1.2: Filter by Category**
- Click on category filter
- Select "Hymns"
- Verify only hymn products display
- Check product count updates

**Test Case 1.3: Search Functionality**
- Enter "Gospel" in search box
- Verify relevant products appear
- Try empty search - should show all products
- Test special characters in search

**Test Case 1.4: Price Sorting**
- Sort by "Price: Low to High"
- Verify products ordered correctly
- Sort by "Price: High to Low"
- Verify order reversed

### 2. Product Detail Page

**Test Case 2.1: Product Information**
- Click on product from listing
- Verify product title, description, price display
- Check cover image loads
- Verify category badge shows correctly

**Test Case 2.2: Related Products**
- Scroll to bottom of detail page
- Verify 4 related products display
- Verify related products are same category
- Verify no duplicate of main product

**Test Case 2.3: Add to Cart**
- Click "Add to Cart" button
- Verify cart updates (if cart exists)
- Check button shows loading state
- Verify success notification appears

### 3. Checkout Process

**Test Case 3.1: Cart Summary**
- Navigate to checkout page
- Verify all items listed with correct prices
- Check total calculation is correct
- Verify tax/shipping if applicable

**Test Case 3.2: Checkout Form**
- Fill in email field
- Verify email validation works
- Test with invalid email - should show error
- Fill in all required fields

**Test Case 3.3: Stripe Integration**
- Click "Proceed to Payment"
- Verify Stripe modal opens
- Enter test card: 4242 4242 4242 4242
- Verify payment processes successfully
- Check success page loads after payment

### 4. Test Cards for Stripe

**Successful Payments**
- 4242 4242 4242 4242 - Success
- 5555 5555 5555 4444 - Mastercard

**Failed Payments**
- 4000 0000 0000 0002 - Decline
- 4000 0000 0000 0069 - Expired Card

**Special Cases**
- 4000 0025 0000 3155 - 3D Secure required

### 5. Post-Purchase Experience

**Test Case 5.1: Success Page**
- After successful payment, verify redirect to success page
- Check order confirmation displays
- Verify download links are present
- Confirm email notification was sent

**Test Case 5.2: Downloads**
- Click download link
- Verify file downloads successfully
- Check downloaded file is correct
- Verify download expires after time limit

**Test Case 5.3: Order History**
- Navigate to `/my-downloads`
- Enter email from purchase
- Verify order appears in list
- Check all order details display correctly

### 6. Admin Features

**Test Case 6.1: Product Management**
- Navigate to `/admin/products`
- Verify all products list
- Check pagination works
- Verify product count displays

**Test Case 6.2: Create Product**
- Click "Add New Product"
- Fill in all fields:
  - Title: "Test Gospel Song"
  - Slug: "test-gospel-song"
  - Price: "12.99"
  - Category: "Original Compositions"
  - Description: "Test description"
  - File URL: "test-file.zip"
- Click "Create Product"
- Verify success message
- Verify new product appears in list

**Test Case 6.3: Edit Product**
- Click edit on existing product
- Change title to "Updated Title"
- Change price to "14.99"
- Click "Update Product"
- Verify changes saved
- Verify product reflects updates

**Test Case 6.4: Store Dashboard**
- Navigate to `/admin/store`
- Verify stats cards display:
  - Active Products count
  - Total Orders count
  - Total Revenue amount
  - Average Order Value

**Test Case 6.5: Orders Management**
- Navigate to `/admin/store/orders`
- Verify all orders display
- Check order status badges (Paid/Pending)
- Verify order details visible
- Test export functionality

### 7. Responsive Design

**Mobile (iPhone/Small Screen)**
- [ ] Store page displays single column grid
- [ ] Filters are collapsible
- [ ] Checkout form is readable
- [ ] Buttons are tap-friendly (48px minimum)
- [ ] Navigation is mobile-friendly

**Tablet**
- [ ] Store page displays 2 column grid
- [ ] Admin pages responsive
- [ ] Forms don't overflow
- [ ] All buttons accessible

**Desktop**
- [ ] Store page displays 3 column grid
- [ ] Admin sidebar visible
- [ ] Tables display clearly
- [ ] Hover effects work

### 8. Browser Compatibility

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 9. Performance Testing

**Page Load Times**
- Store listing page: < 2 seconds
- Product detail: < 2 seconds
- Checkout page: < 3 seconds
- Admin dashboard: < 2 seconds

**Asset Loading**
- [ ] Images lazy load
- [ ] JavaScript bundles optimized
- [ ] CSS not blocking render
- [ ] No console errors

### 10. Security Testing

**Test Case 10.1: Authentication**
- Try accessing admin pages without auth - should redirect
- Try accessing download without purchase - should show error
- Try manipulating order ID in URL - should show error

**Test Case 10.2: Input Validation**
- Try SQL injection in search - should be sanitized
- Try XSS in product title - should be escaped
- Try very long inputs - should be truncated

**Test Case 10.3: Payment Security**
- Verify Stripe keys not exposed in frontend
- Check no payment data logged
- Verify HTTPS enforced
- Check webhook signatures validated

## Automated Testing

### Jest Test Examples

**Product Service Tests**
```typescript
describe('ProductService', () => {
  it('should fetch all products', async () => {
    const products = await getProducts()
    expect(products.length).toBeGreaterThan(0)
  })

  it('should filter by category', async () => {
    const products = await getProducts({ category: 'Hymns' })
    expect(products.every(p => p.category === 'Hymns')).toBe(true)
  })

  it('should search products', async () => {
    const products = await getProducts({ search: 'Gospel' })
    expect(products.length).toBeGreaterThan(0)
  })
})
```

**Checkout Tests**
```typescript
describe('Checkout', () => {
  it('should create Stripe session', async () => {
    const session = await createCheckoutSession({
      items: [{ productId: '1', quantity: 1 }]
    })
    expect(session.id).toBeDefined()
  })

  it('should validate email', async () => {
    const result = validateEmail('invalid')
    expect(result.valid).toBe(false)
  })
})
```

## Bug Report Template

```
**Title:** [Feature] Brief description

**Steps to Reproduce:**
1. Navigate to...
2. Click on...
3. Expected behavior...

**Actual Behavior:**
Description of what happened

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop

**Screenshots:** [if applicable]

**Severity:** Critical/High/Medium/Low
```

## Sign-Off Checklist

Before deploying to production:

- [ ] All test cases pass
- [ ] No console errors
- [ ] Load time acceptable
- [ ] Mobile responsive
- [ ] Security review complete
- [ ] Performance baseline met
- [ ] Stripe integration working
- [ ] Webhooks configured
- [ ] Email notifications tested
- [ ] Database backups working
- [ ] Monitoring alerts setup
- [ ] Documentation complete
