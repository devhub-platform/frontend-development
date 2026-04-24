// src/hooks/useCodeRunner.js
import { useEffect, useMemo, useState } from "react";
import {
  fetchCodeRuntimes,
  fetchCodeLanguages,
  searchRuntimes,
  executeCode,
} from "../services/codeRunnerApi";

export function useCodeRunner() {
  const [languages, setLanguages] = useState([]); // from /code/languages
  const [runtimes, setRuntimes] = useState([]); // from /code/runtimes
  const [loadingRuntimes, setLoadingRuntimes] = useState(true);
  const [selectedRuntime, setSelectedRuntime] = useState(null);

  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load languages + runtimes at mount
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoadingRuntimes(true);

        const [langs, rts] = await Promise.all([
          fetchCodeLanguages(),
          fetchCodeRuntimes(),
        ]);

        if (cancelled) return;

        setLanguages(langs || []);
        setRuntimes(rts || []);

        // اختار default runtime بشكل عاقل:
        // لو عندنا JS استخدمه، لو لأ Python، لو لأ أول واحد
        const preferredOrder = ["javascript", "python", "java"];
        let defaultRt = null;

        for (const lang of preferredOrder) {
          const found = rts.find((rt) => rt.language.toLowerCase() === lang);
          if (found) {
            defaultRt = found;
            break;
          }
        }

        if (!defaultRt && rts.length > 0) {
          defaultRt = rts[0];
        }

        setSelectedRuntime(defaultRt || null);
      } catch (err) {
        console.error("Failed to load runtimes/languages", err);
      } finally {
        if (!cancelled) setLoadingRuntimes(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Search helper using /code/search-runtimes
  const handleSearchRuntime = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) return;

    try {
      const res = await searchRuntimes(term.trim());
      const first = res.data?.[0];
      if (first) {
        // لو لقينا runtime مشابه، نخليه selectedRuntime
        setSelectedRuntime(first);
      }
    } catch (err) {
      console.error("Failed to search runtimes", err);
    }
  };

  const currentLanguage = useMemo(
    () => selectedRuntime?.language?.toLowerCase() || "",
    [selectedRuntime],
  );

  // Run code using executeCode
  const handleRun = async () => {
    if (!selectedRuntime || !code.trim()) return;

    setIsRunning(true);
    setOutput("");
    setError("");

    try {
      const res = await executeCode({
        language: selectedRuntime.language,
        version: selectedRuntime.version,
        code,
        stdin,
      });

      const run = res.run || {};

      // back بيبعت:
      // stdout, stderr, output, code, memory, cpu_time, wall_time...
      if (run.stderr) {
        setError(run.stderr || "Execution error");
      }

      // نعرض stdout أو output لو مفيش stderr
      const finalOutput =
        run.stdout ||
        run.output ||
        (!run.stderr ? "Program finished with no output." : "");

      setOutput(finalOutput);
    } catch (err) {
      console.error("Execute error", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to execute code. Please try again.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  return {
    // data
    languages,
    runtimes,
    loadingRuntimes,
    selectedRuntime,
    currentLanguage,
    code,
    stdin,
    output,
    error,
    isRunning,
    searchTerm,

    // setters
    setSelectedRuntime,
    setCode,
    setStdin,
    setOutput,
    setError,

    // actions
    handleRun,
    handleSearchRuntime,
  };
}
