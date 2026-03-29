import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api.js";
import UploadComponent from "../components/UploadComponent.jsx";

const SAMPLE_TEXT = `Machine learning enables computers to learn from data without being explicitly programmed for every task. Natural language processing helps machines understand, interpret, and generate human language.`;

const initialResult = {
  plagiarism_score: null,
  grammar: "—",
  spelling: "—",
  punctuation: "—",
  readability: "—",
  word_choice: "—",
  ai_detection: "—",
  sources: [],
  metrics: null,
};

export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(initialResult);
  const [scanned, setScanned] = useState(false);

  const firstTextAt = useRef(null);
  const mountAt = useRef(Date.now());

  useEffect(() => {
    if (text.trim().length > 0 && firstTextAt.current === null) {
      firstTextAt.current = Date.now();
    }
    if (!text.trim()) {
      firstTextAt.current = null;
      setScanned(false);
    }
  }, [text]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
      if (firstTextAt.current === null) {
        firstTextAt.current = Date.now();
      }
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const clearFile = useCallback(() => {
    setFile(null);
    setFileName("");
  }, []);

  const clearText = () => {
    setText("");
    setFile(null);
    setFileName("");
    setError("");
    setResult(initialResult);
    firstTextAt.current = null;
    setScanned(false);
  };

  const canScan = Boolean(text.trim() || file);

  const scan = async () => {
    if (!localStorage.getItem("user")) {
      alert("Please login first");
      return;
    }
    setError("");
    if (!canScan) {
      setError("Paste text or upload a file before scanning.");
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("text", text);
    if (file) form.append("file", file);

    const start = firstTextAt.current ?? mountAt.current;
    const elapsed_ms = Math.max(50, Date.now() - start);
    form.append("elapsed_ms", String(elapsed_ms));

    const words = text.trim().split(/\s+/).filter(Boolean);
    const paste_size = words.length;
    const typing_speed = paste_size / (elapsed_ms / 1000);
    form.append(
      "behavior",
      JSON.stringify({
        typing_speed,
        paste_size,
      })
    );

    try {
      const { data } = await axios.post(`${API_BASE}/api/check`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      setResult({
        plagiarism_score: data.plagiarism_score,
        grammar: data.grammar,
        spelling: data.spelling,
        punctuation: data.punctuation,
        readability: data.readability,
        word_choice: data.word_choice,
        ai_detection: data.ai_detection,
        sources: data.sources || [],
        metrics: data.metrics ?? null,
      });
      setScanned(true);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Request failed. Is the backend running?";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const trySample = () => {
    setText(SAMPLE_TEXT);
    clearFile();
    setError("");
    firstTextAt.current = Date.now();
  };

  const scoreColor = (score) => {
    if (score == null) return "text-gray-500";
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-amber-600";
    return "text-emerald-600";
  };

  const showUpload = !scanned;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Check originality in seconds</h1>
        <p className="mt-2 text-gray-600">
          Semantic match + live web sources (SerpAPI) — AI labels use similarity % and paste size.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:shadow-xl">
          <label className="mb-2 block text-sm font-medium text-gray-700">Your text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your essay, article, or assignment here..."
            rows={14}
            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-900 shadow-inner outline-none ring-0 transition duration-200 focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/30"
          />

          {showUpload && (
            <UploadComponent fileName={fileName} onFileChange={onFileChange} onClearFile={clearFile} onClearText={clearText} />
          )}

          {scanned && (
            <p className="mt-3 text-xs text-gray-500">File upload hidden after scan. Clear the text to upload again.</p>
          )}

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">{error}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={scan}
              disabled={loading || !canScan}
              className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-green-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading ? "Scanning…" : "Scan for plagiarism"}
            </button>
            <button
              type="button"
              onClick={trySample}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-sm transition duration-200 hover:border-gray-400 hover:bg-gray-50"
            >
              Try sample text
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900">Plagiarism Checker Results</h2>
          <p className="mt-1 text-sm text-gray-500">Web sources via SerpAPI + semantic similarity (MiniLM).</p>

          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-5 ring-1 ring-gray-100 transition hover:ring-emerald-100">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Plagiarism</p>
              <p className={`mt-1 text-4xl font-bold tabular-nums ${scoreColor(result.plagiarism_score)}`}>
                {result.plagiarism_score != null ? `${result.plagiarism_score}%` : "—"}
              </p>
            </div>

            {result.metrics && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-gray-800 transition hover:bg-emerald-50/70">
                <p className="font-medium text-gray-700">Behavior (sent with request)</p>
                <p className="mt-1">
                  Typing speed: <span className="font-semibold">{result.metrics.typing_speed}</span> words/sec
                </p>
                <p>
                  Paste size: <span className="font-semibold">{result.metrics.paste_size}</span> words
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Grammar", result.grammar],
                ["Spelling", result.spelling],
                ["Punctuation", result.punctuation],
                ["Readability", result.readability],
                ["Word Choice", result.word_choice],
                ["AI Detection", result.ai_detection],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 transition duration-200 hover:border-emerald-100 hover:bg-emerald-50/30"
                >
                  <p className="text-xs font-medium text-gray-500">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:border-emerald-100">
              <h3 className="text-sm font-semibold text-gray-900">Matched Sources</h3>
              <div className="mt-3 space-y-4">
                {result.sources.length === 0 && (
                  <p className="text-sm text-gray-500">Run a scan to load live web matches (SerpAPI).</p>
                )}
                {result.sources.map((s, i) => (
                  <div key={`${s.url}-${i}`} className="rounded-lg border border-gray-100 bg-white/90 p-3 transition hover:shadow-sm">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#16a34a] hover:underline">
                      {s.title}
                    </a>
                    <p className="mt-1 break-all text-xs text-gray-600">{s.url}</p>
                    <span className="mt-2 inline-block text-sm font-medium text-gray-800">
                      {typeof s.similarity === "number" ? `${s.similarity}%` : s.similarity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
