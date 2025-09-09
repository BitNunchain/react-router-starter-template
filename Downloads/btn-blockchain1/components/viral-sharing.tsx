"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface ViralSharingProps {
  blockchain: { addBalance?: (user: string, amount: number) => void };
}
export function ViralSharing({ blockchain }: ViralSharingProps) {
  const referralCode = "BTN-MINER-2024"
  const referrals = 12
  const [shareRewards, setShareRewards] = useState<number>(45.67)

  const shareActions = [
    {
      platform: "Twitter",
      icon: "🐦",
      reward: 5,
      action: () => {
        const text = `I'm mining BTN tokens in my browser! 🚀 Revolutionary blockchain with AI consensus. Join me: ${window.location.origin}?ref=${referralCode}`
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
        handleShare("twitter")
      },
    },
    {
      platform: "Facebook",
      icon: "📘",
      reward: 5,
      action: () => {
        const url = `${window.location.origin}?ref=${referralCode}`
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        handleShare("facebook")
      },
    },
    {
      platform: "LinkedIn",
      icon: "💼",
      reward: 7,
      action: () => {
        const text = "Revolutionary browser-based blockchain mining with AI consensus!"
        const url = `${window.location.origin}?ref=${referralCode}`
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
          "_blank",
        )
        handleShare("linkedin")
      },
    },
    {
      platform: "Telegram",
      icon: "✈️",
      reward: 4,
      action: () => {
        const text = `🚀 Mining BTN tokens in browser! AI-powered blockchain revolution. Join: ${window.location.origin}?ref=${referralCode}`
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`,
          "_blank",
        )
        handleShare("telegram")
      },
    },
  ]

  const handleShare = (platform: string) => {
    // Increment social actions counter
    const currentActions = Number.parseInt(localStorage.getItem("btn_social_actions") || "0")
    localStorage.setItem("btn_social_actions", (currentActions + 1).toString())

    // Award tokens for sharing
    const reward = shareActions.find((a) => a.platform.toLowerCase() === platform)?.reward || 5
    if (blockchain) {
  blockchain.addBalance?.("user", reward)
    }

    toast.success(`+${reward} BTN tokens for sharing on ${platform}!`)
    setShareRewards((prev) => prev + reward)
  }

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    toast.success("Referral link copied to clipboard!")
  }

  return (
    <div className="dashboard-card">
      <Card>
      <CardHeader>
        <CardTitle>Viral Sharing & Referrals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{referrals}</div>
            <div className="text-sm text-muted-foreground">Referrals</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{shareRewards.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Share Rewards</div>
          </div>
        </div>

        {/* Referral Link */}
        <div>
          <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
          <div className="flex gap-2">
            <Input value={referralCode} readOnly className="font-mono" />
            <Button onClick={copyReferralLink} variant="outline">
              Copy Link
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Earn 10 BTN tokens for each person who joins using your link!
          </p>
        </div>

        {/* Social Sharing */}
        <div>
          <h4 className="font-semibold mb-3">Share & Earn</h4>
          <div className="grid grid-cols-2 gap-3">
            {shareActions.map((share) => (
              <Button
                key={share.platform}
                onClick={share.action}
                variant="outline"
                className="h-16 flex flex-col gap-1 bg-transparent"
              >
                <span className="text-2xl">{share.icon}</span>
                <span className="text-sm">{share.platform}</span>
                <Badge variant="secondary" className="text-xs">
                  +{share.reward} BTN
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Viral Challenges */}
        <div>
          <h4 className="font-semibold mb-3">Viral Challenges</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Share Streak</div>
                <div className="text-sm text-muted-foreground">Share daily for 7 days</div>
              </div>
              <Badge variant="outline">3/7 days</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Referral Master</div>
                <div className="text-sm text-muted-foreground">Refer 25 active miners</div>
              </div>
              <Badge variant="outline">{referrals}/25</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Social Butterfly</div>
                <div className="text-sm text-muted-foreground">Share on all platforms</div>
              </div>
              <Badge variant="secondary">Completed! 🎉</Badge>
            </div>
          </div>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}
