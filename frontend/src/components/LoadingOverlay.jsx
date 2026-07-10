import { useEffect, useState } from "react";

const STEPS = [
  "Extracting resume content...",
  "Matching ATS keywords...",
  "Identifying missing skills...",
  "Analyzing strengths & weaknesses...",
  "Generating project recommendations...",
  "Building your learning roadmap...",
  "Preparing your report..."
];

export default function LoadingOverlay() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < STEPS.length - 1 ? prev + 1 : prev
      );
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-700/70 backdrop-blur-sm px-4">

      <div className="w-full max-w-lg rounded-2xl border-2 border-ink-700 bg-cream-50 p-8 shadow-hard-lg">

        {/* Spinner */}

        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full border-4 border-ink-700/15 border-t-lime-500 animate-spin"></div>
        </div>

        {/* Heading */}

        <h2 className="mt-6 text-center text-2xl font-extrabold text-ink-700">
          AI Resume Analysis
        </h2>

        <p className="mt-2 text-center text-ink-500/70">
          Our AI is reviewing your resume against the target role.
        </p>

        {/* Progress */}

        <div className="mt-8 space-y-3">

          {STEPS.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 transition-all duration-500 ${
                index <= currentStep ? "opacity-100" : "opacity-30"
              }`}
            >
              {index < currentStep ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700 text-xs font-bold">
                  ✓
                </div>
              ) : index === currentStep ? (
                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-ink-700 bg-lime-400 animate-pulse"></div>
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-ink-700/20"></div>
              )}

              <span className="text-sm font-medium text-ink-700">
                {step}
              </span>
            </div>
          ))}

        </div>

        {/* Progress Bar */}

        <div className="mt-8 h-2.5 overflow-hidden rounded-full border-2 border-ink-700 bg-cream-100">

          <div
            className="h-full bg-lime-400 transition-all duration-700"
            style={{
              width: `${((currentStep + 1) / STEPS.length) * 100}%`,
            }}
          />

        </div>

      </div>
    </div>
  );
}