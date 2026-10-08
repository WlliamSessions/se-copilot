export const audienceFlowDocs = `
# AudienceFlow Product Documentation

AudienceFlow is a fictional SaaS audience data platform that helps companies ingest customer data, build audiences, and activate those audiences to advertising platforms.

## Batch Data Ingestion

AudienceFlow supports batch customer-data ingestion through:

- AWS S3
- SFTP

Supported file format:

- CSV

Batch files may contain up to 5 million customer records per file.

Imports can be scheduled:

- Hourly
- Daily
- Weekly

AudienceFlow validates incoming files for formatting errors and required fields before processing.

## Data Security

Data transferred to AudienceFlow is encrypted in transit using TLS 1.2 or higher.

Customer data stored by AudienceFlow is encrypted at rest using AES-256 encryption.

## Audience Processing

AudienceFlow can perform:

- File validation
- Record deduplication
- Identifier matching
- Audience creation and updates

After a batch file has been successfully processed, audience activation typically completes within 2 hours.

## Destination Platforms

AudienceFlow currently supports audience activation to:

- AdSphere DSP
- Meta
- Google Ads

AdSphere DSP is a fictional advertising platform used for this demonstration.

## REST API

AudienceFlow provides a REST API for incremental customer-record updates.

The API supports:

- Creating customer records
- Updating customer records
- Deleting customer records

Authentication uses a bearer API key sent in the Authorization header.

Example:

Authorization: Bearer YOUR_API_KEY

The API accepts and returns JSON.

The API rate limit is 1,000 requests per minute.

API updates are typically processed within 5 minutes.

## Webhooks

AudienceFlow does not currently support outbound webhooks.

Customers requiring event-driven notifications must use another workflow or periodically check processing status through supported interfaces.

## Important Sales Engineering Guidance

Do not claim that a customer requirement is supported unless the capability is explicitly documented above.

If the documentation does not contain enough information to determine whether a requirement can be met, identify it as an open question requiring additional discovery.

Distinguish between:

- Supported capabilities
- Unsupported capabilities
- Requirements requiring additional discovery

Do not invent product functionality, limits, integrations, security certifications, or service-level agreements that are not documented.
`;