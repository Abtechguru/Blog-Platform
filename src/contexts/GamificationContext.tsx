import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

interface GamificationContextType {
  points: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  addPoints: (amount: number, reason: string) => void;
  checkAchievement: (id: string, progress: number) => void;
  leaderboard: { name: string; points: number; avatar: string }[];
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState(1250);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'Early Adopter', description: 'Joined during beta', icon: '🌟', unlockedAt: new Date() },
    { id: '2', name: 'Voracious Reader', description: 'Read 10 articles', icon: '📚', unlockedAt: new Date() },
  ]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'read_50', title: 'Bookworm', description: 'Read 50 articles', points: 500, completed: false, progress: 12, maxProgress: 50 },
    { id: 'share_10', title: 'Influencer', description: 'Share 10 articles', points: 300, completed: false, progress: 3, maxProgress: 10 },
    { id: 'comment_5', title: 'Voice', description: 'Comment on 5 articles', points: 150, completed: true, progress: 5, maxProgress: 5 },
  ]);

  // Mock Leaderboard
  const leaderboard = [
    { name: 'Sarah J.', points: 15400, avatar: '' },
    { name: 'Michael K.', points: 12350, avatar: '' },
    { name: 'You', points: points, avatar: '' },
    { name: 'David O.', points: 8900, avatar: '' },
    { name: 'Jessica T.', points: 5600, avatar: '' },
  ];

  useEffect(() => {
    // Calculate level based on points (simple formula: level = floor(points / 1000) + 1)
    const newLevel = Math.floor(points / 1000) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`Level Up! You are now level ${newLevel}! 🎉`);
    }
  }, [points, level]);

  const addPoints = (amount: number, reason: string) => {
    setPoints((prev) => prev + amount);
    toast.success(`+${amount} Points: ${reason}`);
  };

  const checkAchievement = (id: string, increment: number = 1) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id && !ach.completed) {
          const newProgress = Math.min(ach.progress + increment, ach.maxProgress);
          const completed = newProgress >= ach.maxProgress;
          
          if (completed && !ach.completed) {
            addPoints(ach.points, `Achievement Unlocked: ${ach.title}`);
            toast.success(`Achievement Unlocked: ${ach.title} 🏆`);
          }
          
          return { ...ach, progress: newProgress, completed };
        }
        return ach;
      })
    );
  };

  return (
    <GamificationContext.Provider value={{ points, level, badges, achievements, addPoints, checkAchievement, leaderboard }}>
      {children}
    </GamificationContext.Provider>
  );
};
