// src/app/payment/cancel/page.tsx
export default function PaymentCancelPage() {
    return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
            <div className="text-center">
                <div className="text-6xl mb-6">😕</div>
                <h1 className="text-4xl font-extrabold text-white mb-4">
                    Payment Cancelled
                </h1>
                <p className="text-gray-400 mb-8">
                    No worries — you were not charged. Pick a plan anytime.
                </p>
                <a
                    href="/"
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                >
                    View Plans
                </a>
            </div>
        </main>
    );
}
