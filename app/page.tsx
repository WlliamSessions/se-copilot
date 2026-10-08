"use client";

import { useState } from "react";

type RequirementStatus = "Supported" | "Unsupported" | "Needs Discovery";

type RequirementAnalysis = {
  requirement: string;
  status: RequirementStatus;
  explanation: string;
};

type AnalysisResult = {
  overallAssessment: string;
  requirementAnalysis: RequirementAnalysis[];
  technicalConsiderations: string[];
  discoveryQuestions: string[];
  risks: string[];
};

export default function Home() {
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeRequirements() {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data.analysis);
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
            placeholder="Example: The customer needs nightly S3 ingestion..."
            className="mt-4 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={() =>
                setRequirements(
                  "The customer needs to ingest CSV files from AWS S3 every night. Each file will contain approximately 2 million records. The customer requires outbound webhook notifications when audience processing completes. The customer also requires the platform to maintain SOC 2 Type II certification."
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
            <div className="mt-6 rounded-lg border border-red-800 bg-red-950/40 p-4 text-red-300">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="mt-8 space-y-6">
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">
                Overall Assessment
              </p>

              <p className="mt-3 leading-7 text-slate-200">
                {result.overallAssessment}
              </p>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold">Requirement Fit</h2>

              <div className="mt-5 space-y-4">
                {result.requirementAnalysis.map((item, index) => (
                  <RequirementCard key={index} item={item} />
                ))}
              </div>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <ResultSection
                title="Technical Considerations"
                items={result.technicalConsiderations}
              />

              <ResultSection
                title="Discovery Questions"
                items={result.discoveryQuestions}
                numbered
              />

              <ResultSection
                title="Risks / Open Questions"
                items={result.risks}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function RequirementCard({ item }: { item: RequirementAnalysis }) {
  const statusStyles = {
    Supported: "border-emerald-800 bg-emerald-950/30 text-emerald-400",
    Unsupported: "border-red-800 bg-red-950/30 text-red-400",
    "Needs Discovery": "border-amber-800 bg-amber-950/30 text-amber-400",
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 p-5">
      <div
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[item.status]}`}
      >
        {item.status}
      </div>

      <h3 className="mt-3 font-semibold text-white">
        {item.requirement}
      </h3>

      <p className="mt-2 leading-6 text-slate-400">
        {item.explanation}
      </p>
    </div>
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
      <h2 className="text-lg font-semibold">{title}</h2>

      {numbered ? (
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-300">
          {items.map((item, index) => (
            <li key={index} className="pl-1 leading-6">
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-300 marker:text-blue-400">
          {items.map((item, index) => (
            <li key={index} className="pl-1 leading-6">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}