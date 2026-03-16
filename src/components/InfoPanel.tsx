const LIVE_URL = "https://kellmat74.github.io/GOSS/";
const DOWNLOAD_URL = `${import.meta.env.BASE_URL}GOSS-Assistant.html`;

export function InfoPanel() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-4">
      {/* Offline Export */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Offline Export</h2>
        <p className="mb-3 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          Download this app as a single HTML file you can open directly in any browser —
          no internet connection or server required. All features work offline except the
          AI-powered <strong>Ask</strong> tab, which requires an internet connection.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          To use the Ask feature, visit the hosted version at{" "}
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-500 underline hover:text-accent-400"
          >
            {LIVE_URL}
          </a>
        </p>
        <a
          href={DOWNLOAD_URL}
          download="GOSS-Assistant.html"
          className="inline-block rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700"
        >
          Save as HTML
        </a>
      </section>

      {/* About */}
      <section>
        <h2 className="mb-3 text-lg font-bold">About</h2>
        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          <strong>GOSS Assistant</strong> is an interactive companion app for the{" "}
          <em>Grand Operational Simulation Series (GOSS) 2020</em> tabletop wargame system
          by Decision Games. It provides a step-by-step sequence of play,
          searchable rules reference, visual flowcharts, and AI-powered rules Q&A.
        </p>
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
