# Coupon System Guide

## How to Use Coupons

### 1. View Available Coupons on Home Page
- Navigate to the home page after logging in
- Scroll to the **"Special Offers"** section at the top
- You'll see available coupons with:
  - Discount amount (% or $)
  - Coupon code
  - Minimum order requirement
  - **Apply button** to apply the coupon immediately

### 2. Apply Coupon from Home Page
- Click the **"Apply"** button on any coupon card
- You'll see a green success message confirming the coupon is applied
- The coupon will be saved to your session

### 3. Add Products to Cart
- Browse and add products to your cart as normal
- The applied coupon will be ready to use at checkout

### 4. Apply or Manage Coupon in Cart
- Go to **Cart** page
- Scroll to **Order Summary** section on the right
- If a coupon is applied:
  - You'll see the coupon code displayed with the discount amount
  - Click the **X button** to remove the coupon
- If no coupon is applied:
  - Enter a valid coupon code in the input field
  - Click **"Apply Coupon"** button
  - If invalid, you'll see an error message

### 5. See Discount Applied at Checkout
- The **Order Summary** shows:
  - **Subtotal**: Original price of all items
  - **Product Discount**: Discounts on individual products
  - **Coupon Discount**: Discount from the applied coupon code
  - **Tax**: 8% calculated after coupon discount
  - **Delivery**: Fixed delivery fee
  - **Total**: Final amount to pay

## Available Coupons

### FRESH20
- **Discount**: 20% off on fresh produce (fruits and vegetables)
- **Minimum Order**: $25
- **Code**: FRESH20
- **Valid until**: 30 days from now

### WELCOME10
- **Discount**: $10 off any order
- **Minimum Order**: $30
- **Code**: WELCOME10
- **Valid until**: 60 days from now

### DAIRY15
- **Discount**: 15% off on all dairy products
- **Minimum Order**: $20
- **Code**: DAIRY15
- **Valid until**: 45 days from now

## How Discounts are Calculated

**Order Calculation Flow:**
1. **Subtotal** = Sum of all product prices
2. **After Product Discount** = Subtotal - Individual product discounts
3. **After Coupon Discount** = After Product Discount - Coupon Discount
4. **Tax (8%)** = After Coupon Discount × 0.08
5. **Total** = After Coupon Discount + Tax + Delivery Fee

## Coupon Validation

When you apply a coupon, the system checks:
- ✓ Coupon code exists
- ✓ Coupon is active/not expired
- ✓ Coupon hasn't reached max uses
- ✓ Cart total meets minimum order requirement

If validation fails, you'll see an error message explaining why.

## Features

- **Persistent**: Applied coupons are saved even if you refresh the page
- **Real-time**: Discount is calculated instantly
- **One per order**: Only one coupon can be applied per order
- **Easy removal**: Click the X button to remove and try another code
- **Validation feedback**: Clear error messages for invalid codes or requirements

## Tips

- Check the **"Special Offers"** section on home page for quick coupon application
- Make sure your cart total meets the minimum order requirement
- Coupon discounts are applied AFTER product discounts
- Tax is calculated AFTER coupon discount
- Remove a coupon anytime to try a different code
