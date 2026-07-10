import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      await API.post("/auth/register", {
        full_name: fullName,
        email,
        password,
      });

      toast.success("Account created successfully 🎉");

      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Registration failed"
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm">

        {/* Header */}

        <div className="flex flex-col items-center mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700 text-sm font-black mb-4">
            S
          </span>

          <h2 className="text-2xl font-extrabold tracking-tight text-ink-700">
            Create your account
          </h2>

          <p className="text-sm text-ink-500/70 mt-1 text-center">
            Join SkillBridge and improve your resume with AI
          </p>
        </div>

        {/* Card */}

        <div className="rounded-2xl border-2 border-ink-700 bg-cream-50 shadow-hard p-6 sm:p-7">

          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-1.5">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border-2 border-ink-700 bg-white px-3.5 py-2.5 text-ink-700 placeholder:text-ink-500/40 focus:ring-4 focus:ring-lime-400/50 outline-none transition-base disabled:bg-cream-100 disabled:text-ink-500/40 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-1.5">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border-2 border-ink-700 bg-white px-3.5 py-2.5 text-ink-700 placeholder:text-ink-500/40 focus:ring-4 focus:ring-lime-400/50 outline-none transition-base disabled:bg-cream-100 disabled:text-ink-500/40 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-1.5">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border-2 border-ink-700 bg-white px-3.5 py-2.5 pr-14 text-ink-700 placeholder:text-ink-500/40 focus:ring-4 focus:ring-lime-400/50 outline-none transition-base disabled:bg-cream-100 disabled:text-ink-500/40 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-500/70 hover:text-ink-700 transition-base"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-1.5">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-xl border-2 border-ink-700 bg-white px-3.5 py-2.5 pr-14 text-ink-700 placeholder:text-ink-500/40 focus:ring-4 focus:ring-lime-400/50 outline-none transition-base disabled:bg-cream-100 disabled:text-ink-500/40 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-500/70 hover:text-ink-700 transition-base"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-hard w-full bg-lime-400 text-ink-700 py-2.5 hover:bg-lime-300 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="mt-5 text-center text-sm text-ink-500/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-ink-700 underline decoration-lime-400 decoration-2 underline-offset-2 hover:text-ink-700/70"
            >
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}