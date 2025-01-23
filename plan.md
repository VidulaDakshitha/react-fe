# Stripe Integration Plan for Escrow Payment System

## 1. Database Schema Changes

### New Models to Add:

```python
# core_apps/payment/models.py

class StripeAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    organization = models.ForeignKey('user.Organization', on_delete=models.CASCADE, null=True, blank=True)
    stripe_account_id = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)
    is_authorized = models.BooleanField(default=False)
    account_type = models.CharField(max_length=20)  # 'individual' or 'company'
    can_transfer = models.BooleanField(default=False)
    can_charge = models.BooleanField(default=False)
    requirements = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(user__isnull=False, organization__isnull=True) |
                    models.Q(user__isnull=True, organization__isnull=False)
                ),
                name='stripe_account_owner_constraint'
            )
        ]

    @property
    def owner(self):
        return self.user or self.organization

    @property
    def owner_type(self):
        return 'user' if self.user else 'organization'

    @property
    def owner_name(self):
        if self.user:
            return f"{self.user.first_name} {self.user.last_name}"
        return self.organization.name

    @property
    def owner_email(self):
        if self.user:
            return self.user.email
        # Get organization admin's email
        admin = User.objects.filter(
            organization=self.organization,
            roles__name=User.ADMIN_ROLE
        ).first()
        return admin.email if admin else None

class PaymentIntent(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded')
    )
    
    stripe_payment_intent_id = models.CharField(max_length=100)
    customer = models.ForeignKey(User, related_name='customer_payments', on_delete=models.CASCADE)
    task_doer = models.ForeignKey(User, related_name='task_doer_payments', on_delete=models.CASCADE, null=True, blank=True)
    task_doer_organization = models.ForeignKey('user.Organization', related_name='organization_payments', on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    task = models.ForeignKey('task.Task', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(task_doer__isnull=False, task_doer_organization__isnull=True) |
                    models.Q(task_doer__isnull=True, task_doer_organization__isnull=False)
                ),
                name='payment_recipient_constraint'
            )
        ]

    @property
    def recipient(self):
        return self.task_doer or self.task_doer_organization

    @property
    def recipient_type(self):
        return 'user' if self.task_doer else 'organization'

class PaymentTransfer(models.Model):
    payment_intent = models.OneToOneField(PaymentIntent, on_delete=models.CASCADE)
    stripe_transfer_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

class PaymentDispute(models.Model):
    payment_intent = models.ForeignKey(
        PaymentIntent,
        on_delete=models.CASCADE,
        related_name='disputes'
    )
    stripe_dispute_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    reason = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PaymentIncident(models.Model):
    payment_intent = models.ForeignKey(
        PaymentIntent,
        on_delete=models.CASCADE,
        related_name='incidents'
    )
    error_type = models.CharField(max_length=50)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class TransferIncident(models.Model):
    payment_transfer = models.ForeignKey(
        PaymentTransfer,
        on_delete=models.CASCADE,
        related_name='incidents'
    )
    error_type = models.CharField(max_length=50)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class WebhookEvent(models.Model):
    stripe_event_id = models.CharField(max_length=100, unique=True)
    event_type = models.CharField(max_length=100)
    data = models.JSONField()
    processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 2. API Endpoints to Implement

### Task Doer/Organization Stripe Integration
```python
# Generate Onboarding Link
POST /api/v1/stripe/onboarding-link/
Request:
{
    "account_type": "individual" | "company",
    "organization_id": null  # Optional, if creating for organization
}
Response:
{
    "url": "https://connect.stripe.com/setup/s/xxxxx",
    "expires_at": "2024-03-20T12:00:00Z"
}

# Webhook Handler
POST /api/v1/stripe/webhook/
- Handles various Stripe webhook events
- Updates account status based on onboarding completion
- Secured with Stripe signature verification

Events to Handle:
- account.updated: Update account verification status
- account.application.deauthorized: Handle account disconnection
- account.application.authorized: Handle account authorization
- capability.updated: Track account capabilities
- person.updated: Update connected account person information

# Account Status
GET /api/v1/stripe/account-status/
Query Params:
    organization_id: Optional - Get organization's account status
Response:
{
    "is_verified": boolean,
    "requirements": {
        "currently_due": [],
        "eventually_due": [],
        "past_due": []
    },
    "capabilities": {
        "transfers": "active" | "inactive" | "pending",
        "card_payments": "active" | "inactive" | "pending"
    }
}

# Account Dashboard Link
GET /api/v1/stripe/dashboard-link/
Query Params:
    organization_id: Optional - Get organization's dashboard link
Response:
{
    "url": "https://connect.stripe.com/express/xxxxx"
}
```

### Payment Flow
```python
# Create Payment Intent
POST /api/v1/payments/create/
Request:
{
    "task_id": "task_id",
    "amount": 1000.00,
    "currency": "USD"
}

# Confirm Payment
POST /api/v1/payments/confirm/{payment_id}/
- Customer confirms task completion
- Transfers funds to task doer or organization
- Updates payment status

# Get Payment Status
GET /api/v1/payments/{payment_id}/
- Returns current payment status
- Includes transfer status if completed

# List Payments
GET /api/v1/payments/
Query Params:
    organization_id: Optional - Filter by organization
    role: Optional - Filter by role (customer/task_doer)
```

## 3. Implementation Steps

1. **Setup & Configuration**
   - Install stripe package: `pip install stripe`
   - Add Stripe API keys to environment variables:
     ```python
     STRIPE_SECRET_KEY="sk_test_..."
     STRIPE_PUBLISHABLE_KEY="pk_test_..."
     STRIPE_WEBHOOK_SECRET="whsec_..."
     ```
   - Create payment app: `python manage.py startapp payment`

2. **Database Setup**
   - Create migrations for new models
   - Add necessary indexes for performance
   - Setup model relationships

3. **Stripe Account Integration**
   ```python
   # services/stripe_service.py
   
   class StripeService:
       @staticmethod
       def create_account(user=None, organization=None, account_type='individual'):
           """Create a Stripe Connect account for a user or organization"""
           try:
               if not user and not organization:
                   raise ValueError("Either user or organization must be provided")
               
               if user and organization:
                   raise ValueError("Cannot provide both user and organization")
               
               # Get account owner details
               if organization:
                   admin = User.objects.filter(
                       organization=organization,
                       roles__name=User.ADMIN_ROLE
                   ).first()
                   if not admin:
                       raise ValueError("Organization must have an admin")
                   email = admin.email
                   country = organization.country
               else:
                   email = user.email
                   country = user.country
               
               account = stripe.Account.create(
                   type='express',
                   country=country,
                   email=email,
                   business_type=account_type,
                   capabilities={
                       'card_payments': {'requested': True},
                       'transfers': {'requested': True},
                   }
               )
               
               # Create StripeAccount record
               stripe_account = StripeAccount.objects.create(
                   user=user,
                   organization=organization,
                   stripe_account_id=account.id,
                   account_type=account_type
               )
               
               return account
               
           except stripe.error.StripeError as e:
               # Handle error
               pass

       @staticmethod
       def create_account_link(stripe_account, refresh_url, return_url):
           """Create onboarding link for user or organization"""
           try:
               link = stripe.AccountLink.create(
                   account=stripe_account.stripe_account_id,
                   refresh_url=refresh_url,
                   return_url=return_url,
                   type='account_onboarding'
               )
               return link
           except stripe.error.StripeError as e:
               # Handle error
               pass

       @staticmethod
       def handle_webhook(payload, sig_header):
           """Handle Stripe webhook events for both users and organizations"""
           try:
               event = stripe.Webhook.construct_event(
                   payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
               )
               
               if event.type == 'account.updated':
                   account = event.data.object
                   stripe_account = StripeAccount.objects.get(
                       stripe_account_id=account.id
                   )
                   
                   # Update account status
                   stripe_account.is_verified = account.charges_enabled
                   stripe_account.requirements = account.requirements.to_dict()
                   stripe_account.save()
                   
                   # Notify owner
                   if stripe_account.owner_type == 'organization':
                       NotificationService.notify_organization_account_updated(
                           stripe_account.organization,
                           account.charges_enabled
                       )
                   else:
                       NotificationService.notify_user_account_updated(
                           stripe_account.user,
                           account.charges_enabled
                       )
               
               # Handle other events...
               
           except stripe.error.SignatureVerificationError:
               # Handle invalid signature
               pass
   ```

4. **API Implementation**
   ```python
   # views/stripe_views.py
   
   class StripeOnboardingView(APIView):
       permission_classes = [IsAuthenticated]
       
       def post(self, request):
           account_type = request.data.get('account_type')
           organization_id = request.data.get('organization_id')
           
           if account_type not in ['individual', 'company']:
               return Response(
                   {'error': 'Invalid account type'},
                   status=400
               )
           
           try:
               # Handle organization case
               if organization_id:
                   organization = Organization.objects.get(id=organization_id)
                   
                   # Check if user has permission
                   if not request.user.has_role(User.ADMIN_ROLE) or \
                      request.user.organization_id != organization_id:
                       return Response(
                           {'error': 'Not authorized to setup organization account'},
                           status=403
                       )
                   
                   account = StripeService.create_account(
                       organization=organization,
                       account_type=account_type
                   )
               else:
                   account = StripeService.create_account(
                       user=request.user,
                       account_type=account_type
                   )
               
               # Generate onboarding link
               link = StripeService.create_account_link(
                   account,
                   refresh_url=f"{settings.FRONTEND_URL}/stripe/refresh",
                   return_url=f"{settings.FRONTEND_URL}/stripe/return"
               )
               
               return Response({
                   'url': link.url,
                   'expires_at': link.expires_at
               })
               
           except Organization.DoesNotExist:
               return Response(
                   {'error': 'Organization not found'},
                   status=404
               )
           except ValidationError as e:
               return Response(
                   {'error': str(e)},
                   status=400
               )

   class StripeWebhookView(APIView):
       permission_classes = []  # No auth needed for webhooks
       
       def post(self, request):
           payload = request.body
           sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
           
           try:
               event = stripe.Webhook.construct_event(
                   payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
               )
               
               # Handle the event
               return self.handle_stripe_event(event)
               
           except stripe.error.SignatureVerificationError:
               return Response(
                   {'error': 'Invalid signature'},
                   status=400
               )
           except Exception as e:
               return Response(
                   {'error': str(e)},
                   status=400
               )
       
       def handle_stripe_event(self, event):
           """Handle different types of Stripe webhook events"""
           
           event_handlers = {
               # Account related events
               'account.updated': self.handle_account_updated,
               'account.application.authorized': self.handle_account_authorized,
               'account.application.deauthorized': self.handle_account_deauthorized,
               'account.external_account.created': self.handle_external_account_created,
               'account.external_account.deleted': self.handle_external_account_deleted,
               
               # Payment related events
               'payment_intent.succeeded': self.handle_payment_succeeded,
               'payment_intent.payment_failed': self.handle_payment_failed,
               'payment_intent.canceled': self.handle_payment_canceled,
               'payment_intent.processing': self.handle_payment_processing,
               
               # Transfer related events
               'transfer.created': self.handle_transfer_created,
               'transfer.paid': self.handle_transfer_paid,
               'transfer.failed': self.handle_transfer_failed,
               
               # Refund related events
               'charge.refunded': self.handle_charge_refunded,
               'charge.dispute.created': self.handle_dispute_created,
               
               # Capability related events
               'capability.updated': self.handle_capability_updated,
               
               # Person related events
               'person.updated': self.handle_person_updated,
               'person.deleted': self.handle_person_deleted
           }
           
           handler = event_handlers.get(event.type)
           if handler:
               return handler(event.data.object)
           
           return Response({
               'message': f'Unhandled event type: {event.type}'
           })
       
       def handle_account_updated(self, account):
           """Handle Stripe Connect account updates"""
           try:
               stripe_account = StripeAccount.objects.get(
                   stripe_account_id=account.id
               )
               
               # Update verification status
               stripe_account.is_verified = account.charges_enabled
               
               # Update account details
               stripe_account.account_type = account.type
               stripe_account.save()
               
               # Check for requirements
               if account.requirements:
                   if account.requirements.currently_due:
                       # Notify user about pending requirements
                       NotificationService.notify_account_requirements(
                           stripe_account.user,
                           account.requirements.currently_due
                       )
               
               return Response({'status': 'success'})
               
           except StripeAccount.DoesNotExist:
               return Response(
                   {'error': 'Account not found'},
                   status=404
               )
       
       def handle_account_authorized(self, account):
           """Handle when a Connect account authorizes the platform"""
           try:
               stripe_account = StripeAccount.objects.get(
                   stripe_account_id=account.id
               )
               
               stripe_account.is_authorized = True
               stripe_account.save()
               
               # Notify user
               NotificationService.notify_account_authorized(
                   stripe_account.user
               )
               
               return Response({'status': 'success'})
               
           except StripeAccount.DoesNotExist:
               return Response(
                   {'error': 'Account not found'},
                   status=404
               )
       
       def handle_account_deauthorized(self, account):
           """Handle when a Connect account deauthorizes the platform"""
           try:
               stripe_account = StripeAccount.objects.get(
                   stripe_account_id=account.id
               )
               
               stripe_account.is_authorized = False
               stripe_account.is_verified = False
               stripe_account.save()
               
               # Update any pending tasks
               Task.objects.filter(
                   assigned_to=stripe_account.user,
                   status__in=['bid_accepted', 'in_progress']
               ).update(status='cancelled')
               
               # Notify user and admin
               NotificationService.notify_account_deauthorized(
                   stripe_account.user
               )
               
               return Response({'status': 'success'})
               
           except StripeAccount.DoesNotExist:
               return Response(
                   {'error': 'Account not found'},
                   status=404
               )
       
       def handle_payment_succeeded(self, payment_intent):
           """Handle successful payments"""
           try:
               payment = PaymentIntent.objects.get(
                   stripe_payment_intent_id=payment_intent.id
               )
               
               payment.status = 'completed'
               payment.save()
               
               # Update task status if payment was in escrow
               if payment.task.payment_status == 'payment_in_escrow':
                   payment.task.payment_status = 'payment_released'
                   payment.task.save()
               
               # Create transfer record if exists
               if payment_intent.transfer:
                   PaymentTransfer.objects.create(
                       payment_intent=payment,
                       stripe_transfer_id=payment_intent.transfer,
                       amount=payment.amount,
                       status='pending'
                   )
               
               # Notify users
               NotificationService.notify_payment_succeeded(payment)
               
               return Response({'status': 'success'})
               
           except PaymentIntent.DoesNotExist:
               return Response(
                   {'error': 'Payment not found'},
                   status=404
               )
       
       def handle_payment_failed(self, payment_intent):
           """Handle failed payments"""
           try:
               payment = PaymentIntent.objects.get(
                   stripe_payment_intent_id=payment_intent.id
               )
               
               payment.status = 'failed'
               payment.save()
               
               # Update task status
               if payment.task:
                   payment.task.payment_status = 'payment_failed'
                   payment.task.save()
               
               # Log the failure
               PaymentIncident.objects.create(
                   payment_intent=payment,
                   error_type='payment_failed',
                   details=str(payment_intent.last_payment_error)
               )
               
               # Notify users
               NotificationService.notify_payment_failed(payment)
               
               return Response({'status': 'success'})
               
           except PaymentIntent.DoesNotExist:
               return Response(
                   {'error': 'Payment not found'},
                   status=404
               )
       
       def handle_transfer_paid(self, transfer):
           """Handle successful transfers to Connect accounts"""
           try:
               payment_transfer = PaymentTransfer.objects.get(
                   stripe_transfer_id=transfer.id
               )
               
               payment_transfer.status = 'completed'
               payment_transfer.save()
               
               # Notify task doer
               NotificationService.notify_transfer_paid(
                   payment_transfer.payment_intent
               )
               
               return Response({'status': 'success'})
               
           except PaymentTransfer.DoesNotExist:
               return Response(
                   {'error': 'Transfer not found'},
                   status=404
               )
       
       def handle_transfer_failed(self, transfer):
           """Handle failed transfers to Connect accounts"""
           try:
               payment_transfer = PaymentTransfer.objects.get(
                   stripe_transfer_id=transfer.id
               )
               
               payment_transfer.status = 'failed'
               payment_transfer.save()
               
               # Log the failure
               TransferIncident.objects.create(
                   payment_transfer=payment_transfer,
                   error_type='transfer_failed',
                   details=str(transfer.failure_message)
               )
               
               # Notify admin and task doer
               NotificationService.notify_transfer_failed(
                   payment_transfer.payment_intent
               )
               
               return Response({'status': 'success'})
               
           except PaymentTransfer.DoesNotExist:
               return Response(
                   {'error': 'Transfer not found'},
                   status=404
               )
       
       def handle_capability_updated(self, capability):
           """Handle Connect account capability updates"""
           try:
               stripe_account = StripeAccount.objects.get(
                   stripe_account_id=capability.account
               )
               
               # Update account capabilities
               if capability.id == 'transfers':
                   stripe_account.can_transfer = (
                       capability.status == 'active'
                   )
               elif capability.id == 'card_payments':
                   stripe_account.can_charge = (
                       capability.status == 'active'
                   )
               
               stripe_account.save()
               
               # Notify if capabilities are restricted
               if capability.status == 'inactive':
                   NotificationService.notify_capability_restricted(
                       stripe_account.user,
                       capability.id
                   )
               
               return Response({'status': 'success'})
               
           except StripeAccount.DoesNotExist:
               return Response(
                   {'error': 'Account not found'},
                   status=404
               )
       
       def handle_dispute_created(self, dispute):
           """Handle payment disputes"""
           try:
               payment = PaymentIntent.objects.get(
                   stripe_payment_intent_id=dispute.payment_intent
               )
               
               # Create dispute record
               PaymentDispute.objects.create(
                   payment_intent=payment,
                   stripe_dispute_id=dispute.id,
                   amount=dispute.amount,
                   status=dispute.status,
                   reason=dispute.reason
               )
               
               # Update payment status
               payment.status = 'disputed'
               payment.save()
               
               # Notify admin and users
               NotificationService.notify_dispute_created(payment)
               
               return Response({'status': 'success'})
               
           except PaymentIntent.DoesNotExist:
               return Response(
                   {'error': 'Payment not found'},
                   status=404
               )
   ```

5. **Frontend Integration**
   ```javascript
   // Example React component
   const StripeOnboarding = () => {
     const handleOnboarding = async () => {
       try {
         const response = await api.post('/api/v1/stripe/onboarding-link/', {
           account_type: 'individual'
         });
         
         // Redirect to Stripe hosted form
         window.location.href = response.data.url;
       } catch (error) {
         // Handle error
       }
     };
     
     return (
       <Button onClick={handleOnboarding}>
         Setup Stripe Account
       </Button>
     );
   };
   ```

## 4. Security Considerations

1. **Access Control**
   - Only organization admins can setup/manage organization Stripe accounts
   - Individual users can only manage their own accounts
   - Validate user permissions for all payment operations

2. **Data Protection**
   - Encrypt sensitive payment data
   - Secure API endpoints
   - Handle organization payment data with extra care

3. **Stripe Best Practices**
   - Use webhook signatures
   - Implement idempotency
   - Handle errors gracefully

## 5. User Experience Flow

1. **Organization Onboarding**
   - Admin registers organization
   - Creates Stripe Connect account
   - Completes verification
   - Manages payment settings

2. **Individual User Onboarding**
   - User registers
   - Creates personal Stripe Connect account
   - Completes verification
   - Manages personal payment settings

3. **Payment Flow**
   - Customer accepts bid
   - Makes secure payment
   - Funds held in escrow
   - Task completion confirmed
   - Payment released to individual or organization

## 6. Error Handling

1. **Account Setup Issues**
   - Organization verification failures
   - User verification failures
   - Missing requirements
   - Invalid permissions

2. **Payment Failures**
   - Handle declined payments
   - Organization account issues
   - Individual account issues
   - Transfer failures

## 7. Monitoring & Logging

1. **Account Tracking**
   - Organization account status
   - Individual account status
   - Verification progress
   - Requirements status

2. **Payment Monitoring**
   - Organization payment flows
   - Individual payment flows
   - Success/failure rates
   - Transfer status

## Next Steps

1. Implement database schema changes
2. Setup organization Stripe integration
3. Setup individual user integration
4. Implement payment flows
5. Add API endpoints
6. Setup testing environment
7. Deploy and monitor

## Dependencies

1. Django Rest Framework
2. Stripe Python SDK
3. Python 3.x
4. PostgreSQL
5. Redis (for caching and task queue)

## Payment Implementation

### 1. Payment Service
```python
# services/payment_service.py

class PaymentService:
    @staticmethod
    def create_payment_intent(customer, task_doer, amount, task, currency='USD'):
        try:
            # Determine recipient (user or organization)
            if task.is_worker_organization:
                recipient = task.worker_organization
                stripe_account = StripeAccount.objects.get(
                    organization=recipient
                )
            else:
                recipient = task.assignee
                stripe_account = StripeAccount.objects.get(
                    user=recipient
                )
            
            if not stripe_account.is_verified:
                raise ValidationError(
                    f"{stripe_account.owner_type.title()}'s account is not verified"
                )

            # Create payment intent with application fee
            application_fee = int(amount * 0.10)  # 10% platform fee
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency=currency,
                payment_method_types=['card'],
                application_fee_amount=application_fee,
                transfer_data={
                    'destination': stripe_account.stripe_account_id,
                },
                metadata={
                    'task_id': task.id,
                    'customer_id': customer.id,
                    'recipient_type': stripe_account.owner_type,
                    'recipient_id': stripe_account.owner.id
                },
                capture_method='manual',  # For escrow - capture later
            )

            # Create local payment record
            payment = PaymentIntent.objects.create(
                stripe_payment_intent_id=intent.id,
                customer=customer,
                task_doer=None if task.is_worker_organization else task.assignee,
                task_doer_organization=task.worker_organization if task.is_worker_organization else None,
                amount=amount,
                currency=currency,
                task=task,
                status='pending'
            )

            return {
                'client_secret': intent.client_secret,
                'payment_id': payment.id
            }

        except stripe.error.StripeError as e:
            raise ValidationError(f"Stripe error: {str(e)}")
        except Exception as e:
            raise ValidationError(f"Error creating payment: {str(e)}")

    @staticmethod
    def confirm_payment(payment_id, customer):
        try:
            payment = PaymentIntent.objects.get(
                id=payment_id,
                customer=customer,
                status='pending'
            )

            # Capture the payment (release from escrow)
            stripe_intent = stripe.PaymentIntent.capture(
                payment.stripe_payment_intent_id
            )

            # Create transfer record
            transfer = PaymentTransfer.objects.create(
                payment_intent=payment,
                stripe_transfer_id=stripe_intent.transfer,
                amount=payment.amount,
                status='completed'
            )

            payment.status = 'completed'
            payment.save()

            return transfer

        except PaymentIntent.DoesNotExist:
            raise ValidationError("Payment not found")
        except stripe.error.StripeError as e:
            # Handle Stripe-specific errors
            raise ValidationError(f"Stripe error: {str(e)}")

    @staticmethod
    def refund_payment(payment_id, customer):
        try:
            payment = PaymentIntent.objects.get(
                id=payment_id,
                customer=customer
            )

            refund = stripe.Refund.create(
                payment_intent=payment.stripe_payment_intent_id
            )

            payment.status = 'refunded'
            payment.save()

            return refund

        except PaymentIntent.DoesNotExist:
            raise ValidationError("Payment not found")
        except stripe.error.StripeError as e:
            raise ValidationError(f"Stripe error: {str(e)}")
```

### 2. Payment Views
```python
# views/payment_views.py

class PaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        task_id = request.data.get('task_id')
        amount = request.data.get('amount')

        try:
            task = Task.objects.get(id=task_id)
            if task.status != 'bid_accepted':
                return Response(
                    {'error': 'Task is not in correct state for payment'},
                    status=400
                )

            result = PaymentService.create_payment_intent(
                customer=request.user,
                task_doer=task.assigned_to,
                amount=amount,
                task=task
            )

            return Response(result)

        except Task.DoesNotExist:
            return Response(
                {'error': 'Task not found'},
                status=404
            )
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=400
            )

class PaymentConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, payment_id):
        try:
            transfer = PaymentService.confirm_payment(
                payment_id=payment_id,
                customer=request.user
            )
            
            return Response({
                'status': 'success',
                'transfer_id': transfer.id
            })

        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=400
            )

class PaymentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, payment_id):
        try:
            payment = PaymentIntent.objects.get(
                id=payment_id,
                customer=request.user
            )
            
            data = {
                'id': payment.id,
                'status': payment.status,
                'amount': payment.amount,
                'currency': payment.currency,
                'created_at': payment.created_at,
                'task': {
                    'id': payment.task.id,
                    'title': payment.task.title
                }
            }

            if payment.status == 'completed':
                transfer = PaymentTransfer.objects.get(
                    payment_intent=payment
                )
                data['transfer'] = {
                    'id': transfer.id,
                    'status': transfer.status,
                    'created_at': transfer.created_at
                }

            return Response(data)

        except PaymentIntent.DoesNotExist:
            return Response(
                {'error': 'Payment not found'},
                status=404
            )
```

### 3. Frontend Integration
```javascript
// PaymentComponent.js
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/stripe-js-react';

const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');

const PaymentForm = ({ taskId, amount, organizationId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create payment intent
    const { data } = await api.post('/api/v1/payments/create/', {
      task_id: taskId,
      amount: amount
    });

    // Confirm card payment
    const result = await stripe.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Customer Name',
        },
      },
    });

    if (result.error) {
      // Handle error
      console.error(result.error);
    } else {
      // Payment successful but held in escrow
      // Update UI to show pending status
      await api.post(`/api/v1/payments/confirm/${data.payment_id}/`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay ${amount}</button>
    </form>
  );
};

const PaymentComponent = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);
```

### 4. Webhook Handling for Payments
```python
# Add to StripeService.handle_webhook

@staticmethod
def handle_webhook(payload, sig_header):
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        
        if event.type == 'payment_intent.succeeded':
            intent = event.data.object
            payment = PaymentIntent.objects.get(
                stripe_payment_intent_id=intent.id
            )
            payment.status = 'completed'
            payment.save()

        elif event.type == 'payment_intent.payment_failed':
            intent = event.data.object
            payment = PaymentIntent.objects.get(
                stripe_payment_intent_id=intent.id
            )
            payment.status = 'failed'
            payment.save()

        elif event.type == 'transfer.paid':
            transfer = event.data.object
            PaymentTransfer.objects.filter(
                stripe_transfer_id=transfer.id
            ).update(status='completed')

        # Handle other events...
        
    except stripe.error.SignatureVerificationError:
        raise ValidationError("Invalid signature")
    except Exception as e:
        raise ValidationError(f"Webhook error: {str(e)}")
```

### 5. URLs Configuration
```python
# urls.py
from django.urls import path
from .views import payment_views

urlpatterns = [
    path('payments/create/', 
         payment_views.PaymentIntentView.as_view(),
         name='create_payment'),
    path('payments/confirm/<int:payment_id>/',
         payment_views.PaymentConfirmView.as_view(),
         name='confirm_payment'),
    path('payments/<int:payment_id>/',
         payment_views.PaymentStatusView.as_view(),
         name='payment_status'),
]
```

## End-to-End Integration with Current System

### 1. Task Model Updates
```python
# core_apps/task/models.py

class Task(models.Model):
    # ... existing fields ...
    
    PAYMENT_STATUS_CHOICES = (
        ('pending_payment', 'Pending Payment'),
        ('payment_in_escrow', 'Payment in Escrow'),
        ('payment_released', 'Payment Released'),
        ('payment_failed', 'Payment Failed'),
        ('refunded', 'Refunded')
    )
    
    payment_status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS_CHOICES,
        default=None,
        null=True
    )
    payment_intent = models.OneToOneField(
        'payment.PaymentIntent',
        on_delete=models.SET_NULL,
        null=True,
        related_name='task'
    )
```

### 2. Bid Model Updates
```python
# core_apps/task/models.py

class Bid(models.Model):
    # ... existing fields ...
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    is_accepted = models.BooleanField(default=False)
    accepted_at = models.DateTimeField(null=True)
```

### 3. Integration Points

#### A. Task Creation Flow
1. Customer creates task
2. Task doers submit bids
3. Customer accepts a bid:
```python
# core_apps/task/views.py

class AcceptBidView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, bid_id):
        try:
            bid = Bid.objects.get(id=bid_id)
            task = bid.task
            
            # Verify task doer has Stripe account
            stripe_account = StripeAccount.objects.get(user=bid.task_doer)
            if not stripe_account.is_verified:
                return Response({
                    'error': 'Task doer has not completed Stripe verification'
                }, status=400)
            
            # Accept bid
            bid.is_accepted = True
            bid.accepted_at = timezone.now()
            bid.save()
            
            # Update task status
            task.status = 'bid_accepted'
            task.assigned_to = bid.task_doer
            task.payment_status = 'pending_payment'
            task.save()
            
            return Response({'status': 'success'})
            
        except Bid.DoesNotExist:
            return Response({'error': 'Bid not found'}, status=404)
        except StripeAccount.DoesNotExist:
            return Response({
                'error': 'Task doer has not set up payment account'
            }, status=400)
```

#### B. Payment Flow Integration
1. After bid acceptance:
```python
# core_apps/task/views.py

class TaskPaymentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, task_id):
        try:
            task = Task.objects.get(
                id=task_id,
                customer=request.user,
                status='bid_accepted',
                payment_status='pending_payment'
            )
            
            accepted_bid = task.bids.get(is_accepted=True)
            
            # Create payment intent
            result = PaymentService.create_payment_intent(
                customer=request.user,
                task_doer=task.assigned_to,
                amount=accepted_bid.amount,
                task=task
            )
            
            # Update task status
            task.payment_status = 'payment_in_escrow'
            task.payment_intent_id = result['payment_id']
            task.save()
            
            return Response(result)
            
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=404)
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
```

2. Task completion and payment release:
```python
# core_apps/task/views.py

class CompleteTaskView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, task_id):
        try:
            task = Task.objects.get(
                id=task_id,
                customer=request.user,
                status='in_progress',
                payment_status='payment_in_escrow'
            )
            
            # Release payment from escrow
            transfer = PaymentService.confirm_payment(
                payment_id=task.payment_intent_id,
                customer=request.user
            )
            
            # Update task status
            task.status = 'completed'
            task.payment_status = 'payment_released'
            task.completed_at = timezone.now()
            task.save()
            
            return Response({
                'status': 'success',
                'transfer_id': transfer.id
            })
            
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=404)
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
```

### 4. Task Doer Dashboard Integration

```python
# core_apps/user/views.py

class TaskDoerDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get Stripe account status
            stripe_account = StripeAccount.objects.get(user=request.user)
            account_status = StripeService.get_account_status(
                stripe_account.stripe_account_id
            )
            
            # Get tasks and payments
            tasks = Task.objects.filter(
                assigned_to=request.user
            ).select_related('payment_intent')
            
            payments = PaymentIntent.objects.filter(
                task_doer=request.user
            ).select_related('task')
            
            data = {
                'stripe_account': {
                    'is_verified': stripe_account.is_verified,
                    'account_type': stripe_account.account_type,
                    'requirements': account_status.get('requirements', {}),
                    'capabilities': account_status.get('capabilities', {})
                },
                'tasks': TaskSerializer(tasks, many=True).data,
                'payments': PaymentSerializer(payments, many=True).data,
                'total_earnings': sum(
                    payment.amount for payment in payments 
                    if payment.status == 'completed'
                )
            }
            
            return Response(data)
            
        except StripeAccount.DoesNotExist:
            return Response({
                'error': 'Stripe account not set up',
                'setup_url': reverse('stripe-onboarding')
            }, status=404)
```

### 5. Customer Dashboard Integration

```python
# core_apps/user/views.py

class CustomerDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        tasks = Task.objects.filter(
            customer=request.user
        ).select_related(
            'payment_intent',
            'assigned_to'
        )
        
        payments = PaymentIntent.objects.filter(
            customer=request.user
        ).select_related('task', 'task_doer')
        
        data = {
            'tasks': [{
                **TaskSerializer(task).data,
                'payment_status': task.payment_status,
                'task_doer': {
                    'id': task.assigned_to.id,
                    'name': task.assigned_to.get_full_name(),
                    'is_verified': hasattr(
                        task.assigned_to, 'stripeaccount'
                    ) and task.assigned_to.stripeaccount.is_verified
                } if task.assigned_to else None
            } for task in tasks],
            'payments': PaymentSerializer(payments, many=True).data,
            'total_spent': sum(
                payment.amount for payment in payments 
                if payment.status == 'completed'
            )
        }
        
        return Response(data)
```

### 6. Notification Integration

```python
# services/notification_service.py

class NotificationService:
    @staticmethod
    def notify_payment_required(task):
        # Notify customer that payment is required
        Notification.objects.create(
            user=task.customer,
            type='payment_required',
            title='Payment Required',
            message=f'Payment required for task: {task.title}',
            data={
                'task_id': task.id,
                'amount': str(task.bids.get(is_accepted=True).amount)
            }
        )
    
    @staticmethod
    def notify_payment_received(payment):
        # Notify task doer that payment is in escrow
        Notification.objects.create(
            user=payment.task_doer,
            type='payment_received',
            title='Payment Received',
            message=f'Payment received for task: {payment.task.title}',
            data={
                'task_id': payment.task.id,
                'amount': str(payment.amount)
            }
        )
    
    @staticmethod
    def notify_payment_released(payment):
        # Notify task doer that payment is released
        Notification.objects.create(
            user=payment.task_doer,
            type='payment_released',
            title='Payment Released',
            message=f'Payment released for task: {payment.task.title}',
            data={
                'task_id': payment.task.id,
                'amount': str(payment.amount)
            }
        )
```

### 7. State Flow Diagram

```
Task Creation → Bidding → Bid Acceptance → Payment to Escrow → Task Completion → Payment Release

States:
1. Task
   - created
   - bidding
   - bid_accepted
   - in_progress
   - completed
   - cancelled

2. Payment
   - pending_payment
   - payment_in_escrow
   - payment_released
   - payment_failed
   - refunded

3. Stripe Account
   - pending_verification
   - verified
   - restricted
```

### 8. Error Handling and Recovery

```python
# services/payment_recovery_service.py

class PaymentRecoveryService:
    @staticmethod
    def handle_failed_payment(payment_intent):
        task = payment_intent.task
        task.payment_status = 'payment_failed'
        task.save()
        
        # Notify customer
        NotificationService.notify_payment_failed(task)
        
        # Log incident
        PaymentIncident.objects.create(
            payment_intent=payment_intent,
            error_type='payment_failed',
            details=str(payment_intent.last_payment_error)
        )
    
    @staticmethod
    def handle_webhook_failure(event_type, error):
        # Log webhook failure
        WebhookFailure.objects.create(
            event_type=event_type,
            error=str(error),
            payload=event.data
        )
        
        # Alert admin
        AdminNotification.objects.create(
            type='webhook_failure',
            details={
                'event_type': event_type,
                'error': str(error)
            }
        )
```

### 9. Testing Scenarios

1. Task Flow Testing
```python
def test_end_to_end_task_flow():
    # Create task
    task = create_test_task()
    
    # Submit and accept bid
    bid = submit_test_bid(task)
    accept_bid(bid)
    
    # Make payment
    payment = create_payment(task)
    assert task.payment_status == 'payment_in_escrow'
    
    # Complete task
    complete_task(task)
    assert task.payment_status == 'payment_released'
    assert task.status == 'completed'
```

2. Error Scenarios
```python
def test_payment_failure_recovery():
    # Test payment failure
    task = create_test_task_with_failed_payment()
    assert task.payment_status == 'payment_failed'
    
    # Test recovery
    retry_payment(task)
    assert task.payment_status == 'payment_in_escrow'
```

### 10. Deployment Checklist

1. Database Migrations
```bash
python manage.py makemigrations task
python manage.py makemigrations payment
python manage.py migrate
```

2. Environment Setup
```bash
# Add to .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Webhook Configuration
- Set up webhook endpoint in Stripe dashboard
- Configure webhook secret
- Test webhook with Stripe CLI

4. Frontend Integration
- Add Stripe.js
- Implement payment forms
- Add payment status handling

5. Monitoring Setup
- Configure payment logging
- Set up error tracking
- Configure admin notifications
```