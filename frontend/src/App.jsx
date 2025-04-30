import { useState } from "react";

function App() {
  const [source, setSource] = useState("English");
  const [target, setTarget] = useState("French");
  const [context, setContext] = useState("Ecommerce");
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
      const response = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts,
          source_lang: source,
          target_lang: target,
          context,
        }),
      });

      const data = await response.json();
      setTranslations(data?.translations || []);
    } catch (err) {
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
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Main UI */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Domain-Specific Translation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium">Context</label>
            <select
              className="w-full p-2 border rounded"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            >
              <option value="Ecommerce">Ecommerce</option>
              <option value="Legal">Legal</option>
              <option value="Medical">Medical</option>
              <option value="Technical">Technical</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Source Language</label>
            <select
              className="w-full p-2 border rounded"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="English">English</option>
              <option value="German">German</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="Italian">Italian</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Target Language</label>
            <select
              className="w-full p-2 border rounded"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="English">English</option>
              <option value="German">German</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="Italian">Italian</option>
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onRequestTranslation}
          >
            Request Translation
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => downloadResults("txt")}
          >
            Download .txt
          </button>
          <button
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            onClick={() => downloadResults("csv")}
          >
            Download .csv
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={copyToClipboard}
          >
            Copy All
          </button>
        </div>

        {translations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Results:</h2>
            {translations.map((t, index) => (
              <div key={index} className="bg-gray-50 p-4 border rounded mb-2">
                <p>
                  <strong>Text {index + 1}:</strong>{" "}
                  {t.replace(/^.*?:/, "").trim()}
                </p>
                <label className="block mt-2 text-sm font-medium">
                  Was this translation correct?
                </label>
                <div className="flex gap-2 items-center mt-1">
                  <select className="border p-1 rounded">
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                  </select>
                  <button className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    Submit Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow-lg flex items-center gap-4">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
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
            <p className="text-blue-600 font-medium">
              Translating, please wait...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
