"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { User, ShieldAlert, ArrowRight, Loader2, Home } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabaseClient"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"user" | "authority">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role } // Storing role in user metadata
          }
        });
        if (error) throw error;
        
        // Auto-login or alert to check email depending on supabase settings
        if (data.session) {
          router.push(`/${role}/dashboard`);
        } else {
          alert("Sign up successful! Please check your email to verify your account.");
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Fetch user metadata to determine role routing
        const userRole = data.user.user_metadata?.role || role;
        router.push(`/${userRole}/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary-glow rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-120 h-120 bg-danger-glow rounded-full blur-[120px]"
        />
      </div>

      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        <Button variant="glass" size="icon" onClick={() => router.push('/')} className="rounded-full">
          <Home className="w-5 h-5" />
        </Button>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass rounded-4xl p-8 border border-glass-border shadow-2xl relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <motion.h2 
              key={isSignUp ? "signup" : "signin"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black font-heading tracking-tight mb-2"
            >
              {isSignUp ? "Join SecuWear" : "Welcome Back"}
            </motion.h2>
            <p className="text-gray-500 dark:text-gray-400">
              {isSignUp ? "Create an account to secure your lifestyle." : "Log in to your command center."}
            </p>
          </div>

          <div className="flex gap-4 mb-8 relative z-10">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                role === "user" ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(37,99,235,0.2)]" : "border-transparent bg-white/5 text-gray-500 hover:bg-white/10"
              }`}
            >
              <User className="w-8 h-8 mb-2" />
              <span className="font-bold font-heading">Civilian</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("authority")}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                role === "authority" ? "border-danger bg-danger/10 text-danger shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-transparent bg-white/5 text-gray-500 hover:bg-white/10"
              }`}
            >
              <ShieldAlert className="w-8 h-8 mb-2" />
              <span className="font-bold font-heading">Authority</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-xl text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-bold font-heading text-foreground/80 pl-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Secure email"
                className="w-full bg-background/50 backdrop-blur-md border border-glass-border rounded-xl px-5 py-4 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold font-heading text-foreground/80 pl-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background/50 backdrop-blur-md border border-glass-border rounded-xl px-5 py-4 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className={`w-full h-14 mt-4 text-lg rounded-xl shadow-lg transition-all ${
                role === "authority" ? "bg-danger hover:bg-danger/90 shadow-danger/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"
              }`}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Access Portal"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm text-gray-500 hover:text-foreground transition-colors font-medium"
            >
              {isSignUp ? "Already have an account? Sign in." : "Don't have an account? Sign up."}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
