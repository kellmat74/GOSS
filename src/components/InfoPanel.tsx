import { useState } from "react";
import type { GameSystemConfig } from "../types/platform";

const APP_LIVE_URL = "https://rules.battle-captain.com";
const OFFLINE_DOWNLOAD_NAME = "battle-captain.html";
const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL || "";

type FeedbackType = "bug" | "suggestion" | "question";

function FeedbackForm() {
  const [type, setType] = useState<FeedbackType>("bug");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!FEEDBACK_URL) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      await fetch(FEEDBACK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: name.trim() || "Anonymous",
          message: message.trim(),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
      setStatus("sent");
      setMessage("");
      setName("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-green-700 bg-green-900/30 p-4 text-sm text-green-400">
        Thanks for your feedback! It has been submitted.
        <button
          onClick={() => setStatus("idle")}
          className="ml-2 underline hover:text-green-300"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        {(["bug", "suggestion", "question"] as FeedbackType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              type === t
                ? "bg-accent-600 text-white"
                : "bg-stone-700 text-stone-300 hover:bg-stone-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:border-accent-500 focus:outline-none"
      />

      <textarea
        placeholder="Describe the issue, suggestion, or question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        required
        className="w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:border-accent-500 focus:outline-none"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!message.trim() || status === "sending"}
          className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Submit Feedback"}
        </button>
        {status === "error" && (
          <span className="text-xs text-red-400">
            Failed to send. Please try again.
          </span>
        )}
      </div>
    </form>
  );
}

interface InfoPanelProps {
  gameConfig?: GameSystemConfig;
}

export function InfoPanel({ gameConfig }: InfoPanelProps) {
  const gameName = gameConfig?.name ?? "Wargame Companion";
  const gameSubtitle = gameConfig?.subtitle ?? "";
  const downloadUrl = `${import.meta.env.BASE_URL}${OFFLINE_DOWNLOAD_NAME}`;

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-4">
      {/* Offline Export */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Offline Export</h2>
        <p className="mb-3 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          Download the entire Battle Captain app — <strong>all games included</strong> (GOSS, Next War, Blue Water Navy) — as a single
          self-contained HTML file (~9 MB). Open it directly in any browser; no internet connection
          or server required. Play-aid content and rules all work offline.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          The only feature that needs internet is the AI-powered <strong>Ask</strong> tab. For
          that, use the hosted version at{" "}
          <a
            href={APP_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-500 underline hover:text-accent-400"
          >
            {APP_LIVE_URL}
          </a>
          .
        </p>
        <a
          href={downloadUrl}
          download={OFFLINE_DOWNLOAD_NAME}
          className="inline-block rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700"
        >
          Save as HTML
        </a>
      </section>

      {/* Feedback */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Submit Feedback</h2>
        <p className="mb-4 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          Found a bug, have a suggestion, or have a question? Let us know below.
        </p>
        <FeedbackForm />
      </section>

      {/* About */}
      <section>
        <h2 className="mb-3 text-lg font-bold">About</h2>
        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          <strong>{gameName}</strong>
          {gameSubtitle ? ` — ${gameSubtitle}` : ""} is an interactive companion app
          providing a step-by-step sequence of play, searchable rules reference,
          and AI-powered rules Q&amp;A. This is an unofficial fan-made tool.
        </p>
        {gameConfig?.id === "blue-water-navy" && (
          <p className="mt-3 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            <strong>Rules numbering:</strong> this app uses Christophe Bonnet's
            Revised Rules v1.17 (e.g. §5.3.3.2). The original 2020 rulebook section
            is shown in muted text next to each rule for cross-reference (e.g.{" "}
            <em>(orig §17.11)</em>).
          </p>
        )}
      </section>

      {/* Disclaimer */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Disclaimer</h2>
        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          This is an unofficial fan-made tool. All game rules, terminology, and content
          are the property of their respective copyright holders. This app is intended
          as a play aid and does not replace the official rulebooks.
        </p>
      </section>
    </div>
  );
}
