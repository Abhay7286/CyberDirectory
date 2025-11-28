import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById, Tool } from "@/data/tools";
import { supabase } from "@/lib/supabase";

const Report = () => {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get("tool");
  const [tool, setTool] = useState<Tool | null>(null);
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const user = supabase.auth.getUser();
  console.log("this is user", user);

  const [formData, setFormData] = useState({
    toolName: "",
    reportType: "",
    description: "",
    reporterEmail: "",
    reporterName: "",
    expectedBehavior: "",
    actualBehavior: ""
  });

  // auto-fill tool name if toolId is present
  useEffect(() => {
    if (toolId) {
      getToolById(toolId).then((result) => {
        setTool(result);
        setFormData((prev) => ({
          ...prev,
          toolName: result?.name || ""
        }));
      });
    }
  }, [toolId]);

  const reportTypes = [
    "Broken Link",
    "Outdated Information",
    "Incorrect Category",
    "Malicious Software",
    "Duplicate Entry",
    "Inappropriate Content",
    "Tool No Longer Available",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userData?.user || userError) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to submit a report.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (
      !formData.toolName.trim() ||
      !formData.reportType.trim() ||
      !formData.description.trim() ||
      !formData.reporterEmail.trim()
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Insert report into database
    const { error } = await supabase.from("report").insert([
      {
        tool_id: toolId, // optional
        tool_name: formData.toolName,
        report_type: formData.reportType,
        description: formData.description,
        reporter_email: formData.reporterEmail,
        reporter_name: formData.reporterName,
        expected_behavior: formData.expectedBehavior,
        actual_behavior: formData.actualBehavior
      },
    ]);

    if (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description:
          "We couldn’t submit your report. Please check your information and try again.",
        variant: "destructive",
      });
      return;
    }

    // Success
    setIsSubmitted(true);
    toast({
      title: "Report Submitted",
      description:
        "Thank you for helping us maintain the quality of our directory. We'll review your report shortly.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">
                Report Submitted Successfully
              </h1>
              <p className="text-muted-foreground mb-6">
                Thank you for reporting an issue with{" "}
                <strong>{formData.toolName}</strong>. Your report helps us
                maintain a high-quality directory for the cybersecurity
                community.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <p className="text-sm">
                  <strong>What happens next?</strong>
                  <br />
                  Our team will review your report within 1-2 business days. If
                  the issue is confirmed, we'll take appropriate action to fix
                  or remove the problematic content.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      toolName: "",
                      reportType: "",
                      description: "",
                      reporterEmail: "",
                      reporterName: "",
                      expectedBehavior: "",
                      actualBehavior: ""
                    });
                  }}
                >
                  Submit Another Report
                </Button>
                <Button variant="outline" asChild>
                  <a href="/tools">Browse Tools</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">Report an Issue</h1>
              <p className="text-muted-foreground">
                Help us maintain the quality and accuracy of our cybersecurity
                tools directory. Report broken links, outdated information, or
                other issues.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Issue Report</CardTitle>
                <CardDescription>
                  Please provide detailed information about the issue you've
                  encountered.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tool Name */}
                  <div>
                    <Label htmlFor="toolName">Tool Name *</Label>
                    <Input
                      id="toolName"
                      value={formData.toolName}
                      onChange={(e) =>
                        setFormData({ ...formData, toolName: e.target.value })
                      }
                      placeholder="Enter the name of the tool you're reporting"
                      required
                    />
                    {tool && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Reporting issue for: <strong>{tool.name}</strong>
                      </p>
                    )}
                  </div>

                  {/* Issue Type */}
                  <div>
                    <Label>Issue Type *</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData({ ...formData, reportType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of issue" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Issue Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value
                        })
                      }
                      placeholder="Please describe the issue in detail..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Extra fields conditionally */}
                  {(formData.reportType === "Broken Link" ||
                    formData.reportType === "Other") && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expected">Expected Behavior</Label>
                          <Textarea
                            id="expected"
                            value={formData.expectedBehavior}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expectedBehavior: e.target.value
                              })
                            }
                            placeholder="What should happen?"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="actual">Actual Behavior</Label>
                          <Textarea
                            id="actual"
                            value={formData.actualBehavior}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                actualBehavior: e.target.value
                              })
                            }
                            placeholder="What actually happens?"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                  {/* Reporter Information */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Reporter Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reporterName">Your Name</Label>
                        <Input
                          id="reporterName"
                          value={formData.reporterName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reporterName: e.target.value
                            })
                          }
                          placeholder="Your name (optional)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reporterEmail">Your Email *</Label>
                        <Input
                          id="reporterEmail"
                          type="email"
                          value={formData.reporterEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reporterEmail: e.target.value
                            })
                          }
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          Important Notes
                        </h4>
                        <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                          <li>
                            • False reports may result in restrictions on future
                            submissions
                          </li>
                          <li>
                            • We may contact you for additional information
                          </li>
                          <li>
                            • Reports are reviewed within 1-2 business days
                          </li>
                          <li>
                            • Urgent security issues are prioritized
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button type="submit" className="w-full">
                    Submit Report
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Report;
