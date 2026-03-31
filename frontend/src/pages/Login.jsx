import { useState } from 'react'
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, Github, Fingerprint, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [loginMode, setLoginMode] = useState('password') // 'password' or 'otp'
    const [otpStep, setOtpStep] = useState('send') // 'send' or 'verify'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        try {
            const res = await api.post('/auth/login', {
                email,
                password
            })

            if (res.data.requires2FA) {
                setOtpStep('verify');
                setMessage('An OTP has been sent to your email for verification.');
            } else if (res.data.success) {
                const userRes = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${res.data.token}` }
                });
                login(res.data.token, userRes.data.data);
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    const handleSendOTP = async () => {
        setError('')
        setMessage('')
        if (!email) return setError('Please enter your email first')
        setLoading(true)
        try {
            const res = await api.post('/auth/send-otp', { email })
            if (res.data.success) {
                setOtpStep('verify')
                setMessage('OTP sent to your email!')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await api.post('/auth/verify-otp', { email, otp })
            if (res.data.success) {
                const userRes = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${res.data.token}` }
                });
                login(res.data.token, userRes.data.data);
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired OTP')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 w-full bg-slate-50 flex font-sans overflow-hidden">
            <div className="hidden lg:flex lg:w-[45%] h-full relative bg-indigo-600 items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0 opacity-10 mix-blend-overlay"
                    style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-600/90 to-indigo-500/80 z-5"></div>

                <div className="relative z-10 p-12 xl:p-16 max-w-xl text-white">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                            <Shield className="w-7 h-7 text-indigo-600" />
                        </div>
                        <span className="text-2xl font-black tracking-tight uppercase">SecureVault</span>
                    </div>

                    <h2 className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight mb-8">
                        Protecting your <br />
                        <span className="text-white/70 italic">digital world</span> <br />
                        with precision.
                    </h2>

                    <div className="space-y-6 mb-12">
                        {["Military-grade AES-256 encryption", "Zero-knowledge security architecture", "Local-first data processing", "Seamless cross-platform sync"].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 text-white/90 font-semibold text-base">
                                <CheckCircle2 className="w-6 h-6 text-indigo-300 flex-shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-[55%] h-full flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 bg-white relative overflow-hidden overflow-y-auto">
                <div className="w-full max-w-[400px]">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900 uppercase">Vault</span>
                    </div>

                    <header className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Unlock your vault</h1>
                        <p className="text-slate-500 font-medium">
                            {otpStep === 'verify' ? 'Verify your identity with the code sent to your email.' : loginMode === 'password' ? 'Enter your master credentials to access your vault.' : 'Access your vault with a one-time code.'}
                        </p>
                    </header>

                    {otpStep === 'verify' ? (
                        <form className="space-y-6" onSubmit={handleVerifyOTP}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Verifying Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 transition-colors" />
                                        <input type="email" className="input-indigo pl-12 bg-slate-50" disabled value={email} />
                                    </div>
                                </div>
                                <div className="space-y-2 animate-slide-up">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Verification OTP</label>
                                    <div className="relative group">
                                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input type="text" placeholder="6-digit code" className="input-indigo pl-12 font-mono tracking-[0.5em] text-center text-lg" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            {message && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-semibold border border-emerald-100 mb-4">{message}</div>}
                            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-100 mb-4 animate-shake">{error}</div>}
                            <button type="submit" disabled={loading} className="w-full btn-indigo h-12 shadow-indigo-glow flex items-center justify-center gap-3 text-xs uppercase tracking-[0.15em] disabled:opacity-50">
                                {loading ? 'Verifying...' : 'Verify & Access'}
                                {!loading && <ArrowRight className="w-4.5 h-4.5" />}
                            </button>
                            <button type="button" onClick={() => { setOtpStep('send'); setMessage(''); setError(''); }} className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors text-center">Back to login</button>
                        </form>
                    ) : (
                        loginMode === 'password' ? (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Master Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                            <input type="email" placeholder="admin@securevault.com" className="input-indigo pl-12" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Master Password</label>
                                            <a href="#" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors">Forgot?</a>
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                            <input type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="input-indigo pl-12 pr-12 font-mono tracking-widest" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-100 mb-4 animate-shake">{error}</div>}
                                <button type="submit" disabled={loading} className="w-full btn-indigo h-12 shadow-indigo-glow flex items-center justify-center gap-3 text-xs uppercase tracking-[0.15em] disabled:opacity-50">
                                    {loading ? 'Validating...' : 'Access Vault'}
                                    {!loading && <ArrowRight className="w-4.5 h-4.5" />}
                                </button>
                            </form>
                        ) : (
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSendOTP() }}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                            <input type="email" placeholder="admin@securevault.com" className="input-indigo pl-12" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-100 mb-4 animate-shake">{error}</div>}
                                <button type="submit" disabled={loading} className="w-full btn-indigo h-12 shadow-indigo-glow flex items-center justify-center gap-3 text-xs uppercase tracking-[0.15em] disabled:opacity-50">
                                    {loading ? 'Working...' : 'Request Login OTP'}
                                    {!loading && <ArrowRight className="w-4.5 h-4.5" />}
                                </button>
                            </form>
                        )
                    )}

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-[10px] bg-white px-4 uppercase font-bold tracking-[0.2em] text-slate-400">Alternative Methods</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => { setLoginMode(loginMode === 'password' ? 'otp' : 'password'); setError(''); setMessage(''); setOtpStep('send'); }} 
                            className={`flex items-center justify-center gap-3 h-11 border rounded-xl transition-all text-xs font-bold ${loginMode === 'otp' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'border-slate-100 hover:bg-slate-50 text-slate-700'}`}
                        >
                            <Mail className={`w-4.5 h-4.5 ${loginMode === 'otp' ? 'text-indigo-600' : 'text-slate-400'}`} />
                            Email OTP
                        </button>
                        <button className="flex items-center justify-center gap-3 h-11 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700">
                            <Fingerprint className="w-4.5 h-4.5 text-slate-400" />
                            Biometric
                        </button>
                    </div>

                    <footer className="mt-12 text-center text-[10px] text-slate-300 font-bold leading-relaxed uppercase tracking-widest">
                        Zero-Knowledge &bull; GDPR Compliant &bull; AES-256 <br />
                        &copy; 2024 SecureVault Technologies
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default Login
