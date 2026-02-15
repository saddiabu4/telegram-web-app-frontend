import { gsap } from "gsap"
import {
	Facebook,
	Heart,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Send,
	ShoppingBag,
	Twitter,
} from "lucide-react"
import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"

const Footer = () => {
	const footerRef = useRef(null)

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						gsap.fromTo(
							footerRef.current.querySelectorAll(".footer-section"),
							{ opacity: 0, y: 30 },
							{
								opacity: 1,
								y: 0,
								duration: 0.6,
								stagger: 0.1,
								ease: "power3.out",
							}
						)
						observer.unobserve(entry.target)
					}
				})
			},
			{ threshold: 0.2 }
		)

		if (footerRef.current) {
			observer.observe(footerRef.current)
		}

		return () => observer.disconnect()
	}, [])

	return (
		<footer
			ref={footerRef}
			className='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
		>
			{/* Newsletter Section */}
			<div className='border-b border-slate-700'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='footer-section flex flex-col lg:flex-row items-center justify-between gap-8'>
						<div className='text-center lg:text-left'>
							<h3 className='text-2xl font-bold mb-2'>
								Yangiliklar va aksiyalardan xabardor bo'ling
							</h3>
							<p className='text-slate-400'>
								Emailingizni qoldiring va eng yaxshi takliflarni oling
							</p>
						</div>
						<div className='flex gap-3 w-full lg:w-auto'>
							<Input
								type='email'
								placeholder='Email manzilingiz'
								className='flex-1 lg:w-80 h-14 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 rounded-xl'
							/>
							<Button className='h-14 px-6 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600 rounded-xl'>
								<Send className='w-5 h-5 mr-2' />
								<span className='hidden sm:inline'>Yuborish</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Footer */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12'>
					{/* Brand */}
					<div className='col-span-2 md:col-span-1 footer-section'>
						<Link to='/' className='flex items-center gap-3 mb-6'>
							<div className='w-12 h-12 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-2xl flex items-center justify-center'>
								<ShoppingBag className='w-6 h-6 text-white' />
							</div>
							<div>
								<h2 className='text-xl font-bold'>Uzum Market</h2>
								<p className='text-xs text-slate-400'>Eng yaxshi narxlar</p>
							</div>
						</Link>
						<p className='text-slate-400 mb-6'>
							Bizning onlayn do'konimiz sifatli va arzon mahsulotlarni taqdim
							etadi.
						</p>
						<div className='flex gap-3'>
							{[Facebook, Instagram, Twitter, Send].map((Icon, i) => (
								<Button
									key={i}
									variant='ghost'
									size='icon'
									className='w-10 h-10 bg-slate-800 rounded-xl hover:bg-purple-600 text-white'
								>
									<Icon className='w-5 h-5' />
								</Button>
							))}
						</div>
					</div>

					{/* Quick Links */}
					<div className='footer-section'>
						<h4 className='font-semibold text-lg mb-6'>Tezkor havolalar</h4>
						<ul className='space-y-3'>
							{["Bosh sahifa", "Do'kon", "Biz haqimizda", "Blog", "Aloqa"].map(
								(item, i) => (
									<li key={i}>
										<a
											href='#'
											className='text-slate-400 hover:text-purple-400 transition-colors'
										>
											{item}
										</a>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Categories */}
					<div className='footer-section'>
						<h4 className='font-semibold text-lg mb-6'>Kategoriyalar</h4>
						<ul className='space-y-3'>
							{[
								"Elektronika",
								"Kiyimlar",
								"Uy jihozlari",
								"Sport",
								"Kitoblar",
							].map((item, i) => (
								<li key={i}>
									<a
										href='#'
										className='text-slate-400 hover:text-purple-400 transition-colors'
									>
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div className='footer-section'>
						<h4 className='font-semibold text-lg mb-6'>Aloqa</h4>
						<ul className='space-y-4'>
							<li className='flex items-start gap-3'>
								<MapPin className='w-5 h-5 text-purple-400 mt-1' />
								<span className='text-slate-400'>
									Toshkent sh., Chilonzor tumani, 15-mavze
								</span>
							</li>
							<li className='flex items-center gap-3'>
								<Phone className='w-5 h-5 text-purple-400' />
								<span className='text-slate-400'>+998 90 123 45 67</span>
							</li>
							<li className='flex items-center gap-3'>
								<Mail className='w-5 h-5 text-purple-400' />
								<span className='text-slate-400'>info@uzummarket.uz</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<Separator className='bg-slate-800' />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				<div className='flex flex-col md:flex-row items-center justify-between gap-4'>
					<p className='text-slate-400 text-sm text-center md:text-left'>
						© 2026 Uzum Market. Barcha huquqlar himoyalangan.
					</p>
					<p className='text-slate-400 text-sm flex items-center gap-1'>
						<Heart className='w-4 h-4 text-red-500 fill-red-500' /> bilan
						yaratilgan
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
