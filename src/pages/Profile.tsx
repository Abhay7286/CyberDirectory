import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
// import ToolCard from "@/components/ToolCard";
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Shield,
  Calendar,
  Settings,
  LogOut,
  Heart,
  Plus,
  ArrowUp,
  Github,
  LinkedinIcon,
  ArrowLeft,
} from "lucide-react";
import { VoteHistory, type Tool } from "@/data/tools";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
// import ErrorBoundary from "@/components/ErrorBoundary";
import CoinsIcon from '../../src/coinsicon.svg';
import Loader from "../components/Loader";
import { Helmet } from "react-helmet-async";
const WishlistTab = lazy(() => import("../components/WishlistTab"));
const UserToolsTab = lazy(() => import("../components/UserToolsTab"));
const StatsTab = lazy(() => import("../components/StatsTab"));
const VotesTab = lazy(() => import("../components/VotesTab"));

const Profile = () => {
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    bio: "",
    organization: "",
    joinDate: "",
    avatarUrl: "",
    avatarPath: "",
    linkedin: "",
    github: "",
    instagram: "",
    cyberPoints: 0,
  });
  const [wishlistTools, setWishlistTools] = useState<Tool[]>([]);
  const [userTools, setUserTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [votingHistory, setVotingHistory] = useState<VoteHistory[]>([]);

  // Hooks
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      Promise.all([
        fetchUserProfile(),
        fetchUserTools(),
        fetchWishlistTools(),
        fetchVotingHistory(user.id),
      ]).finally(() => setLoading(false));
    }
  }, [user]);



  // Fetch user profile including social links and cyberPoints
  const fetchUserProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "full_name, email, bio, organization, avatar_url, linkedin, github, instagram, cyber_points, created_at"
        )
        .eq("id", user.id)
        .single();

      // Handle case when no profile exists yet
      if (profileError && profileError.code === "PGRST116") {
        // No profile yet - prompt user to fill data
        setProfile({
          fullName: "",
          email: user.email || "",
          bio: "",
          organization: "",
          joinDate: "",
          avatarUrl: "",
          avatarPath: "",
          linkedin: "",
          github: "",
          instagram: "",
          cyberPoints: 0,
        });
        toast({
          title: "Profile missing",
          description: "Please fill in your profile data",
          variant: "default",
        });
        return;
      }
      if (profileError) throw profileError;

      let avatarPath = "";
      let avatarUrl = "";

      if (profileData?.avatar_url) {
        avatarPath = profileData.avatar_url;
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(profileData.avatar_url);
        avatarUrl = data?.publicUrl || "";
      }

      setProfile({
        fullName: profileData.full_name || "",
        email: profileData.email || user.email || "",
        bio: profileData.bio || "",
        organization: profileData.organization || "",
        joinDate: profileData.created_at || "",
        avatarPath: avatarPath,
        avatarUrl: avatarUrl,
        linkedin: profileData.linkedin || "",
        github: profileData.github || "",
        instagram: profileData.instagram || "",
        cyberPoints: profileData.cyber_points || 0,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  // Fetch user tools submitted
  const fetchUserTools = async () => {
    try {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("submitted_by", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setUserTools(data as Tool[]);
    } catch (error) {
      console.error("Error fetching user tools:", error);
      toast({
        title: "Error",
        description: "Failed to load your tools",
        variant: "destructive",
      });
    }
  };

  // Fetch wishlist tools
  const fetchWishlistTools = async () => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("tool:tool_id(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      const tools = data.map((item: any) => item.tool).filter(Boolean);
      setWishlistTools(tools as Tool[]);
    } catch (error) {
      console.error("Error fetching wishlist tools:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    }
  };

  // Avatar file change handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const fetchVotingHistory = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("tool_votes")
        .select(
          `tool_id, vote_type, created_at, comment, tools!tool_votes_tool_id_fkey(name, category, type)`
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const processedData = data.map((vote) => ({
        tool_id: vote.tool_id,
        tool_name: vote.tools?.name,
        tool_category: vote.tools?.category,
        tool_type: vote.tools?.type || "",
        vote_type: vote.vote_type,
        created_at: vote.created_at,
        comment: vote.comment || undefined,
      }));

      setVotingHistory(processedData);
    } catch (error) {
      console.error("Error loading voting history:", error);
      toast({
        title: "Error",
        description: "Failed to load voting history",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      // Use existing relative avatar path from profile state
      let avatarFilePath = profile.avatarPath || null;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${uuidv4()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Remove old avatar if it exists and is different from new file path
        if (profile.avatarPath && profile.avatarPath !== filePath) {
          await supabase.storage.from('avatars').remove([profile.avatarPath]);
        }

        // Upload new avatar file
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        avatarFilePath = filePath;
      }

      // Prepare update, include avatar_url only if avatarFilePath is set
      const updates: {
        full_name: string | null;
        email: string | null;
        bio: string | null;
        organization: string | null;
        linkedin: string | null;
        github: string | null;
        instagram: string | null;
        updated_at: string;
        avatar_url?: string;
      } = {
        full_name: profile.fullName || null,
        email: profile.email || null,
        bio: profile.bio || null,
        organization: profile.organization || null,
        linkedin: profile.linkedin || null,
        github: profile.github || null,
        instagram: profile.instagram || null,
        updated_at: new Date().toISOString(),
      };

      if (avatarFilePath) {
        updates.avatar_url = avatarFilePath;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          created_at: profile.joinDate || new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview("");
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to ensure visible update
      await fetchUserProfile();

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };

  const usernameRegex = /^[a-zA-Z0-9_.]{3,30}$/;

  const onLinkedInChange = (e: { target: { value: any; }; }) => {
    const val = e.target.value;
    if (val === "" || /^[a-zA-Z0-9_\.~-]*$/.test(val)) {
      setProfile({ ...profile, linkedin: val });
    }
  };

  const onGithubChange = (e: { target: { value: any; }; }) => {
    const val = e.target.value;
    if (val === "" || /^[a-zA-Z0-9_\.~-]*$/.test(val)) {
      setProfile({ ...profile, github: val });
    }
  };

  const onInstagramChange = (e: { target: { value: any; }; }) => {
    const val = e.target.value;
    if (val === "" || /^[a-zA-Z0-9_\.~-]*$/.test(val)) {
      setProfile({ ...profile, instagram: val });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Could not sign out",
        variant: "destructive",
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Main render
  return (
    <>
      <Helmet>
        <title>{profile.fullName || "User"} - CyberDirectory Profile</title>
        <meta
          name="description"
          content={profile.bio || `Profile page for ${profile.fullName || "user"} on CyberDirectory.`}
        />
        <meta property="og:title" content={`${profile.fullName || "User"} - CyberDirectory Profile`} />
        <meta
          property="og:description"
          content={profile.bio || `Discover the profile of ${profile.fullName || "user"} on CyberDirectory.`}
        />
        <meta property="og:image" content={profile.avatarUrl || "/default-avatar.png"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            className="flex items-center px-4 py-2 rounded-lg border text-base font-medium bg-white text-black hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          {/* Profile Header Card */}
          <Card>
            <CardHeader>
              <div className="grid items-center justify-between sm:grid-none sm:flex">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={avatarPreview || profile.avatarUrl || "/placeholder-avatar.jpg"}
                      className="h-20 w-20 rounded-lg object-cover" rel="preload"
                    />
                    <AvatarFallback className="text-lg">
                      {profile.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                    {/* CyberCoins display */}
                    <div className="flex items-center space-x-2 mt-2">
                      <img src={CoinsIcon} alt="Coins Icon" className="h-5 w-5 text-yellow-400" />
                      <span className="font-semibold text-lg">{profile.cyberPoints} CyberCoin</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">Premium Member</Badge>
                      <Badge variant="outline">Verified</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-4">
                  {/* Social Media Icons with links */}
                  {profile.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      className="hover:text-blue-600"
                    >
                      <LinkedinIcon className="h-6 w-6" />
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                      className="hover:text-gray-700"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                  )}
                  {profile.instagram && (
                    <a
                      href={`https://instagram.com/${profile.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram"
                      className="hover:text-pink-600"
                    >
                      {/* Instagram svg or icon */}
                      <svg
                        className="h-6 w-6 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5a3.75 3.75 0 003.75-3.75v-8.5A3.75 3.75 0 0016.25 4h-8.5zm4.25 2.75a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm4.75-.25a.75.75 0 110 1.5.75.75 0 010-1.5z" />
                      </svg>
                    </a>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                    style={{ transform: 'translateY(-6px)' }}
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column - Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="cursor-pointer"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={profile.organization}
                    onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                {/* Social Media Links Inputs */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="text"
                    placeholder="e.g. johnsmith"
                    value={profile.linkedin}
                    onChange={onLinkedInChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    type="text"
                    placeholder="e.g. johnsmith"
                    value={profile.github}
                    onChange={onGithubChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="text"
                    placeholder="e.g. yourhandle"
                    value={profile.instagram}
                    onChange={onInstagramChange}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setAvatarPreview("");
                        setAvatarFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Right Column - Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto">
                <TabsTrigger value="profile" className="text-xs sm:text-sm p-2">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="text-xs sm:text-sm p-3">
                  <span className="hidden sm:inline">Wishlist ({wishlistTools.length})</span>
                  <span className="sm:hidden">List ({wishlistTools.length})</span>
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs sm:text-sm p-3">
                  <span className="hidden sm:inline">My Tools ({userTools.length})</span>
                  <span className="sm:hidden">Tools ({userTools.length})</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs sm:text-sm p-2">
                  Stats
                </TabsTrigger>
                <TabsTrigger value="votes" className="text-xs sm:text-sm p-2">
                  Votes
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" /> About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {profile.bio || "No bio provided"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" /> Account Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Member Since</span>
                      <span className="text-sm text-muted-foreground">
                        {profile.joinDate
                          ? new Date(profile.joinDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Email</span>
                      <span className="text-sm text-muted-foreground">{profile.email}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="space-y-6">
                <Suspense fallback={<Loader />}>
                  <WishlistTab wishlistTools={wishlistTools} fetchWishlistTools={fetchWishlistTools} />
                </Suspense>
              </TabsContent>

              {/* My Tools Tab */}
              <TabsContent value="tools" className="space-y-6">
                <Suspense fallback={<Loader />}>
                  <UserToolsTab userTools={userTools} />
                </Suspense>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="stats" className="space-y-6">
                <Suspense fallback={<Loader />}>
                  <StatsTab userTools={userTools} wishlistTools={wishlistTools} joinDate={profile.joinDate} />
                </Suspense>
              </TabsContent>

              {/* Votes Tab */}
              <TabsContent value="votes" className="space-y-6">
                <Suspense fallback={<Loader />}>
                  <VotesTab votingHistory={votingHistory} />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
