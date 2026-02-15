import { gsap } from "gsap"
import { Eye, Heart, ShoppingCart, Star } from "lucide-react"
import { useEffect, useRef } from "react"
import { API } from "../config/api"

const ProductCard = ({ product, index }) => {
	const cardRef = useRef(null)

	useEffect(() => {
		gsap.fromTo(
			cardRef.current,
			{
				opacity: 0,
				y: 50,
				scale: 0.9,
			},
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.6,
				delay: index * 0.1,
				ease: "power3.out",
			}
		)
	}, [index])

	const handleMouseEnter = () => {
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

	const handleMouseLeave = () => {
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

	const getImageUrl = (imagePath) => {
		if (!imagePath) return "/placeholder.jpg"
		if (imagePath.startsWith("http")) return imagePath
		return `${API.UPLOADS}/${imagePath}`
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat("uz-UZ").format(price)
	}

	return (
		<div
			ref={cardRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className='group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-shadow duration-500 border border-slate-100'
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
					<span className='px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg'>
						Yangi
					</span>
				</div>

				{/* Favorite Button */}
				<button className='absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-500'>
					<Heart className='w-5 h-5' />
				</button>

				{/* Action Buttons */}
				<div className='card-actions absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-5'>
					<button className='flex-1 py-3 bg-gradient-to-r from-purple-600 to-emerald-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-shadow'>
						<ShoppingCart className='w-4 h-4' />
						Savatga
					</button>
					<button className='w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-purple-50 hover:text-purple-600 transition-colors'>
						<Eye className='w-5 h-5' />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className='p-5'>
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
					<div className='flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg'>
						<span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
						Mavjud
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
