'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Users, Star, Trophy, BookOpen, Video, Code, DollarSign, Play, Award } from 'lucide-react'
import Link from 'next/link'

export default function BitnunAcademy() {
  const courses = [
    {
      title: "Blockchain Fundamentals",
      price: "$19",
      students: "12,500+",
      rating: 4.9,
      duration: "6 weeks",
      level: "Beginner",
      description: "Master the basics of blockchain technology, cryptocurrencies, and decentralized systems",
      modules: [
        "Blockchain Architecture & Consensus",
        "Cryptocurrency Economics", 
        "Smart Contract Basics",
        "DeFi Fundamentals",
        "NFTs and Digital Assets",
        "Security Best Practices"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Smart Contract Development",
      price: "$49",
      students: "8,400+", 
      rating: 4.8,
      duration: "12 weeks",
      level: "Intermediate",
      description: "Build production-ready smart contracts using Solidity, Hardhat, and best practices",
      modules: [
        "Advanced Solidity Programming",
        "Testing & Debugging",
        "Gas Optimization Techniques",
        "Security Patterns & Auditing",
        "Integration with Frontend",
        "Deployment Strategies"
      ],
      color: "from-purple-500 to-pink-500",
      popular: true
    },
    {
      title: "DeFi Protocol Engineering", 
      price: "$79",
      students: "3,200+",
      rating: 4.9,
      duration: "16 weeks",
      level: "Advanced",
      description: "Design and deploy complex DeFi protocols including DEXs, lending platforms, and yield farms",
      modules: [
        "AMM Design & Implementation",
        "Lending Protocol Architecture", 
        "Yield Farming Mechanisms",
        "Governance Token Economics",
        "Cross-Chain Integrations",
        "MEV Protection Strategies"
      ],
      color: "from-green-500 to-emerald-500"
    }
  ]

  const mentorshipTiers = [
    {
      name: "Group Mentorship",
      price: "$5/month",
      description: "Weekly group sessions with industry experts",
      features: [
        "Weekly 2-hour group sessions",
        "Access to private Discord",
        "Code review sessions",
        "Career guidance",
        "Project feedback"
      ]
    },
    {
      name: "1-on-1 Mentorship",
      price: "$25/month", 
      description: "Personal guidance from blockchain veterans",
      features: [
        "Bi-weekly 1-hour sessions",
        "Personalized learning path",
        "Direct code reviews",
        "Job referral network",
        "Portfolio development"
      ],
      popular: true
    },
    {
      name: "Enterprise Training",
      price: "$99/month",
      description: "Custom training for teams and organizations",
      features: [
        "Custom curriculum design",
        "On-site or remote training", 
        "Team assessments",
        "Certification programs",
        "Ongoing support"
      ]
    }
  ]

  const stats = [
    { number: "25,000+", label: "Students Trained", icon: <Users className="w-8 h-8" /> },
    { number: "$2.3M+", label: "Student Salary Increases", icon: <DollarSign className="w-8 h-8" /> },
    { number: "94%", label: "Job Placement Rate", icon: <Trophy className="w-8 h-8" /> },
    { number: "4.9/5", label: "Average Rating", icon: <Star className="w-8 h-8" /> }
  ]

  const successStories = [
    {
      name: "Sarah Chen",
      role: "Senior Smart Contract Developer at Uniswap",
      story: "Went from web developer to DeFi engineer in 6 months",
      salaryIncrease: "$45K → $165K",
      image: "👩‍💻"
    },
    {
      name: "Marcus Rodriguez",
      role: "Blockchain Architect at Compound",
      story: "Launched 3 successful DeFi protocols after completing our program",
      salaryIncrease: "$80K → $200K",
      image: "👨‍💼"
    },
    {
      name: "Alex Kim",
      role: "Founded $50M TVL Protocol",
      story: "Built and deployed a yield farming protocol that reached $50M TVL",
      salaryIncrease: "$0 → $500K+",
      image: "🚀"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Competitive Pricing Alert */}
      <div className="fixed top-20 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-lg max-w-sm"
        >
          <div className="text-green-400 font-semibold text-sm mb-1">🔥 97% CHEAPER</div>
          <div className="text-white font-bold text-lg">$5/month vs $200+</div>
          <div className="text-gray-300 text-sm mb-3">Full access to all courses</div>
          <Link href="/pricing" className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors">
            Compare Pricing →
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
              <GraduationCap className="w-16 h-16 text-purple-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                BITNUN Academy
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Master blockchain development with hands-on courses, expert mentorship, and real-world projects. 
              Join 25,000+ developers building the future of Web3.
            </p>
            <div className="flex items-center justify-center space-x-6 text-green-400">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Industry Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">94% Job Placement</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20"
              >
                <div className="text-purple-400 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured Courses</h2>
            <p className="text-xl text-gray-300">Comprehensive curriculum designed by industry experts</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  course.popular 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                    : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-purple-500'
                }`}
              >
                {course.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${course.color} text-white`}>
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">{course.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{course.title}</h3>
                  <p className="text-gray-300 mb-4">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Course Modules:</h4>
                  {course.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="flex items-center space-x-2 text-sm">
                      <Play className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{module}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text">
                    {course.price}
                  </div>
                  <div className="text-sm text-gray-400">One-time payment</div>
                </div>

                <button className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r ${course.color} hover:opacity-90 transform hover:scale-105`}>
                  Enroll Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Expert Mentorship</h2>
            <p className="text-xl text-gray-300">Accelerate your learning with personalized guidance</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {mentorshipTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  tier.popular 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                    : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50'
                }`}
              >
                {tier.popular && (
                  <div className="text-center mb-4">
                    <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text mb-2">
                    {tier.price}
                  </div>
                  <p className="text-gray-300">{tier.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-blue-600 hover:opacity-90 transform hover:scale-105">
                  Start Mentorship
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Success Stories</h2>
            <p className="text-xl text-gray-300">Real results from our graduates</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/20"
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{story.image}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{story.name}</h3>
                  <p className="text-green-400 font-semibold mb-2">{story.role}</p>
                  <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
                    {story.salaryIncrease}
                  </div>
                </div>
                
                <p className="text-gray-300 text-center italic">"{story.story}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Potential */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12 border border-green-500/20"
          >
            <DollarSign className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Academy Revenue Model</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">$20K-$80K</div>
                <div className="text-gray-300">Monthly Recurring Revenue</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">85%</div>
                <div className="text-gray-300">Course Completion Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">92%</div>
                <div className="text-gray-300">Student Satisfaction</div>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Build a scalable education business with high-value courses, recurring mentorship, and corporate training contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity">
                Launch Your Academy
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
    </div>
  )
}