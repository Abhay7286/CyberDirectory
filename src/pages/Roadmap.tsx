import { useState, useRef, useEffect } from "react";
import Header from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Download, FileDown } from "lucide-react";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface RoadmapStage {
    stage: number;
    title: string;
    skills: string[];
    tools: { name: string; description: string }[];
    certifications: string[];
}

const Roadmap = () => {
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [hoursPerWeek, setHoursPerWeek] = useState("");
    const [goal, setGoal] = useState("");
    const [roadmap, setRoadmap] = useState<RoadmapStage[]>([]);
    const [toolsTable, setToolsTable] = useState<Record<string, string>>({});
    const roadmapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTools = async () => {
            const { data, error } = await supabase
                .from("tools")
                .select("name, description");

            if (error) {
                console.error("Error fetching tools:", error);
                return;
            }

            const table: Record<string, string> = {};
            data.forEach((tool) => {
                table[tool.name] = tool.description || "No description available.";
            });

            setToolsTable(table);
        };

        fetchTools();
    }, []);

  const generateRoadmap = async () => {
    const prompt = `
You are a professional Cybersecurity Career Counselor.
Create a cybersecurity learning roadmap for the following user:

ROLE: ${role}
EXPERIENCE LEVEL: ${experience}
HOURS PER WEEK: ${hoursPerWeek}
GOAL: ${goal}

Your output MUST be Strictly in JSON only:
[
  {
    "stage": 1,
    "title": "Stage Title",
    "skills": ["skill1", "skill2"],
    "tools": ["Tool1", "Tool2"],
    "certifications": ["Cert1"]
  }
]

Rules:
- Exactly 4 stages.
- Do NOT explain anything.
- Tools array must only contain names.
`;

    try {
        const groqResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/groq`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ prompt }),
            }
        );

        if (!groqResponse.ok) {
            console.error("Function error:", await groqResponse.text());
            return;
        }

        const groqData = await groqResponse.json();
        const raw = groqData?.choices?.[0]?.message?.content;

        if (!raw) {
            console.error("Invalid LLM response:", groqData);
            return;
        }

        let parsed: any[];
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            console.error("LLM returned invalid JSON:", raw);
            return;
        }

        const enriched = parsed.map((stage: any) => ({
            stage: stage.stage,
            title: stage.title,
            skills: stage.skills,
            tools: stage.tools.map((toolName: string) => ({
                name: toolName,
                description: toolsTable[toolName] || "Learn this tool as part of this stage",
            })),
            certifications: stage.certifications,
        }));

        setRoadmap(enriched);

    } catch (err) {
        console.error("Network error:", err);
    }
};


    const downloadAsSVG = () => {
        if (!roadmapRef.current) return;
        const svg = roadmapRef.current.querySelector("svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `cyberskill-roadmap-${Date.now()}.svg`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const downloadAsImage = () => {
        if (!roadmapRef.current) return;
        const svg = roadmapRef.current.querySelector("svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        canvas.width = 1600;
        canvas.height = 800;

        img.onload = () => {
            if (ctx) {
                ctx.fillStyle = "#0a0a0a";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `cyberskill-roadmap-${Date.now()}.png`;
                        link.click();
                        URL.revokeObjectURL(url);
                    }
                });
            }
        };

        img.src =
            "data:image/svg+xml;base64," +
            btoa(unescape(encodeURIComponent(svgData)));
    };


    return (
  <div className="min-h-screen bg-background">
    <Header />

    <div className="container mx-auto px-4 py-12 max-w-6xl">

      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
          CyberSkill Roadmap
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Chart your path to cybersecurity mastery with a personalized learning roadmap
        </p>
      </div>

      {/* ===== CONFIG CARD ===== */}
      <Card className="mb-16 border bg-card">
        <CardContent className="p-8 space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Configure Your Journey
            </h2>
            <p className="text-muted-foreground">
              Customize your roadmap to match your goals and experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Role */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-foreground">Target Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your cybersecurity path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="penetration tester">Penetration Tester</SelectItem>
                  <SelectItem value="red team operator">Red Team Operator</SelectItem>
                  <SelectItem value="security analyst">Security Analyst</SelectItem>
                  <SelectItem value="incident responder">Incident Response</SelectItem>
                  <SelectItem value="malware analyst">Malware Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-foreground">Experience Level</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Your current skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hours */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-foreground">Weekly Commitment</Label>
              <Input
                type="number"
                placeholder="e.g., 10 hours"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            {/* Goal */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-foreground">Your Mission (Optional)</Label>
              <Input
                placeholder="e.g., Get OSCP in 6 months"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
          </div>

          <Button
            onClick={generateRoadmap}
            className="w-full h-16 text-xl font-bold"
            disabled={!role || !experience || !hoursPerWeek}
          >
            Generate My Roadmap
          </Button>
        </CardContent>
      </Card>

      {/* ===== ROADMAP DISPLAY ===== */}
      {roadmap.length > 0 && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-2">
              Your Personalized Roadmap
            </h2>
            <p className="text-muted-foreground text-lg">
              Follow this path to achieve your cybersecurity goals
            </p>
          </div>

          <div id="roadmap-content" className="space-y-6">

            {roadmap.map((stage) => (
              <Card key={stage.stage} className="border bg-card">
                <CardContent className="p-8">

                  {/* Header */}
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-foreground">
                        {stage.stage}
                      </div>
                      <h3 className="text-3xl font-bold text-foreground">{stage.title}</h3>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Skills */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-foreground mb-4">Core Skills</h4>
                      <ul className="space-y-3">
                        {stage.skills.map((skill, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full mt-2 bg-foreground" />
                            <span className="text-foreground text-lg">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tools */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-foreground mb-4">Essential Tools</h4>
                      <div className="space-y-4">
                        {stage.tools.map((tool, i) => (
                          <div key={i} className="p-4 rounded-lg bg-muted border border-border">
                            <h5 className="font-bold text-lg mb-2 text-foreground">{tool.name}</h5>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {tool.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-foreground mb-4">Certifications</h4>
                      <ul className="space-y-3">
                        {stage.certifications.map((cert, i) => (
                          <li key={i}>
                            <div className="p-3 rounded-lg border text-center font-semibold text-foreground">
                              {cert}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Download Buttons */}
          <div className="flex justify-center pt-8 gap-4">
            <Button onClick={downloadAsSVG} variant="outline">
              <Download className="mr-2 w-4 h-4" /> Download SVG
            </Button>
            <Button onClick={downloadAsImage} variant="outline">
              <Download className="mr-2 w-4 h-4" /> Download PNG
            </Button>
          </div>

        </div>
      )}
    </div>
  </div>
);

};
export default Roadmap;
