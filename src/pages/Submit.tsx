import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import AddResourceForm from "@/components/AddResource";

const Submit = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    github: "",
    category: "",
    type: "",
    submitterName: "",
    submitterEmail: "",
    reasonForSubmission: ""
  });

  const [newToolId, setNewToolId] = useState<string | null>(null);
  const [showAddResources, setShowAddResources] = useState(false);

  const categories = [
    "OSINT", "Red Teaming", "SOC Tools", "Threat Intelligence",
    "Scanners", "Malware Analysis", "Forensics", "Cryptography",
    "Network Security", "Penetration Testing"
  ];

  const types = ["Free", "Open Source", "Paid", "Freemium"];

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Step 1: Submit tool data and get back tool id
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.description || !formData.category || !formData.type || !formData.submitterEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Get current user info from Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("You must be signed in to submit a tool.");
      }

      // Prepare tool data payload
      const insertData = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        github: formData.github,
        category: formData.category,
        type: formData.type,
        tags: tags,
        submitted_by: user.id,
        submitter_name: formData.submitterName,
        submitter_email: formData.submitterEmail,
        reason_for_submission: formData.reasonForSubmission,
        status: "pending"
      };

      // Insert tool and select returned id
      const { data, error } = await supabase
        .from("tools")
        .insert([insertData])
        .select("id");

      if (error) throw error;
      if (!data || data.length === 0 || !data[0].id) {
        throw new Error("Tool creation failed. No ID returned.");
      }

      // Store newly created tool id in state
      setNewToolId(data[0].id);

      // Show resources step
      setShowAddResources(true);

    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // After resources added or skipped, show success notification
  const handleResourcesSuccess = () => {
    setShowAddResources(false);
    setIsSubmitted(true);
  };

  if (showAddResources && newToolId) {
    // Step 2: Add resources UI
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12 container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Add Resources (Optional)</h2>
          <p className="text-muted-foreground mb-6">
            Your tool has been submitted successfully! Now you can add resources related to your tool.
            You can skip this step and add resources later.
          </p>
          <AddResourceForm toolId={newToolId} onSuccess={handleResourcesSuccess} />
          <Button
            variant="outline"
            className="mt-6"
            onClick={handleResourcesSuccess}
          >
            Skip Adding Resources
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isSubmitted) {
    // Step 3: Show success message
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12 container mx-auto px-4 max-w-2xl text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Submission Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for submitting <strong>{formData.name}</strong>. Your submission is now under review by our team.
            We'll notify you at <strong>{formData.submitterEmail}</strong> once it's approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: "",
                  description: "",
                  website: "",
                  github: "",
                  category: "",
                  type: "",
                  submitterName: "",
                  submitterEmail: "",
                  reasonForSubmission: ""
                });
                setTags([]);
              }}
            >
              Submit Another Tool
            </Button>
            <Button variant="outline" asChild>
              <a href="/tools">Browse Tools</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Step 0: Initial tool submission form UI
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12 container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Submit a Cybersecurity Tool</h1>
          <p className="text-muted-foreground">
            Help grow our community by submitting a cybersecurity tool for review. All submissions are manually reviewed before being added to the directory.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tool Information</CardTitle>
            <CardDescription>
              Please provide detailed information about the cybersecurity tool you'd like to submit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tool Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Nmap, Wireshark" required />
                </div>
                <div>
                  <Label htmlFor="website">Website URL *</Label>
                  <Input id="website" type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://example.com" required />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Provide a clear, concise description of what this tool does..." rows={4} required />
              </div>
              <div>
                <Label htmlFor="github">GitHub URL (optional)</Label>
                <Input id="github" type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/username/repo" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger><SelectValue placeholder="Select tool type" /></SelectTrigger>
                    <SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2 mb-2">
                  <Input id="tags" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add tags (press Enter to add)" />
                  <Button type="button" onClick={addTag} variant="outline"><Plus className="h-4 w-4" /></Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="reason">Why should this tool be included?</Label>
                <Textarea id="reason" value={formData.reasonForSubmission} onChange={(e) => setFormData({ ...formData, reasonForSubmission: e.target.value })} placeholder="Tell us why this tool would be valuable to the cybersecurity community..." rows={3} />
              </div>
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Submitter Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="submitterName">Your Name</Label>
                    <Input id="submitterName" value={formData.submitterName} onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div>
                    <Label htmlFor="submitterEmail">Your Email *</Label>
                    <Input id="submitterEmail" type="email" value={formData.submitterEmail} onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })} placeholder="your.email@example.com" required />
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Review Process:</strong> All submissions are manually reviewed by our team. We'll verify the tool's legitimacy, security, and value to the community before approval. You'll receive an email notification once your submission is reviewed.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Tool for Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Submit;
