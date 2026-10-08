# SE Copilot — AI Technical Discovery

SE Copilot is an AI-powered technical discovery assistant designed to help Sales Engineers evaluate customer requirements against product documentation.

A user can paste discovery notes, technical requirements, or RFP questions into the application. SE Copilot retrieves relevant product documentation, provides that context to an LLM, and generates a structured technical assessment identifying supported requirements, unsupported requirements, areas requiring further discovery, technical considerations, risks, and follow-up questions.

The application uses a fully fictional SaaS platform called **AudienceFlow** so the project can demonstrate realistic Sales Engineering workflows without using proprietary product or customer information.

## Why I Built This

Sales Engineers frequently need to translate customer requirements into technical decisions:

- Can the product support this requirement?
- What documentation is relevant?
- What additional questions should we ask?
- Are there integration, security, scale, or operational concerns?
- What should we avoid committing to before additional validation?

SE Copilot explores how AI can assist with that process while keeping the analysis grounded in product documentation rather than relying solely on the model's general knowledge.

## How It Works

The application follows a retrieval-augmented generation (RAG) workflow:

1. A user submits customer requirements through the React interface.
2. A Next.js API route sends the requirements to an OpenAI embedding model.
3. The application compares the requirement embedding with embeddings generated from AudienceFlow product documentation.
4. Cosine similarity is used to rank documentation by semantic relevance.
5. Documents below a relevance threshold are removed.
6. The most relevant documentation is provided to the LLM as context.
7. The LLM returns a structured JSON technical assessment.
8. The React interface presents the assessment along with the documentation sources used to ground the response.

This allows the application to retrieve documentation based on meaning rather than requiring exact keyword matches.

## Example

A fictional customer might require:

- Nightly customer-data ingestion from AWS S3
- Individual profile updates through an API
- SAML-based single sign-on
- SOC 2 Type II compliance
- Automatic processing-completion notifications
- Audience activation to an advertising platform within a required timeframe

SE Copilot evaluates those requirements and classifies them as:

- **Supported**
- **Unsupported**
- **Needs Discovery**

It also generates technical considerations, discovery questions, and risks that a Sales Engineer should investigate before recommending a solution.

## Technical Architecture

```text
Customer Requirements
        |
        v
Next.js / React UI
        |
        v
POST /api/analyze
        |
        v
OpenAI Embeddings API
        |
        v
Semantic Similarity Search
        |
        v
Relevant AudienceFlow Documentation
        |
        v
OpenAI LLM
        |
        v
Structured JSON Assessment
        |
        v
React Results UI
```

## Technology

- Next.js
- React
- TypeScript
- OpenAI API
- OpenAI embeddings
- REST API
- JSON Schema structured output
- Tailwind CSS
- Git / GitHub

## Technical Decisions

### Semantic Search Instead of Keyword Search

The first version of the retrieval system used keyword matching.

Testing revealed a limitation: a customer might request that the platform "automatically notify their application when processing finishes," while the product documentation describes the capability as an "outbound webhook."

The two statements describe the same concept but do not use the same terminology.

The retrieval system was therefore upgraded to use embeddings and cosine similarity, allowing documentation to be retrieved based on semantic meaning rather than exact words.

### Grounding the AI Response

The model is instructed to use only retrieved AudienceFlow documentation when determining product support.

A requirement is classified as:

- **Supported** when documentation explicitly confirms the capability.
- **Unsupported** when documentation explicitly states the capability is not supported.
- **Needs Discovery** when the available documentation does not provide enough information.

This reduces the risk of the model inventing product capabilities.

### Retrieval Threshold

Early testing showed that simply returning the top documents could introduce unrelated context.

For example, an unrelated vacation-approval requirement still produced several "top" documents even though none were actually relevant.

A semantic similarity threshold was added so weak matches are excluded before context is provided to the LLM.

### Structured Output

The OpenAI response is constrained using a JSON schema.

Instead of asking the model to generate arbitrary text, the API expects a predictable structure containing:

- Overall assessment
- Requirement-by-requirement analysis
- Technical considerations
- Discovery questions
- Risks and open questions

This makes the AI response easier for the frontend to validate and display consistently.

## Error Handling

The application includes basic error handling for:

- Missing customer requirements
- Invalid API requests
- OpenAI API failures
- Requirements with no sufficiently relevant documentation

When relevant documentation cannot be found, the application defaults to **Needs Discovery** rather than assuming that a capability is supported or unsupported.

## What I Learned

This project reinforced several concepts relevant to Sales and Solutions Engineering:

- Designing and consuming REST APIs
- Working with JSON requests and structured responses
- Using environment variables to protect API credentials
- Integrating an LLM into an application
- Using embeddings for semantic search
- Understanding the basic architecture behind RAG applications
- Testing AI retrieval behavior rather than assuming outputs are correct
- Designing technical guardrails around AI-generated answers
- Translating customer requirements into technical discovery questions
- Building and troubleshooting a working technical POC

## POC vs. Production

This application is intentionally designed as a portfolio POC rather than a production enterprise application.

The fictional documentation set is small, so document embeddings are generated and cached in server memory.

For a production implementation, I would consider:

- Precomputing document embeddings
- Storing embeddings in a persistent vector database such as PostgreSQL with pgvector
- Retrieving documentation separately for individual requirements
- Adding document-level citations to each requirement assessment
- Authentication and user access controls
- Logging and observability
- Rate limiting
- Automated retrieval evaluation
- More robust API error handling
- Monitoring model usage and cost

The goal of this project is to demonstrate the architecture and technical decision-making behind a grounded AI Sales Engineering assistant without introducing infrastructure that is unnecessary for the POC.

## Fictional Data

AudienceFlow, Acme Retail, AdSphere DSP, MarketReach Ads, SocialConnect, and all associated product documentation and customer requirements in this project are fictional.

No proprietary customer, employer, or product information is used.