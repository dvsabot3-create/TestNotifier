# Stripe Payment Setup - TestNotifier

## 💳 Payment System Overview

This document provides a comprehensive guide for setting up Stripe payments and subscription tiers for the TestNotifier platform. The system supports multiple subscription tiers with different features and pricing.

## 🎯 Payment Strategy

### Subscription Tiers Overview

#### Tier 1: Basic (Free)
- **Price**: £0/month
- **Features**:
  - Up to 3 pupils
  - Basic notifications
  - Manual booking only
  - Email support

#### Tier 2: Professional (£9.99/month)
- **Price**: £9.99/month
- **Features**:
  - Up to 10 pupils
  - Instant notifications
  - Auto-booking with consent
  - Priority support
  - Advanced filtering

#### Tier 3: Premium (£19.99/month)
- **Price**: £19.99/month
- **Features**:
  - Unlimited pupils
  - Instant notifications
  - Auto-booking with consent
  - Priority support
  - Advanced filtering
  - Multi-location support
  - Analytics dashboard

#### Tier 4: Enterprise (Custom)
- **Price**: Custom pricing
- **Features**:
  - Unlimited pupils
  - All premium features
  - Dedicated support
  - Custom integrations
  - White-label options

## 🔧 Stripe Setup Process

### Phase 1: Stripe Account Setup

#### 1.1 Create Stripe Account
1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Complete the registration form:
   - Email address
   - Full name
   - Password
   - Country (select United Kingdom)

#### 1.2 Complete Business Verification
1. **Business Type**: Select appropriate type (Individual/Sole Trader or Company)
2. **Business Details**: Fill in your business information
3. **Bank Account**: Add your business bank account details
4. **Identity Verification**: Upload required documents
5. **Website**: Add your domain (https://yourdomain.com)

#### 1.3 Get API Keys
Once verified, get your API keys:
1. Go to Developers → API keys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. **IMPORTANT**: Store these securely and never commit them to code

### Phase 2: Product and Price Setup

#### 2.1 Create Products in Stripe Dashboard

**Professional Tier Product**:
1. Go to Products → Add product
2. **Name**: "TestNotifier Professional"
3. **Description**: "Professional DVSA test slot finder with auto-booking"
4. **Pricing model**: Recurring
5. **Price**: £9.99
6. **Billing period**: Monthly
7. **Save product**

**Premium Tier Product**:
1. Go to Products → Add product
2. **Name**: "TestNotifier Premium"
3. **Description**: "Premium DVSA test slot finder with unlimited pupils"
4. **Pricing model**: Recurring
5. **Price**: £19.99
6. **Billing period**: Monthly
7. **Save product**

#### 2.2 Create Price IDs for API
After creating products, note down the **Price IDs** (they look like `price_1234567890`)

### Phase 3: Webhook Configuration

#### 3.1 Set Up Webhook Endpoint

**Create webhook endpoint file**:
```bash
# Create webhook handler
sudo mkdir -p /var/www/testnotifier/api
sudo nano /var/www/testnotifier/api/stripe-webhook.php
```

**Add webhook handler code**:
```php
<?php
require_once 'vendor/autoload.php';

\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

// Get the webhook payload
$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
$event = null;

try {
    $event = \Stripe\Webhook::constructEvent(
        $payload,
        $sig_header,
        $_ENV['STRIPE_WEBHOOK_SECRET']
    );
} catch(\UnexpectedValueException $e) {
    // Invalid payload
    http_response_code(400);
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    // Invalid signature
    http_response_code(400);
    exit();
}

// Handle the event
switch ($event->type) {
    case 'checkout.session.completed':
        $session = $event->data->object;
        handleSubscriptionCreated($session);
        break;

    case 'invoice.payment_succeeded':
        $invoice = $event->data->object;
        handlePaymentSucceeded($invoice);
        break;

    case 'invoice.payment_failed':
        $invoice = $event->data->object;
        handlePaymentFailed($invoice);
        break;

    case 'customer.subscription.deleted':
        $subscription = $event->data->object;
        handleSubscriptionDeleted($subscription);
        break;

    case 'customer.subscription.updated':
        $subscription = $event->data->object;
        handleSubscriptionUpdated($subscription);
        break;
}

http_response_code(200);

function handleSubscriptionCreated($session) {
    // Handle new subscription
    $customer_id = $session->customer;
    $subscription_id = $session->subscription;

    // Update user subscription in database
    // Send welcome email
    // Activate premium features
}

function handlePaymentSucceeded($invoice) {
    // Handle successful payment
    $customer_id = $invoice->customer;
    $subscription_id = $invoice->subscription;

    // Update payment status
    // Send payment confirmation
    // Ensure service continuity
}

function handlePaymentFailed($invoice) {
    // Handle failed payment
    $customer_id = $invoice->customer;
    $subscription_id = $invoice->subscription;

    // Send payment failure notification
    // Gracefully downgrade service
    // Provide payment retry options
}

function handleSubscriptionDeleted($subscription) {
    // Handle subscription cancellation
    $customer_id = $subscription->customer;
    $subscription_id = $subscription->id;

    // Downgrade user to free tier
    // Send cancellation confirmation
    // Preserve user data
}

function handleSubscriptionUpdated($subscription) {
    // Handle subscription changes
    $customer_id = $subscription->customer;
    $subscription_id = $subscription->id;

    // Handle plan upgrades/downgrades
    // Update user permissions
    // Send change confirmation
}
?>
```

#### 3.2 Configure Nginx for Webhook
```bash
# Add webhook location to your nginx config
sudo nano /etc/nginx/sites-available/testnotifier
```

Add this location block:
```nginx
# Stripe webhook endpoint
location /api/stripe-webhook {
    try_files $uri =404;
    fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;  # Adjust PHP version
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    # Rate limiting for webhooks
    limit_req zone=webhook burst=5 nodelay;
}
```

#### 3.3 Get Webhook Signing Secret
1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://yourdomain.com/api/stripe-webhook`
4. **Events to send**: Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. **Save endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

### Phase 4: Frontend Integration

#### 4.1 Create Stripe Checkout Integration
**File**: Create `stripe-checkout.js` in your website
```javascript
// Stripe Checkout Integration
class StripePaymentManager {
    constructor() {
        this.stripe = Stripe('YOUR_PUBLISHABLE_KEY');  // Replace with your key
        this.prices = {
            professional: 'price_professional_id',  // Replace with your price ID
            premium: 'price_premium_id'             // Replace with your price ID
        };
    }

    async createCheckoutSession(priceId, successUrl, cancelUrl) {
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: priceId,
                    successUrl: successUrl,
                    cancelUrl: cancelUrl,
                    customerEmail: this.getCustomerEmail(),
                    customerId: this.getCustomerId()
                })
            });

            const session = await response.json();

            if (response.ok) {
                // Redirect to Stripe Checkout
                const result = await this.stripe.redirectToCheckout({
                    sessionId: session.id
                });

                if (result.error) {
                    console.error('Stripe Checkout error:', result.error);
                    this.showError(result.error.message);
                }
            } else {
                throw new Error(session.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Payment error:', error);
            this.showError('Payment processing failed. Please try again.');
        }
    }

    getCustomerEmail() {
        // Get customer email from your system
        return localStorage.getItem('customerEmail') || '';
    }

    getCustomerId() {
        // Get customer ID from your system
        return localStorage.getItem('customerId') || '';
    }

    showError(message) {
        // Show error to user
        const errorElement = document.getElementById('payment-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    async handlePaymentSuccess(sessionId) {
        // Handle successful payment
        console.log('Payment successful:', sessionId);

        // Update UI
        this.showSuccess('Payment successful! Your subscription has been activated.');

        // Update user permissions
        await this.updateUserSubscription();

        // Redirect or update UI
        window.location.href = '/dashboard?payment=success';
    }

    async handlePaymentFailure() {
        // Handle payment failure
        console.log('Payment failed');

        this.showError('Payment failed. Please check your payment method and try again.');

        // Stay on current page or show retry options
        this.showRetryOptions();
    }

    showSuccess(message) {
        const successElement = document.getElementById('payment-success');
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
        }
    }

    showRetryOptions() {
        // Show retry payment options
        const retryElement = document.getElementById('payment-retry');
        if (retryElement) {
            retryElement.style.display = 'block';
        }
    }

    async updateUserSubscription() {
        // Update user subscription status in your system
        try {
            const response = await fetch('/api/update-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'activate',
                    customerId: this.getCustomerId()
                })
            });

            if (!response.ok) {
                console.error('Failed to update user subscription');
            }
        } catch (error) {
            console.error('Subscription update error:', error);
        }
    }
}

// Usage example
document.addEventListener('DOMContentLoaded', function() {
    const paymentManager = new StripePaymentManager();

    // Professional plan button
    document.getElementById('subscribe-professional')?.addEventListener('click', function() {
        paymentManager.createCheckoutSession(
            paymentManager.prices.professional,
            'https://yourdomain.com/success?plan=professional',
            'https://yourdomain.com/cancel?plan=professional'
        );
    });

    // Premium plan button
    document.getElementById('subscribe-premium')?.addEventListener('click', function() {
        paymentManager.createCheckoutSession(
            paymentManager.prices.premium,
            'https://yourdomain.com/success?plan=premium',
            'https://yourdomain.com/cancel?plan=premium'
        );
    });
});
```

#### 4.2 Create Backend API Endpoint
**File**: Create `api/create-checkout-session.php`
```php
<?php
require_once 'vendor/autoload.php';

\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

header('Content-Type: application/json');

try {
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str);

    $price_id = $json_obj->priceId;
    $success_url = $json_obj->successUrl;
    $cancel_url = $json_obj->cancelUrl;
    $customer_email = $json_obj->customerEmail ?? '';
    $customer_id = $json_obj->customerId ?? '';

    // Create or retrieve customer
    if ($customer_id) {
        $customer = \Stripe\Customer::retrieve($customer_id);
    } else {
        $customer = \Stripe\Customer::create([
            'email' => $customer_email,
            'description' => 'TestNotifier customer'
        ]);
    }

    // Create checkout session
    $session = \Stripe\Checkout\Session::create([
        'customer' => $customer->id,
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price' => $price_id,
            'quantity' => 1,
        ]],
        'mode' => 'subscription',
        'success_url' => $success_url,
        'cancel_url' => $cancel_url,
        'metadata' => [
            'source' => 'testnotifier',
            'plan' => $price_id
        ],
        'subscription_data' => [
            'metadata' => [
                'source' => 'testnotifier',
                'plan' => $price_id
            ]
        ]
    ]);

    echo json_encode(['id' => $session->id]);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
```

### Phase 5: Environment Configuration

#### 5.1 Set Up Environment Variables
```bash
# Create environment file
sudo nano /etc/environment

# Add these variables:
STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

#### 5.2 Update Deployment Script
**File**: Update `deploy-website.sh` to include Stripe environment variables:
```bash
# Add to the server configuration section
ssh "$DEPLOYMENT_USER@$REMOTE_HOST" << EOF
    # Add Stripe environment variables
    echo 'STRIPE_PUBLISHABLE_KEY="'$STRIPE_PUBLISHABLE_KEY'"' >> /etc/environment
    echo 'STRIPE_SECRET_KEY="'$STRIPE_SECRET_KEY'"' >> /etc/environment
    echo 'STRIPE_WEBHOOK_SECRET="'$STRIPE_WEBHOOK_SECRET'"' >> /etc/environment

    # Reload environment
    source /etc/environment
EOF
```

## 📊 Payment Success Metrics

### 1. Conversion Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Payment Conversion Rate** | >3% | Stripe analytics |
| **Checkout Abandonment Rate** | <60% | Stripe analytics |
| **Payment Success Rate** | >98% | Stripe analytics |
| **Refund Rate** | <2% | Stripe analytics |

### 2. Subscription Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Monthly Recurring Revenue (MRR)** | Growth >10% month-over-month | Stripe analytics |
| **Churn Rate** | <5% monthly | Stripe analytics |
| **Customer Lifetime Value (CLV)** | Growth >10% year-over-year | Customer analytics |
| **Average Revenue Per User (ARPU)** | Growth >5% month-over-month | Financial analytics |

### 3. Customer Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Free to Paid Conversion** | >5% | User analytics |
| **Plan Upgrade Rate** | >10% monthly | User analytics |
| **Customer Satisfaction** | >4.5/5 | Post-payment surveys |
| **Support Ticket Rate** | <5% of users | Support analytics |

## 🛡️ Payment Security

### 1. PCI Compliance
- **PCI DSS Level 1**: Stripe handles PCI compliance
- **Data Storage**: No card data stored on your servers
- **Tokenization**: All sensitive data handled by Stripe
- **Encryption**: TLS 1.3+ for all communications

### 2. Fraud Prevention
- **Stripe Radar**: Built-in fraud detection
- **Address Verification**: AVS checks enabled
- **3D Secure**: Strong customer authentication
- **Velocity Limits**: Rate limiting for payment attempts

### 3. Privacy Protection
- **Data Minimization**: Only essential data collected
- **GDPR Compliance**: European privacy regulations met
- **Data Retention**: Clear retention policies
- **User Rights**: Easy subscription management

## 🔧 Troubleshooting Payment Issues

### Common Issues and Solutions

#### 1. Webhook Not Receiving Events
**Problem**: Webhook endpoint not receiving Stripe events
**Solution**:
```bash
# Check webhook endpoint accessibility
curl -X POST https://yourdomain.com/api/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Test webhook manually
stripe trigger checkout.session.completed \
  --api-key sk_test_your_key
```

#### 2. Payment Fails on Frontend
**Problem**: Checkout doesn't redirect to Stripe
**Solution**:
```javascript
// Add error handling
console.log('Stripe public key:', 'pk_test_your_key'); // Verify key is correct
console.log('API endpoint:', '/api/create-checkout-session'); // Verify endpoint

// Check browser console for errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e);
});
```

#### 3. Subscription Not Activating
**Problem**: User pays but subscription doesn't activate
**Solution**:
```php
// Add logging to webhook handler
error_log("Webhook received: " . json_encode($event));
error_log("Customer ID: " . $customer_id);
error_log("Subscription ID: " . $subscription_id);

// Verify webhook signature
try {
    $event = \Stripe\Webhook::constructEvent(
        $payload,
        $sig_header,
        $webhook_secret
    );
    error_log("Webhook signature verified");
} catch (\Exception $e) {
    error_log("Webhook error: " . $e->getMessage());
}
```

## 📋 Payment Setup Checklist

### Pre-Launch Checklist
- [ ] Stripe account created and verified
- [ ] API keys obtained and securely stored
- [ ] Products and prices created in Stripe dashboard
- [ ] Webhook endpoint configured and tested
- [ ] Webhook signing secret obtained
- [ ] Frontend payment integration completed
- [ ] Backend API endpoints created
- [ ] Environment variables configured

### Launch Checklist
- [ ] Test payment flow with Stripe test cards
- [ ] Verify webhook functionality
- [ ] Test subscription upgrades/downgrades
- [ ] Test payment failure scenarios
- [ ] Verify customer email notifications
- [ ] Test refund process
- [ ] Monitor payment success rates

### Post-Launch Monitoring
- [ ] Monitor payment success rates daily
- [ ] Track subscription metrics weekly
- [ ] Review customer feedback monthly
- [ ] Analyze churn and upgrade patterns
- [ ] Optimize pricing based on data

## 🎯 Payment Success Criteria

### Immediate (Launch Day)
- [ ] Payment flow works end-to-end
- [ ] Webhook events are received and processed
- [ ] Customer subscriptions are activated correctly
- [ ] No payment processing errors

### Short-term (Week 1)
- [ ] Payment success rate >98%
- [ ] Webhook processing success rate >99%
- [ ] Customer activation rate >95%
- [ ] No critical payment issues

### Long-term (Month 1)
- [ ] Conversion rate meets targets
- [ ] Subscription growth is positive
- [ ] Customer satisfaction is high
- [ ] Revenue targets are being met

---

**Payment System Status**: ✅ READY FOR IMPLEMENTATION
**Next Steps**: Set up Stripe account and configure payment tiers
**Support**: Stripe documentation at https://stripe.com/docs
**Emergency Contact**: Stripe support for payment issues

**Remember**: Test thoroughly with Stripe test cards before going live!**