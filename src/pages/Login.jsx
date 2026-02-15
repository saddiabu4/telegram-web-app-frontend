import axios from "axios"
import gsap from "gsap"
import {
	ArrowLeft,
	Eye,
	EyeOff,
	Lock,
	LogIn,
	Mail,
	ShoppingBag,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
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
			className='min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-emerald-50 flex relative overflow-hidden'
		>
			{/* Background Decorations */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='float-element absolute top-20 left-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl' />
				<div className='float-element absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl' />
				<div className='float-element absolute top-1/2 left-1/3 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl' />
			</div>

			{/* Left Side - Branding */}
			<div className='hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative'>
				<div className='max-w-lg text-center'>
					{/* Logo */}
					<div className='w-24 h-24 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30'>
						<ShoppingBag className='w-12 h-12 text-white' />
					</div>
					<h1 className='text-4xl font-bold text-slate-800 mb-4'>
						Uzum Market
					</h1>
					<p className='text-lg text-slate-600 mb-8'>
						Admin panelga kirish uchun o'z hisobingizdan foydalaning.
						Mahsulotlarni boshqarish, buyurtmalarni kuzatish va ko'proq
						imkoniyatlar.
					</p>

					{/* Features */}
					<div className='grid grid-cols-2 gap-4 text-left'>
						{[
							{ title: "Mahsulotlar", desc: "Boshqarish va qo'shish" },
							{ title: "Statistika", desc: "Sotuvlar tahlili" },
							{ title: "Buyurtmalar", desc: "Kuzatish va tasdiqlash" },
							{ title: "Xavfsizlik", desc: "Himoyalangan kirish" },
						].map((item, i) => (
							<Card
								key={i}
								className='bg-white/60 backdrop-blur-sm border-white'
							>
								<CardContent className='p-4'>
									<h3 className='font-semibold text-slate-800'>{item.title}</h3>
									<p className='text-sm text-slate-500'>{item.desc}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12'>
				<div className='w-full max-w-md relative z-10'>
					{/* Mobile Logo */}
					<div ref={logoRef} className='text-center mb-8 lg:hidden'>
						<div className='w-16 h-16 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/30'>
							<ShoppingBag className='w-8 h-8 text-white' />
						</div>
						<h1 className='text-2xl font-bold text-slate-800'>Uzum Market</h1>
						<p className='text-slate-500 text-sm'>Admin Panel</p>
					</div>

					{/* Form Card */}
					<Card ref={formRef} className='shadow-xl shadow-slate-200/50'>
						<CardHeader className='text-center pb-2'>
							<h2 className='text-2xl font-bold text-slate-800 mb-2'>
								Xush kelibsiz!
							</h2>
							<p className='text-slate-500'>
								Hisobingizga kirish uchun ma'lumotlarni kiriting
							</p>
						</CardHeader>

						<form onSubmit={handleLogin}>
							<CardContent className='space-y-6'>
								{/* Email Input */}
								<div className='form-input space-y-2'>
									<Label htmlFor='email'>Email manzil</Label>
									<div className='relative'>
										<Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
										<Input
											id='email'
											type='email'
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder='admin@example.com'
											className='pl-12 h-14'
										/>
									</div>
								</div>

								{/* Password Input */}
								<div className='form-input space-y-2'>
									<Label htmlFor='password'>Parol</Label>
									<div className='relative'>
										<Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
										<Input
											id='password'
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder='••••••••'
											className='pl-12 pr-12 h-14'
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => setShowPassword(!showPassword)}
											className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
										>
											{showPassword ? (
												<EyeOff className='w-5 h-5' />
											) : (
												<Eye className='w-5 h-5' />
											)}
										</Button>
									</div>
								</div>

								{/* Remember Me & Forgot */}
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-2'>
										<Checkbox id='remember' />
										<Label
											htmlFor='remember'
											className='text-sm font-normal cursor-pointer'
										>
											Eslab qolish
										</Label>
									</div>
									<a
										href='#'
										className='text-sm text-purple-600 hover:text-purple-700 font-medium'
									>
										Parolni unutdingizmi?
									</a>
								</div>
							</CardContent>

							<CardFooter className='flex flex-col gap-4'>
								{/* Submit Button */}
								<Button
									type='submit'
									disabled={loading}
									className='login-btn w-full h-14 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600 text-lg'
								>
									{loading ? (
										<>
											<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
											Kirilmoqda...
										</>
									) : (
										<>
											<LogIn className='w-5 h-5 mr-2' />
											Kirish
										</>
									)}
								</Button>

								{/* Back to Shop */}
								<Link
									to='/'
									className='inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors'
								>
									<ArrowLeft className='w-4 h-4' />
									Do'konga qaytish
								</Link>
							</CardFooter>
						</form>
					</Card>

					{/* Help Text */}
					<p className='text-center text-sm text-slate-500 mt-6'>
						Muammo bormi?{" "}
						<a href='#' className='text-purple-600 hover:underline'>
							Yordam olish
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Login
