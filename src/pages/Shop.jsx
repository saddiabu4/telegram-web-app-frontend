import axios from "axios"
import gsap from "gsap"
import {
	ArrowRight,
	ChevronRight,
	Heart,
	Minus,
	Package,
	Plus,
	Search,
	Settings,
	ShoppingCart,
	Sparkles,
	Star,
	Trash2,
	X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { API, getImageUrl } from "../config/api"

function Shop() {
	const [products, setProducts] = useState([])
	const [cart, setCart] = useState([])
	const [loading, setLoading] = useState(true)
	const [isCartOpen, setIsCartOpen] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [favorites, setFavorites] = useState([])

	const navigate = useNavigate()

	// Refs for animations
	const headerRef = useRef(null)
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
			const tl = gsap.timeline()

			tl.fromTo(
				headerRef.current,
				{ opacity: 0, y: -30 },
				{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
			).fromTo(
				".product-item",
				{ opacity: 0, y: 40, scale: 0.95 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.5,
					stagger: 0.08,
					ease: "back.out(1.4)",
				},
				"-=0.3"
			)
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

	// Filter products by search
	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

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

	const handleCheckout = () => {
		if (tg) {
			tg.sendData(
				JSON.stringify({
					action: "checkout",
					items: cart,
					total: total.toFixed(2),
				})
			)
		} else {
			toast.success("Buyurtma qabul qilindi!")
			setCart([])
			setIsCartOpen(false)
		}
	}

	const openProductModal = (product) => {
		setSelectedProduct(product)
		document.body.style.overflow = "hidden"

		setTimeout(() => {
			gsap.fromTo(
				productModalRef.current,
				{ opacity: 0, y: 100 },
				{ opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
			)
		}, 10)
	}

	const closeProductModal = () => {
		gsap.to(productModalRef.current, {
			opacity: 0,
			y: 100,
			duration: 0.3,
			ease: "power3.in",
			onComplete: () => {
				setSelectedProduct(null)
				document.body.style.overflow = ""
			},
		})
	}

	const openCart = () => {
		setIsCartOpen(true)
		document.body.style.overflow = "hidden"
		setTimeout(() => {
			gsap.fromTo(
				cartPanelRef.current,
				{ x: "100%" },
				{ x: "0%", duration: 0.35, ease: "power3.out" }
			)
		}, 10)
	}

	const closeCart = () => {
		gsap.to(cartPanelRef.current, {
			x: "100%",
			duration: 0.3,
			ease: "power3.in",
			onComplete: () => {
				setIsCartOpen(false)
				document.body.style.overflow = ""
			},
		})
	}

	// Loading Skeleton
	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50'>
				{/* Skeleton Header */}
				<div className='sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-pink-100 px-4 py-3'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='w-11 h-11 rounded-2xl shimmer bg-pink-100' />
							<div className='space-y-2'>
								<div className='h-4 w-24 shimmer rounded bg-pink-100' />
								<div className='h-3 w-16 shimmer rounded bg-pink-100' />
							</div>
						</div>
						<div className='w-11 h-11 rounded-2xl shimmer bg-pink-100' />
					</div>
				</div>

				{/* Skeleton Grid */}
				<div className='px-4 py-6'>
					<div className='grid grid-cols-2 gap-3 sm:gap-4'>
						{[...Array(6)].map((_, i) => (
							<div key={i} className='bg-white rounded-2xl p-3 shadow-sm'>
								<div className='aspect-square shimmer rounded-xl bg-pink-50 mb-3' />
								<div className='h-4 shimmer rounded bg-pink-50 mb-2' />
								<div className='h-3 shimmer rounded bg-pink-50 w-2/3' />
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50'>
			{/* Header */}
			<header
				ref={headerRef}
				className='sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-pink-100 safe-area-top'
			>
				<div className='px-4 py-3'>
					<div className='flex items-center justify-between'>
						{/* Logo */}
						<div className='flex items-center gap-3'>
							<div className='w-11 h-11 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25'>
								<Sparkles className='w-5 h-5 text-white' />
							</div>
							<div>
								<h1 className='text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
									Cosmetic Shop
								</h1>
								<p className='text-[11px] text-gray-500'>
									{products.length} ta mahsulot
								</p>
							</div>
						</div>

						{/* Right Actions */}
						<div className='flex items-center gap-2'>
							{/* Admin Link */}
							<button
								onClick={() => navigate("/admin")}
								className='w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all active:scale-95'
							>
								<Settings className='w-5 h-5 text-gray-600' />
							</button>

							{/* Cart Button */}
							<button
								ref={cartBtnRef}
								onClick={openCart}
								className='relative w-11 h-11 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25 active:scale-95 transition-transform'
							>
								<ShoppingCart className='w-5 h-5 text-white' />
								{totalItems > 0 && (
									<span className='absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-red-500 rounded-full text-white text-[11px] font-bold flex items-center justify-center px-1 shadow-lg animate-bounce'>
										{totalItems}
									</span>
								)}
							</button>
						</div>
					</div>

					{/* Search Bar */}
					<div className='mt-3 relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
						<input
							type='text'
							placeholder='Mahsulot qidirish...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:bg-white transition-all'
						/>
					</div>
				</div>
			</header>

			{/* Products Grid */}
			<main ref={productsRef} className='px-4 py-4 pb-24'>
				{filteredProducts.length === 0 ? (
					<div className='text-center py-16'>
						<Package className='w-16 h-16 mx-auto text-gray-300 mb-4' />
						<h3 className='text-lg font-semibold text-gray-500 mb-1'>
							{searchTerm ? "Hech narsa topilmadi" : "Mahsulotlar yo'q"}
						</h3>
						<p className='text-sm text-gray-400'>
							{searchTerm
								? "Boshqa so'z bilan qidiring"
								: "Tez orada yangi mahsulotlar qo'shiladi"}
						</p>
					</div>
				) : (
					<div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'>
						{filteredProducts.map((product) => (
							<div
								key={product._id}
								className='product-item bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group'
							>
								{/* Image Container */}
								<div
									className='relative aspect-square overflow-hidden cursor-pointer'
									onClick={() => openProductModal(product)}
								>
									{product.image ? (
										<img
											src={getImageUrl(product.image)}
											alt={product.name}
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
											loading='lazy'
										/>
									) : (
										<div className='w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center'>
											<Package className='w-10 h-10 text-pink-300' />
										</div>
									)}

									{/* Favorite Button */}
									<button
										className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 ${
											favorites.includes(product._id)
												? "bg-pink-500 text-white"
												: "bg-white/95 text-pink-500 hover:bg-pink-50"
										}`}
										onClick={(e) => {
											e.stopPropagation()
											toggleFavorite(product._id)
										}}
									>
										<Heart
											className={`w-4 h-4 ${
												favorites.includes(product._id) ? "fill-white" : ""
											}`}
										/>
									</button>
								</div>

								{/* Info */}
								<div className='p-3'>
									<h3
										className='font-semibold text-gray-800 text-sm line-clamp-1 cursor-pointer'
										onClick={() => openProductModal(product)}
									>
										{product.name}
									</h3>
									<p className='text-[11px] text-gray-500 mt-0.5 line-clamp-1'>
										{product.description || "Kosmetika mahsuloti"}
									</p>

									<div className='flex items-center justify-between mt-2'>
										<span className='text-base font-bold text-pink-600'>
											${product.price}
										</span>

										<button
											onClick={(e) => {
												e.stopPropagation()
												addToCart(product)
											}}
											className='w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-transform'
										>
											<Plus className='w-4 h-4 text-white' />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</main>

			{/* Floating Cart Button (Mobile) */}
			{totalItems > 0 && !isCartOpen && (
				<div className='fixed bottom-4 left-4 right-4 z-30 md:hidden'>
					<button
						onClick={openCart}
						className='w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3.5 px-5 rounded-2xl shadow-xl shadow-pink-500/30 flex items-center justify-between active:scale-[0.98] transition-transform'
					>
						<div className='flex items-center gap-3'>
							<div className='w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center'>
								<ShoppingCart className='w-5 h-5' />
							</div>
							<span className='font-semibold'>{totalItems} ta mahsulot</span>
						</div>
						<div className='flex items-center gap-2'>
							<span className='font-bold text-lg'>${total.toFixed(2)}</span>
							<ArrowRight className='w-5 h-5' />
						</div>
					</button>
				</div>
			)}

			{/* Product Modal */}
			{selectedProduct && (
				<div
					className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center'
					onClick={closeProductModal}
				>
					<div
						ref={productModalRef}
						className='bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-hidden'
						onClick={(e) => e.stopPropagation()}
					>
						{/* Handle Bar */}
						<div className='flex justify-center pt-3 pb-2'>
							<div className='w-10 h-1 bg-gray-300 rounded-full' />
						</div>

						{/* Modal Image */}
						<div className='relative aspect-[4/3] overflow-hidden'>
							{selectedProduct.image ? (
								<img
									src={getImageUrl(selectedProduct.image)}
									alt={selectedProduct.name}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center'>
									<Package className='w-20 h-20 text-pink-300' />
								</div>
							)}

							<button
								onClick={closeProductModal}
								className='absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur rounded-full flex items-center justify-center active:scale-90 transition-transform'
							>
								<X className='w-5 h-5 text-white' />
							</button>

							{/* Favorite on Modal */}
							<button
								onClick={() => toggleFavorite(selectedProduct._id)}
								className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all ${
									favorites.includes(selectedProduct._id)
										? "bg-pink-500 text-white"
										: "bg-white text-pink-500"
								}`}
							>
								<Heart
									className={`w-5 h-5 ${
										favorites.includes(selectedProduct._id) ? "fill-white" : ""
									}`}
								/>
							</button>
						</div>

						{/* Modal Content */}
						<div className='p-5 space-y-4 safe-area-bottom'>
							<div className='flex items-start justify-between gap-3'>
								<div className='flex-1'>
									<h2 className='text-xl font-bold text-gray-800'>
										{selectedProduct.name}
									</h2>
									<div className='flex items-center gap-1 mt-1.5'>
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400'
											/>
										))}
										<span className='text-xs text-gray-500 ml-1'>
											(128 baho)
										</span>
									</div>
								</div>
								<span className='text-2xl font-bold text-pink-600'>
									${selectedProduct.price}
								</span>
							</div>

							<p className='text-sm text-gray-600 leading-relaxed'>
								{selectedProduct.description ||
									"Premium sifatli kosmetika mahsuloti. Tabiiy ingredientlardan tayyorlangan. Teri uchun xavfsiz va samarali."}
							</p>

							<button
								onClick={() => {
									addToCart(selectedProduct)
									closeProductModal()
								}}
								className='w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform'
							>
								<ShoppingCart className='w-5 h-5' />
								Savatga qo'shish
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Cart Drawer */}
			{isCartOpen && (
				<div className='fixed inset-0 z-50'>
					<div
						className='absolute inset-0 bg-black/60 backdrop-blur-sm'
						onClick={closeCart}
					/>

					<div
						ref={cartPanelRef}
						className='absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col'
					>
						{/* Cart Header */}
						<div className='flex items-center justify-between p-4 border-b bg-white'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center'>
									<ShoppingCart className='w-5 h-5 text-white' />
								</div>
								<div>
									<h2 className='font-bold text-lg'>Savat</h2>
									<p className='text-xs text-gray-500'>
										{totalItems} ta mahsulot
									</p>
								</div>
							</div>

							<button
								onClick={closeCart}
								className='w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all'
							>
								<X className='w-5 h-5 text-gray-600' />
							</button>
						</div>

						{/* Cart Items */}
						<div className='flex-1 overflow-y-auto p-4 space-y-3'>
							{cart.length === 0 ? (
								<div className='text-center py-16'>
									<ShoppingCart className='w-14 h-14 mx-auto text-gray-300 mb-3' />
									<p className='text-gray-500 font-medium'>Savat bo'sh</p>
									<p className='text-sm text-gray-400 mt-1'>
										Mahsulot qo'shing
									</p>
								</div>
							) : (
								cart.map((item) => (
									<div
										key={item._id}
										data-cart-item={item._id}
										className='bg-gray-50 rounded-2xl p-3 flex items-center gap-3'
									>
										{/* Item Image */}
										<div className='w-16 h-16 rounded-xl overflow-hidden flex-shrink-0'>
											{item.image ? (
												<img
													src={getImageUrl(item.image)}
													alt={item.name}
													className='w-full h-full object-cover'
												/>
											) : (
												<div className='w-full h-full bg-pink-100 flex items-center justify-center'>
													<Package className='w-6 h-6 text-pink-300' />
												</div>
											)}
										</div>

										{/* Item Info */}
										<div className='flex-1 min-w-0'>
											<h4 className='font-semibold text-sm text-gray-800 truncate'>
												{item.name}
											</h4>
											<p className='text-pink-600 font-bold text-sm mt-0.5'>
												${(item.price * item.quantity).toFixed(2)}
											</p>
										</div>

										{/* Quantity Controls */}
										<div className='flex items-center gap-1.5'>
											<button
												onClick={() => updateQuantity(item._id, -1)}
												className='w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm active:scale-90 transition-transform'
											>
												<Minus className='w-3.5 h-3.5 text-gray-600' />
											</button>

											<span className='w-6 text-center font-semibold text-sm'>
												{item.quantity}
											</span>

											<button
												onClick={() => updateQuantity(item._id, 1)}
												className='w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm active:scale-90 transition-transform'
											>
												<Plus className='w-3.5 h-3.5 text-gray-600' />
											</button>
										</div>

										{/* Remove Button */}
										<button
											onClick={() => removeFromCart(item._id)}
											className='w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center active:scale-90 transition-transform'
										>
											<Trash2 className='w-3.5 h-3.5 text-red-500' />
										</button>
									</div>
								))
							)}
						</div>

						{/* Cart Footer */}
						{cart.length > 0 && (
							<div className='p-4 border-t bg-white safe-area-bottom'>
								<div className='flex items-center justify-between mb-4'>
									<span className='text-gray-600'>Jami:</span>
									<span className='font-bold text-2xl text-pink-600'>
										${total.toFixed(2)}
									</span>
								</div>

								<button
									onClick={handleCheckout}
									className='w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform'
								>
									Buyurtma berish
									<ChevronRight className='w-5 h-5' />
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default Shop
