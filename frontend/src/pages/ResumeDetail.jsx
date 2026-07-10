import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResumeHistory } from "../services/historyService";
import { getUserId } from "../utils/auth";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SECTION_STYLES = {
  danger: { bg: "bg-danger-100", text: "text-danger-500" },
  success: { bg: "bg-success-100", text: "text-success-500" },
  warning: { bg: "bg-warning-100", text: "text-warning-500" },
  accent: { bg: "bg-lime-400", text: "text-ink-700" },
  neutral: { bg: "bg-cream-200", text: "text-ink-700" },
};

function SectionIcon({ tone, path }) {
  const { bg, text } = SECTION_STYLES[tone];
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink-700 ${bg} ${text}`}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d={path} />
      </svg>
    </span>
  );
}

const ICONS = {
  missing:
    "M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z",
  strengths:
    "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z",
  weaknesses:
    "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z",
  ideas:
    "M10 2a6 6 0 00-3.796 10.632C6.7 13.055 7 13.598 7 14.174V15a1 1 0 001 1h4a1 1 0 001-1v-.826c0-.576.3-1.119.796-1.542A6 6 0 0010 2zM8.5 17a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z",
  roadmap:
    "M4.25 5.5a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H4.25zm0 4.75a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H4.25zm0 4.75a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H4.25z",
};

function Card({ title, tone, icon, children }) {
  return (
    <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 p-5 mb-4 shadow-hard">
      <div className="flex items-center gap-2.5 mb-3">
        <SectionIcon tone={tone} path={icon} />
        <h3 className="font-bold text-ink-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ItemList({ items, empty, render }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-ink-500/50 italic">{empty}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-sm text-ink-700/80 leading-relaxed pl-3 border-l-2 border-ink-700/15"
        >
          {render ? render(item) : item}
        </li>
      ))}
    </ul>
  );
}

export default function ResumeDetail() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getResumeHistory(getUserId());

      const found = res.find((r) => String(r.resume_id) === String(id));

      setResume(found || null);
    };

    fetchData();
  }, [id]);

  if (!resume) {
    return (
      <div className="min-h-screen bg-cream-100 px-4 py-10 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-64 rounded-full bg-ink-700/10 animate-pulse mb-3" />
          <div className="h-4 w-40 rounded-full bg-ink-700/10 animate-pulse mb-8" />
          <div className="h-36 w-36 rounded-full bg-ink-700/10 animate-pulse mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl border-2 border-ink-700/10 bg-cream-50 animate-pulse mb-4" />
          ))}
        </div>
      </div>
    );
  }

  const a = resume.analysis;
  const score = a?.ats_score ?? 0;
  const scoreTone = score > 70 ? "success" : score > 40 ? "warning" : "danger";
  const scoreColorMap = {
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  };

  return (
    <div className="min-h-screen bg-cream-100 px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-700 truncate">
          {resume.file_name}
        </h1>
        <p className="text-sm text-ink-500/70 mt-1">Role: {resume.target_role}</p>

        {/* ATS SCORE */}
        <div className="flex flex-col items-center sm:items-start my-8">
          <div className="w-36 rounded-full border-2 border-ink-700 bg-cream-50 p-3 shadow-hard">
            <CircularProgressbar
              value={score}
              text={`${score}`}
              styles={buildStyles({
                textSize: "24px",
                pathColor: scoreColorMap[scoreTone],
                textColor: "#141310",
                trailColor: "#EAE3D3",
              })}
            />
          </div>
          <p className="mt-3 text-sm font-bold text-ink-500/70">
            ATS Compatibility Score
          </p>
        </div>

        {/* SECTIONS */}
        <Card title="Missing Skills" tone="danger" icon={ICONS.missing}>
          <ItemList items={a?.missing_skills} empty="No missing skills identified." />
        </Card>

        <Card title="Strengths" tone="success" icon={ICONS.strengths}>
          <ItemList items={a?.strengths} empty="No strengths listed." />
        </Card>

        <Card title="Weaknesses" tone="warning" icon={ICONS.weaknesses}>
          <ItemList items={a?.weaknesses} empty="No weaknesses listed." />
        </Card>

        <Card title="Project Ideas" tone="accent" icon={ICONS.ideas}>
          <ItemList
            items={a?.project_ideas}
            empty="No project ideas yet."
            render={(p) => p.name || p}
          />
        </Card>

        <Card title="Roadmap" tone="neutral" icon={ICONS.roadmap}>
          <ItemList items={a?.roadmap} empty="No roadmap generated." />
        </Card>
      </div>
    </div>
  );
}