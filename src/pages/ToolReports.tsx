import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { sendReportNotificationEmail } from "@/hooks/reportStatus";

const ToolReports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("report")
        .select("*")
        .eq("status", "pending")
        .order("submitted_at", { ascending: true });
      if (error) throw error;
      setReports(data || []);
    } catch (err: any) {
      toast({
        title: "Error fetching reports",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

const approveReport = async (id: string) => {
  setLoading(true);
  try {
    const { data: report, error: fetchError } = await supabase
      .from("report")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchError || !report) throw fetchError || new Error("Report not found");

    const { error: updateError } = await supabase
      .from("report")
      .update({ status: "approved" })
      .eq("id", id);
    if (updateError) throw updateError;

    await sendReportNotificationEmail(
      report.reporter_email,
      report.tool_name,
      report.reporter_name,
      "approved"
    );

    toast({
      title: "Report approved",
      description: "The report has been approved, the submitter notified.",
    });

    await fetchReports();
  } catch (error: any) {
    toast({
      title: "Error approving report",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

const rejectReport = async (id: string) => {
  setLoading(true);
  try {
    const { data: report, error: fetchError } = await supabase
      .from("report")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchError || !report) throw fetchError || new Error("Report not found");

    const { error: updateError } = await supabase
      .from("report")
      .update({ status: "rejected" })
      .eq("id", id);
    if (updateError) throw updateError;

    await sendReportNotificationEmail(
      report.reporter_email,
      report.tool_name,
      report.reporter_name,
      "rejected"
    );

    toast({
      title: "Report rejected",
      description: "The report has been rejected, the submitter notified.",
    });

    await fetchReports();
  } catch (error: any) {
    toast({
      title: "Error rejecting report",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Admin: Tool Reports</h1>
      {loading && <p>Loading reports...</p>}
      {!loading && reports.length === 0 && <p>No pending reports at the moment.</p>}
      <div className="space-y-6">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle>{report.tool_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Description:</strong> {report.description}
              </p>
              <p>
                <strong>Report type:</strong> {report.report_type}
              </p>
              <p>
                <strong>Submitter name:</strong> {report.reporter_name || "N/A"}
              </p>
              <p>
                <strong>Submitter email:</strong> {report.reporter_email || "N/A"}
              </p>
              <Button
                onClick={() => approveReport(report.id)}
                disabled={loading}
                className="mt-4 mr-4"
              >
                Approve Report
              </Button>
              <Button onClick={() => rejectReport(report.id)} disabled={loading} className="mt-4">
                Reject Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ToolReports;
