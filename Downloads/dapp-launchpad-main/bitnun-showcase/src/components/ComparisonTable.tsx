'use client'

import { motion } from 'framer-motion'
import { CheckCircle, X, Star, Zap, Clock, Users, Shield, TrendingDown } from 'lucide-react'

interface ComparisonTableProps {
  title?: string
  subtitle?: string
}

export default function ComparisonTable({ 
  title = "Why Choose BITNUN?",
  subtitle = "We deliver the same quality at a fraction of the cost"
}: ComparisonTableProps) {
  
  const comparisons = [
    {
      category: "Smart Contract Audits",
      features: [
        { feature: "Professional audit quality", bitnun: true, competitors: true },
        { feature: "Manual code review", bitnun: true, competitors: true },
        { feature: "Security report", bitnun: true, competitors: true },
        { feature: "Fast turnaround (24-48hrs)", bitnun: true, competitors: false },
        { feature: "Price range", bitnun: "$99 - $999", competitors: "$2,000 - $15,000" },
        { feature: "Free tier available", bitnun: true, competitors: false },
        { feature: "Unlimited revisions", bitnun: true, competitors: false }
      ]
    },
    {
      category: "Web3 Education",
      features: [
        { feature: "Professional courses", bitnun: true, competitors: true },
        { feature: "Hands-on projects", bitnun: true, competitors: true },
        { feature: "Certificates", bitnun: true, competitors: true },
        { feature: "Price per month", bitnun: "$5", competitors: "$200 - $500" },
        { feature: "Free access tier", bitnun: true, competitors: false },
        { feature: "Job placement help", bitnun: true, competitors: false },
        { feature: "1-on-1 mentoring", bitnun: true, competitors: false }
      ]
    },
    {
      category: "Token Launchpad",
      features: [
        { feature: "Professional setup", bitnun: true, competitors: true },
        { feature: "KYC integration", bitnun: true, competitors: true },
        { feature: "Marketing support", bitnun: true, competitors: true },
        { feature: "Price range", bitnun: "0.29 - 0.6 ETH", competitors: "1.5 - 5 ETH" },
        { feature: "Audit included", bitnun: true, competitors: false },
        { feature: "Success guarantee", bitnun: true, competitors: false },
        { feature: "24/7 support", bitnun: true, competitors: false }
      ]
    }
  ]

  const brands = [
    { name: "ConsenSys Diligence", known: "Auditing", pricing: "$10K+ audits" },
    { name: "OpenZeppelin", known: "Security", pricing: "$5K+ audits" },
    { name: "Alchemy University", known: "Education", pricing: "$200/month" },
    { name: "Moralis Academy", known: "Courses", pricing: "$500/month" },
    { name: "DxSale", known: "Launchpad", pricing: "2+ ETH fees" },
    { name: "PinkSale", known: "Token Launch", pricing: "1.5+ ETH fees" }
  ]

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 mb-6">
            <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-400 font-semibold">Up to 95% Savings</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Competitor Brands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            We're 20-30% Cheaper Than Industry Leaders
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/20 rounded-xl p-4 text-center border border-gray-700 hover:border-red-500/50 transition-colors"
              >
                <div className="text-white font-semibold text-sm mb-1">{brand.name}</div>
                <div className="text-gray-400 text-xs mb-2">{brand.known}</div>
                <div className="text-red-400 text-xs line-through">{brand.pricing}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Comparisons */}
        <div className="space-y-16">
          {comparisons.map((comparison, categoryIndex) => (
            <motion.div
              key={comparison.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-black/20 rounded-2xl p-8 border border-gray-700"
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                {comparison.category}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-4 px-4 text-gray-300">Feature</th>
                      <th className="text-center py-4 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">B</span>
                          </div>
                          <span className="text-green-400 font-bold">BITNUN</span>
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 text-gray-300">Competitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.features.map((item, featureIndex) => (
                      <motion.tr
                        key={featureIndex}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: featureIndex * 0.05 }}
                        className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-white">{item.feature}</td>
                        <td className="py-4 px-4 text-center">
                          {typeof item.bitnun === 'boolean' ? (
                            item.bitnun ? (
                              <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-6 h-6 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-green-400 font-semibold">{item.bitnun}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {typeof item.competitors === 'boolean' ? (
                            item.competitors ? (
                              <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-6 h-6 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-red-400 line-through">{item.competitors}</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-green-500/20">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Save 70-95%?</h3>
            <p className="text-gray-300 mb-6">
              Join thousands of developers who switched to BITNUN for professional Web3 services at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                View Pricing Plans
              </button>
              <button className="px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}