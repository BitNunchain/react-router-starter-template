'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, Shield, CheckCircle } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutFormContent() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  const clientSecret = searchParams.get('client_secret')

  useEffect(() => {
    if (!stripe || !clientSecret) return

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment succeeded!')
            break
          case 'processing':
            setMessage('Your payment is processing.')
            break
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.')
            break
          default:
            setMessage('Something went wrong.')
            break
        }
      }
    })
  }, [stripe, clientSecret])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An error occurred.')
      } else {
        setMessage('An unexpected error occurred.')
      }
    }

    setLoading(false)
  }

  if (!clientSecret) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <p className="text-center text-gray-500">
            No payment session found. Please start from the service page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </h3>
        <p className="text-gray-600 mt-1">
          Secure payment powered by Stripe
        </p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          
          <button 
            type="submit" 
            disabled={!stripe || loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('succeeded') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Your payment is secured by 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutFormWrapper() {
  const searchParams = useSearchParams()
  const clientSecret = searchParams.get('client_secret')

  if (!clientSecret) {
    return <CheckoutFormContent />
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutFormContent />
    </Elements>
  )
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Payment</h1>
          <p className="text-gray-600">Complete your purchase with BITNUN</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Suspense fallback={
              <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <div className="text-center">Loading payment form...</div>
                </div>
              </div>
            }>
              <CheckoutFormWrapper />
            </Suspense>
          </div>

          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <div className="p-6 border-b border-green-200">
                <h3 className="text-green-900 font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  What You Get
                </h3>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Professional security audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Detailed vulnerability report</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Expert recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>95% cost savings vs competitors</span>
                </div>
              </div>
            </div>

            {/* Competitive Pricing */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="p-6 border-b border-blue-200">
                <h3 className="text-blue-900 font-semibold">💰 Competitive Advantage</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-blue-900">Save 95%</div>
                    <div className="text-blue-700">vs traditional audit firms</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700">BITNUN:</span>
                      <span className="font-bold text-blue-900">$99-$999</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Others:</span>
                      <span className="line-through">$2K-$15K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Secure Payment
                </h3>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div>✓ 256-bit SSL encryption</div>
                <div>✓ PCI DSS compliant</div>
                <div>✓ Powered by Stripe</div>
                <div>✓ No card details stored</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}