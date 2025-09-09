"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserStats {
  level: number
  xp: number
  xpToNext: number
  totalTokens: number
  blocksMinedToday: number
  streak: number
  rank: number
  achievements: Achievement[]
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

import type { Blockchain } from "@/lib/blockchain"
export function UserProfile({ blockchain, mining }: { blockchain: Blockchain; mining: { getHashRate: () => number } }) {
  const getInitialStats = () => {
    const profile = blockchain?.getUserProfile("user") as Partial<UserStats> | undefined;
    return {
      level: typeof profile?.level === "number" ? profile.level : 1,
      xp: typeof profile?.xp === "number" ? profile.xp : 0,
      xpToNext: typeof profile?.xpToNext === "number" ? profile.xpToNext : 100,
      totalTokens: blockchain?.getBalance("user") ?? 0,
      blocksMinedToday: typeof profile?.blocksMinedToday === "number" ? profile.blocksMinedToday : 0,
      streak: typeof profile?.streak === "number" ? profile.streak : 0,
      rank: typeof profile?.rank === "number" ? profile.rank : 1,
      achievements: Array.isArray(profile?.achievements) ? profile.achievements as Achievement[] : [
        {
          id: "first_block",
          name: "First Block",
          description: "Mine your first block",
          icon: "🎯",
          unlocked: false,
          progress: 0,
          maxProgress: 1,
        },
        {
          id: "speed_demon",
          name: "Speed Demon",
          description: "Achieve 10,000 H/s",
          icon: "⚡",
          unlocked: false,
          progress: 0,
          maxProgress: 10000,
        },
        {
          id: "token_collector",
          name: "Token Collector",
          description: "Earn 100 BTN tokens",
          icon: "💰",
          unlocked: false,
          progress: 0,
          maxProgress: 100,
        },
        {
          id: "social_miner",
          name: "Social Miner",
          description: "Complete 50 social actions",
          icon: "👥",
          unlocked: false,
          progress: 0,
          maxProgress: 50,
        },
        {
          id: "streak_master",
          name: "Streak Master",
          description: "Mine for 7 consecutive days",
          icon: "🔥",
          unlocked: false,
          progress: 0,
          maxProgress: 7,
        },
      ],
    };
  };

  const [userStats, setUserStats] = useState<UserStats>(getInitialStats());

  useEffect(() => {
    const updateStats = () => {
      if (!blockchain || !mining) return;
      const profile = blockchain.getUserProfile("user") || {};
      const tokens = blockchain.getBalance("user");
      const blocks = blockchain.getChainLength();
      const hashRate = mining.getHashRate();
      const totalXP = Math.floor(tokens * 10 + blocks * 50);
      const level = typeof profile.level === "number" ? profile.level : Math.floor(totalXP / 100) + 1;
      const currentLevelXP = typeof profile.xp === "number" ? profile.xp : (typeof totalXP === "number" ? totalXP % 100 : 0);
      const xpToNext = typeof profile.xpToNext === "number"
        ? profile.xpToNext
        : 100 - (typeof currentLevelXP === "number" ? currentLevelXP : 0);
      const achievementsArr =
        Array.isArray(profile.achievements)
          ? profile.achievements
          : userStats.achievements;
      const updatedAchievements = achievementsArr.map((achievement: Achievement) => {
        switch (achievement.id) {
          case "first_block":
            return { ...achievement, progress: Math.min(blocks, 1), unlocked: blocks >= 1 };
          case "speed_demon":
            return { ...achievement, progress: Math.min(hashRate, 10000), unlocked: hashRate >= 10000 };
          case "token_collector":
            return { ...achievement, progress: Math.min(tokens, 100), unlocked: tokens >= 100 };
          case "social_miner":
            const socialActions = Number.parseInt(localStorage.getItem("btn_social_actions") || "0");
            return { ...achievement, progress: Math.min(socialActions, 50), unlocked: socialActions >= 50 };
          case "streak_master":
            const streak = Number.parseInt(localStorage.getItem("btn_mining_streak") || "0");
            return { ...achievement, progress: Math.min(streak, 7), unlocked: streak >= 7 };
          default:
            return achievement;
        }
      });
      setUserStats((prev) => ({
        ...prev,
        level,
        xp: currentLevelXP,
        xpToNext,
        totalTokens: tokens,
        blocksMinedToday: blocks,
        achievements: updatedAchievements,
        streak: typeof profile.streak === "number" ? profile.streak : prev.streak,
        rank: typeof profile.rank === "number" ? profile.rank : prev.rank,
      }));
    };
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [blockchain, mining, userStats.achievements]);

  return (
    <div className="dashboard-card">
      <Card className="bg-white/60 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-2">
      <CardHeader className="border-b border-gradient-to-r from-indigo-300 via-blue-300 to-purple-300">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12 animate-pulse">
            <AvatarImage src="/blockchain-miner-avatar.jpg" />
            <AvatarFallback>BM</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xl font-bold">Blockchain Miner</div>
            <div className="text-sm text-muted-foreground">
              Level {userStats.level} • Rank #{userStats.rank}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* XP Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Experience</span>
            <span>
              {userStats.xp}/{userStats.xp + userStats.xpToNext} XP
            </span>
          </div>
          <Progress value={(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">{userStats.xpToNext} XP to next level</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{userStats.totalTokens.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Total BTN</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">{userStats.blocksMinedToday}</div>
            <div className="text-xs text-muted-foreground">Blocks Today</div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-semibold mb-3">Achievements</h4>
          <div className="grid grid-cols-1 gap-2">
            {userStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-xl border border-gradient-to-r from-green-200 via-blue-200 to-purple-200 shadow transition-transform hover:scale-[1.02] ${
                  achievement.unlocked ? "bg-green-50/80" : "bg-white/40"
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1 mt-1" />
                </div>
                {achievement.unlocked && (
                  <Badge variant="default" className="text-xs">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}
