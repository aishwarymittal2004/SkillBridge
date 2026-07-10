import { useState, useEffect } from "react";
import { uploadResume } from "../services/resumeService";
import { getUserId } from "../utils/auth";
import toast from "react-hot-toast";
import LoadingOverlay from "../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";
import { getResumeHistory } from "../services/historyService";
import { getUserName } from "../utils/auth";
// import { Link } from "react-router-dom";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const [latestResume, setLatestResume] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    bestScore: 0,
    avgScore: 0,
  });

  const userName = getUserName() || "User";

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const handleUpload = async () => {
    if (!file || !targetRole) {
      toast.error("Please select a resume and enter a target role.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_role", targetRole);
    formData.append("user_id", getUserId());

    setLoading(true);

    try {
      const res = await uploadResume(formData);

      // Let the loading animation play
      await new Promise((resolve) => setTimeout(resolve, 2500));

      toast.success("Resume analyzed successfully 🚀");

      navigate(`/resume/${res.resume_id}/report`);
      loadStats();
    } catch (err) {
      console.log(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const loadLatestResume = async () => {
      try {
        const history = await getResumeHistory(getUserId());

        if (history.length > 0) {
          setLatestResume(history[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadLatestResume();
  }, []);

  const loadStats = async () => {
    try {
      const history = await getResumeHistory(getUserId());

      const total = history.length;

      const scores = history.map((r) => r.analysis?.ats_score || 0);

      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

      const avgScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;

      setStats({
        total,
        bestScore,
        avgScore,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}

      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-5xl">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-700 bg-lime-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-700 mb-3">
                {greeting}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-700 tracking-tight">
                Hey {userName} 👋
              </h1>
              <p className="mt-2 text-ink-500/70 text-[15px] leading-relaxed max-w-2xl">
                Ready to improve your ATS score today? Upload your resume to
                receive an AI-powered ATS analysis, personalized learning
                roadmap, skill gap detection, and curated learning resources.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700 text-sm font-black">
                S
              </span>
              <span className="text-lg font-extrabold tracking-tight text-ink-700">
                SkillBridge
              </span>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <StatCard title="Resumes Analyzed" value={stats.total} variant="outline" />
            <StatCard title="Best ATS Score" value={`${stats.bestScore}%`} variant="dark" />
            <StatCard title="Average ATS Score" value={`${stats.avgScore}%`} variant="lime" />
          </div>

          {/* LATEST RESUME */}
          {latestResume && (
            <div className="mb-8 rounded-2xl border-2 border-ink-700 bg-cream-50 shadow-hard p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500/60">
                    Latest Resume
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-ink-700">
                    {latestResume.file_name}
                  </h2>

                  <p className="mt-1 text-sm text-ink-500/70">
                    {latestResume.target_role}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/resume/${latestResume.resume_id}/report`)
                  }
                  className="btn-hard bg-lime-400 text-ink-700 px-5 py-2.5 text-sm hover:bg-lime-300"
                >
                  View Report
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-6 border-t-2 border-ink-700/10 pt-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500/60">
                    ATS Score
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-ink-700">
                    {latestResume.analysis?.ats_score}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500/60">
                    Uploaded
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink-700">
                    {new Date(latestResume.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* UPLOAD CARD */}
          <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 shadow-hard p-6 sm:p-7">
            <h2 className="text-lg font-extrabold text-ink-700 mb-5">
              Analyze a new resume
            </h2>

            {/* ROLE INPUT */}
            <div className="mb-5">
              <label
                htmlFor="targetRole"
                className="block text-sm font-bold text-ink-700 mb-1.5"
              >
                Target role
              </label>
              <input
                id="targetRole"
                type="text"
                placeholder="e.g. Python Backend Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border-2 border-ink-700 bg-white px-3.5 py-2.5 text-[15px]
                text-ink-700 placeholder:text-ink-500/40
                transition-base
                focus:ring-4 focus:ring-lime-400/50 focus:outline-none
                disabled:bg-cream-100 disabled:text-ink-500/40 disabled:cursor-not-allowed"
              />
            </div>

            {/* DROP ZONE */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-ink-700 mb-1.5">
                Resume
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`transition-base rounded-xl border-2 border-dashed px-6 py-8 text-center
                ${
                  dragActive
                    ? "border-ink-700 bg-lime-100"
                    : file
                      ? "border-ink-700 bg-lime-100/60"
                      : "border-ink-700/30 bg-cream-100 hover:border-ink-700/60"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <p className="text-sm font-bold text-ink-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-ink-500/60">
                      Click below to choose a different file
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-700 bg-white text-ink-700">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                      </svg>
                    </span>
                    <p className="text-sm text-ink-700">
                      <span className="font-bold">Drag & drop</span> your
                      resume, or choose a file below
                    </p>
                    <p className="text-xs text-ink-500/50">PDF, DOC, or DOCX</p>
                  </div>
                )}

                <label
                  htmlFor="resumeFile"
                  className={`btn-hard mt-4 bg-white text-ink-700 px-4 py-2 text-sm cursor-pointer
                  ${loading ? "pointer-events-none opacity-50" : ""}`}
                >
                  Choose file
                </label>
                <input
                  id="resumeFile"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  disabled={loading}
                  className="sr-only"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleUpload}
              disabled={loading}
              aria-busy={loading}
              className="btn-hard w-full bg-lime-400 text-ink-700 px-4 py-3 text-[15px]
              hover:bg-lime-300
              disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-ink-700"
                    viewBox="0 0 24 24"
                    fill="none"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Analyzing resume...
                </>
              ) : (
                "Analyze resume →"
              )}
            </button>

            {loading && (
              <p className="mt-3 text-center text-xs text-ink-500/60">
                Extracting skills · Matching ATS · Generating roadmap
              </p>
            )}
          </div>

          {/* FOOTER TIP */}
          <p className="mt-5 text-center text-xs text-ink-500/50">
            💡 Tip: Use a clean resume with proper headings for a better ATS
            score
          </p>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, variant = "outline" }) {
  const styles = {
    outline: "bg-cream-50 text-ink-700 border-ink-700",
    dark: "bg-ink-700 text-lime-400 border-ink-700",
    lime: "bg-lime-400 text-ink-700 border-ink-700",
  };

  return (
    <div
      className={`rounded-2xl border-2 shadow-hard p-5 transition-base
        hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg ${styles[variant]}`}
    >
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">
        {title}
      </p>
      <h2 className="mt-2 text-3xl font-extrabold">{value}</h2>
    </div>
  );
}