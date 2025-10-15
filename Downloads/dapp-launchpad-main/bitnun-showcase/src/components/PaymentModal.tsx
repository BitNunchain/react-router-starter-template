'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { CheckCircle, CreditCard, Loader } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  serviceKey: string
  serviceName: string
  amount: number
  onSuccess: () => void
  metadata?: any
}

function PaymentForm({ serviceKey, serviceName, amount, onSuccess, metadata }: PaymentFormProps) {
  const { data: session } = useSession()
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements || !session) return

    setProcessing(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          serviceKey,
          metadata: {
            ...metadata,
            service_name: serviceName,
          }
        }),
      })

      const { clientSecret, orderId } = await response.json()

      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: session.user.name || session.user.email,
            email: session.user.email,
          },
        },
      })

      if (result.error) {
        setError(result.error.message || 'Payment failed')
      } else {
        setSucceeded(true)
        setTimeout(onSuccess, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setProcessing(false)
    }
  }

  if (succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-300">Your order has been processed successfully.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 p-6 rounded-xl border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': {
                  color: '#a0a0a0',
                },
              },
            },
          }}
          className="p-4 bg-black/20 rounded-lg border border-gray-600"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Service:</span>
          <span className="text-white font-semibold">{serviceName}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Amount:</span>
          <span className="text-2xl font-bold text-green-400">${amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Processing fee:</span>
          <span className="text-gray-400">Included</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
          processing
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90'
        } text-white flex items-center justify-center space-x-2`}
      >
        {processing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pay ${amount.toLocaleString()}</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Your payment is secure and encrypted. Powered by Stripe.
      </p>
    </form>
  )
}

export default function PaymentModal({ 
  serviceKey, 
  serviceName, 
  amount, 
  onSuccess, 
  onClose, 
  metadata 
}: PaymentFormProps & { onClose: () => void }) {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-300 mb-6">Please sign in to purchase this service.</p>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm
            serviceKey={serviceKey}
            serviceName={serviceName}
            amount={amount}
            onSuccess={onSuccess}
            metadata={metadata}
          />
        </Elements>
      </motion.div>
    </div>
  )
}