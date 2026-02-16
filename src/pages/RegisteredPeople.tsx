import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Registration {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  age: number;
  country: string;
  gender: string | null;
  amount_paid: number | null;
  created_at: string;
}

const dummyData: Omit<Registration, "id" | "created_at">[] = [
  { first_name: "Ricardo", middle_name: null, last_name: "Rodriquez", age: 48, country: "Ecuador", gender: "Male", amount_paid: 2500 },
  { first_name: "Jennifer", middle_name: null, last_name: "Lopez", age: 28, country: "Spain", gender: "Female", amount_paid: 1800 },
  { first_name: "Piero", middle_name: null, last_name: "Thiago", age: 55, country: "Ecuador", gender: "Male", amount_paid: 3200 },
  { first_name: "Raul", middle_name: null, last_name: "Jimenez", age: 22, country: "Mexico", gender: "Male", amount_paid: 1500 },
  { first_name: "Santos", middle_name: null, last_name: "Clara", age: 35, country: "Colombia", gender: "Female", amount_paid: 2100 },
  { first_name: "Jeremie", middle_name: null, last_name: "Frimpong", age: 18, country: "Ghana", gender: "Male", amount_paid: 900 },
  { first_name: "Zayn", middle_name: null, last_name: "Aisha", age: 40, country: "Morocco", gender: "Female", amount_paid: 2800 },
  { first_name: "Aarons", middle_name: null, last_name: "Sarah", age: 60, country: "USA", gender: "Female", amount_paid: 3500 },
];

const RegisteredPeople = () => {
  const [registrants, setRegistrants] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrants = async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("id, first_name, middle_name, last_name, age, country, created_at")
        .eq("form_uploaded", true)
        .order("created_at", { ascending: false });

      if (!error && data) setRegistrants(data as unknown as Registration[]);
      setLoading(false);
    };
    fetchRegistrants();
  }, []);

  const allPeople = [
    ...dummyData.map((d, i) => ({
      ...d,
      id: `dummy-${i}`,
      created_at: new Date(2025, 0, 15 + i).toISOString(),
    })),
    ...registrants,
  ];

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-secondary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Registered People</h1>
            <p className="text-muted-foreground font-body">
              {allPeople.length} registered {allPeople.length === 1 ? "person" : "people"} with completed forms.
            </p>
          </div>

          {loading ? (
            <Card className="card-shadow border-border">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground font-body">Loading...</p>
              </CardContent>
            </Card>
          ) : allPeople.length === 0 ? (
            <Card className="card-shadow border-border">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground font-body">No completed registrations yet. Be the first to register!</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-shadow border-border overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">#</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Age</TableHead>
                      <TableHead className="font-semibold">Gender</TableHead>
                      <TableHead className="font-semibold">Country</TableHead>
                      <TableHead className="font-semibold">Amount Paid</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPeople.map((r, i) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell>{r.first_name} {r.middle_name ? `${r.middle_name} ` : ""}{r.last_name}</TableCell>
                        <TableCell>{r.age}</TableCell>
                        <TableCell>{r.gender || "—"}</TableCell>
                        <TableCell>{r.country}</TableCell>
                        <TableCell className="font-semibold">${(r.amount_paid || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/10">Verified</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RegisteredPeople;
