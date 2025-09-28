import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// Assuming these are available, adjust paths if necessary
import Navbar from "../Navbar/Navbar"; 
import { Camera, RefreshCw, MapPin, Mail, Link, X, Plus, User, Code, Briefcase, Settings, ArrowRight } from "lucide-react";
import { SiLeetcode, SiCodechef, SiHackerrank, SiHackerearth, SiCodeforces, SiLinkedin, SiGitlab, SiGithub } from "react-icons/si";
import { Button } from "../ui/button"; // Assuming a robust Button component

// --- Configuration & Utility ---

// Use semantic Tailwind classes mapped to your CSS Variables
const PRIMARY_TEXT = "text-primary";
const CARD_BG = "bg-card";
const BORDER_COLOR = "border-border";
const INPUT_BG = "bg-input";
const RING_COLOR = "focus:ring-ring";

// Icon mapping - using foreground and primary/accent colors for visibility
const socialIcons = {
  github: <SiGithub className="w-5 h-5 text-foreground" />,
  gitlab: <SiGitlab className="w-5 h-5 text-accent" />,
  linkedin: <SiLinkedin className="w-5 h-5 text-primary" />,
  website: <Link className="w-5 h-5 text-primary" />,
  leetcode: <SiLeetcode className="w-5 h-5 text-accent" />,
  codechef: <SiCodechef className="w-5 h-5 text-destructive" />,
  hackerrank: <SiHackerrank className="w-5 h-5 text-chart-5" />,
  codeforces: <SiCodeforces className="w-5 h-5 text-chart-1" />,
  hackerearth: <SiHackerearth className="w-5 h-5 text-chart-3" />,
};

// Section Card: Uses CARD_BG for the component's background
const SectionCard = ({ title, icon: Icon, children, className = "", delay = 0.1 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    className={`shadow-lg rounded-xl ${CARD_BG} p-6 sm:p-8 ${className} border ${BORDER_COLOR} transition-shadow duration-300 hover:shadow-xl`}
  >
    <h3 className={`text-xl sm:text-2xl font-bold text-foreground mb-6 flex items-center gap-3 border-b border-border/70 pb-3`}>
      <Icon className={`w-6 h-6 ${PRIMARY_TEXT}`} /> 
      {title}
    </h3>
    {children}
  </motion.div>
);

const SocialLinkDisplay = ({ url, icon, name }) => {
  if (!url) return null;

  return (
    <motion.a
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center space-x-3 p-3 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary hover:bg-secondary/50 rounded-md`}
      whileHover={{ x: 2 }}
      title={`View ${name} Profile`}
    >
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <span className={`text-foreground font-medium text-base`}>{name}</span>
      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
    </motion.a>
  );
};

// Reusable Input Component
const HyperInput = ({ label, name, value, onChange, placeholder, type = "text", rows = 1, readOnly = false }) => (
    <div className="space-y-1">
        <label className={`text-sm font-medium text-muted-foreground block`}>{label}</label>
        {rows > 1 ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`w-full px-4 py-3 ${INPUT_BG} border ${BORDER_COLOR} text-foreground placeholder-muted-foreground ${RING_COLOR} focus:ring-2 focus:border-primary focus:bg-background/50 focus:outline-none text-base transition-all rounded-md ${readOnly ? 'bg-secondary cursor-not-allowed' : ''}`}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`w-full px-4 py-2.5 ${INPUT_BG} border ${BORDER_COLOR} text-foreground placeholder-muted-foreground ${RING_COLOR} focus:ring-2 focus:border-primary focus:bg-background/50 focus:outline-none text-base transition-all rounded-md ${readOnly ? 'bg-secondary cursor-not-allowed' : ''}`}
            />
        )}
    </div>
);

const HyperSocialInput = ({ label, linkName, value, onChange }) => {
  const Icon = socialIcons[linkName] || <Link className="w-5 h-5 text-muted-foreground" />;
  
  const handleSocialChange = (e) => {
    onChange({
      target: {
        name: `socialLinks.${linkName}`,
        value: e.target.value
      }
    });
  };

  return (
    <div className="space-y-1">
      <label className={`text-sm font-medium text-muted-foreground block`}>{label}</label>
      <div className={`flex items-center overflow-hidden border ${BORDER_COLOR} ${RING_COLOR} focus-within:ring-2 focus-within:border-primary transition-all ${INPUT_BG} rounded-md`}>
        <span className={`p-3 text-muted-foreground border-r ${BORDER_COLOR} bg-secondary/70`}>
          {Icon}
        </span> 
        <input
          type="text"
          name={`socialLinks.${linkName}`}
          value={value || ""}
          onChange={handleSocialChange}
          placeholder={`Enter profile URL...`}
          className="w-full px-3 py-2.5 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
        />
      </div>
    </div>
  );
};

// --- Main Profile Component ---

const AdaptiveProProfile = () => {
  const initialData = {
    name: "Anya Sharma",
    email: "anya.sharma@prodev.com",
    bio: "Senior Software Engineer specializing in modern JavaScript frameworks (React, Next.js) and robust backend architecture (Node.js, GraphQL). Passionate about scalable design, clean code, and effective team leadership, delivering high-impact, low-latency applications.",
    location: "Global Remote",
    avatar: "https://api.dicebear.com/6.x/micah/svg?seed=AnyaSharmaPro", 
    socialLinks: {
      github: "https://github.com/anyasharma",
      linkedin: "https://linkedin.com/in/anyasharma",
      website: "https://prodev.io/anyasharma",
      leetcode: "https://leetcode.com/anyacoder",
      gitlab: "", codechef: "", hackerrank: "", codeforces: "", hackerearth: ""
    },
    skills: ["React", "Next.js", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Tailwind CSS", "AWS", "Docker", "Kubernetes"]
  };
  
  const [profileData, setProfileData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...initialData });
  const [isSaving, setIsSaving] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // --- Handlers (Functional core remains) ---

  useEffect(() => {
    const fetchProfile = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setIsLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleEditToggle = () => {
    setEditData(isEditing ? { ...profileData } : { ...profileData });
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value }
      }));
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };
  
  const handleAddSkill = () => {
    if (currentSkill.trim() && !editData.skills.includes(currentSkill.trim())) {
      setEditData(prev => ({ ...prev, skills: [...prev.skills, currentSkill.trim()] }));
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleGenerateAvatar = async () => {
    if (isEditing) {
        const seed = Math.random().toString(36).substring(2, 8);
        const newAvatarUrl = `https://api.dicebear.com/6.x/micah/svg?seed=${seed}`;
        setAvatarPreview(newAvatarUrl);
        setAvatarFile(null);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => { setAvatarPreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
      let updatedProfile = { ...editData, avatar: avatarPreview || editData.avatar };
      setAvatarFile(null);
      setAvatarPreview(null);
      setProfileData(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const currentAvatarSrc = avatarPreview || (profileData.avatar.startsWith('http') ? profileData.avatar : `${import.meta.env.VITE_API_URL}${profileData.avatar}`);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-3 text-lg">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div className="pt-24 pb-16 w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          {/* Header and Controls */}
          <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 pb-5 border-b border-border">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              <span className={PRIMARY_TEXT}>Developer</span> Profile
            </h1>
            <div className="flex gap-3 mt-4 md:mt-0 flex-wrap">
              <Button
                onClick={handleEditToggle}
                className={`py-2 px-4 transition duration-200 flex items-center gap-2 font-medium rounded-lg border ${isEditing ? 'bg-secondary border-border text-secondary-foreground hover:bg-secondary/80 shadow-sm' : 'bg-primary border-primary hover:bg-primary/80 text-primary-foreground shadow-md'}`}
              >
                {isEditing ? (
                  <>
                    <X className="w-5 h-5" /> Cancel
                  </>
                ) : (
                  <>
                    <Settings className="w-5 h-5" /> Edit Profile
                  </>
                )}
              </Button>
              {isEditing && (
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="py-2 px-4 bg-chart-5 text-primary-foreground hover:bg-chart-5/80 flex items-center gap-2 font-medium rounded-lg shadow-md"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      Save Changes
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleLogout}
                className="py-2 px-4 bg-secondary text-destructive border border-destructive/70 hover:bg-destructive/10 rounded-lg shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span className="ml-2 hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>

          {/* Core Layout: Main Content + Sidebar */}
          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            
            {/* Right Column - Fixed Sidebar (Vitals, Avatar) - Order 1 on mobile */}
            <div className="lg:sticky lg:top-28 self-start space-y-8 order-1 lg:order-2">
              <SectionCard title="Personal Information" icon={User} delay={0.1} className="p-8">
                
                {/* Avatar Section */}
                <div className="text-center mb-6 border-b border-border/70 pb-6">
                  <div className={`relative w-36 h-36 rounded-full border-4 border-primary/50 shadow-lg mx-auto mb-4 overflow-hidden transition-all duration-300 hover:shadow-xl ${CARD_BG}`}>
                    <img
                      src={currentAvatarSrc}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/30 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"
                        onClick={handleAvatarClick}
                      >
                        <Camera className="h-6 w-6 mb-1 text-primary-foreground" />
                      </motion.div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />

                  {isEditing && (
                    <Button
                      onClick={handleGenerateAvatar}
                      className="text-sm p-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition duration-300 flex items-center gap-1 mx-auto mt-2 font-medium rounded-full border border-border"
                    >
                      <RefreshCw className="h-4 w-4" /> Generate Avatar
                    </Button>
                  )}
                </div>

                {/* Vitals */}
                <div className="space-y-6">
                    <HyperInput 
                        label="Full Name" 
                        name="name" 
                        value={isEditing ? editData.name : profileData.name} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                    />
                    <HyperInput 
                        label="Email Address (Not Editable)" 
                        name="email" 
                        value={profileData.email} 
                        onChange={handleChange} 
                        readOnly={true}
                    />
                    <HyperInput 
                        label="Location" 
                        name="location" 
                        value={isEditing ? editData.location : profileData.location} 
                        onChange={handleChange} 
                        readOnly={!isEditing}
                    />
                </div>

                {/* Website Link */}
                <div className="space-y-1 mt-6 pt-6 border-t border-border/70">
                    <label className={`text-sm font-medium text-muted-foreground block`}>Portfolio/Website</label>
                    {!isEditing ? (
                        <a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer" className={`text-lg font-medium ${PRIMARY_TEXT} hover:text-primary/80 truncate block`}>
                            {profileData.socialLinks.website || "No link provided"}
                        </a>
                    ) : (
                        <HyperInput 
                            name="socialLinks.website" 
                            value={editData.socialLinks.website} 
                            onChange={handleChange} 
                            placeholder="https://yourwebsite.com"
                        />
                    )}
                </div>
              </SectionCard>
            </div>

            {/* Left Column - Main Content (Scrollable) - Order 2 on mobile */}
            <div className="space-y-10 order-2 lg:order-1">

              {/* Bio Section */}
              <SectionCard title="Professional Summary" icon={Briefcase} delay={0.2}>
                {!isEditing ? (
                  <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">{profileData.bio}</p>
                ) : (
                    <HyperInput 
                        label="Summary" 
                        name="bio" 
                        value={editData.bio} 
                        onChange={handleChange} 
                        placeholder="Provide a concise and professional summary..."
                        rows={6}
                    />
                )}
              </SectionCard>

              {/* Skills Section */}
              <SectionCard title="Core Skills & Expertise" icon={Code} delay={0.3}>
                {isEditing && (
                  <div className="mb-6 border-b border-border/70 pb-5">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Add a skill (e.g., Python, Kubernetes)"
                        className={`flex-grow px-4 py-2.5 ${INPUT_BG} border ${BORDER_COLOR} text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50 focus:bg-background/50 focus:outline-none text-base rounded-md`}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      />
                      <Button
                        onClick={handleAddSkill}
                        type="button"
                        className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/80 transition-all flex items-center gap-2 font-medium rounded-lg"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {(isEditing ? editData.skills : profileData.skills).map((skill, index) => (
                    <motion.div
                      key={index}
                      className={`px-4 py-1.5 text-sm font-medium transition-all flex items-center bg-secondary/70 text-secondary-foreground border border-secondary rounded-full hover:bg-secondary/50`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100, delay: index * 0.02 }}
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 p-0.5 rounded-full hover:bg-destructive/20 transition-colors focus:outline-none"
                          aria-label="Remove skill"
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                  {profileData.skills.length === 0 && !isEditing && (
                    <p className="text-muted-foreground italic text-base">No key skills are listed.</p>
                  )}
                </div>
              </SectionCard>

              {/* Social Links Section */}
              <SectionCard title="Professional Links" icon={Link} delay={0.4}>
                <div className="space-y-8">
                  {/* Primary Professional Links */}
                  <div>
                    <h4 className={`text-lg font-semibold text-foreground/80 mb-4 border-b border-border/50 pb-2`}>Code & Career</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {isEditing ? (
                        <>
                          <HyperSocialInput label="Github" linkName="github" value={editData.socialLinks.github} onChange={handleChange} />
                          <HyperSocialInput label="Linkedin" linkName="linkedin" value={editData.socialLinks.linkedin} onChange={handleChange} />
                          <HyperSocialInput label="Gitlab" linkName="gitlab" value={editData.socialLinks.gitlab} onChange={handleChange} />
                        </>
                      ) : (
                        <>
                          <SocialLinkDisplay url={profileData.socialLinks?.github} icon={socialIcons.github} name="Github" />
                          <SocialLinkDisplay url={profileData.socialLinks?.linkedin} icon={socialIcons.linkedin} name="Linkedin" />
                          <SocialLinkDisplay url={profileData.socialLinks?.gitlab} icon={socialIcons.gitlab} name="Gitlab" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Competitive Coding Links */}
                  <div>
                    <h4 className={`text-lg font-semibold text-foreground/80 mb-4 border-b border-border/50 pt-4 pb-2`}>Competitive Platforms</h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {isEditing ? (
                        <>
                          <HyperSocialInput label="Leetcode" linkName="leetcode" value={editData.socialLinks.leetcode} onChange={handleChange} />
                          <HyperSocialInput label="Codeforces" linkName="codeforces" value={editData.socialLinks.codeforces} onChange={handleChange} />
                          <HyperSocialInput label="CodeChef" linkName="codechef" value={editData.socialLinks.codechef} onChange={handleChange} />
                          <HyperSocialInput label="Hackerrank" linkName="hackerrank" value={editData.socialLinks.hackerrank} onChange={handleChange} />
                          <HyperSocialInput label="HackerEarth" linkName="hackerearth" value={editData.socialLinks.hackerearth} onChange={handleChange} />
                        </>
                      ) : (
                        <>
                          <SocialLinkDisplay url={profileData.socialLinks?.leetcode} icon={socialIcons.leetcode} name="Leetcode" />
                          <SocialLinkDisplay url={profileData.socialLinks?.codeforces} icon={socialIcons.codeforces} name="Codeforces" />
                          <SocialLinkDisplay url={profileData.socialLinks?.codechef} icon={socialIcons.codechef} name="CodeChef" />
                          <SocialLinkDisplay url={profileData.socialLinks?.hackerrank} icon={socialIcons.hackerrank} name="Hackerrank" />
                          <SocialLinkDisplay url={profileData.socialLinks?.hackerearth} icon={socialIcons.hackerearth} name="HackerEarth" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SectionCard>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveProProfile;