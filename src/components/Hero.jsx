import { gsap } from "gsap"
import {
	ArrowRight,
	HeadphonesIcon,
	Shield,
	ShoppingBag,
	Sparkles,
	Truck,
} from "lucide-react"
import { useEffect, useRef } from "react"

const Hero = () => {
	const heroRef = useRef(null)
	const titleRef = useRef(null)
	const subtitleRef = useRef(null)
	const ctaRef = useRef(null)
	const imageRef = useRef(null)
	const featuresRef = useRef(null)

	useEffect(() => {
		const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

		tl.fromTo(
			titleRef.current,
			{ opacity: 0, y: 50 },
			{ opacity: 1, y: 0, duration: 0.8 }
		)
			.fromTo(
				subtitleRef.current,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.6 },
				"-=0.4"
			)
			.fromTo(
				ctaRef.current.children,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
				"-=0.3"
			)
			.fromTo(
				imageRef.current,
				{ opacity: 0, scale: 0.8, x: 100 },
				{ opacity: 1, scale: 1, x: 0, duration: 1 },
				"-=0.8"
			)
			.fromTo(
				featuresRef.current.children,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
				"-=0.5"
			)

		// Floating animation for decorations
		gsap.to(".floating-shape", {
			y: -20,
			duration: 2,
			repeat: -1,
			yoyo: true,
			ease: "sine.inOut",
			stagger: 0.5,
		})
	}, [])

	return (
		<section
			ref={heroRef}
			className='relative min-h-screen pt-24 pb-16 overflow-hidden'
		>
			{/* Background Shapes */}
			<div className='absolute top-20 right-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl floating-shape' />
			<div className='absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl floating-shape' />
			<div className='absolute top-1/2 right-1/4 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl floating-shape' />

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]'>
					{/* Left Content */}
					<div className='relative z-10'>
						{/* Badge */}
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6'>
							<Sparkles className='w-4 h-4' />
							Yangi kolleksiya 2026
						</div>

						<h1
							ref={titleRef}
							className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6'
						>
							Sifatli{" "}
							<span className='bg-gradient-to-r from-purple-600 via-purple-500 to-emerald-500 bg-clip-text text-transparent'>
								mahsulotlar
							</span>{" "}
							eng yaxshi narxlarda
						</h1>

						<p
							ref={subtitleRef}
							className='text-lg sm:text-xl text-slate-600 mb-8 max-w-lg'
						>
							Bizning onlayn do'konimizda minglab mahsulotlarni kashf eting. Tez
							yetkazib berish va sifat kafolati bilan.
						</p>

						<div ref={ctaRef} className='flex flex-wrap gap-4'>
							<button className='group px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 flex items-center gap-3'>
								<ShoppingBag className='w-5 h-5' />
								Xarid qilish
								<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
							</button>
							<button className='px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-purple-300 hover:text-purple-600 transition-all duration-300'>
								Katalogni ko'rish
							</button>
						</div>

						{/* Stats */}
						<div className='grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200'>
							<div>
								<p className='text-3xl font-bold text-purple-600'>10K+</p>
								<p className='text-sm text-slate-500'>Mahsulotlar</p>
							</div>
							<div>
								<p className='text-3xl font-bold text-emerald-600'>50K+</p>
								<p className='text-sm text-slate-500'>Mijozlar</p>
							</div>
							<div>
								<p className='text-3xl font-bold text-amber-600'>4.9</p>
								<p className='text-sm text-slate-500'>Reyting</p>
							</div>
						</div>
					</div>

					{/* Right Image */}
					<div ref={imageRef} className='relative'>
						<div className='relative z-10'>
							<div className='relative bg-gradient-to-br from-purple-100 via-white to-emerald-100 rounded-[3rem] p-8 shadow-2xl shadow-purple-500/10'>
								<img
									src='https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop'
									alt='Shopping'
									className='w-full h-auto rounded-2xl'
								/>

								{/* Floating Cards */}
								<div className='absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl animate-bounce'>
									<div className='flex items-center gap-3'>
										<div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
											<Truck className='w-6 h-6 text-purple-600' />
										</div>
										<div>
											<p className='font-semibold text-slate-800'>
												Tez yetkazish
											</p>
											<p className='text-xs text-slate-500'>24 soat ichida</p>
										</div>
									</div>
								</div>

								<div className='absolute -right-4 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl'>
									<div className='flex items-center gap-3'>
										<div className='w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center'>
											<Shield className='w-6 h-6 text-emerald-600' />
										</div>
										<div>
											<p className='font-semibold text-slate-800'>Kafolat</p>
											<p className='text-xs text-slate-500'>100% sifat</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Background decoration */}
						<div className='absolute -inset-4 bg-gradient-to-r from-purple-600/10 to-emerald-600/10 rounded-[4rem] blur-2xl -z-10' />
					</div>
				</div>

				{/* Features */}
				<div
					ref={featuresRef}
					className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16'
				>
					{[
						{
							icon: Truck,
							title: "Bepul yetkazish",
							desc: "100 000 so'mdan yuqori",
							color: "purple",
						},
						{
							icon: Shield,
							title: "Xavfsiz to'lov",
							desc: "100% himoyalangan",
							color: "emerald",
						},
						{
							icon: HeadphonesIcon,
							title: "24/7 Yordam",
							desc: "Professional qo'llab",
							color: "amber",
						},
						{
							icon: ShoppingBag,
							title: "Qaytarish",
							desc: "14 kun ichida",
							color: "rose",
						},
					].map((feature, i) => (
						<div
							key={i}
							className='group p-6 bg-white rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer'
						>
							<div
								className={`w-14 h-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
							>
								<feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
							</div>
							<h3 className='font-semibold text-slate-800 mb-1'>
								{feature.title}
							</h3>
							<p className='text-sm text-slate-500'>{feature.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Hero
