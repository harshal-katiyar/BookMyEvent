import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!showOTP) {
                const data = await login(email, password);
                navigate(data.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                navigate(data.role === 'admin' ? '/admin' : '/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('OTP sent to email. Please verify.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute w-[500px] h-[500px] bg-indigo-400 blur-[150px] opacity-30 rounded-full top-[-100px] left-[-100px]"></div>
            <div className="absolute w-[500px] h-[500px] bg-pink-400 blur-[150px] opacity-30 rounded-full bottom-[-100px] right-[-100px]"></div>

            <div className="glass w-full max-w-md p-8 rounded-2xl shadow-2xl z-10">

                <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
                    Welcome Back
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {!showOTP ? (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-indigo-400"
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/70 border focus:ring-2 focus:ring-indigo-400"
                            />
                        </>
                    ) : (
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            maxLength="6"
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-3 text-center tracking-widest rounded-xl bg-white/70 border focus:ring-2 focus:ring-pink-400"
                        />
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-90 transition"
                    >
                        {loading ? "Processing..." : showOTP ? "Verify OTP" : "Login"}
                    </button>
                </form>

                <p className="text-center mt-5 text-gray-600">
                    New user? <Link to="/register" className="text-indigo-600 font-bold">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;