import { KBArticle, ContentGap } from '../types/knowledgeBase';

export const mockKBArticles: KBArticle[] = [
  {
    id: 'kb-1',
    title: 'Duplicate Charge Resolution & Billing Corrections',
    slug: 'duplicate-charge-resolution',
    category: 'Billing',
    tags: ['Billing', 'Refunds', 'Credit Card', 'Invoices'],
    summary: 'Standard operating procedure for identifying, verifying, and voiding duplicate credit card charges within 3-5 business days.',
    content: `# Duplicate Charge Resolution Policy

## Overview
When a customer reports being charged multiple times for a single billing cycle or subscription renewal, agents must immediately verify the transaction history in Stripe/Billing Portal.

### Verification Checklist:
1. Locate customer by email and check recent invoices.
2. Confirm if duplicate transactions have distinct Stripe \`ch_xxx\` IDs or pending authorization holds.
3. If confirmed, initiate an immediate refund on the duplicate charge ID with reason \`duplicate_charge\`.

### Processing Timeline:
- Credit Card refunds typically reflect on the customer's bank statement within **3 to 5 business days**.
- Wire transfers or ACH may take up to **7 business days**.

### Escalation:
If duplicate charges exceed $1,000 USD or involve multiple billing cycles, escalate to Tier 2 Finance immediately.`,
    status: 'indexed',
    lastIndexed: '2026-08-30T14:20:00Z',
    lastUpdated: '2026-08-28T10:15:00Z',
    chunksCount: 8,
    embeddingModel: 'text-embedding-004',
    viewCount: 1420,
    helpfulVotes: 98,
    aiUsageCount: 420,
  },
  {
    id: 'kb-2',
    title: 'Subscription Refund Policy & Eligibility Criteria',
    slug: 'subscription-refund-policy',
    category: 'Billing',
    tags: ['Billing', 'Refunds', 'Cancellation', 'Terms of Service'],
    summary: 'Rules and guidelines for annual and monthly subscription refunds within the 30-day money-back guarantee window.',
    content: `# Subscription Refund Policy

## Eligibility Window
- **Monthly Subscriptions**: Eligible for full refund if requested within 7 days of the latest renewal.
- **Annual Subscriptions**: Eligible for prorated or full refund within 30 days of initial purchase or renewal.

## Non-Refundable Items
- Usage-based add-on credits consumed during the billing term.
- Dedicated IP addresses or custom domain setup fees.

## Standard Resolution
1. Confirm cancellation intent.
2. Issue credit note or direct card refund.
3. Send email confirmation with receipt.`,
    status: 'indexed',
    lastIndexed: '2026-08-29T11:00:00Z',
    lastUpdated: '2026-08-25T09:30:00Z',
    chunksCount: 6,
    embeddingModel: 'text-embedding-004',
    viewCount: 2310,
    helpfulVotes: 142,
    aiUsageCount: 610,
  },
  {
    id: 'kb-3',
    title: 'Password Reset & Account Recovery Protocols',
    slug: 'password-reset-account-recovery',
    category: 'Account',
    tags: ['Account', 'Security', 'Authentication', 'MFA'],
    summary: 'Step-by-step guide for unlocking accounts, resolving 2FA lockout issues, and secure identity verification.',
    content: `# Account Recovery & 2FA Reset

## Self-Service Flow
Customers can initiate password resets via \`https://app.supportflow.io/reset-password\`. The secure token expires in 15 minutes.

## Assisted Recovery (MFA Lost)
If a user lost access to their Authenticator app or hardware key:
1. Verify customer identity using domain TXT record or verified primary phone SMS.
2. An authorized manager must confirm the recovery for Enterprise accounts.
3. Support Agent resets 2FA and forces temporary security lockout for 2 hours.`,
    status: 'indexed',
    lastIndexed: '2026-08-31T09:40:00Z',
    lastUpdated: '2026-08-20T16:00:00Z',
    chunksCount: 7,
    embeddingModel: 'text-embedding-004',
    viewCount: 3105,
    helpfulVotes: 215,
    aiUsageCount: 890,
  },
  {
    id: 'kb-4',
    title: 'Troubleshooting HTTP 502 Bad Gateway & API Gateway Timeouts',
    slug: 'troubleshooting-http-502-bad-gateway',
    category: 'Technical',
    tags: ['Technical', 'Errors', '502', 'API', 'Gateway'],
    summary: 'Diagnostic procedures for webhook failures, upstream proxy timeout errors, and service health status verification.',
    content: `# HTTP 502 & Gateway Timeout Guide

## Symptoms
- Browser displays \`ERR-502\` or \`502 Bad Gateway\`
- Webhook payloads fail with timeout status (>30,000ms)

## Root Causes & Fixes
1. **Upstream Microservice deployment**: Check \`https://status.supportflow.io\` for ongoing cluster rollouts.
2. **Heavy payload queries**: If requesting >10,000 records without pagination, advise customer to apply \`limit=100\` and cursor pagination.
3. **Browser Cache / DNS stale route**: Ask user to flush DNS cache or test via Incognito mode.`,
    status: 'indexed',
    lastIndexed: '2026-08-30T18:10:00Z',
    lastUpdated: '2026-08-27T13:45:00Z',
    chunksCount: 9,
    embeddingModel: 'text-embedding-004',
    viewCount: 1890,
    helpfulVotes: 110,
    aiUsageCount: 340,
  },
  {
    id: 'kb-5',
    title: 'Customer Churn Prevention & Cancellation Procedures',
    slug: 'account-cancellation-churn-prevention',
    category: 'Account',
    tags: ['Account', 'Cancellation', 'Churn', 'Retention'],
    summary: 'Guidelines for handling high-value churn risks, discount retention offers, and graceful offboarding.',
    content: `# Account Cancellation Protocol

## Retention Best Practices
1. Empathize with the customer's frustration or blocker.
2. Investigate if their issue stems from missing features, bugs, or pricing constraints.
3. Offer eligible Pro/Enterprise customers up to 3 months at 50% discount or a personalized onboarding call with an engineer.

## Offboarding Steps
If customer declines retention offers:
1. Export their workspace audit logs and data snapshot.
2. Schedule account deactivation at the end of the current billing period.
3. Confirm that no future renewal charges will occur.`,
    status: 'indexed',
    lastIndexed: '2026-08-28T12:00:00Z',
    lastUpdated: '2026-08-22T10:00:00Z',
    chunksCount: 6,
    embeddingModel: 'text-embedding-004',
    viewCount: 840,
    helpfulVotes: 64,
    aiUsageCount: 290,
  },
  {
    id: 'kb-6',
    title: 'Workspace Data Export & GDPR/CCPA Compliance',
    slug: 'data-export-compliance',
    category: 'Account',
    tags: ['Account', 'Data Export', 'GDPR', 'Compliance', 'Privacy'],
    summary: 'How customers can generate JSON/CSV data archives of tickets, contacts, and knowledge bases.',
    content: `# Data Export & Compliance

## Automated Self-Serve Export
Workspace Admins can navigate to **Settings > Data Management > Export Full Archive**.
- Formats provided: JSON files for tickets & threads, CSV for contact lists.
- A secure expiring S3 link will be emailed within 15 minutes.

## Right to Be Forgotten
For GDPR erasure requests, support tickets are anonymized after a 30-day grace retention window unless required for financial tax compliance.`,
    status: 'indexed',
    lastIndexed: '2026-08-27T08:15:00Z',
    lastUpdated: '2026-08-15T11:20:00Z',
    chunksCount: 5,
    embeddingModel: 'text-embedding-004',
    viewCount: 670,
    helpfulVotes: 48,
    aiUsageCount: 180,
  },
  {
    id: 'kb-7',
    title: 'Slack, Microsoft Teams & Webhook Integration Setup',
    slug: 'slack-teams-webhook-integration',
    category: 'Technical',
    tags: ['Technical', 'Integrations', 'Slack', 'Teams', 'Webhooks'],
    summary: 'Instructions for configuring incoming bots, OAuth scopes, and dispatching real-time notifications to team channels.',
    content: `# Slack & Webhooks Integration Guide

## Connecting Slack
1. Go to **Settings > Integrations > Slack**.
2. Click **Add to Slack** and authorize the \`chat:write\` and \`channels:read\` scopes.
3. Select the default channel for triage alerts (e.g. \`#support-triage\`).

## Webhook Signature Verification
All outbound webhooks include an \`X-SupportFlow-Signature\` HMAC-SHA256 header signed with your workspace webhook secret.`,
    status: 'indexed',
    lastIndexed: '2026-08-29T16:45:00Z',
    lastUpdated: '2026-08-26T14:10:00Z',
    chunksCount: 8,
    embeddingModel: 'text-embedding-004',
    viewCount: 1540,
    helpfulVotes: 125,
    aiUsageCount: 470,
  },
  {
    id: 'kb-8',
    title: 'Shipment Tracking, Delivery Delays & Replacement Orders',
    slug: 'shipping-tracking-delivery-delays',
    category: 'Shipping',
    tags: ['Shipping', 'Logistics', 'Tracking', 'Carrier Delays'],
    summary: 'Policies for handling lost parcels, tracking carrier milestones with FedEx/UPS/DHL, and issuing replacements.',
    content: `# Shipping & Delivery Guidelines

## Investigating Delayed Shipments
1. Check Carrier tracking tracking ID against FedEx/UPS/DHL API.
2. If parcel shows **In Transit** with no update for >5 business days:
   - Initiate carrier trace with tracking code.
   - For VIP accounts, offer immediate express replacement at zero cost.
3. Customs delay notice: Advise recipient to check customs clearance SMS if international.`,
    status: 'indexed',
    lastIndexed: '2026-08-31T11:20:00Z',
    lastUpdated: '2026-08-29T10:00:00Z',
    chunksCount: 7,
    embeddingModel: 'text-embedding-004',
    viewCount: 920,
    helpfulVotes: 73,
    aiUsageCount: 310,
  },
  {
    id: 'kb-9',
    title: 'Dark Mode & Custom Theme Accessibility Preferences',
    slug: 'dark-mode-theme-settings',
    category: 'Feature Request',
    tags: ['Feature Request', 'UI/UX', 'Dark Mode', 'Accessibility'],
    summary: 'User preferences for system theme auto-switching, high-contrast modes, and custom palette options.',
    content: `# Theme & Appearance Preferences

## Enabling Dark Mode
SupportFlow AI supports seamless dark mode. Users can switch themes via:
1. User Avatar Dropdown > Theme > Dark / Light / System Sync.
2. Quick toggle hotkey: \`Shift + Cmd + D\`.

## High Contrast Mode
Available under Accessibility in Settings for WCAG AAA compliant text contrast.`,
    status: 'indexed',
    lastIndexed: '2026-08-25T14:00:00Z',
    lastUpdated: '2026-08-18T09:00:00Z',
    chunksCount: 4,
    embeddingModel: 'text-embedding-004',
    viewCount: 510,
    helpfulVotes: 39,
    aiUsageCount: 140,
  },
  {
    id: 'kb-10',
    title: 'SOC2, HIPAA & Enterprise Security Architecture',
    slug: 'soc2-hipaa-security-compliance',
    category: 'Security',
    tags: ['Security', 'Compliance', 'SOC2', 'Encryption', 'Enterprise'],
    summary: 'Overview of TLS 1.3 in transit, AES-256 at rest, role-based access control (RBAC), and audit log retention.',
    content: `# Security & Compliance Standards

## Encryption Standards
- **In Transit**: Enforced TLS 1.3 with Perfect Forward Secrecy.
- **At Rest**: AES-256 encryption across all databases, backups, and S3 asset buckets.

## Audit Logs
All ticket access, classification updates, and agent message dispatches are immutably logged for 365 days.`,
    status: 'indexed',
    lastIndexed: '2026-08-26T15:30:00Z',
    lastUpdated: '2026-08-20T12:00:00Z',
    chunksCount: 6,
    embeddingModel: 'text-embedding-004',
    viewCount: 780,
    helpfulVotes: 68,
    aiUsageCount: 220,
  },
];

export const mockContentGaps: ContentGap[] = [
  {
    id: 'gap-1',
    topic: 'API Rate Limits & Burst Capacity',
    ticketCount: 24,
    priority: 'Critical',
    sampleQueries: [
      'Why am I getting 429 Too Many Requests?',
      'How do I increase API tier rate limit to 500 req/sec?',
      'Is burst rate limited per IP or API key?',
    ],
    suggestedCategory: 'Technical',
    description: '24 support tickets in the last 14 days had no indexed KB coverage regarding REST API throttle headers, burst concurrency, and quota upgrades.',
  },
  {
    id: 'gap-2',
    topic: 'Enterprise SAML / Okta SSO Configuration',
    ticketCount: 18,
    priority: 'High',
    sampleQueries: [
      'How to setup Okta SAML 2.0 with SupportFlow?',
      'Azure AD SCIM user provisioning configuration guide',
      'Entity ID and ACS URL endpoints for Google Workspace SSO',
    ],
    suggestedCategory: 'Account',
    description: '18 high-value Enterprise prospects and customers requested step-by-step IdP metadata guides and SCIM group sync instructions.',
  },
  {
    id: 'gap-3',
    topic: 'Mobile App Push Notifications & Deep Linking',
    ticketCount: 14,
    priority: 'High',
    sampleQueries: [
      'Push notifications not delivering on iOS 18',
      'How to configure APNS VoIP certificates',
      'Universal deep links breaking inside mobile WebView',
    ],
    suggestedCategory: 'Technical',
    description: '14 mobile SDK integrators ran into notification token refresh issues without documented troubleshooting recipes.',
  },
  {
    id: 'gap-4',
    topic: 'Custom Invoicing & Multi-Entity Billing',
    ticketCount: 9,
    priority: 'Medium',
    sampleQueries: [
      'Can we split invoice across US and European tax entities?',
      'Adding VAT ID and Purchase Order (PO) numbers to automated receipts',
      'Net-30 invoice wire transfer instructions',
    ],
    suggestedCategory: 'Billing',
    description: '9 inquiries regarding customized VAT invoicing fields, PO numbers on receipts, and multi-currency billing.',
  },
];
