import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, Award, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Community coming together" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-80" />
        <div className="relative z-10 container text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Welcome to <br />
              <span className="text-secondary">HopeRise Foundation</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-4 font-body">
              We believe everyone deserves a chance at financial stability. Our foundation is dedicated to empowering lives through direct financial support.
            </p>
            <p className="text-xl md:text-2xl font-semibold text-secondary mb-10 font-body">
              ✨ Register now and stand a chance to be among our{" "}
              <span className="underline decoration-2 underline-offset-4">Top 10 Favorites</span> for financial assistance!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gold-gradient text-secondary-foreground font-semibold text-base px-8 py-6 hover:opacity-90 transition-opacity">
                  Register Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/registered">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 py-6">
                  <Users className="mr-2 h-5 w-5" /> View Registered People
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-14 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: HandHeart, title: "Register", desc: "Fill out a simple registration form with your details to get started." },
              { icon: Award, title: "Download & Upload", desc: "Download your registration form as a PDF and upload it to confirm your entry." },
              { icon: Users, title: "Get Selected", desc: "Our Top 10 Favorites receive direct financial support from the foundation." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-8 text-center card-shadow border border-border"
              >
                <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-7 w-7 text-secondary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
