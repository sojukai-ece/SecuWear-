"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Bell, Watch, MapPin, CheckCircle, TriangleAlert, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ThemeToggle } from "@/components/ThemeToggle"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function UserDashboard() {
  const router = useRouter();
  const [sosActive, setSosActive] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      } else {
        setUserEmail(session.user.email || "Civilian");
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const handleSos = () => {
    setSosActive(true);
    setTimeout(() => {
      alert("Emergency Signal Sent! Authorities have been notified and are tracking your location.");
    }, 500);
  };

  return (
    <div className="min-h-screen p-6 sm:p-12 z-10 bg-background relative overflow-hidden transition-colors">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-glow rounded-full blur-[150px] pointer-events-none" />
      
      <header className="flex justify-between items-center mb-12 relative z-10">
        <div>
          <h1 className="text-4xl font-black font-heading">Dashboard</h1>
          <p className="text-gray-500 font-medium">Identity: <span className="mono-text">{userEmail || "Loading..."}</span></p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
            SecuWear Linked
          </div>
          <ThemeToggle />
          <Button variant="glass" size="icon" className="rounded-full" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Activity className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-500">Heart Rate</h3>
                <p className="text-6xl font-black mono-text tracking-tighter text-foreground">72<span className="text-2xl text-gray-400 font-sans tracking-normal ml-1">bpm</span></p>
              </CardContent>
            </Card>
            <Card className="hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-500">Live Location</h3>
                <p className="text-3xl font-black font-heading text-foreground">Makati City</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="border-b border-glass-border">
              <CardTitle className="font-heading text-2xl">Telemetry Logs</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  { title: "Device Synced", time: "2 mins ago", icon: Watch, color: "text-primary", bg: "bg-primary/10" },
                  { title: "Health Check Passed", time: "1 hour ago", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
                  { title: "Slight Irregularity Detected", time: "Yesterday", icon: TriangleAlert, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                ].map((item, i) => (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex items-center justify-between p-5 rounded-2xl glass hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${item.bg}`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <span className="font-bold text-lg">{item.title}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-500 mono-text">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-center h-full min-h-125 glass rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-danger-glow opacity-20 pointer-events-none" />
          <motion.div
            animate={sosActive ? {
              scale: [1, 1.15, 1],
              boxShadow: [
                "0 0 0 0 rgba(220, 38, 38, 0.7)",
                "0 0 0 50px rgba(220, 38, 38, 0)",
                "0 0 0 0 rgba(220, 38, 38, 0)"
              ]
            } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="rounded-full relative z-10"
          >
            <button
              onClick={handleSos}
              className={`w-72 h-72 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
                sosActive 
                  ? "bg-danger text-white border-8 border-danger/50 shadow-[0_0_100px_rgba(220,38,38,0.8)]" 
                  : "bg-linear-to-br from-danger/20 to-danger/5 text-danger border-8 border-danger/30 hover:bg-danger hover:text-white hover:border-danger/50"
              }`}
            >
              <TriangleAlert className="w-24 h-24 mb-4" />
              <span className="text-6xl font-black tracking-widest font-heading">SOS</span>
            </button>
          </motion.div>
          <p className="mt-12 text-center text-gray-500 max-w-sm font-medium px-4 relative z-10">
            Hold or tap the SOS button to instantly alert nearby authorities and broadcast your live GPS location.
          </p>
        </div>
      </div>
    </div>
  );
}
