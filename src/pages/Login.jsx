import axios from "axios"
import gsap from "gsap"
import {
	ArrowLeft,
	Eye,
	EyeOff,
	Lock,
	LogIn,
	Mail,
	Sparkles,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { API } from "../config/api"

function Login() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const navigate = useNavigate()

	// Refs for animations
	const containerRef = useRef(null)
	const formRef = useRef(null)
	const logoRef = useRef(null)

	useEffect(() => {
		// Check if already logged in
		const token = localStorage.getItem("token")
		if (token) {
			navigate("/admin")
			return
		}

		// GSAP Animations
		const tl = gsap.timeline()

		tl.fromTo(
			logoRef.current,
			{ opacity: 0, y: -50, scale: 0.5 },
			{ opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
		)
			.fromTo(
				formRef.current,
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
				"-=0.3"
			)
			.fromTo(
				".form-input",
				{ opacity: 0, x: -30 },
				{ opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
				"-=0.2"
			)
			.fromTo(
				".login-btn",
				{ opacity: 0, scale: 0.9 },
				{ opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
				"-=0.1"
			)

		// Floating animation for background elements
		gsap.to(".float-element", {
			y: -20,
			duration: 2,
			repeat: -1,
			yoyo: true,
			ease: "power1.inOut",
			stagger: 0.5,
		})
	}, [navigate])

	const handleLogin = async (e) => {
		e.preventDefault()

		if (!email || !password) {
			toast.error("Email va parolni kiriting")
			return
		}

		setLoading(true)

		// Button animation
		gsap.to(".login-btn", {
			scale: 0.95,
			duration: 0.1,
		})

		try {
			const res = await axios.post(API.AUTH.LOGIN, { email, password })
			localStorage.setItem("token", res.data.token)

			toast.success("Muvaffaqiyatli kirdingiz!")

			// Success animation
			gsap.to(formRef.current, {
				scale: 0.9,
				opacity: 0,
				duration: 0.3,
				onComplete: () => navigate("/admin"),
			})
		} catch (error) {
			toast.error(error.response?.data?.message || "Login yoki parol xato")

			// Shake animation on error
			gsap.to(formRef.current, {
				x: [-10, 10, -10, 10, 0],
				duration: 0.4,
				ease: "power2.out",
			})
		} finally {
			setLoading(false)
			gsap.to(".login-btn", { scale: 1, duration: 0.1 })
		}
	}

	return (
		<div
			ref={containerRef}
			className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden'
		>
			{/* Background Elements */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='float-element absolute top-20 left-20 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl' />
				<div className='float-element absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl' />
				<div className='float-element absolute top-1/2 left-1/3 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl' />
			</div>

			{/* Login Card */}
			<div className='w-full max-w-md relative z-10'>
				{/* Logo */}
				<div ref={logoRef} className='text-center mb-8'>
					<div className='w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-pink-500/30'>
						<Sparkles className='w-10 h-10 text-white' />
					</div>
					<h1 className='text-3xl font-bold text-white mb-2'>Admin Panel</h1>
					<p className='text-gray-400'>Cosmetic Shop boshqaruvi</p>
				</div>

				{/* Form */}
				<form
					ref={formRef}
					onSubmit={handleLogin}
					className='bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 space-y-6'
				>
					{/* Email Input */}
					<div className='form-input space-y-2'>
						<label className='text-sm text-gray-300 font-medium'>Email</label>
						<div className='relative'>
							<Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='email'
								placeholder='admin@example.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all input-focus'
								required
							/>
						</div>
					</div>

					{/* Password Input */}
					<div className='form-input space-y-2'>
						<label className='text-sm text-gray-300 font-medium'>Parol</label>
						<div className='relative'>
							<Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type={showPassword ? "text" : "password"}
								placeholder='••••••••'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all input-focus'
								required
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition'
							>
								{showPassword ? (
									<EyeOff className='w-5 h-5' />
								) : (
									<Eye className='w-5 h-5' />
								)}
							</button>
						</div>
					</div>

					{/* Login Button */}
					<button
						type='submit'
						disabled={loading}
						className='login-btn w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-pink-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed btn-shine'
					>
						{loading ? (
							<>
								<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
								Kirish...
							</>
						) : (
							<>
								<LogIn className='w-5 h-5' />
								Kirish
							</>
						)}
					</button>
				</form>

				{/* Footer */}
				<div className='text-center mt-6 space-y-3'>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors'
					>
						<ArrowLeft className='w-4 h-4' />
						Do'konga qaytish
					</Link>
					<p className='text-gray-500 text-sm'>
						© 2026 Cosmetic Shop. Barcha huquqlar himoyalangan.
					</p>
				</div>
			</div>
		</div>
	)
}

export default Login
