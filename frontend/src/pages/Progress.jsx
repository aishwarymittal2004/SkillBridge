import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumeHistory } from "../services/historyService";
import { getProgress } from "../services/progressService";
import { getUserId } from "../utils/auth";

function StatCard({ title, value, subtitle, variant = "outline" }) {
  const styles = {
    outline: "bg-cream-50 text-ink-700 border-ink-700",
    dark: "bg-ink-700 text-lime-400 border-ink-700",
  };
  return (
    <div className={`rounded-2xl border-2 shadow-hard p-5 transition-base hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg ${styles[variant]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">{title}</p>
      <h2 className="text-4xl font-extrabold mt-3">{value}</h2>
      {subtitle && <p className="text-sm opacity-60 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function Progress() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = getUserId();

        const historyData = await getResumeHistory(userId);

        setHistory(historyData);

        if (historyData.length > 0) {
          const latest = historyData[0];

          const progressData = await getProgress(latest.resume_id);

          setProgress(progressData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const completedSkills = useMemo(() => {
    return Object.values(progress.skills || {}).filter(Boolean).length;
  }, [progress]);

  const totalSkills = useMemo(() => {
    return Object.keys(progress.skills || {}).length;
  }, [progress]);

  const completedRoadmap = useMemo(() => {
    return Object.values(progress.roadmap || {}).filter(Boolean).length;
  }, [progress]);

  const totalRoadmap = useMemo(() => {
    return Object.keys(progress.roadmap || {}).length;
  }, [progress]);

  const latestATS = history[0]?.analysis?.ats_score || 0;
  const atsHistory = [...history]
    .reverse()
    .map((resume) => resume.analysis?.ats_score || 0);

  const nextRoadmapTask = useMemo(() => {
    const roadmap = progress.roadmap || {};

    const nextEntry = Object.entries(roadmap).find(
      ([, completed]) => !completed,
    );

    return nextEntry ? nextEntry[0] : null;
  }, [progress]);

  const targetRole = history[0]?.target_role || "Software Engineer";

  const pointsNeeded = Math.max(80 - latestATS, 0);
  const analysis = history[0]?.analysis || {};

  const topWeakness = analysis.weaknesses?.[0] || "Keep improving your resume.";

  const topSkill = analysis.missing_skills?.[0] || "Continue learning.";

  const topStrength = analysis.strengths?.[0] || "Great progress!";

  const overallProgress =
    totalSkills + totalRoadmap === 0
      ? 0
      : Math.round(
          ((completedSkills + completedRoadmap) /
            (totalSkills + totalRoadmap)) *
            100,
        );

  const atsTone = latestATS > 70 ? "success" : latestATS > 40 ? "warning" : "danger";
  const atsToneStyles = {
    success: "bg-success-100 text-success-500",
    warning: "bg-warning-100 text-warning-500",
    danger: "bg-danger-100 text-danger-500",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center h-[70vh]">
        <p className="text-ink-500/70 font-semibold">Loading Progress...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}

        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-700 bg-lime-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-700 mb-3">
            Your journey
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-700">
            Learning Progress
          </h1>

          <p className="text-ink-500/70 mt-2">
            Track your growth and stay consistent.
          </p>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard title="Overall Progress" value={`${overallProgress}%`} variant="dark" />
          <StatCard
            title="Completed Skills"
            value={completedSkills}
            subtitle={`out of ${totalSkills}`}
          />
          <StatCard
            title="Roadmap Progress"
            value={completedRoadmap}
            subtitle={`out of ${totalRoadmap}`}
          />
          <StatCard title="Latest ATS Score" value={latestATS} />
        </div>

        {/* Today's Focus */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Focus Card */}

          <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 p-7 shadow-hard">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-full border-2 border-ink-700 bg-lime-400 flex items-center justify-center text-2xl">
                🎯
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-ink-700">Today's Focus</h2>

                <p className="text-sm text-ink-500/70">
                  Continue your learning journey
                </p>
              </div>
            </div>

            {nextRoadmapTask ? (
              <>
                <div className="rounded-xl bg-cream-100 border-2 border-ink-700/15 p-5">
                  <p className="text-sm text-ink-500/70 mb-2">Next Milestone</p>

                  <h3 className="font-bold text-ink-700 text-lg">
                    {nextRoadmapTask}
                  </h3>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm font-semibold text-ink-700 mb-2">
                    <span>Roadmap Progress</span>

                    <span>
                      {completedRoadmap}/{totalRoadmap}
                    </span>
                  </div>

                  <div className="h-3 rounded-full border-2 border-ink-700 bg-cream-100 overflow-hidden">
                    <div
                      className="h-full bg-lime-400 transition-all duration-700"
                      style={{
                        width: `${(completedRoadmap / totalRoadmap) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-lime-100 border-2 border-ink-700 p-5">
                <h3 className="font-bold text-ink-700">🎉 Amazing!</h3>

                <p className="text-sm text-ink-700/70 mt-2">
                  You have completed every roadmap task.
                </p>
              </div>
            )}
          </div>

          {/* Goal Card */}

          <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 p-7 shadow-hard">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full border-2 border-ink-700 bg-lime-400 flex items-center justify-center text-2xl">
                🚀
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-ink-700">Career Goal</h2>

                <p className="text-sm text-ink-500/70">Your target role</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-ink-500/70">Target Role</span>

                <span className="font-bold text-ink-700">{targetRole}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-ink-500/70">Current ATS</span>

                <span className="font-bold text-ink-700">{latestATS}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-ink-500/70">Target ATS</span>

                <span className="font-bold text-ink-700">80</span>
              </div>

              <div className="flex justify-between">
                <span className="text-ink-500/70">Points Needed</span>

                <span className="font-bold text-danger-500">{pointsNeeded}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Progress Overview */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Skills */}

          <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 p-6 shadow-hard">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-ink-700">
                Skills Mastered
              </h2>

              <span className="text-sm font-semibold text-ink-500/70">
                {completedSkills}/{totalSkills}
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(progress.skills || {}).map(([skill, done]) => (
                <div key={skill}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-ink-700">{skill}</span>

                    <span
                      className={`text-xs font-bold ${
                        done ? "text-success-500" : "text-ink-500/40"
                      }`}
                    >
                      {done ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <div className="h-2 rounded-full border border-ink-700/15 bg-cream-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        done ? "bg-lime-400 w-full" : "bg-ink-700/10 w-0"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap */}

          <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 p-6 shadow-hard">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-ink-700">
                Learning Roadmap
              </h2>

              <span className="text-sm font-semibold text-ink-500/70">
                {completedRoadmap}/{totalRoadmap}
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(progress.roadmap || {}).map(([step, done]) => (
                <div key={step} className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink-700 text-xs font-bold ${
                      done ? "bg-lime-400 text-ink-700" : "bg-cream-100 text-transparent"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </div>

                  <div>
                    <p
                      className={`text-sm ${
                        done ? "text-ink-700 font-semibold" : "text-ink-500/50"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Coach */}

        <div className="mt-8 rounded-2xl border-2 border-ink-700 bg-ink-700 p-7 shadow-hard">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-full border-2 border-lime-400 bg-lime-400 text-ink-700 flex items-center justify-center text-xl">
              🤖
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-cream-50">AI Career Coach</h2>

              <p className="text-cream-50/60 text-sm">
                Personalized recommendations from your latest resume analysis
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-cream-50 p-5 border-2 border-cream-50">
              <p className="text-xs uppercase tracking-wide font-bold text-ink-500/60">
                Biggest Strength
              </p>

              <p className="mt-3 font-semibold text-ink-700">✅ {topStrength}</p>
            </div>

            <div className="rounded-xl bg-cream-50 p-5 border-2 border-cream-50">
              <p className="text-xs uppercase tracking-wide font-bold text-ink-500/60">
                Improve Next
              </p>

              <p className="mt-3 font-semibold text-ink-700">📈 {topWeakness}</p>
            </div>

            <div className="rounded-xl bg-cream-50 p-5 border-2 border-cream-50">
              <p className="text-xs uppercase tracking-wide font-bold text-ink-500/60">
                Learn First
              </p>

              <p className="mt-3 font-semibold text-ink-700">🎯 {topSkill}</p>
            </div>
          </div>
        </div>

        {/* Achievements */}

        <div className="mt-8">
          <h2 className="text-xl font-extrabold text-ink-700 mb-5">
            Achievements
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                unlocked: history.length >= 1,
                emoji: "📄",
                title: "First Resume",
                desc: "Upload your first resume.",
              },
              {
                unlocked: completedSkills >= 5,
                emoji: "💻",
                title: "Skill Builder",
                desc: "Complete 5 skills.",
              },
              {
                unlocked: overallProgress >= 50,
                emoji: "🚀",
                title: "Halfway There",
                desc: "Reach 50% learning progress.",
              },
              {
                unlocked: latestATS >= 80,
                emoji: "🏆",
                title: "ATS Master",
                desc: "Reach an ATS score of 80.",
              },
            ].map((a) => (
              <div
                key={a.title}
                className={`rounded-2xl border-2 p-5 transition-base ${
                  a.unlocked
                    ? "bg-lime-400 border-ink-700 shadow-hard"
                    : "bg-cream-200/50 border-dashed border-ink-700/25"
                }`}
              >
                <div className={`text-4xl mb-3 ${a.unlocked ? "" : "grayscale opacity-40"}`}>
                  {a.emoji}
                </div>

                <h3 className="font-bold text-ink-700">{a.title}</h3>

                <p className={`text-sm mt-1 ${a.unlocked ? "text-ink-700/70" : "text-ink-500/50"}`}>
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* ATS Progress */}

          <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 p-6 shadow-hard">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-ink-700">
                  ATS Progress
                </h2>

                <p className="text-sm text-ink-500/70">
                  Score improvement across uploads
                </p>
              </div>

              <span className={`text-sm font-bold rounded-full border-2 border-ink-700 px-2.5 py-1 ${atsToneStyles[atsTone]}`}>
                {history.length} Resume{history.length !== 1 && "s"}
              </span>
            </div>

            <div className="flex items-end justify-between h-56">
              {atsHistory.map((score, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 flex-1"
                >
                  <div className="text-xs font-bold text-ink-700">
                    {score}
                  </div>

                  <div
                    className="w-10 rounded-t-lg border-2 border-b-0 border-ink-700 bg-lime-400 transition-all duration-700"
                    style={{
                      height: `${Math.max(score * 2, 12)}px`,
                    }}
                  />

                  <span className="text-xs text-ink-500/50">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Resume */}

          <div className="mt-8 rounded-2xl border-2 border-ink-700 bg-cream-50 p-6 shadow-hard">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-ink-700">
                  Latest Resume
                </h2>

                <p className="text-sm text-ink-500/70">
                  Your most recent analysis
                </p>
              </div>

              <button
                onClick={() => navigate(`/resume/${history[0]?.resume_id}/report`)}
                className="btn-hard bg-lime-400 text-ink-700 px-4 py-2 text-sm hover:bg-lime-300"
              >
                View Report
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-5">
              <div>
                <p className="text-xs text-ink-500/50 uppercase font-bold">Resume</p>

                <p className="font-semibold text-ink-700 mt-1">{history[0]?.file_name}</p>
              </div>

              <div>
                <p className="text-xs text-ink-500/50 uppercase font-bold">Target Role</p>

                <p className="font-semibold text-ink-700 mt-1">{history[0]?.target_role}</p>
              </div>

              <div>
                <p className="text-xs text-ink-500/50 uppercase font-bold">Uploaded</p>

                <p className="font-semibold text-ink-700 mt-1">
                  {new Date(history[0]?.uploaded_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-ink-500/50 uppercase font-bold">ATS Score</p>

                <p className="text-2xl font-extrabold text-ink-700 mt-1">
                  {latestATS}
                </p>
              </div>
            </div>
          </div>
          {/* Achievement */}

          <div className="rounded-2xl border-2 border-ink-700 bg-ink-700 text-cream-50 p-8 shadow-hard-lg">
            <div className="text-5xl mb-5">🏆</div>

            <h2 className="text-2xl font-extrabold">Keep Going!</h2>

            <p className="mt-4 text-cream-50/70 leading-relaxed">
              Every completed roadmap step and every new skill brings you one step
              closer to your dream job.
            </p>

            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completion</span>

                <span>{overallProgress}%</span>
              </div>

              <div className="h-3 rounded-full bg-cream-50/20 overflow-hidden">
                <div
                  className="h-full bg-lime-400 transition-all duration-700"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <div>
                <p className="text-sm text-cream-50/60">Skills</p>

                <p className="text-2xl font-extrabold">{completedSkills}</p>
              </div>

              <div>
                <p className="text-sm text-cream-50/60">Roadmap</p>

                <p className="text-2xl font-extrabold">{completedRoadmap}</p>
              </div>

              <div>
                <p className="text-sm text-cream-50/60">ATS</p>

                <p className="text-2xl font-extrabold">{latestATS}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}