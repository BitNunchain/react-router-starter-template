"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeaderboardEntry {
  rank: number
  username: string
  tokens: number
  hashRate: number
  blocks: number
  level: number
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  blockchain: {
    nativeStorage: {
      userProfiles: Map<string, Record<string, unknown>>
    }
    getBalance: (address: string) => number
  }
  mining?: unknown
}

export function Leaderboard({ blockchain, mining }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Get all user profiles from blockchain
  const profiles = blockchain?.nativeStorage?.userProfiles ? Array.from(blockchain.nativeStorage.userProfiles.entries()) as [string, Record<string, unknown>][] : [];
  const entries: LeaderboardEntry[] = profiles.map(([address, profile], idx) => {
    const tokens = blockchain.getBalance(address);
    const hashRate = typeof profile.hashRate === "number" ? profile.hashRate : 0;
    const blocks = typeof profile.blocksMined === "number" ? profile.blocksMined : 0;
    const level = typeof profile.level === "number" ? profile.level : Math.floor((tokens * 10) / 100) + 1;
    return {
      rank: idx + 1,
      username: typeof profile.username === "string" ? profile.username : address.slice(0, 8),
      tokens,
      hashRate,
      blocks,
      level,
      isCurrentUser: address === "user"
    };
  });
    // Sort by tokens and update ranks
    const sorted = entries.sort((a, b) => b.tokens - a.tokens);
    sorted.forEach((user, index) => {
      user.rank = index + 1;
    });
    setLeaderboard(sorted);
  // Removed unused interval variable
  // const interval = setInterval(() => {
  //   const sorted = entries.sort((a, b) => b.tokens - a.tokens);
  //   sorted.forEach((user, index) => {
  //     user.rank = index + 1;
  //   });
  //   setLeaderboard(sorted);
  // }, 5000);
  // return () => clearInterval(interval);
  }, [blockchain, mining]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🥇 #1</Badge>
    if (rank === 2) return <Badge className="bg-gray-400">🥈 #2</Badge>
    if (rank === 3) return <Badge className="bg-amber-600">🥉 #3</Badge>
    return <Badge variant="outline">#{rank}</Badge>
  }

  return (
    <div className="dashboard-card">
      <Card className="bg-white/60 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-2">
      <CardHeader className="border-b border-gradient-to-r from-indigo-300 via-blue-300 to-purple-300">
        <CardTitle className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <svg className="w-8 h-8 text-indigo-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20m10-10H2" /></svg>
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokens">BTN Tokens</TabsTrigger>
            <TabsTrigger value="hashrate">Hash Rate</TabsTrigger>
            <TabsTrigger value="blocks">Blocks Mined</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-2 mt-4">
            {leaderboard
              .sort((a, b) => b.tokens - a.tokens)
              .map((user, index) => (
                <div
                  key={user.username}
                  className={`flex items-center gap-3 p-3 rounded-xl border border-gradient-to-r from-indigo-200 via-blue-200 to-purple-200 shadow transition-transform hover:scale-[1.02] ${
                    user.isCurrentUser ? "bg-indigo-50/80" : "bg-white/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getRankBadge(index + 1)}
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-lg">{user.username}</div>
                    <div className="text-sm text-muted-foreground">Level {user.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{user.tokens.toFixed(2)} BTN</div>
                    <div className="text-xs text-muted-foreground">{user.blocks} blocks</div>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="hashrate" className="space-y-2 mt-4">
            {leaderboard
              .sort((a, b) => b.hashRate - a.hashRate)
              .map((user, index) => (
                <div
                  key={user.username}
                  className={`flex items-center gap-3 p-3 rounded-xl border border-gradient-to-r from-green-200 via-blue-200 to-purple-200 shadow transition-transform hover:scale-[1.02] ${
                    user.isCurrentUser ? "bg-green-50/80" : "bg-white/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getRankBadge(index + 1)}
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-lg">{user.username}</div>
                    <div className="text-sm text-muted-foreground">Level {user.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{user.hashRate.toLocaleString()} H/s</div>
                    <div className="text-xs text-muted-foreground">{user.tokens.toFixed(2)} BTN</div>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="blocks" className="space-y-2 mt-4">
            {leaderboard
              .sort((a, b) => b.blocks - a.blocks)
              .map((user, index) => (
                <div
                  key={user.username}
                  className={`flex items-center gap-3 p-3 rounded-xl border border-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 shadow transition-transform hover:scale-[1.02] ${
                    user.isCurrentUser ? "bg-purple-50/80" : "bg-white/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getRankBadge(index + 1)}
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-lg">{user.username}</div>
                    <div className="text-sm text-muted-foreground">Level {user.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">{user.blocks} blocks</div>
                    <div className="text-xs text-muted-foreground">{user.hashRate.toLocaleString()} H/s</div>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      </Card>
    </div>
  )
}
