import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UploadForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registrantId = searchParams.get("id");
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file || !registrantId) {
      toast.error("Please select a PDF file to upload.");
      return;
    }
    setLoading(true);
    try {
      // Get registrant name for the email subject
      const { data: registrant } = await supabase
        .from("registrations")
        .select("first_name, last_name")
        .eq("id", registrantId)
        .single();

      const registrantName = registrant
        ? `${registrant.first_name} ${registrant.last_name}`
        : "Unknown";

      // Send PDF via email
      const formData = new FormData();
      formData.append("file", file);
      formData.append("registrantName", registrantName);

      const emailRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-registration-email`,
        {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: formData,
        }
      );

      if (!emailRes.ok) {
        const errData = await emailRes.json();
        throw new Error(errData.error || "Failed to send email");
      }

      // Mark as uploaded in DB
      const { error } = await supabase
        .from("registrations")
        .update({ form_uploaded: true })
        .eq("id", registrantId);

      if (error) throw error;
      setUploaded(true);
      toast.success("Form uploaded and sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (uploaded) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full">
          <Card className="card-shadow border-border">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Upload Complete!</h2>
              <p className="text-muted-foreground mb-6 font-body">Your registration form has been uploaded. You can now view all registered people.</p>
              <Button onClick={() => navigate("/registered")} size="lg" className="gold-gradient text-secondary-foreground font-semibold hover:opacity-90">
                View Registered People
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full">
        <Card className="card-shadow border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Upload Registration Form</CardTitle>
            <CardDescription className="font-body">Upload your downloaded registration form PDF to complete the process.</CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-10 cursor-pointer hover:border-secondary transition-colors bg-muted/30">
              {file ? (
                <>
                  <FileText className="h-10 w-10 text-secondary mb-3" />
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to change file</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">Click to select PDF</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
                </>
              )}
              <input id="pdf-upload" type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
            </label>
            <Button onClick={handleUpload} disabled={!file || loading} size="lg" className="w-full mt-6 gold-gradient text-secondary-foreground font-semibold hover:opacity-90 disabled:opacity-50">
              {loading ? "Uploading..." : "Upload Form"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadForm;
