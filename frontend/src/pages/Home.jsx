import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaChartLine,
  FaBrain,
  FaBookOpen,
  FaRoute,
  FaUpload,
  FaUserGraduate,
} from "react-icons/fa";

export default function Home() {
  const features = [
    {
      icon: <FaChartLine className="text-2xl text-ink-700" />,
      title: "ATS Score Analysis",
      desc: "Get instant AI-powered ATS scoring with detailed feedback.",
    },
    {
      icon: <FaBrain className="text-2xl text-ink-700" />,
      title: "Skill Gap Detection",
      desc: "Identify the missing skills recruiters are looking for.",
    },
    {
      icon: <FaBookOpen className="text-2xl text-ink-700" />,
      title: "Learning Resources",
      desc: "Curated YouTube videos and premium courses.",
    },
    {
      icon: <FaRoute className="text-2xl text-ink-700" />,
      title: "Personalized Roadmap",
      desc: "Receive a structured roadmap tailored to your career.",
    },
  ];

  const steps = [
    {
      icon: <FaUpload className="text-2xl text-ink-700" />,
      title: "Upload Resume",
      desc: "Upload your PDF or DOC resume in seconds.",
    },
    {
      icon: <FaBrain className="text-2xl text-ink-700" />,
      title: "AI Analysis",
      desc: "Gemini analyzes your resume against your target role.",
    },
    {
      icon: <FaBookOpen className="text-2xl text-ink-700" />,
      title: "Learn",
      desc: "Watch videos and complete curated online courses.",
    },
    {
      icon: <FaUserGraduate className="text-2xl text-ink-700" />,
      title: "Get Hired",
      desc: "Improve your profile and confidently apply for jobs.",
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b-2 border-ink-700 bg-cream-100/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700 font-black text-lg">
              S
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-ink-700 leading-none">
                SkillBridge
              </h1>

              <p className="text-xs text-ink-500/60">AI Resume Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border-2 border-ink-700 px-5 py-2 text-sm font-bold text-ink-700 transition-base hover:bg-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn-hard bg-lime-400 text-ink-700 px-5 py-2 text-sm hover:bg-lime-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-20 lg:grid-cols-2">
        {/* LEFT */}

        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit items-center rounded-full border-2 border-ink-700 bg-lime-400 px-4 py-1.5 text-sm font-bold text-ink-700">
            🚀 AI Powered Resume Analyzer
          </span>

          <h1 className="text-5xl font-extrabold leading-[1.1] text-ink-700">
            Bridge the gap between your resume{" "}
            <span className="bg-lime-400 px-2 -mx-1 rounded">
              and your dream career.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-ink-500/70">
            Upload your resume, receive an ATS score, discover missing skills,
            get personalized learning resources, and track your progress — all
            powered by AI.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/login"
              className="btn-hard bg-lime-400 text-ink-700 px-7 py-3 hover:bg-lime-300"
            >
              Get Started
              <FaArrowRight />
            </Link>

            <Link
              to="/login"
              className="rounded-full border-2 border-ink-700 bg-white px-7 py-3 font-bold text-ink-700 transition-base hover:bg-cream-100"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {["ATS Analysis", "Skill Gap Detection", "AI Roadmap", "Progress Tracking"].map(
              (label) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400">
                    <FaCheckCircle className="text-[10px] text-ink-700" />
                  </span>
                  <span className="text-sm font-semibold text-ink-700">{label}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT MOCKUP */}

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border-2 border-ink-700 bg-cream-50 p-6 shadow-hard-lg">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-500/60">Resume Analysis</p>

                <h2 className="text-xl font-extrabold text-ink-700">
                  Python Backend Resume
                </h2>
              </div>

              <div className="rounded-full border-2 border-ink-700 bg-lime-400 px-4 py-2 text-ink-700 font-extrabold">
                91 ATS
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm font-semibold text-ink-700">
                <span>ATS Score</span>
                <span>91%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full border-2 border-ink-700 bg-cream-100">
                <div
                  className="h-full rounded-full bg-lime-400"
                  style={{ width: "91%" }}
                />
              </div>
            </div>

            <h3 className="mb-3 font-bold text-ink-700">Missing Skills</h3>

            <div className="space-y-2">
              {["Docker", "Kubernetes", "Redis", "AWS", "CI/CD"].map(
                (skill) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between rounded-xl border border-ink-700/15 bg-cream-100 px-3 py-2"
                  >
                    <span className="text-sm font-semibold text-ink-700">{skill}</span>

                    <span className="rounded-full bg-danger-100 px-2 py-1 text-xs font-bold text-danger-500">
                      Missing
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 rounded-xl border-2 border-ink-700 bg-lime-100 p-4">
              <h3 className="mb-2 font-bold text-ink-700">
                AI Recommendation
              </h3>

              <p className="text-sm leading-6 text-ink-700/80">
                Learn Docker and FastAPI first to improve your ATS score by
                nearly <strong>18%</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="bg-cream-50 border-y-2 border-ink-700 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-3 text-center text-4xl font-extrabold text-ink-700">
            Everything you need to land your next job
          </h2>

          <p className="mx-auto mb-14 max-w-2xl text-center text-ink-500/70">
            SkillBridge combines resume analysis, AI recommendations, learning
            resources, and progress tracking into one platform.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border-2 border-ink-700 bg-cream-100 p-6 shadow-hard transition-base hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400">
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-lg font-bold text-ink-700">{feature.title}</h3>

                <p className="text-sm leading-6 text-ink-500/70">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-4xl font-extrabold text-ink-700">
            How SkillBridge Works
          </h2>

          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border-2 border-ink-700 bg-cream-50 p-8 text-center shadow-hard transition-base hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
              >
                <span className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink-700 bg-ink-700 text-xs font-extrabold text-lime-400">
                  {i + 1}
                </span>

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400">
                  {step.icon}
                </div>

                <h3 className="mb-3 text-lg font-bold text-ink-700">{step.title}</h3>

                <p className="text-ink-500/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-20 max-w-7xl rounded-3xl border-2 border-ink-700 bg-ink-700 px-8 py-14 text-center shadow-hard-lg lg:mx-auto">
        <h2 className="text-4xl font-extrabold text-cream-50">
          Ready to Improve Your Resume?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-cream-50/70">
          Join SkillBridge today and let AI guide your career journey with
          personalized resume analysis, ATS scoring, learning paths, and
          interview-ready recommendations.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 px-8 py-3 font-bold text-ink-700 shadow-[3px_3px_0_0_#F3EFE6] transition-base hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#F3EFE6]"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-full border-2 border-cream-50 px-8 py-3 font-bold text-cream-50 transition-base hover:bg-cream-50 hover:text-ink-700"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-ink-500/60">
        © {new Date().getFullYear()} SkillBridge • AI Resume Analyzer & Career
        Development Platform
      </footer>
    </div>
  );
}