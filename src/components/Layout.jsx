import { gsap } from "gsap"
import { useEffect } from "react"

const Layout = ({ children }) => {
	useEffect(() => {
		// Page load animation
		gsap.fromTo(
			".page-content",
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
		)
	}, [])

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/20'>
			{/* Background Decorations */}
			<div className='fixed inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-0 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl' />
				<div className='absolute bottom-0 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl' />
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-100/20 to-emerald-100/20 rounded-full blur-3xl' />
			</div>

			{/* Main Content */}
			<div className='relative z-10 page-content'>{children}</div>
		</div>
	)
}

export default Layout
