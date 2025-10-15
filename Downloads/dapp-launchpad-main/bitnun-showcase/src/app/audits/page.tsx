'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertTriangle, Users, Star, Clock, DollarSign, FileCheck } from 'lucide-react'
import Link from 'next/link'
import PaymentModal from '@/components/PaymentModal'

export default function SmartContractAudits() {
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [auditForm, setAuditForm] = useState({
    projectName: '',
    contractAddress: '',
    githubRepo: '',
    description: ''
  })

  const auditPackages = [
    {
      id: "basic_audit",
      name: "Basic Audit",
      price: "$199",
      actualPrice: 199,
      duration: "2-3 days",
      description: "Affordable security review for indie developers",
      features: [
        "Automated security scanning", 
        "Basic vulnerability assessment",
        "Simple report with fixes",
        "Email support",
        "Perfect for learning projects"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "professional_audit",
      name: "Professional Audit", 
      price: "$499",
      actualPrice: 499,
      duration: "3-5 days",
      description: "Professional audit for serious projects",
      features: [
        "Manual code review",
        "Advanced security tools",
        "Gas optimization review",
        "Architecture assessment",
        "2 rounds of re-audit",
        "Live chat support"
      ],
      color: "from-purple-500 to-purple-600",
      popular: true
    },
    {
      id: "enterprise_audit",
      name: "Enterprise Audit",
      price: "$999",
      actualPrice: 999,
      duration: "5-7 days", 
      description: "Premium audit for mission-critical contracts",
      features: [
        "Multi-auditor review team",
        "Formal verification methods",
        "Economic attack vectors",
        "Integration testing",
        "Unlimited re-audits",
        "24/7 priority support",
        "Bug bounty consultation"
      ],
      color: "from-green-500 to-green-600"
    }
  ]

  const securityStats = [
    { metric: "$2.8B+", label: "Value Secured", icon: <Shield className="w-6 h-6" /> },
    { metric: "850+", label: "Audits Completed", icon: <FileCheck className="w-6 h-6" /> },
    { metric: "99.8%", label: "Success Rate", icon: <CheckCircle className="w-6 h-6" /> },
    { metric: "0", label: "Post-Audit Exploits", icon: <Star className="w-6 h-6" /> }
  ]

  const vulnerabilityTypes = [
    "Reentrancy Attacks",
    "Integer Overflow/Underflow", 
    "Access Control Issues",
    "Front-running Vulnerabilities",
    "Flash Loan Exploits",
    "MEV Vulnerabilities",
    "Governance Attacks",
    "Oracle Manipulation"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Floating Price Alert */}
      <div className="fixed top-20 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-lg max-w-sm"
        >
          <div className="text-green-400 font-semibold text-sm mb-1">🔥 PRICE GUARANTEE</div>
          <div className="text-white font-bold text-lg">20% Below Any Competitor</div>
          <div className="text-gray-300 text-sm mb-3">From $199 vs competitors' $2,000+</div>
          <Link href="/pricing" className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors">
            View All Pricing →
          </Link>
        </motion.div>
      </div>

      {/* Header */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-blue-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Smart Contract Audits
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Professional security audits by certified blockchain security experts. 
              Protect your protocol and users with comprehensive vulnerability assessments.
            </p>
            <div className="flex items-center justify-center space-x-4 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">ISO 27001 Certified</span>
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">500+ Protocols Secured</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {securityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
              >
                <div className="text-blue-400 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.metric}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Packages */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Audit Packages</h2>
            <p className="text-xl text-gray-300">Choose the right level of security for your protocol</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {auditPackages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  pkg.popular 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                    : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-blue-500'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mb-2">
                    {pkg.price}
                  </div>
                  <div className="flex items-center justify-center text-gray-400 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    {pkg.duration}
                  </div>
                  <p className="text-gray-300">{pkg.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setSelectedAudit(pkg.id)
                    setShowPaymentModal(true)
                  }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r ${pkg.color} hover:opacity-90 transform hover:scale-105`}
                >
                  Order Audit - {pkg.price}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Detection */}
      <section className="py-20 px-6 bg-gradient-to-r from-red-900/20 to-orange-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                <AlertTriangle className="inline w-10 h-10 text-red-400 mr-3" />
                Vulnerability Detection
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our comprehensive audit process identifies critical vulnerabilities that could compromise your protocol's security and user funds.
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Critical Security Areas</h3>
                <div className="grid grid-cols-2 gap-3">
                  {vulnerabilityTypes.map((vuln, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-gray-300">{vuln}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-500/20">
                <h3 className="text-xl font-semibold text-white mb-3">Our Process</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-gray-300">Initial code review and architecture analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-gray-300">Automated scanning with custom security tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-gray-300">Manual exploitation and penetration testing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span className="text-gray-300">Detailed report with remediation steps</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Revenue Potential */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12 border border-green-500/20"
          >
            <DollarSign className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Affordable Security for Everyone</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">$199-$999</div>
                <div className="text-gray-300">Per Audit (Not $10K+)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-gray-300">Client Retention Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">3-5x</div>
                <div className="text-gray-300">ROI for Clients</div>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Professional security audits that indie developers and small projects can actually afford. No more $10K+ barriers to entry!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity">
                Start Audit Business
              </button>
              <Link href="/business-dashboard">
                <button className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors">
                  View Revenue Dashboard
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && selectedAudit && (
        <PaymentModal
          serviceKey={selectedAudit}
          serviceName={auditPackages.find(pkg => pkg.id === selectedAudit)?.name || ''}
          amount={auditPackages.find(pkg => pkg.id === selectedAudit)?.actualPrice || 0}
          metadata={{
            projectName: auditForm.projectName,
            contractAddress: auditForm.contractAddress,
            githubRepo: auditForm.githubRepo,
            description: auditForm.description,
            category: 'audit'
          }}
          onSuccess={() => {
            setShowPaymentModal(false)
            // Redirect to dashboard
            window.location.href = '/dashboard?success=audit_ordered'
          }}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedAudit(null)
          }}
        />
      )}
    </div>
  )
}