import React, { useState } from "react";
import CodeBlock from "./CodeBlock";
import CodeEditor from "./CodeEditor";

const tabs = ["Description", "Approach", "Code", "My Solution"];
const OPENAI_API_KEY = 'your-api-key-here'; // Replace with your actual API key

export default function ProblemDetails({ problem }) {
  const [activeTab, setActiveTab] = useState("Description");
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  if (!problem) return <div className="p-4">Select a problem to view details.</div>;

  const checkSolution = async () => {
    setIsChecking(true);
    setFeedback("");

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful programming mentor that reviews code solutions."
            },
            {
              role: "user",
              content: `Please review this solution for the following problem:
                Problem: ${problem.name}
                Description: ${problem.description}
                Expected Solution: ${problem.code}
                User's Solution: ${userCode}
                
                Compare the solutions and provide:
                1. Is the solution correct?
                2. Detailed explanation of any issues found
                3. Suggestions for improvement
                4. Time and space complexity analysis`
            }
          ]
        })
      });

      const data = await response.json();
      setFeedback(data.choices[0].message.content);
    } catch (error) {
      setFeedback("Error checking solution: " + error.message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold mb-2">{problem.name}</h1>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-t ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-white p-4 overflow-y-auto">
        {activeTab === "Description" && <div className="whitespace-pre-wrap">{problem.description}</div>}
        {activeTab === "Approach" && <div className="whitespace-pre-wrap">{problem.approach}</div>}
        {activeTab === "Code" && <CodeBlock code={problem.code} />}
        {activeTab === "My Solution" && (
          <div className="flex flex-col gap-4">
            <CodeEditor
              value={userCode}
              onChange={setUserCode}
              language="javascript"
            />
            <div className="flex gap-4 items-center">
              <button
                onClick={checkSolution}
                disabled={isChecking}
                className={`px-6 py-3 rounded ${
                  isChecking ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white font-semibold`}
              >
                {isChecking ? "Checking..." : "Check Solution"}
              </button>
              {isChecking && (
                <span className="text-gray-600">
                  Analyzing your solution...
                </span>
              )}
            </div>
            {feedback && (
              <div className="mt-4 p-6 border rounded-lg bg-gray-50 whitespace-pre-wrap">
                <h3 className="text-lg font-bold mb-3">AI Feedback:</h3>
                <div className="prose max-w-none">
                  {feedback}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 