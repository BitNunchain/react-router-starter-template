"use client"
// Removed duplicate export
import { useState } from "react"

interface User {
  username: string;
  email: string;
  wallet: string | null;
}
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { generateMnemonic, mnemonicToAddress } from "../../lib/utils"

export default function UserAuth({ onAuth }: { onAuth?: (user: Record<string, unknown>) => void }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState<User | null>(null)
  const [walletMnemonic, setWalletMnemonic] = useState<string>("")
  const [walletAddress, setWalletAddress] = useState<string>("")

  const handleRegister = () => {
    if (!username || !email || !password) {
      setError("All fields are required.")
      return
    }
    // Simulate registration and link to wallet (for demo)
    const newUser = { username, email, wallet: null }
    setUser(newUser)
    setAuthenticated(true)
    setError("")
    if (onAuth) onAuth(newUser)
  }

  const handleLogin = () => {
    if (!username || !password) {
      setError("Username and password required.")
      return
    }
    // Simulate login (for demo)
    setUser({ username, email, wallet: null })
    setAuthenticated(true)
    setError("")
    if (onAuth) onAuth({ username, email, wallet: null })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{authenticated ? "Welcome" : "User Registration / Login"}</CardTitle>
      </CardHeader>
      <CardContent>
        {!authenticated ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <Button onClick={handleRegister}>Register</Button>
            <Button onClick={handleLogin} variant="outline">Login</Button>
            {error && <div className="text-red-600 text-xs">{error}</div>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="font-bold">Username: {user?.username}</div>
            <div className="font-mono">Email: {user?.email}</div>
            {!walletAddress ? (
              <Button onClick={() => {
                const mnemonic = generateMnemonic()
                const address = mnemonicToAddress(mnemonic)
                setWalletMnemonic(mnemonic)
                setWalletAddress(address)
                if (user) {
                  setUser({ username: user.username, email: user.email, wallet: address })
                }
              }}>
                Create Wallet
              </Button>
            ) : (
              <div>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">Mnemonic: {walletMnemonic}</div>
                <div className="font-mono">Wallet Address: {walletAddress}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
// Removed duplicate export
