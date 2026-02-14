import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Registration {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  age: number;
  country: string;
  address: string;
  phone: string;
  created_at: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [currentRegistrant, setCurrentRegistrant] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    age: "",
    country: "",
    address: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.age || !form.country || !form.address || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("register", {
        body: {
          firstName: form.firstName.trim(),
          middleName: form.middleName.trim() || null,
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          age: form.age,
          country: form.country.trim(),
          address: form.address.trim(),
          phone: form.phone.trim(),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setCurrentRegistrant(data.registration);
      setSubmitted(true);
      toast.success("Registration successful! A notification has been sent.");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!currentRegistrant) return;
    const r = currentRegistrant;
    const doc = new jsPDF();

    doc.setFillColor(26, 42, 68);
    doc.rect(0, 0, 210, 45, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("HopeRise Foundation", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Registration Form", 105, 32, { align: "center" });

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    let y = 60;
    const fields = [
      ["Registration ID", r.id],
      ["First Name", r.first_name],
      ["Middle Name", r.middle_name || "N/A"],
      ["Last Name", r.last_name],
      ["Age", String(r.age)],
      ["Country", r.country],
      ["Address", r.address],
      ["Phone Number", r.phone],
      ["Date of Registration", new Date(r.created_at).toLocaleDateString()],
    ];

    fields.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 75, y);
      y += 10;
    });

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Please upload this form to complete your registration.", 105, 270, { align: "center" });

    doc.save(`HopeRise_Registration_${r.first_name}_${r.last_name}.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  if (submitted && currentRegistrant) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
        >
          <Card className="card-shadow border-border">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Registration Successful!
              </h2>
              <p className="text-muted-foreground mb-6 font-body">
                Thank you, {currentRegistrant.first_name}! Your registration has been recorded and a notification has been sent. Please download your form and upload it to complete the process.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={downloadPDF}
                  size="lg"
                  className="gold-gradient text-secondary-foreground font-semibold hover:opacity-90"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Registration Form
                </Button>
                <Button
                  onClick={() => navigate(`/upload?id=${currentRegistrant.id}`)}
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  Upload Form
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full"
      >
        <Card className="card-shadow border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Registration Form</CardTitle>
            <CardDescription className="font-body">
              Fill in your details to stand a chance to be among the Top 10 Favorites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" placeholder="FirstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" name="middleName" placeholder="MiddleName (Optional)" value={form.middleName} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" name="lastName" placeholder="LastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" placeholder="Your email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input id="age" name="age" type="number" placeholder="Your age" min="1" max="150" value={form.age} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" name="country" placeholder="Your country" value={form.country} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" placeholder="Your address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Your phone number" value={form.phone} onChange={handleChange} required />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full gold-gradient text-secondary-foreground font-semibold hover:opacity-90 mt-2"
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
