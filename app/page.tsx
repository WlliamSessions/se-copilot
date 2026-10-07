"use client";

import { useState } from "react";

type Analysis = {
  overallAssessment: string;
  requirements: string[];
  technicalConsiderations: string[];
  discoveryQuestions: string[];
  risks: string[];
};

export default function Home() {
  const [requirements, setRequirements] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeRequirements() {
    setAnalysis(null);
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirements: requirements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setAnalysis(data.analysis);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
          SE Copilot
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Technical Discovery
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Turn customer requirements into a structured technical assessment.
        </p>

        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <label
            htmlFor="requirements"
            className="block text-sm font-semibold text-slate-200"
          >
            Customer Requirements / Discovery Notes
          </label>

          <p className="mt-1 text-sm text-slate-400">
            Paste discovery notes, customer requirements, or RFP questions below.
          </p>

          <textarea
            id="requirements"
            rows={10}
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
            placeholder="Example: The customer needs to send approximately 2 million customer records from AWS S3 every night..."
            className="mt-4 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={() =>
                setRequirements(
                  "Acme Retail wants to send approximately 2 million customer records to AudienceFlow every night. Their data is stored in AWS S3 as CSV files. They require encryption in transit and at rest. Audiences need to be available in AdSphere DSP by 8:00 AM each morning. They also want to know whether AudienceFlow can support real-time customer updates through an API."
                )
              }
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Load Example
            </button>

            <button
              type="button"
              onClick={analyzeRequirements}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Requirements"}
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-800 bg-red-950/30 p-4">
              <p className="text-sm font-semibold text-red-400">Error</p>
              <p className="mt-2 text-slate-300">{error}</p>
            </div>
          )}
        </div>

        {analysis && (
          <div className="mt-8 space-y-6">
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Overall Assessment
              </p>

              <p className="mt-3 leading-7 text-slate-300">
                {analysis.overallAssessment}
              </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <ResultSection
                title="Requirements"
                items={analysis.requirements}
              />

              <ResultSection
                title="Technical Considerations"
                items={analysis.technicalConsiderations}
              />

              <ResultSection
                title="Discovery Questions"
                items={analysis.discoveryQuestions}
                numbered
              />

              <ResultSection
                title="Risks / Open Questions"
                items={analysis.risks}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ResultSection({
  title,
  items,
  numbered = false,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      {numbered ? (
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-300">
          {items.map((item, index) => (
            <li key={index} className="pl-1 leading-6">
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="mt-4 space-y-3 text-slate-300">
          {items.map((item, index) => (
            <li key={index} className="flex gap-3 leading-6">
              <span className="text-blue-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}