import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, KeyRound, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

async function verifyAadhaarApi(email: string, aadhaarNumber: string, otp: string) {
    const response = await fetch('/api/auth/verify-aadhaar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, aadhaarNumber, otp }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Aadhaar verification failed.');
    }

    return response.json();
}

// Mock function to simulate sending an OTP
async function sendAadhaarOtpApi(aadhaarNumber: string) {
    console.log(`Simulating sending OTP for Aadhaar: ${aadhaarNumber}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return { success: true, message: 'OTP sent to your Aadhaar-linked mobile number.' };
}

export function AadhaarVerificationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'enter-aadhaar' | 'enter-otp'>('enter-aadhaar');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (step === 'enter-otp') {
            // Defer to next tick to ensure element is mounted
            setTimeout(() => {
                const el = document.getElementById('otp') as HTMLElement | null;
                el?.focus();
            }, 0);
        }
    }, [step]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (aadhaarNumber.length !== 12) {
            setError('Please enter a valid 12-digit Aadhaar number.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await sendAadhaarOtpApi(aadhaarNumber);
            setMessage('OTP has been sent to your registered mobile number. Use OTP 4567 (dev).');
            setStep('enter-otp');
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) {
            setError('Please enter the 4-digit OTP.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await verifyAadhaarApi(email, aadhaarNumber, otp);
            // On success, redirect to login with a success message
            navigate('/login', { state: { successMessage: 'Account activated! You can now log in.' } });
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please check the OTP and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <Shield className="mx-auto w-12 h-12 text-blue-600 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Aadhaar Verification</h1>
                    <p className="text-gray-600">Please verify your Aadhaar to activate your account.</p>
                </div>

                {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
                {message && !error && <Alert className="mb-4"><AlertDescription>{message}</AlertDescription></Alert>}

                {step === 'enter-aadhaar' && (
                    <form onSubmit={handleSendOtp} noValidate className="space-y-6">
                        <div>
                            <Label htmlFor="aadhaar">Aadhaar Number</Label>
                            <Input
                              id="aadhaar"
                              value={aadhaarNumber}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                                setAadhaarNumber(digits);
                              }}
                              placeholder="Enter 12 digits"
                              required
                              maxLength={12}
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter exactly 12 digits. No spaces or symbols.</p>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading || aadhaarNumber.length !== 12}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                        </Button>
                    </form>
                )}

                {step === 'enter-otp' && (
                    <form onSubmit={handleVerifyOtp} noValidate className="space-y-6">
                        <div>
                            <Label htmlFor="otp">Enter 4-Digit OTP</Label>
                            <Input
                              id="otp"
                              type="tel"
                              inputMode="numeric"
                              maxLength={4}
                              value={otp}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setOtp(digits);
                              }}
                              placeholder="4567"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">Use OTP 4567 (dev).</p>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading || otp.length !== 4}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Verify & Activate Account'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}