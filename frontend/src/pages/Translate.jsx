import { useState } from "react";
import axios from "axios";

function Translate() {
  const [source, setSource] = useState("english");
  const [target, setTarget] = useState("french");
  const [context, setContext] = useState("ecommerce");
  const [inputTexts, setInputTexts] = useState("");
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false); // ← loader state

  const onRequestTranslation = async () => {
    const texts = inputTexts
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (!texts.length) return;

    setLoading(true); // ← show loader

    try {
      const res = await axios.post(
        "http://localhost:3000/translate",
        {
          texts,
          source_lang: source,
          target_lang: target,
          context,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setTranslations(res.data?.translations || []);
    } catch (err) {
      console.error(err);
      alert("Translation failed.");
    } finally {
      setLoading(false); // ← hide loader
    }
  };

  const downloadResults = (format = "txt") => {
    if (!translations.length) return;

    const cleaned = translations.map(
      (t, i) => `Text ${i + 1}: ${t.replace(/^.*?:/, "").trim()}`
    );
    let blob;

    if (format === "csv") {
      const csv = cleaned.map((t, i) => `"${i + 1}","${t}"`).join("\n");
      blob = new Blob([`Index,Translation\n${csv}`], { type: "text/csv" });
    } else {
      blob = new Blob([cleaned.join("\n")], { type: "text/plain" });
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `translations.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!translations.length) return;

    const content = translations
      .map((t, i) => `Text ${i + 1}: ${t.replace(/^.*?:/, "").trim()}`)
      .join("\n");

    navigator.clipboard
      .writeText(content)
      .then(() => alert("Translations copied to clipboard!"))
      .catch((err) => alert("Failed to copy: " + err));
  };

  return (
    <div className="relative min-h-screen p-6 bg-gray-100">
      {/* Main UI */}
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Domain-Specific Translation
        </h1>

        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 font-medium">Context</label>
            <select
              className="w-full p-2 border rounded"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            >
              <option value="ecommerce">Ecommerce</option>
              <option value="legal">Legal</option>
              <option value="medical">Medical</option>
              <option value="technical">Technical</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Source Language</label>
            <select
              className="w-full p-2 border rounded"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="english">English</option>
              <option value="german">German</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="italian">Italian</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Target Language</label>
            <select
              className="w-full p-2 border rounded"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="english">English</option>
              <option value="german">German</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="italian">Italian</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Texts to Translate (one per line)
          </label>
          <textarea
            rows={10}
            className="w-full p-2 border rounded"
            value={inputTexts}
            onChange={(e) => setInputTexts(e.target.value)}
            placeholder="Enter one sentence per line..."
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={onRequestTranslation}
          >
            Request Translation
          </button>
          <button
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            onClick={() => downloadResults("txt")}
          >
            Download .txt
          </button>
          <button
            className="px-4 py-2 text-white bg-teal-600 rounded hover:bg-teal-700"
            onClick={() => downloadResults("csv")}
          >
            Download .csv
          </button>
          <button
            className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
            onClick={copyToClipboard}
          >
            Copy All
          </button>
        </div>

        {translations.length > 0 && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Results:</h2>
            {translations.map((t, index) => (
              <div key={index} className="p-4 mb-2 border rounded bg-gray-50">
                <p>
                  <strong>Text {index + 1}:</strong>{" "}
                  {t.replace(/^.*?:/, "").trim()}
                </p>
                <label className="block mt-2 text-sm font-medium">
                  Was this translation correct?
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <select className="p-1 border rounded">
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                  </select>
                  <button className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600">
                    Submit Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex items-center gap-4 px-6 py-4 bg-white rounded shadow-lg">
            <svg
              className="w-6 h-6 text-blue-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="font-medium text-blue-600">
              Translating, please wait...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Translate;
