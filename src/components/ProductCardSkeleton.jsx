import { gsap } from "gsap"
import { useEffect, useRef } from "react"

const ProductCardSkeleton = ({ index = 0 }) => {
	const cardRef = useRef(null)

	useEffect(() => {
		gsap.fromTo(
			cardRef.current,
			{ opacity: 0, y: 30 },
			{
				opacity: 1,
				y: 0,
				duration: 0.5,
				delay: index * 0.05,
				ease: "power2.out",
			}
		)
	}, [index])

	return (
		<div
			ref={cardRef}
			className='bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100'
		>
			{/* Image Skeleton */}
			<div className='aspect-square bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse bg-[length:200%_100%]' />

			{/* Content Skeleton */}
			<div className='p-5 space-y-3'>
				{/* Rating */}
				<div className='flex gap-1'>
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className='w-4 h-4 bg-slate-200 rounded animate-pulse'
						/>
					))}
				</div>

				{/* Title */}
				<div className='h-5 bg-slate-200 rounded-lg w-3/4 animate-pulse' />
				<div className='h-4 bg-slate-100 rounded-lg w-1/2 animate-pulse' />

				{/* Price */}
				<div className='flex justify-between items-end pt-2'>
					<div className='h-8 bg-purple-100 rounded-lg w-1/3 animate-pulse' />
					<div className='h-6 bg-emerald-100 rounded-lg w-1/4 animate-pulse' />
				</div>
			</div>
		</div>
	)
}

export default ProductCardSkeleton
