/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { useCodeRunner } from "../../hooks/useCodeRunner";
import {
  Play,
  FolderOpen,
  Download,
  RotateCcw,
  Copy,
  Maximize2,
  Minimize2,
  Trash2,
  Code2,
  Terminal,
  Cpu,
} from "lucide-react";
import { CodeEditor } from "../../Components/CodeRunner/CodeEditor";

const INITIAL_SNIPPETS = {
  javascript: `// DevHub JS Environment\nconsole.log("Welcome to DevHub!");`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Welcome to DevHub!");\n  }\n}`,
  "c++": `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to DevHub!" << endl;\n    return 0;\n}`,
  python: `print("Welcome to DevHub!")`,
};

export default function CodePlaygroundPage() {
  const {
    runtimes,
    loadingRuntimes,
    selectedRuntime,
    setSelectedRuntime,
    code,
    setCode,
    stdin,
    setStdin,
    output,
    error,
    isRunning,
    handleRun,
    setOutput,
    setError,
  } = useCodeRunner();

  const fileInputRef = useRef(null);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  const currentLang = selectedRuntime?.language?.toLowerCase() || "javascript";
  const tabLabel =
    currentLang === "java"
      ? "Main.java"
      : `main.${currentLang === "javascript" ? "js" : currentLang}`;

  useEffect(() => {
    const snippet =
      INITIAL_SNIPPETS[currentLang] || `// Welcome to DevHub! (${currentLang})`;
    setCode(snippet);
  }, [currentLang]);

  const handleOpenFromDisk = () => fileInputRef.current?.click();
  const handleSaveToDisk = () => {
    const blob = new Blob([code || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tabLabel;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleResetCode = () =>
    setCode(INITIAL_SNIPPETS[currentLang] || INITIAL_SNIPPETS.javascript);
  const handleCopyCode = () => navigator.clipboard.writeText(code);
  const handleClearOutput = () => {
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#020617] px-3 py-4 sm:px-4 lg:px-8 lg:py-8 transition-all duration-500">
      <div className="max-w-6xl xl:max-w-7xl mx-auto flex flex-col h-full gap-4 sm:gap-6">
        {/* Header - Toolbar (Matches image top bar) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white/90 dark:bg-[#111827] px-4 py-4 rounded-2xl border border-white/20 dark:border-gray-800 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white dark:bg-[#1f2937] px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner">
              <Cpu className="w-5 h-5 text-blue-500" />
              <select
                className="bg-transparent text-sm font-bold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                value={selectedRuntime?.language || ""}
                onChange={(e) =>
                  setSelectedRuntime(
                    runtimes.find((r) => r.language === e.target.value),
                  )
                }
              >
                {loadingRuntimes ? (
                  <option>Loading...</option>
                ) : (
                  runtimes.map((rt) => (
                    <option
                      key={rt.language}
                      value={rt.language}
                      className="dark:bg-[#111827]"
                    >
                      {rt.language.toUpperCase()}{" "}
                      {rt.version ? ` (${rt.version})` : ""}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="hidden sm:block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Environment Ready
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className={`flex items-center justify-center gap-3 px-8 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              isRunning || !code.trim()
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400"
                : "bg-primary text-white shadow-lg shadow-blue-500/20"
            }`}
          >
            <Play
              className={`w-5 h-5 ${isRunning ? "animate-spin" : "fill-current"}`}
            />
            <span>{isRunning ? "Executing..." : "Run Code"}</span>
          </button>
        </div>

        {/* Main Workspace */}
        <div
          className={`grid flex-1 gap-6 transition-all duration-500 ${isEditorExpanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]"}`}
        >
          {/* Editor Container (Matches Left Box in images) */}
          <div className="flex flex-col bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden min-h-125">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50/60 dark:bg-[#1f2937]/50 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 mr-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#0f172a] rounded-lg border dark:border-gray-700 shadow-sm">
                  <Code2 className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                    {tabLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
              >
                {isEditorExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex flex-1 relative bg-[#0f172a]">
              <div className="hidden sm:flex w-14 flex-col items-center py-6 gap-6 border-r dark:border-gray-800  bg-white dark:bg-[#111827]">
                <SideButton
                  icon={<FolderOpen />}
                  onClick={handleOpenFromDisk}
                  title="Open"
                />
                <SideButton
                  icon={<Download />}
                  onClick={handleSaveToDisk}
                  title="Save"
                />
                <SideButton
                  icon={<Copy />}
                  onClick={handleCopyCode}
                  title="Copy"
                />
                <div className="mt-auto">
                  <SideButton
                    icon={<RotateCcw />}
                    onClick={handleResetCode}
                    title="Reset"
                    variant="danger"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  language={currentLang}
                  value={code}
                  onChange={setCode}
                />
              </div>
            </div>

            {/* Input Bar (Matches Bottom Input in images) */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800 flex gap-4 items-center">
              <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 tracking-tighter">
                INPUT:
              </span>
              <input
                type="text"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Type input here..."
                className="flex-1 text-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Console Container (Matches Right Box in images) */}
          {!isEditorExpanded && (
            <div className="flex flex-col bg-white dark:bg-[#0b0f1a] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden min-h-75">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-blue-100/60">
                    Console Output
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClearOutput}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 font-mono text-sm overflow-auto bg-white dark:bg-[#0b0f1a] text-gray-800 dark:text-blue-50/90 leading-relaxed custom-scrollbar">
                {error ? (
                  <div className="text-red-400 bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                    <div className="text-[10px] font-bold uppercase mb-2 opacity-50">
                      Runtime Error
                    </div>
                    <pre className="whitespace-pre-wrap">{error}</pre>
                  </div>
                ) : output ? (
                  <div className="animate-in fade-in duration-300">
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 opacity-30">
                    <Play className="w-16 h-16 mb-4 stroke-[1px]" />
                    <p className="text-sm font-medium">
                      Click "Run Code" to see execution
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setCode(ev.target?.result || "");
            reader.readAsText(file);
          }
        }}
      />
    </div>
  );
}

function SideButton({ icon, onClick, title, variant = "default" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-3 rounded-xl transition-all duration-200 active:scale-90 ${
        variant === "danger"
          ? "text-gray-500 hover:text-red-500 hover:bg-red-500/10"
          : "text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
      }`}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </button>
  );
}
