import axios from "axios"
import gsap from "gsap"
import {
	ArrowRight,
	ChevronDown,
	Eye,
	Grid,
	HeadphonesIcon,
	Heart,
	List,
	Minus,
	Package,
	Plus,
	Search,
	Shield,
	ShoppingBag,
	ShoppingCart,
	Sparkles,
	Star,
	Trash2,
	Truck,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import Layout from "../components/Layout"
import Navbar from "../components/Navbar"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { ScrollArea } from "../components/ui/scroll-area"
import { Separator } from "../components/ui/separator"
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "../components/ui/sheet"
import { Skeleton } from "../components/ui/skeleton"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../components/ui/tooltip"
import { API } from "../config/api"

function Shop() {
	const [products, setProducts] = useState([])
	const [cart, setCart] = useState([])
	const [loading, setLoading] = useState(true)
	const [isCartOpen, setIsCartOpen] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [favorites, setFavorites] = useState([])
	const [viewMode, setViewMode] = useState("grid")
	const [sortBy, setSortBy] = useState("newest")

	const navigate = useNavigate()

	// Refs for animations
	const heroRef = useRef(null)
	const productsRef = useRef(null)
	const cartBtnRef = useRef(null)
	const cartPanelRef = useRef(null)
	const productModalRef = useRef(null)

	// Telegram WebApp
	const tg = window.Telegram?.WebApp

	useEffect(() => {
		// Initialize Telegram WebApp
		if (tg) {
			tg.ready()
			tg.expand()
			tg.enableClosingConfirmation()
		}

		// Load cart from localStorage
		const savedCart = localStorage.getItem("cart")
		if (savedCart) {
			setCart(JSON.parse(savedCart))
		}

		// Load favorites
		const savedFavorites = localStorage.getItem("favorites")
		if (savedFavorites) {
			setFavorites(JSON.parse(savedFavorites))
		}

		fetchProducts()
	}, [])

	// Save cart to localStorage
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart))
	}, [cart])

	// Save favorites to localStorage
	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites))
	}, [favorites])

	// GSAP Animations
	useEffect(() => {
		if (!loading && products.length > 0) {
			// Hero animation
			const heroTl = gsap.timeline()
			heroTl
				.fromTo(
					".hero-title",
					{ opacity: 0, y: 50 },
					{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
				)
				.fromTo(
					".hero-subtitle",
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
					"-=0.4"
				)
				.fromTo(
					".hero-cta",
					{ opacity: 0, y: 20 },
					{ opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
					"-=0.3"
				)
				.fromTo(
					".hero-image",
					{ opacity: 0, scale: 0.8, x: 50 },
					{ opacity: 1, scale: 1, x: 0, duration: 1, ease: "power3.out" },
					"-=0.8"
				)
				.fromTo(
					".feature-card",
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
					"-=0.5"
				)

			// Products animation
			gsap.fromTo(
				".product-card",
				{ opacity: 0, y: 40, scale: 0.95 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.6,
					stagger: 0.08,
					ease: "back.out(1.4)",
					scrollTrigger: {
						trigger: productsRef.current,
						start: "top 80%",
					},
				}
			)

			// Floating animations
			gsap.to(".floating-shape", {
				y: -20,
				duration: 2,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				stagger: 0.5,
			})
		}
	}, [loading, products])

	// Cart button bounce animation
	useEffect(() => {
		if (cart.length > 0 && cartBtnRef.current) {
			gsap.fromTo(
				cartBtnRef.current,
				{ scale: 1 },
				{
					scale: 1.15,
					duration: 0.15,
					yoyo: true,
					repeat: 1,
					ease: "power2.inOut",
				}
			)
		}
	}, [cart.length])

	// Cart panel animation
	useEffect(() => {
		if (isCartOpen && cartPanelRef.current) {
			gsap.fromTo(
				cartPanelRef.current,
				{ x: "100%", opacity: 0 },
				{ x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
			)
			gsap.fromTo(
				".cart-item",
				{ x: 50, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					duration: 0.4,
					stagger: 0.1,
					ease: "power3.out",
					delay: 0.2,
				}
			)
		}
	}, [isCartOpen])

	// Product modal animation
	useEffect(() => {
		if (selectedProduct && productModalRef.current) {
			gsap.fromTo(
				productModalRef.current,
				{ opacity: 0, scale: 0.9, y: 50 },
				{ opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
			)
		}
	}, [selectedProduct])

	const fetchProducts = async () => {
		try {
			const res = await axios.get(API.PRODUCTS.GET_ALL)
			setProducts(res.data)
		} catch (err) {
			console.error(err)
			toast.error("Mahsulotlarni yuklashda xatolik")
		} finally {
			setLoading(false)
		}
	}

	// Get image URL
	const getImageUrl = (imagePath) => {
		if (!imagePath) return "https://via.placeholder.com/300x300?text=No+Image"
		if (imagePath.startsWith("http")) return imagePath
		return `${API.UPLOADS}/${imagePath}`
	}

	// Format price
	const formatPrice = (price) => {
		return new Intl.NumberFormat("uz-UZ").format(price)
	}

	// Filter and sort products
	const filteredProducts = products
		.filter((product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			switch (sortBy) {
				case "price-low":
					return a.price - b.price
				case "price-high":
					return b.price - a.price
				case "name":
					return a.name.localeCompare(b.name)
				default:
					return new Date(b.createdAt) - new Date(a.createdAt)
			}
		})

	const toggleFavorite = (productId) => {
		if (favorites.includes(productId)) {
			setFavorites(favorites.filter((id) => id !== productId))
			toast("Sevimlilardan olib tashlandi", { icon: "💔" })
		} else {
			setFavorites([...favorites, productId])
			toast("Sevimlilarga qo'shildi!", { icon: "❤️" })
		}

		if (tg?.HapticFeedback) {
			tg.HapticFeedback.impactOccurred("light")
		}
	}

	const addToCart = (product) => {
		const existingItem = cart.find((item) => item._id === product._id)

		if (existingItem) {
			setCart(
				cart.map((item) =>
					item._id === product._id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			)
		} else {
			setCart([...cart, { ...product, quantity: 1 }])
		}

		toast.success(`${product.name} savatga qo'shildi!`, { icon: "🛒" })

		if (tg?.HapticFeedback) {
			tg.HapticFeedback.impactOccurred("medium")
		}
	}

	const updateQuantity = (productId, change) => {
		setCart(
			cart
				.map((item) => {
					if (item._id === productId) {
						const newQuantity = item.quantity + change
						return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
					}
					return item
				})
				.filter((item) => item.quantity > 0)
		)
	}

	const removeFromCart = (productId) => {
		gsap.to(`[data-cart-item="${productId}"]`, {
			opacity: 0,
			x: 50,
			duration: 0.3,
			onComplete: () => {
				setCart(cart.filter((item) => item._id !== productId))
				toast.success("Mahsulot olib tashlandi")
			},
		})
	}

	const total = cart.reduce(
		(sum, item) => sum + Number(item.price) * item.quantity,
		0
	)

	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

	// Send order to Telegram
	const sendOrder = () => {
		if (cart.length === 0) {
			toast.error("Savat bo'sh!")
			return
		}

		if (tg) {
			let orderText = "🛒 *Yangi buyurtma!*\n\n"
			cart.forEach((item, index) => {
				orderText += `${index + 1}. *${item.name}*\n`
				orderText += `   📦 ${item.quantity} dona × ${formatPrice(
					item.price
				)} so'm\n`
				orderText += `   💰 Jami: ${formatPrice(
					item.price * item.quantity
				)} so'm\n\n`
			})
			orderText += `━━━━━━━━━━━━━━━━━━\n`
			orderText += `💵 *Umumiy: ${formatPrice(total)} so'm*`

			tg.sendData(
				JSON.stringify({
					type: "order",
					items: cart,
					total: total,
					orderText: orderText,
				})
			)
		} else {
			toast.success("Buyurtma qabul qilindi!")
			console.log("Order:", cart, "Total:", total)
		}

		setCart([])
		setIsCartOpen(false)
	}

	return (
		<Layout>
			<Navbar cartCount={totalItems} />

			{/* Hero Section */}
			<section className='relative min-h-screen pt-24 pb-16 overflow-hidden'>
				{/* Background Shapes */}
				<div className='absolute top-20 right-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl floating-shape' />
				<div className='absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl floating-shape' />
				<div className='absolute top-1/2 right-1/4 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl floating-shape' />

				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]'>
						{/* Left Content */}
						<div className='relative z-10'>
							{/* Badge */}
							<Badge className='hero-cta mb-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'>
								<Sparkles className='w-4 h-4 mr-2' />
								Yangi kolleksiya 2026
							</Badge>

							<h1 className='hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6'>
								Sifatli{" "}
								<span className='bg-gradient-to-r from-purple-600 via-purple-500 to-emerald-500 bg-clip-text text-transparent'>
									mahsulotlar
								</span>{" "}
								eng yaxshi narxlarda
							</h1>

							<p className='hero-subtitle text-lg sm:text-xl text-slate-600 mb-8 max-w-lg'>
								Bizning onlayn do'konimizda minglab mahsulotlarni kashf eting.
								Tez yetkazib berish va sifat kafolati bilan.
							</p>

							<div className='hero-cta flex flex-wrap gap-4'>
								<Button
									asChild
									size='lg'
									className='group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 rounded-2xl px-8 py-6 text-base'
								>
									<a href='#products'>
										<ShoppingBag className='w-5 h-5 mr-2' />
										Xarid qilish
										<ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
									</a>
								</Button>
								<Button
									variant='outline'
									size='lg'
									onClick={() => setIsCartOpen(true)}
									className='rounded-2xl px-8 py-6 text-base border-2 hover:border-purple-300 hover:text-purple-600'
								>
									<ShoppingCart className='w-5 h-5 mr-2' />
									Savat ({totalItems})
								</Button>
							</div>

							{/* Stats */}
							<div className='grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200'>
								<div>
									<p className='text-3xl font-bold text-purple-600'>
										{products.length}+
									</p>
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
						<div className='hero-image relative hidden lg:block'>
							<div className='relative z-10'>
								<Card className='relative border-0 bg-gradient-to-br from-purple-100 via-white to-emerald-100 rounded-[3rem] p-8 shadow-2xl shadow-purple-500/10'>
									<img
										src='https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop'
										alt='Shopping'
										className='w-full h-auto rounded-2xl'
									/>

									{/* Floating Cards */}
									<Card className='absolute -left-8 top-1/4 p-4 shadow-xl animate-bounce border-0'>
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
									</Card>

									<Card className='absolute -right-4 bottom-1/4 p-4 shadow-xl border-0'>
										<div className='flex items-center gap-3'>
											<div className='w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center'>
												<Shield className='w-6 h-6 text-emerald-600' />
											</div>
											<div>
												<p className='font-semibold text-slate-800'>Kafolat</p>
												<p className='text-xs text-slate-500'>100% sifat</p>
											</div>
										</div>
									</Card>
								</Card>
							</div>

							{/* Background decoration */}
							<div className='absolute -inset-4 bg-gradient-to-r from-purple-600/10 to-emerald-600/10 rounded-[4rem] blur-2xl -z-10' />
						</div>
					</div>

					{/* Features */}
					<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16'>
						{[
							{
								icon: Truck,
								title: "Bepul yetkazish",
								desc: "100 000 so'mdan yuqori",
								bgColor: "bg-purple-100",
								iconColor: "text-purple-600",
							},
							{
								icon: Shield,
								title: "Xavfsiz to'lov",
								desc: "100% himoyalangan",
								bgColor: "bg-emerald-100",
								iconColor: "text-emerald-600",
							},
							{
								icon: HeadphonesIcon,
								title: "24/7 Yordam",
								desc: "Professional qo'llab",
								bgColor: "bg-amber-100",
								iconColor: "text-amber-600",
							},
							{
								icon: Package,
								title: "Qaytarish",
								desc: "14 kun ichida",
								bgColor: "bg-rose-100",
								iconColor: "text-rose-600",
							},
						].map((feature, i) => (
							<Card
								key={i}
								className='feature-card group p-6 border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer'
							>
								<div
									className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
								>
									<feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
								</div>
								<h3 className='font-semibold text-slate-800 mb-1'>
									{feature.title}
								</h3>
								<p className='text-sm text-slate-500'>{feature.desc}</p>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section
				id='products'
				ref={productsRef}
				className='py-20 bg-gradient-to-b from-transparent to-white'
			>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{/* Section Header */}
					<div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12'>
						<div>
							<Badge
								variant='outline'
								className='mb-2 text-purple-600 border-purple-200'
							>
								Bizning mahsulotlar
							</Badge>
							<h2 className='text-3xl sm:text-4xl font-bold text-slate-900 mt-2'>
								Eng yaxshi{" "}
								<span className='bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent'>
									tanlovlar
								</span>
							</h2>
						</div>

						{/* Filters */}
						<div className='flex flex-wrap items-center gap-4'>
							{/* Search */}
							<div className='relative'>
								<Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
								<Input
									type='text'
									placeholder='Qidirish...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='pl-12 pr-4 py-3 h-12 border-2 rounded-xl focus:border-purple-500 w-full sm:w-64'
								/>
							</div>

							{/* Sort */}
							<div className='relative'>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className='appearance-none pl-4 pr-10 py-3 h-12 bg-white border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors cursor-pointer'
								>
									<option value='newest'>Eng yangi</option>
									<option value='price-low'>Narx: past → yuqori</option>
									<option value='price-high'>Narx: yuqori → past</option>
									<option value='name'>Nomi bo'yicha</option>
								</select>
								<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none' />
							</div>

							{/* View Toggle */}
							<div className='flex bg-white border-2 border-slate-200 rounded-xl overflow-hidden'>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => setViewMode("grid")}
											className={`rounded-none ${
												viewMode === "grid"
													? "bg-purple-600 text-white hover:bg-purple-700"
													: "text-slate-600 hover:bg-slate-50"
											}`}
										>
											<Grid className='w-5 h-5' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Grid ko'rinish</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => setViewMode("list")}
											className={`rounded-none ${
												viewMode === "list"
													? "bg-purple-600 text-white hover:bg-purple-700"
													: "text-slate-600 hover:bg-slate-50"
											}`}
										>
											<List className='w-5 h-5' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>List ko'rinish</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</div>

					{/* Loading State */}
					{loading ? (
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{[...Array(8)].map((_, i) => (
								<Card key={i} className='overflow-hidden'>
									<Skeleton className='aspect-square w-full' />
									<CardContent className='p-5 space-y-3'>
										<div className='flex gap-1'>
											{[...Array(5)].map((_, j) => (
												<Skeleton key={j} className='w-4 h-4 rounded' />
											))}
										</div>
										<Skeleton className='h-5 w-3/4' />
										<Skeleton className='h-4 w-1/2' />
										<div className='flex justify-between items-end pt-2'>
											<Skeleton className='h-8 w-1/3' />
											<Skeleton className='h-6 w-1/4' />
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : filteredProducts.length === 0 ? (
						<Card className='text-center py-20 border-dashed'>
							<CardContent className='pt-6'>
								<Package className='w-20 h-20 text-slate-300 mx-auto mb-4' />
								<h3 className='text-xl font-semibold text-slate-600 mb-2'>
									Mahsulotlar topilmadi
								</h3>
								<p className='text-slate-500'>
									Boshqa kalit so'z bilan qidirib ko'ring
								</p>
							</CardContent>
						</Card>
					) : (
						<div
							className={`grid gap-6 ${
								viewMode === "grid"
									? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
									: "grid-cols-1"
							}`}
						>
							{filteredProducts.map((product, index) => (
								<ProductCard
									key={product._id}
									product={product}
									index={index}
									viewMode={viewMode}
									isFavorite={favorites.includes(product._id)}
									onToggleFavorite={() => toggleFavorite(product._id)}
									onAddToCart={() => addToCart(product)}
									onViewDetails={() => setSelectedProduct(product)}
									getImageUrl={getImageUrl}
									formatPrice={formatPrice}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Floating Cart Button (Mobile) */}
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						ref={cartBtnRef}
						onClick={() => setIsCartOpen(true)}
						className='fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full shadow-2xl shadow-purple-500/30 md:hidden hover:scale-110 transition-transform'
						size='icon'
					>
						<ShoppingCart className='w-7 h-7' />
						{totalItems > 0 && (
							<span className='absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse'>
								{totalItems}
							</span>
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent side='left'>Savat</TooltipContent>
			</Tooltip>

			{/* Cart Sidebar - Using Sheet */}
			<Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
				<SheetContent className='w-full sm:max-w-md p-0 flex flex-col'>
					<SheetHeader className='p-6 border-b'>
						<SheetTitle className='flex items-center gap-2'>
							<ShoppingCart className='w-5 h-5 text-purple-600' />
							Savatingiz
							<Badge variant='secondary' className='ml-2'>
								{totalItems} ta mahsulot
							</Badge>
						</SheetTitle>
					</SheetHeader>

					<ScrollArea className='flex-1 p-6'>
						{cart.length === 0 ? (
							<div className='text-center py-12'>
								<ShoppingCart className='w-16 h-16 text-slate-300 mx-auto mb-4' />
								<h3 className='text-lg font-semibold text-slate-600 mb-2'>
									Savat bo'sh
								</h3>
								<p className='text-slate-500 text-sm'>
									Mahsulotlarni qo'shishni boshlang
								</p>
							</div>
						) : (
							<div className='space-y-4'>
								{cart.map((item) => (
									<Card
										key={item._id}
										data-cart-item={item._id}
										className='cart-item p-4'
									>
										<div className='flex gap-4'>
											<img
												src={getImageUrl(item.image)}
												alt={item.name}
												className='w-20 h-20 object-cover rounded-xl'
												onError={(e) => {
													e.target.src =
														"https://via.placeholder.com/80x80?text=No+Image"
												}}
											/>
											<div className='flex-1'>
												<h4 className='font-semibold text-slate-800 line-clamp-1'>
													{item.name}
												</h4>
												<p className='text-purple-600 font-bold'>
													{formatPrice(item.price)} so'm
												</p>
												<div className='flex items-center justify-between mt-2'>
													<div className='flex items-center gap-2'>
														<Button
															variant='outline'
															size='icon'
															className='w-8 h-8'
															onClick={() => updateQuantity(item._id, -1)}
														>
															<Minus className='w-4 h-4' />
														</Button>
														<span className='w-8 text-center font-semibold'>
															{item.quantity}
														</span>
														<Button
															variant='outline'
															size='icon'
															className='w-8 h-8'
															onClick={() => updateQuantity(item._id, 1)}
														>
															<Plus className='w-4 h-4' />
														</Button>
													</div>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant='ghost'
																size='icon'
																className='text-red-500 hover:bg-red-50 hover:text-red-600'
																onClick={() => removeFromCart(item._id)}
															>
																<Trash2 className='w-5 h-5' />
															</Button>
														</TooltipTrigger>
														<TooltipContent>O'chirish</TooltipContent>
													</Tooltip>
												</div>
											</div>
										</div>
									</Card>
								))}
							</div>
						)}
					</ScrollArea>

					{cart.length > 0 && (
						<SheetFooter className='p-6 border-t bg-white'>
							<div className='w-full space-y-4'>
								<Separator />
								<div className='flex justify-between items-center'>
									<span className='text-slate-600'>Jami:</span>
									<span className='text-2xl font-bold text-purple-600'>
										{formatPrice(total)} so'm
									</span>
								</div>
								<Button
									onClick={sendOrder}
									className='w-full h-14 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600 text-lg rounded-2xl'
								>
									<ShoppingBag className='w-5 h-5 mr-2' />
									Buyurtma berish
								</Button>
							</div>
						</SheetFooter>
					)}
				</SheetContent>
			</Sheet>

			{/* Product Modal - Using Dialog */}
			<Dialog
				open={!!selectedProduct}
				onOpenChange={() => setSelectedProduct(null)}
			>
				<DialogContent className='max-w-2xl p-0 overflow-hidden'>
					{selectedProduct && (
						<div className='grid md:grid-cols-2'>
							{/* Image */}
							<div className='relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100'>
								<img
									src={getImageUrl(selectedProduct.image)}
									alt={selectedProduct.name}
									className='w-full h-full object-cover'
									onError={(e) => {
										e.target.src =
											"https://via.placeholder.com/400x400?text=No+Image"
									}}
								/>
							</div>

							{/* Content */}
							<div className='p-6 flex flex-col'>
								<DialogHeader>
									{/* Rating */}
									<div className='flex items-center gap-1 mb-3'>
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-5 h-5 ${
													i < 4
														? "text-amber-400 fill-amber-400"
														: "text-slate-200"
												}`}
											/>
										))}
										<span className='text-sm text-slate-400 ml-2'>(128)</span>
									</div>

									<DialogTitle className='text-2xl'>
										{selectedProduct.name}
									</DialogTitle>
								</DialogHeader>

								{selectedProduct.description && (
									<p className='text-slate-600 my-4'>
										{selectedProduct.description}
									</p>
								)}

								<div className='flex items-center gap-2 mb-6'>
									<span className='text-3xl font-bold text-purple-600'>
										{formatPrice(selectedProduct.price)}
									</span>
									<span className='text-slate-500'>so'm</span>
								</div>

								<Badge
									variant='outline'
									className='w-fit mb-6 text-emerald-600 border-emerald-200'
								>
									<span className='w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse' />
									Mavjud
								</Badge>

								{/* Actions */}
								<div className='mt-auto space-y-3'>
									<Button
										onClick={() => {
											addToCart(selectedProduct)
											setSelectedProduct(null)
										}}
										className='w-full h-14 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600 rounded-2xl'
									>
										<ShoppingCart className='w-5 h-5 mr-2' />
										Savatga qo'shish
									</Button>
									<Button
										variant='outline'
										onClick={() => toggleFavorite(selectedProduct._id)}
										className={`w-full h-14 rounded-2xl ${
											favorites.includes(selectedProduct._id)
												? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
												: "hover:border-red-200 hover:text-red-500"
										}`}
									>
										<Heart
											className={`w-5 h-5 mr-2 ${
												favorites.includes(selectedProduct._id)
													? "fill-red-500"
													: ""
											}`}
										/>
										{favorites.includes(selectedProduct._id)
											? "Sevimlilardan o'chirish"
											: "Sevimlilarga qo'shish"}
									</Button>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			<Footer />
		</Layout>
	)
}

// Product Card Component
const ProductCard = ({
	product,
	index,
	viewMode,
	isFavorite,
	onToggleFavorite,
	onAddToCart,
	onViewDetails,
	getImageUrl,
	formatPrice,
}) => {
	const cardRef = useRef(null)

	useEffect(() => {
		gsap.fromTo(
			cardRef.current,
			{ opacity: 0, y: 50, scale: 0.9 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.6,
				delay: index * 0.05,
				ease: "power3.out",
			}
		)
	}, [index])

	const handleMouseEnter = () => {
		if (viewMode === "grid") {
			gsap.to(cardRef.current, {
				y: -10,
				scale: 1.02,
				duration: 0.3,
				ease: "power2.out",
			})
			gsap.to(cardRef.current.querySelector(".card-image"), {
				scale: 1.1,
				duration: 0.4,
				ease: "power2.out",
			})
			gsap.to(cardRef.current.querySelector(".card-actions"), {
				opacity: 1,
				y: 0,
				duration: 0.3,
				ease: "power2.out",
			})
		}
	}

	const handleMouseLeave = () => {
		if (viewMode === "grid") {
			gsap.to(cardRef.current, {
				y: 0,
				scale: 1,
				duration: 0.3,
				ease: "power2.out",
			})
			gsap.to(cardRef.current.querySelector(".card-image"), {
				scale: 1,
				duration: 0.4,
				ease: "power2.out",
			})
			gsap.to(cardRef.current.querySelector(".card-actions"), {
				opacity: 0,
				y: 20,
				duration: 0.3,
				ease: "power2.out",
			})
		}
	}

	if (viewMode === "list") {
		return (
			<Card
				ref={cardRef}
				className='product-card overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300'
			>
				<CardContent className='flex gap-6 p-4'>
					<div className='relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100'>
						<img
							src={getImageUrl(product.image)}
							alt={product.name}
							className='w-full h-full object-cover'
							onError={(e) => {
								e.target.src =
									"https://via.placeholder.com/150x150?text=No+Image"
							}}
						/>
					</div>
					<div className='flex-1 flex flex-col'>
						<div className='flex items-center gap-1 mb-2'>
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`w-4 h-4 ${
										i < 4 ? "text-amber-400 fill-amber-400" : "text-slate-200"
									}`}
								/>
							))}
							<span className='text-xs text-slate-400 ml-1'>(128)</span>
						</div>
						<h3 className='font-semibold text-slate-800 mb-1'>
							{product.name}
						</h3>
						{product.description && (
							<p className='text-sm text-slate-500 line-clamp-2 mb-2'>
								{product.description}
							</p>
						)}
						<div className='mt-auto flex items-center justify-between'>
							<p className='text-xl font-bold text-purple-600'>
								{formatPrice(product.price)}{" "}
								<span className='text-sm font-normal'>so'm</span>
							</p>
							<div className='flex items-center gap-2'>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='icon'
											onClick={onToggleFavorite}
											className={`${
												isFavorite
													? "bg-red-50 text-red-500 border-red-200"
													: "hover:bg-red-50 hover:text-red-500"
											}`}
										>
											<Heart
												className={`w-5 h-5 ${
													isFavorite ? "fill-red-500" : ""
												}`}
											/>
										</Button>
									</TooltipTrigger>
									<TooltipContent>Sevimli</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='icon'
											onClick={onViewDetails}
										>
											<Eye className='w-5 h-5' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Ko'rish</TooltipContent>
								</Tooltip>
								<Button
									onClick={onAddToCart}
									className='bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600'
								>
									<ShoppingCart className='w-4 h-4 mr-2' />
									Savatga
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card
			ref={cardRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className='product-card group overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-shadow duration-500'
		>
			{/* Image Container */}
			<div className='relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100'>
				<img
					src={getImageUrl(product.image)}
					alt={product.name}
					className='card-image w-full h-full object-cover transition-transform duration-500'
					onError={(e) => {
						e.target.src = "https://via.placeholder.com/300x300?text=No+Image"
					}}
				/>

				{/* Badges */}
				<div className='absolute top-4 left-4 flex flex-col gap-2'>
					<Badge className='bg-gradient-to-r from-purple-600 to-purple-500 text-white border-0'>
						Yangi
					</Badge>
				</div>

				{/* Favorite Button */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							onClick={onToggleFavorite}
							className={`absolute top-4 right-4 w-10 h-10 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 ${
								isFavorite
									? "bg-red-500 text-white hover:bg-red-600"
									: "bg-white/90 text-slate-600 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
							}`}
						>
							<Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Sevimli</TooltipContent>
				</Tooltip>

				{/* Action Buttons */}
				<div className='card-actions absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-5'>
					<Button
						onClick={onAddToCart}
						className='flex-1 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600 rounded-xl'
					>
						<ShoppingCart className='w-4 h-4 mr-2' />
						Savatga
					</Button>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='secondary'
								size='icon'
								onClick={onViewDetails}
								className='w-12 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-purple-50 hover:text-purple-600'
							>
								<Eye className='w-5 h-5' />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Ko'rish</TooltipContent>
					</Tooltip>
				</div>
			</div>

			{/* Content */}
			<CardContent className='p-5'>
				{/* Rating */}
				<div className='flex items-center gap-1 mb-2'>
					{[...Array(5)].map((_, i) => (
						<Star
							key={i}
							className={`w-4 h-4 ${
								i < 4 ? "text-amber-400 fill-amber-400" : "text-slate-200"
							}`}
						/>
					))}
					<span className='text-xs text-slate-400 ml-1'>(128)</span>
				</div>

				{/* Name */}
				<h3 className='font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors'>
					{product.name}
				</h3>

				{/* Description */}
				{product.description && (
					<p className='text-sm text-slate-500 mb-3 line-clamp-2'>
						{product.description}
					</p>
				)}

				{/* Price */}
				<div className='flex items-end justify-between'>
					<div>
						<p className='text-2xl font-bold text-purple-600'>
							{formatPrice(product.price)}{" "}
							<span className='text-sm font-normal'>so'm</span>
						</p>
					</div>
					<Badge
						variant='outline'
						className='text-emerald-600 border-emerald-200'
					>
						<span className='w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse' />
						Mavjud
					</Badge>
				</div>
			</CardContent>
		</Card>
	)
}

export default Shop
