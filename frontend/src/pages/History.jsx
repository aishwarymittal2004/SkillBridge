import { useEffect, useState } from "react";
import { getResumeHistory } from "../services/historyService";
import { getUserId } from "../utils/auth";
import ATSScoreCircle from "../components/ATSScoreCircle";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getResumeHistory(getUserId());
        setData(res);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 px-4 py-10 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-52 rounded-full bg-ink-700/10 animate-pulse mb-6" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[96px] rounded-2xl border-2 border-ink-700/10 bg-cream-50 animate-pulse mb-4"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-700 bg-lime-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-700 mb-3">
            Your resumes
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-700">
            Resume History
          </h1>
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-ink-700/30 bg-cream-50 px-6 py-16">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700 mb-4">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h5.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0116 6.828V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm7 1V4H6v12h8V7h-2a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <p className="text-sm font-bold text-ink-700">
              No resumes analyzed yet
            </p>
            <p className="text-sm text-ink-500/70 mt-1">
              Upload a resume from the dashboard to see your history here.
            </p>
          </div>
        ) : (
          <div>
            {data.map((item) => (
              <motion.div
                key={item.resume_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -2 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
                  rounded-2xl border-2 border-ink-700 bg-cream-50 p-5 mb-4 shadow-hard
                  transition-base hover:shadow-hard-lg"
              >
                {/* LEFT */}
                <div className="min-w-0">
                  <h3 className="font-bold text-ink-700 truncate">
                    {item.file_name}
                  </h3>
                  <p className="text-sm text-ink-500/70 mt-0.5">
                    {item.target_role}
                  </p>

                  {(item.analysis?.missing_skills || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.analysis.missing_skills.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-ink-700/20 bg-cream-100 px-2.5 py-1 text-xs font-semibold text-ink-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4 shrink-0 self-start sm:self-center">
                  <ATSScoreCircle score={item.analysis?.ats_score ?? 0} />

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/resume/${item.resume_id}/report`)}
                    className="btn-hard bg-lime-400 text-ink-700 px-3.5 py-2 text-sm hover:bg-lime-300"
                  >
                    Full report
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 01.75-.75h10.638L11.29 6.15a.75.75 0 111.02-1.1l4.5 4.25a.75.75 0 010 1.1l-4.5 4.25a.75.75 0 11-1.02-1.1l3.098-2.9H3.75A.75.75 0 013 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}