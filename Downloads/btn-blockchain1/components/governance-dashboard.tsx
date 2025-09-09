"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Proposal {
	id: number
	title: string
	description: string
	yesVotes: number
	noVotes: number
	endTime: number
	active: boolean
}

export default function GovernanceDashboard() {
	const [proposals, setProposals] = useState<Proposal[]>([])
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [duration, setDuration] = useState(60) // seconds
	const [voted, setVoted] = useState<Record<number, boolean>>({})

	const handleCreateProposal = () => {
		if (!title || !description || duration <= 0) return
		const id = proposals.length
		setProposals([
			...proposals,
			{
				id,
				title,
				description,
				yesVotes: 0,
				noVotes: 0,
				endTime: Date.now() + duration * 1000,
				active: true,
			},
		])
		setTitle("")
		setDescription("")
		setDuration(60)
	}

	const handleVote = (id: number, support: boolean) => {
		setProposals((prev) =>
			prev.map((p) =>
				p.id === id
					? {
							...p,
							yesVotes: support ? p.yesVotes + 1 : p.yesVotes,
							noVotes: !support ? p.noVotes + 1 : p.noVotes,
						}
					: p
			)
		)
		setVoted((prev) => ({ ...prev, [id]: true }))
	}

	// End expired proposals
	const now = Date.now()
	proposals.forEach((p) => {
		if (p.active && now > p.endTime) {
			p.active = false
		}
	})

		return (
				<div className="dashboard-card">
					<Card className="bg-white/80 shadow-lg mt-8">
			<CardHeader>
				<CardTitle>Governance & Voting</CardTitle>
				<CardDescription>Decentralized proposals and community voting</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-6">
					<div className="font-semibold mb-2">Create Proposal</div>
					<Input
						placeholder="Proposal Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="mb-2"
					/>
					<Input
						placeholder="Proposal Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="mb-2"
					/>
					<Input
						type="number"
						min={10}
						max={3600}
						value={duration}
						onChange={(e) => setDuration(Number(e.target.value))}
						className="mb-2"
					/>
					<Button onClick={handleCreateProposal} variant="default">
						Create Proposal
					</Button>
				</div>
				<div className="space-y-6">
					{proposals.length === 0 ? (
						<div className="text-muted-foreground text-sm">No proposals yet.</div>
					) : (
						proposals.map((p) => (
							<Card key={p.id} className="mb-4">
								<CardHeader>
									<CardTitle>{p.title}</CardTitle>
									<CardDescription>{p.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex gap-4 items-center mb-2">
										<span className="text-xs">Ends: {new Date(p.endTime).toLocaleTimeString()}</span>
										<span className="text-xs font-bold text-green-700">Yes: {p.yesVotes}</span>
										<span className="text-xs font-bold text-red-700">No: {p.noVotes}</span>
										<span className="text-xs font-bold">Status: {p.active ? "Active" : "Closed"}</span>
									</div>
									{p.active && !voted[p.id] ? (
										<div className="flex gap-2">
											<Button size="sm" variant="default" onClick={() => handleVote(p.id, true)}>
												Vote Yes
											</Button>
											<Button size="sm" variant="outline" onClick={() => handleVote(p.id, false)}>
												Vote No
											</Button>
										</div>
									) : (
										<div className="text-xs text-muted-foreground">Voting closed or already voted.</div>
									)}
								</CardContent>
							</Card>
						))
					)}
				</div>
			</CardContent>
			</Card>
			</div>
		)
	}
