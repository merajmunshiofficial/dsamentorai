import React from 'react';
import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange, language = "javascript" }) {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="h-[400px] border rounded">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
        }}
      />
    </div>
  );
}
