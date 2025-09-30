import { User, ExternalLink, Verified, Star, Activity } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import CardWrapper from "./CardWrapper";
import {
  SiLeetcode, SiCodechef, SiHackerrank, SiGithub, SiHackerearth, SiLinkedin,
} from "react-icons/si";

const iconMap = {
  leetcode: SiLeetcode,
  codechef: SiCodechef,
  hackerrank: SiHackerrank,
  hackerearth: SiHackerearth,
  github: SiGithub,
  linkedin: SiLinkedin,
};

export default function ProfileCard({ user }) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!user) return null;

  const platformColors = {
    'github': 'bg-gray-900 hover:bg-gray-800',
    'linkedin': 'bg-blue-600 hover:bg-blue-700',
    'twitter': 'bg-sky-500 hover:bg-sky-600',
    'portfolio': 'bg-purple-600 hover:bg-purple-700',
    'default': 'bg-slate-600 hover:bg-slate-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <CardWrapper className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          {/* Enhanced Avatar with Status */}
          <div className="flex items-center flex-col gap-4">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                      <User size={32} className="text-indigo-600" />
                    </div>
                  )}
                </div>
                
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full flex items-center justify-center"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                >
                  <Activity size={12} className="text-white" />
                </motion.div>
              </div>
              
              {user.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Verified size={14} className="text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Name & Info */}
            <div className="text-center space-y-2">
              <motion.h2 
                className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
                animate={{ opacity: isHovered ? 1 : 0.9 }}
              >
                {user.name}
                {user.isPro && <Star size={16} className="inline ml-2 text-amber-500 fill-amber-500" />}
              </motion.h2>
              
              <p className="text-sm text-slate-600 font-medium">{user.email}</p>
              
              {user.title && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold rounded-full"
                >
                  {user.title}
                </motion.div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          {user.stats && (
            <motion.div 
              className="mt-6 grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="text-lg font-bold text-indigo-600">{user.stats.projects || 0}</div>
                <div className="text-xs text-slate-600">Projects</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                <div className="text-lg font-bold text-emerald-600">{user.stats.contributions || 0}</div>
                <div className="text-xs text-slate-600">Commits</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <div className="text-lg font-bold text-purple-600">{user.stats.followers || 0}</div>
                <div className="text-xs text-slate-600">Followers</div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Platforms */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Connected Platforms</h3>
              {user.platforms?.length > 0 && (
                <span className="text-xs text-slate-500">{user.platforms.length} connected</span>
              )}
            </div>
            
            {user.platforms && user.platforms.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {user.platforms.slice(0, 6).map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="group relative"
                  >
                    <div className={`w-full h-12 flex items-center justify-center rounded-xl ${platformColors[platform.name?.toLowerCase()] || platformColors.default} text-white shadow-md transition-all duration-200 cursor-pointer group-hover:shadow-lg`}>
                      <img src={platform.url} alt={platform.name} className="w-5 h-5 object-contain filter brightness-0 invert" />
                      
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                        {platform.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50"
              >
                <ExternalLink size={24} className="text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 font-medium">No platforms connected</p>
                <p className="text-xs text-slate-400">Link your accounts to showcase your work</p>
              </motion.div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>View Full Profile</span>
            <ExternalLink size={16} />
          </motion.button>
        </div>
      </CardWrapper>
    </motion.div>
  );
}
