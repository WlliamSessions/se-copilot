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
    id: "security",
    title: "Data Security and Encryption",
    category: "Security",
    content: `
AudienceFlow requires TLS 1.2 or higher for data transmitted to the platform.

Customer data stored by AudienceFlow is encrypted at rest using AES-256.

Customer-managed encryption keys are not currently supported.

SOC 2 Type II certification status is not documented in this guide.
    `,
  },

  {
    id: "api",
    title: "Customer Update API",
    category: "API",
    content: `
AudienceFlow provides a REST API for updating individual customer records.

API requests use JSON request and response bodies.

Authentication is performed using API keys sent in the Authorization header.

The API supports creating and updating customer records.

The API is subject to rate limits.

Real-time processing latency is not guaranteed.
    `,
  },

  {
    id: "destinations",
    title: "Audience Activation Destinations",
    category: "Activation",
    content: `
AudienceFlow can activate processed audiences to supported advertising platforms.

AdSphere DSP is a supported destination.

Audience activation typically completes within 2 hours after audience
processing has completed.

Activation timing represents typical performance and is not a guaranteed SLA.
    `,
  },

  {
    id: "webhooks",
    title: "Webhook Notifications",
    category: "Integrations",
    content: `
AudienceFlow does not currently support outbound webhook notifications
when audience processing completes.

Customers requiring processing status updates should periodically check
processing status using supported platform interfaces.
    `,
  },
];