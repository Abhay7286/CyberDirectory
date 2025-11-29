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
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        CyberSkill Roadmap Generator
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Create a personalized learning roadmap using AI 
                    </p>
                </div>

                {/* FORM */}
                <Card className="bg-card border-cyber mb-12">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Configure Your Roadmap</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Select Cyber Role</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Target role" />
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

                            <div className="space-y-2">
                                <Label>Experience Level</Label>
                                <Select value={experience} onValueChange={setExperience}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Your level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Hours per Week</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 10"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Optional Goal</Label>
                                <Input
                                    placeholder="e.g., OSCP in 6 months"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={generateRoadmap}
                            className="w-full h-14 text-lg font-semibold bg-cyber hover:bg-cyber/80 text-black"
                            disabled={!role || !experience || !hoursPerWeek}
                        >
                            Generate Roadmap
                        </Button>
                    </CardContent>
                </Card>

                {/* ---------------- SVG OUTPUT ---------------- */}
                {roadmap.length > 0 && (
                    <div className="space-y-8">
                        <div
                            ref={roadmapRef}
                            className="bg-card border border-cyber rounded-lg p-8 overflow-x-auto"
                        >
                            <svg width="100%" height="600" viewBox="0 0 1400 600" className="min-w-[1400px]">

                                {/* CONNECTING LINES */}
                                {roadmap.map((_, index) => {
                                    if (index < roadmap.length - 1) {
                                        const x1 = 150 + index * 330;
                                        return (
                                            <line
                                                key={index}
                                                x1={x1 + 150}
                                                y1="300"
                                                x2={x1 + 330}
                                                y2="300"
                                                stroke="hsl(var(--cyber))"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        );
                                    }
                                })}

                                {/* STAGE CARDS */}
                                {roadmap.map((stage, index) => {
                                    const x = 50 + index * 330;

                                    return (
                                        <g key={stage.stage}>
                                            <rect
                                                x={x}
                                                y={50}
                                                width="300"
                                                height="500"
                                                fill="hsl(var(--background))"
                                                stroke="hsl(var(--cyber))"
                                                strokeWidth="2"
                                                rx="8"
                                            />

                                            <rect
                                                x={x}
                                                y={50}
                                                width="300"
                                                height="50"
                                                fill="hsl(var(--cyber))"
                                                rx="8"
                                            />

                                            <text
                                                x={x + 150}
                                                y={82}
                                                textAnchor="middle"
                                                fill="hsl(var(--background))"
                                                fontSize="18"
                                                fontWeight="bold"
                                            >
                                                Stage {stage.stage}: {stage.title}
                                            </text>

                                            {/* Skills */}
                                            <text x={x + 10} y={125} fill="hsl(var(--cyber))" fontSize="14" fontWeight="bold">
                                                Skills:
                                            </text>
                                            {stage.skills.map((skill, i) => (
                                                <text key={i} x={x + 10} y={145 + i * 20} fill="hsl(var(--foreground))" fontSize="12">
                                                    • {skill}
                                                </text>
                                            ))}

                                            {/* Tools */}
                                            <text x={x + 10} y={230} fill="hsl(var(--cyber))" fontSize="14" fontWeight="bold">
                                                Tools:
                                            </text>
                                            {stage.tools.map((tool, i) => (
                                                <g key={i}>
                                                    <text
                                                        x={x + 10}
                                                        y={250 + i * 55}
                                                        fill="hsl(var(--foreground))"
                                                        fontSize="12"
                                                        fontWeight="bold"
                                                    >
                                                        • {tool.name}
                                                    </text>
                                                    <text
                                                        x={x + 20}
                                                        y={265 + i * 55}
                                                        fill="hsl(var(--muted-foreground))"
                                                        fontSize="10"
                                                    >
                                                        {tool.description.slice(0, 40)}
                                                    </text>
                                                    {tool.description.length > 40 && (
                                                        <text
                                                            x={x + 20}
                                                            y={277 + i * 55}
                                                            fill="hsl(var(--muted-foreground))"
                                                            fontSize="10"
                                                        >
                                                            {tool.description.slice(40)}
                                                        </text>
                                                    )}
                                                </g>
                                            ))}

                                            {/* Certifications */}
                                            <text x={x + 10} y={440} fill="hsl(var(--cyber))" fontSize="14" fontWeight="bold">
                                                Certifications:
                                            </text>
                                            {stage.certifications.map((cert, i) => (
                                                <text key={i} x={x + 10} y={460 + i * 20} fill="hsl(var(--foreground))" fontSize="12">
                                                    • {cert}
                                                </text>
                                            ))}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={downloadAsSVG} variant="outline" className="border-cyber text-cyber hover:bg-cyber hover:text-black">
                                <FileDown className="mr-2 h-4 w-4" /> Download SVG
                            </Button>
                            <Button onClick={downloadAsImage} variant="outline" className="border-cyber text-cyber hover:bg-cyber hover:text-black">
                                <Download className="mr-2 h-4 w-4" /> Download PNG
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Roadmap;
