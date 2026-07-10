import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Feature({ title, text }) {
  return (
    <div>
      <h4 className="font-bold text-cream-50">{title}</h4>
      <p className="text-cream-50/60 text-sm mt-0.5">{text}</p>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate(); // Move here

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("full_name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);

      toast.success("Login successful!");
      console.log("TOKEN:", res.data.access_token);
      console.log("USER:", res.data.user);

      navigate("/dashboard"); // Redirect after successful login
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream-100">
      {/* LEFT PANEL */}

      <div className="hidden lg:flex flex-col justify-between bg-ink-700 text-cream-50 p-14">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-cream-50/30 bg-lime-400 text-ink-700 text-xl font-black">
              S
            </div>

            <div>
              <h1 className="text-2xl font-extrabold">SkillBridge</h1>

              <p className="text-cream-50/60 text-sm">AI Resume Analyzer</p>
            </div>
          </div>

          <div className="mt-20">
            <span className="inline-flex rounded-full border-2 border-lime-400 bg-lime-400/10 px-4 py-1.5 text-sm font-bold text-lime-400">
              AI Powered Career Platform
            </span>

            <h2 className="mt-6 text-5xl font-extrabold leading-[1.1]">
              Get your dream job with AI.
            </h2>

            <p className="mt-6 text-lg leading-8 text-cream-50/70 max-w-lg">
              Analyze your resume, calculate ATS score, discover missing skills,
              receive project recommendations and build a personalized learning
              roadmap.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <Feature
            title="ATS Resume Analysis"
            text="Know exactly why your resume succeeds or fails."
          />

          <Feature
            title="Skill Gap Detection"
            text="Find missing skills employers are looking for."
          />

          <Feature
            title="Learning Resources"
            text="Curated YouTube videos and online courses."
          />

          <Feature
            title="Project Recommendations"
            text="Build projects that strengthen your portfolio."
          />
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="flex justify-center mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700 font-black">
                S
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-ink-700">SkillBridge</h1>
          </div>

          <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 shadow-hard-lg p-8">
            <h2 className="text-3xl font-extrabold text-ink-700">
              Welcome Back
            </h2>

            <p className="mt-2 text-ink-500/70">
              Login to continue your career journey.
            </p>

            <form onSubmit={handleLogin} className="space-y-5 mt-8">
              {/* EMAIL */}

              <div>
                <label className="block text-sm font-bold text-ink-700 mb-2">Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border-2 border-ink-700 px-4 py-3 bg-white text-ink-700 placeholder:text-ink-500/40 focus:ring-4 focus:ring-lime-400/50 outline-none transition-base"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="block text-sm font-bold text-ink-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border-2 border-ink-700 px-4 py-3 pr-12 bg-white text-ink-700 placeholder:text-ink-500/40 focus:ring-4 focus:ring-lime-400/50 outline-none transition-base"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-ink-500/70 hover:text-ink-700 transition-base"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-ink-500/70">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-ink-700 underline decoration-lime-400 decoration-2 underline-offset-2 hover:text-ink-700/70"
                >
                  Create one
                </Link>
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-hard w-full bg-lime-400 text-ink-700 py-3 hover:bg-lime-300 disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}