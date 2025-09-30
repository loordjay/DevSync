import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar"; 
import { Camera, RefreshCw, MapPin, Mail, Link, X, Plus, User, Code, Briefcase, Settings, ArrowRight } from "lucide-react";
import { SiLeetcode, SiCodechef, SiHackerrank, SiHackerearth, SiCodeforces, SiLinkedin, SiGitlab, SiGithub } from "react-icons/si";
import { Button } from "../ui/button";

// --- Configuration & Utility ---

const PRIMARY_TEXT = "text-primary";
const CARD_BG = "bg-card";
const BORDER_COLOR = "border-border";
const INPUT_BG = "bg-input";
const RING_COLOR = "focus:ring-ring";

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

const SectionCard = ({ title, icon: Icon, children, className = "", delay = 0.1 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    className={`shadow-lg rounded-xl ${CARD_BG} p-6 sm:p-8 ${className} border ${BORDER_COLOR} transition-shadow duration-300 hover:shadow-xl`}
  >
    <h3 className={`text-xl sm:text-2xl font-bold text-foreground mb-2 flex items-center gap-2`}>
      {Icon && <Icon className="w-6 h-6" />}
      {title}
    </h3>
    {children}
  </motion.div>
);

const defaultProfileData = {
  name: "",
  email: "",
  bio: "",
  location: "",
  avatar: "/uploads/avatars/default-avatar.png",
  socialLinks: {
    github: "",
    gitlab: "",
    linkedin: "",
    website: "",
    codechef: "",
    hackerrank: "",
    leetcode: "",
    codeforces: "",
    hackerearth: ""
  },
  skills: []
};

const Profile = () => {
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(defaultProfileData);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();

        const mergedData = {
          ...defaultProfileData,
          ...data,
          socialLinks: {
            ...defaultProfileData.socialLinks,
            ...(data.socialLinks || {})
          },
          skills: data.skills || []
        };

        setProfileData(mergedData);
        setEditData(mergedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/avatar`, {
          method: 'POST',
          headers: {
            'x-auth-token': token
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload avatar');
        }

        const uploadData = await uploadResponse.json();
        editData.avatar = uploadData.avatarUrl;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();

      const mergedData = {
        ...defaultProfileData,
        ...data,
        socialLinks: {
          ...defaultProfileData.socialLinks,
          ...(data.socialLinks || {})
        },
        skills: data.skills || []
      };

      setProfileData(mergedData);
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setEditData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !editData.skills.includes(currentSkill.trim())) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading Profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-destructive mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Developer Profile
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Manage your profile, showcase your skills, and connect with other developers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <SectionCard delay={0.1} className="text-center">
              <div className="relative inline-block mb-4">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={avatarPreview || profileData.avatar}
                  alt="Profile Avatar"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-primary shadow-lg"
                />
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      onClick={triggerFileInput}
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg ${INPUT_BG} ${BORDER_COLOR} border ${RING_COLOR} focus:ring-2 focus:outline-none text-foreground text-center`}
                    placeholder="Your Name"
                  />
                ) : (
                  profileData.name || "Anonymous Developer"
                )}
              </h2>

              {!isEditing && profileData.email && (
                <p className="text-muted-foreground text-sm mb-4">{profileData.email}</p>
              )}

              {!isEditing ? (
                <Button onClick={handleEdit} className="w-full" variant="default">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                    variant="default"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Contact Info" icon={User} delay={0.2}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg ${INPUT_BG} ${BORDER_COLOR} border ${RING_COLOR} focus:ring-2 focus:outline-none text-foreground`}
                        placeholder="Your Location"
                      />
                    ) : (
                      <p className="text-foreground">{profileData.location || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg ${INPUT_BG} ${BORDER_COLOR} border ${RING_COLOR} focus:ring-2 focus:outline-none text-foreground`}
                        placeholder="Your Email"
                      />
                    ) : (
                      <p className="text-foreground break-all">{profileData.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Link className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={editData.website || ""}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg ${INPUT_BG} ${BORDER_COLOR} border ${RING_COLOR} focus:ring-2 focus:outline-none text-foreground`}
                        placeholder="Your Website"
                      />
                    ) : (
                      <p className="text-foreground break-all">{profileData.website || "Not specified"}</p>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="About Me" icon={User} delay={0.3}>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg ${INPUT_BG} ${BORDER_COLOR} border ${RING_COLOR} focus:ring-2 focus:outline-none text-foreground resize-none`}
                  placeholder="Tell us about yourself, your interests, and what you're working on..."
                />
              ) : (
                <p className="text-foreground leading-relaxed">
                  {profileData.bio || "No bio added yet. Click 'Edit Profile' to add one!"}
                </p>
              )}
            </SectionCard>

            <SectionCard title="Technical Skills" icon={Code} delay={0.4}>
              <p className="text-muted-foreground text-sm mb-4">
                Add your technical skills and technologies you're proficient in
              </p>
              {isEditing && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    className={`flex-1 px-4 py-2 rounded-lg ${INPUT_BG} ${BORDER_COLOR} border ${RING_COLOR} focus:ring-2 focus:outline-none text-foreground`}
                    placeholder="e.g., React, Node.js, Python"
                  />
                  <Button onClick={handleAddSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(isEditing ? editData.skills : profileData.skills).length > 0 ? (
                  (isEditing ? editData.skills : profileData.skills).map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`px-3 py-1.5 ${CARD_BG} ${BORDER_COLOR} border rounded-full text-sm font-medium text-foreground flex items-center gap-2 hover:shadow-md transition-shadow`}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-destructive transition-colors"
                          type="button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No skills added yet</p>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Social & Coding Profiles" icon={Briefcase} delay={0.5}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(socialIcons).map(([platform, icon]) => (
                  <div key={platform} className="flex items-center gap-3">
                    <div className="flex-shrink-0">{icon}</div>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="url"
                          value={editData.socialLinks?.[platform] ?? ""}
                          onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg ${INPUT_BG} ${BORDER_COLOR} border ${RING_COLOR} focus:ring-2 focus:outline-none text-foreground text-sm`}
                          placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                        />
                      ) : profileData.socialLinks?.[platform] ? (
                        <a
                          href={profileData.socialLinks[platform]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm break-all flex items-center gap-1 group"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <p className="text-muted-foreground text-sm">Not added</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
