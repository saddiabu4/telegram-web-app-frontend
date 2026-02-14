import gsap from "gsap"
import { LogOut, Sparkles, Store } from "lucide-react"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

function Navbar() {
	const navigate = useNavigate()
	const navRef = useRef(null)

	useEffect(() => {
		gsap.fromTo(
			navRef.current,
			{ opacity: 0, y: -20 },
			{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
		)
	}, [])

	const handleLogout = () => {
		localStorage.removeItem("token")
		toast.success("Tizimdan chiqdingiz")
		navigate("/login")
	}

	const openShop = () => {
		window.open("/", "_blank")
	}

	return (
		<nav
			ref={navRef}
			className='sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800'
		>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center h-14 sm:h-16'>
					{/* Logo */}
					<div className='flex items-center gap-2 sm:gap-3'>
						<div className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20'>
							<Sparkles className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
						</div>
						<div>
							<h1 className='text-white font-bold text-base sm:text-lg'>
								Admin Panel
							</h1>
							<p className='text-[10px] sm:text-xs text-gray-500 hidden sm:block'>
								Boshqaruv paneli
							</p>
						</div>
					</div>

					{/* Actions */}
					<div className='flex items-center gap-2'>
						{/* Shop Button */}
						<button
							onClick={openShop}
							className='flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all active:scale-95'
						>
							<Store className='w-4 h-4' />
							<span className='hidden sm:inline text-sm'>Do'kon</span>
						</button>

						{/* Logout Button */}
						<button
							onClick={handleLogout}
							className='flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all active:scale-95'
						>
							<LogOut className='w-4 h-4' />
							<span className='hidden sm:inline text-sm'>Chiqish</span>
						</button>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
