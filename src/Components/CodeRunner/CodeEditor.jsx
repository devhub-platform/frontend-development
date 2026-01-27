import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";

const LANGUAGE_EXTENSIONS = {
  javascript: javascript({ jsx: true }),
  java: java(),
  "c++": cpp(),
};

export function CodeEditor({ language, value, onChange }) {
  const extensions =
    LANGUAGE_EXTENSIONS[language] || LANGUAGE_EXTENSIONS.javascript;

  return (
    <div className="h-full">
      <CodeMirror
        value={value}
        height="100%"
        theme="dark"
        extensions={[extensions]}
        onChange={(val) => onChange(val)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: false,
        }}
        className="h-full text-sm rounded-none"
      />
    </div>
  );
}
