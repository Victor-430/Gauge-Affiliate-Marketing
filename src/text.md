affiliates (sales associates)
├── affiliate_id
├── unique_code
├── email
├── registration_date
└── status

leads
├── lead_id
├── affiliate_id (FK)
├── company_name
├── industry
├── contact_info
├── submitted_date
└── status (pending/closed/rejected)

deals
├── deal_id
├── lead_id (FK)
├── affiliate_id (FK)
├── closed_date
├── deal_value
└── commission_amount

email_logs (audit trail)
├── email_id
├── recipient
├── template_type
└── sent_timestamp