export type AudienceFlowDoc = {
  id: string;
  title: string;
  category: string;
  content: string;
};

export const audienceFlowDocs: AudienceFlowDoc[] = [
  {
    id: "s3-ingestion",
    title: "AWS S3 Batch Ingestion",
    category: "Data Ingestion",
    content: `
AudienceFlow supports batch ingestion of CSV files from AWS S3.

Customers may configure imports to run daily.

Each CSV file may contain up to 5 million customer records.

Supported files must follow the AudienceFlow CSV schema and include
a supported customer identifier.

Audience processing typically completes within 2 hours after a
successfully processed batch file.
    `,
  },

  {
    id: "api",
    title: "Customer Update API",
    category: "API",
    content: `
AudienceFlow provides a REST API for creating and updating individual
customer records.

API requests and responses use JSON.

Customer records may be created or updated without waiting for a
scheduled batch import.

A successful API request confirms that AudienceFlow accepted the request,
but does not guarantee that downstream audience processing has completed.

Real-time processing latency is not guaranteed.
    `,
  },

  {
    id: "api-authentication",
    title: "API Authentication and Rate Limits",
    category: "API",
    content: `
AudienceFlow API requests are authenticated using API keys.

API keys must be included in the Authorization header of each request.

API keys can be created and revoked by authorized AudienceFlow administrators.

The Customer Update API supports up to 1,000 requests per minute per
customer account.

Requests that exceed the rate limit return HTTP status code 429.

OAuth 2.0 authentication is not currently supported for the Customer Update API.
    `,
  },

  {
    id: "data-validation",
    title: "Data Validation and Error Handling",
    category: "Data Ingestion",
    content: `
AudienceFlow validates incoming batch files and API requests before customer
records are accepted for processing.

Batch files with invalid formatting may fail validation.

API validation errors return an appropriate HTTP 4xx response with a JSON
error message describing the validation issue.

Customers are responsible for correcting invalid data and resubmitting it.

AudienceFlow does not automatically correct malformed customer records.
    `,
  },

  {
    id: "processing-status",
    title: "Audience Processing and Status",
    category: "Processing",
    content: `
AudienceFlow processes customer data after it has been successfully ingested.

Batch audience processing typically completes within 2 hours after a
successful file import.

Processing status can be viewed in the AudienceFlow administrative interface.

Processing times represent typical platform performance and are not a
guaranteed service-level agreement.

AudienceFlow does not currently provide a customer-facing API endpoint
specifically for retrieving audience processing status.
    `,
  },

  {
    id: "destinations",
    title: "Audience Activation Destinations",
    category: "Activation",
    content: `
AudienceFlow can activate processed audiences to supported advertising platforms.

AdSphere DSP, MarketReach Ads, and SocialConnect are supported destinations.

Customers configure destination accounts before audiences can be activated.

Audience activation typically completes within 2 hours after audience
processing has completed.

Activation timing represents typical performance and is not a guaranteed SLA.

Custom advertising destinations require technical evaluation before support
can be confirmed.
    `,
  },

  {
    id: "webhooks",
    title: "Webhook Notifications",
    category: "Integrations",
    content: `
AudienceFlow does not currently support outbound webhook notifications
when audience processing completes.

Customers requiring processing status updates should view processing status
in the AudienceFlow administrative interface.

AudienceFlow does not currently provide event-driven callbacks for
audience processing events.
    `,
  },

  {
    id: "security",
    title: "Data Security and Encryption",
    category: "Security",
    content: `
AudienceFlow requires TLS 1.2 or higher for data transmitted to the platform.

Customer data stored by AudienceFlow is encrypted at rest using AES-256.

Customer-managed encryption keys are not currently supported.

SOC 2 Type II certification status is not documented in this guide.

Additional security and compliance requirements should be reviewed with the
AudienceFlow security team before contractual commitments are made.
    `,
  },

  {
    id: "sso",
    title: "User Access and Single Sign-On",
    category: "Security",
    content: `
AudienceFlow provides role-based access for users of the administrative
interface.

Standard roles include Administrator, Analyst, and Read Only.

SAML 2.0 single sign-on is supported for enterprise customer accounts.

AudienceFlow does not currently support OpenID Connect for administrative
user authentication.

Detailed identity-provider configuration requirements are provided during
customer onboarding.
    `,
  },

  {
    id: "data-retention",
    title: "Data Retention and Deletion",
    category: "Data Management",
    content: `
AudienceFlow retains active customer profile data while the customer account
remains active.

Customers may request deletion of customer profile data through AudienceFlow
support.

Deletion requests are processed according to AudienceFlow data-management
procedures.

The documentation does not define a guaranteed deletion-completion timeframe.

Customer-configurable automatic retention periods are not currently supported.
    `,
  },
];