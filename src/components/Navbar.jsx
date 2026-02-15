import { gsap } from "gsap"
import {
	Home,
	Menu,
	Package,
	Search,
	Settings,
	ShoppingBag,
	ShoppingCart,
	User,
	X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

const Navbar = ({ cartCount = 0 }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const [searchOpen, setSearchOpen] = useState(false)
	const navRef = useRef(null)
	const location = useLocation()

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	useEffect(() => {
		// Navbar animation on mount
		gsap.fromTo(
			navRef.current,
			{ y: -100, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
		)
	}, [])

	const navLinks = [
		{ path: "/", label: "Bosh sahifa", icon: Home },
		{ path: "/shop", label: "Do'kon", icon: Package },
	]

	return (
		<>
			<nav
				ref={navRef}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
					scrolled
						? "bg-white/90 backdrop-blur-xl shadow-lg shadow-purple-500/5 py-3"
						: "bg-transparent py-5"
				}`}
			>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between'>
						{/* Logo */}
						<Link to='/' className='flex items-center gap-3 group'>
							<div className='relative'>
								<div className='w-12 h-12 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300'>
									<ShoppingBag className='w-6 h-6 text-white' />
								</div>
								<div className='absolute -inset-1 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity' />
							</div>
							<div className='hidden sm:block'>
								<h1 className='text-xl font-bold bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent'>
									Uzum Market
								</h1>
								<p className='text-xs text-slate-500 -mt-1'>
									Eng yaxshi narxlar
								</p>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<div className='hidden md:flex items-center gap-1'>
							{navLinks.map((link) => (
								<Button
									key={link.path}
									asChild
									variant='ghost'
									className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
										location.pathname === link.path
											? "text-purple-600 bg-purple-50 hover:bg-purple-100"
											: "text-slate-600 hover:text-purple-600 hover:bg-purple-50/50"
									}`}
								>
									<Link to={link.path} className='flex items-center gap-2'>
										<link.icon className='w-4 h-4' />
										{link.label}
										{location.pathname === link.path && (
											<span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full' />
										)}
									</Link>
								</Button>
							))}
						</div>

						{/* Right Actions */}
						<div className='flex items-center gap-2'>
							{/* Search Button */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => setSearchOpen(!searchOpen)}
										className='rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50'
									>
										<Search className='w-5 h-5' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Qidirish</TooltipContent>
							</Tooltip>

							{/* Cart Button */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='ghost'
										size='icon'
										className='relative rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50'
									>
										<ShoppingCart className='w-5 h-5' />
										{cartCount > 0 && (
											<Badge className='absolute -top-1 -right-1 w-5 h-5 p-0 bg-gradient-to-r from-purple-600 to-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border-0'>
												{cartCount}
											</Badge>
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>Savat</TooltipContent>
							</Tooltip>

							{/* Admin Link */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										asChild
										variant='ghost'
										size='icon'
										className='hidden sm:flex rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50'
									>
										<Link to='/admin'>
											<Settings className='w-5 h-5' />
										</Link>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Admin Panel</TooltipContent>
							</Tooltip>

							{/* Mobile Menu Button */}
							<Button
								variant='ghost'
								size='icon'
								onClick={() => setIsOpen(!isOpen)}
								className='md:hidden rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50'
							>
								{isOpen ? (
									<X className='w-6 h-6' />
								) : (
									<Menu className='w-6 h-6' />
								)}
							</Button>
						</div>
					</div>

					{/* Search Bar */}
					<div
						className={`overflow-hidden transition-all duration-500 ${
							searchOpen ? "max-h-20 mt-4" : "max-h-0"
						}`}
					>
						<div className='relative'>
							<Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
							<Input
								type='text'
								placeholder='Mahsulotlarni qidirish...'
								className='w-full pl-12 pr-4 py-3 h-12 bg-slate-50 border-2 border-transparent rounded-xl focus:border-purple-500 focus:bg-white'
							/>
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile Menu - Using Sheet */}
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side='right' className='w-80 p-0'>
					<SheetHeader className='p-6 border-b'>
						<SheetTitle>Menu</SheetTitle>
					</SheetHeader>

					<div className='p-6 space-y-2'>
						{navLinks.map((link) => (
							<Button
								key={link.path}
								asChild
								variant={location.pathname === link.path ? "default" : "ghost"}
								className={`w-full justify-start gap-4 h-14 rounded-xl ${
									location.pathname === link.path
										? "bg-gradient-to-r from-purple-600 to-emerald-500 text-white hover:from-purple-700 hover:to-emerald-600"
										: "text-slate-600 hover:bg-slate-50"
								}`}
								onClick={() => setIsOpen(false)}
							>
								<Link to={link.path}>
									<link.icon className='w-5 h-5' />
									<span className='font-medium'>{link.label}</span>
								</Link>
							</Button>
						))}

						<Button
							asChild
							variant='ghost'
							className='w-full justify-start gap-4 h-14 rounded-xl text-slate-600 hover:bg-slate-50'
							onClick={() => setIsOpen(false)}
						>
							<Link to='/admin'>
								<Settings className='w-5 h-5' />
								<span className='font-medium'>Admin Panel</span>
							</Link>
						</Button>

						<Button
							asChild
							variant='ghost'
							className='w-full justify-start gap-4 h-14 rounded-xl text-slate-600 hover:bg-slate-50'
							onClick={() => setIsOpen(false)}
						>
							<Link to='/login'>
								<User className='w-5 h-5' />
								<span className='font-medium'>Kirish</span>
							</Link>
						</Button>
					</div>

					{/* Mobile Menu Footer */}
					<div className='absolute bottom-8 left-6 right-6'>
						<div className='p-4 bg-gradient-to-r from-purple-50 to-emerald-50 rounded-2xl'>
							<p className='text-sm text-slate-600 text-center'>
								Savollar bormi?
							</p>
							<p className='text-sm font-bold text-purple-600 text-center'>
								+998 90 123 45 67
							</p>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</>
	)
}

export default Navbar
