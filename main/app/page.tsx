"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { Shield, Activity, MapPin, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useRef } from "react"

export default function Home() {
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="relative flex-1 flex flex-col items-center min-h-screen overflow-hidden">
      {/* Header */}
      <header className="w-full absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold font-heading tracking-tight">SecuWear</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <ThemeToggle />
        </motion.div>
      </header>

      {/* Hero Section */}
      <motion.div style={{ y, opacity }} className="flex-1 flex flex-col items-center justify-center p-6 sm:p-24 mt-20 w-full relative z-10">
        
        {/* Parallax Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[20%] opacity-20 pointer-events-none"
        >
          <Zap className="w-24 h-24 text-primary" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -10, 10, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[15%] bottom-[30%] opacity-20 pointer-events-none"
        >
          <MapPin className="w-32 h-32 text-danger" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto w-24 h-24 bg-primary/10 rounded-3xl rotate-45 flex items-center justify-center mb-8 border border-primary/20 backdrop-blur-md shadow-[0_0_50px_rgba(37,99,235,0.3)]"
          >
            <Shield className="w-12 h-12 text-primary -rotate-45" />
          </motion.div>
          
          <h1 className="text-6xl sm:text-8xl font-black font-heading tracking-tighter mb-6">
            <span className="text-foreground">Next-Gen</span>
            <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-danger">
              Safety Response
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Wearable integration, instant alerts, and intelligent algorithm-driven routing for emergency responders. Built for the modern world.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" onClick={() => router.push('/login')} className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] transition-all">
              Launch Portal
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <div className="w-full max-w-6xl p-6 pb-24 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Activity, title: "Wearable Sync", desc: "Monitors vitals and detects sudden impacts automatically with zero latency." },
            { icon: MapPin, title: "Live Tracking", desc: "Pinpoint accuracy utilizing our custom Luzon Dijkstra node network." },
            { icon: Shield, title: "Rapid Response", desc: "Authorities are routed using the absolute shortest path available instantly." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass p-8 rounded-4xl flex flex-col items-start space-y-4 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-4 bg-primary/10 rounded-2xl">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-heading">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
