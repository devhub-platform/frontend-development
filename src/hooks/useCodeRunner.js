import { useEffect, useState } from "react";
import { getRuntimes, runCode } from "../services/codeRunnerApi";

export function useCodeRunner() {
  const [runtimes, setRuntimes] = useState([]);
  const [loadingRuntimes, setLoadingRuntimes] = useState(true);
  const [selectedRuntime, setSelectedRuntime] = useState(null);

  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoadingRuntimes(true);
        const list = await getRuntimes();
        const uniqueList = list.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.language === item.language),
        );
        setRuntimes(uniqueList);
        if (uniqueList.length > 0) setSelectedRuntime(uniqueList[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRuntimes(false);
      }
    }
    load();
  }, []);

  const handleRun = async () => {
    if (!selectedRuntime || !code.trim()) return;

    setIsRunning(true);
    setOutput("");
    setError("");

    try {
      const res = await runCode({
        language: selectedRuntime.language,
        version: selectedRuntime.version,
        code,
        stdin,
      });

      // بناءً على صورة الـ API: النتيجة موجودة داخل res.output
      const execution = res.output || res.run || res;

      let finalOutput = "";
      let finalError = "";

      if (execution && typeof execution === "object") {
        // استخراج stdout و stderr من كائن الـ output القادم من الـ API
        finalOutput = execution.stdout !== undefined ? execution.stdout : "";
        finalError = execution.stderr !== undefined ? execution.stderr : "";
      } else {
        finalOutput = execution || "";
      }

      // تحويل القيم لنصوص قبل استخدام trim() لتجنب خطأ "is not a function"
      const cleanOutput = String(finalOutput).trim();
      const cleanError = String(finalError).trim();

      if (cleanError !== "") {
        setError(cleanError);
      }

      if (cleanOutput !== "") {
        setOutput(cleanOutput);
      } else if (cleanError === "") {
        setOutput("Success (No Output)");
      }
    } catch (e) {
      setError(e.message || "Something went wrong!");
    } finally {
      setIsRunning(false);
    }
  };

  return {
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
  };
}
