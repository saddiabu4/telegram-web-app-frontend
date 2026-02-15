import axios from "axios"
import gsap from "gsap"
import {
	AlertCircle,
	CheckCircle,
	DollarSign,
	Edit3,
	FileText,
	Image as ImageIcon,
	LogOut,
	Package,
	Plus,
	Save,
	ShoppingBag,
	Sparkles,
	Store,
	Tag,
	Trash2,
	TrendingUp,
	Upload,
	Users,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { Skeleton } from "../components/ui/skeleton"
import { Textarea } from "../components/ui/textarea"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../components/ui/tooltip"
import { API } from "../config/api"

function Admin() {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [currentId, setCurrentId] = useState(null)
	const [deleteConfirm, setDeleteConfirm] = useState(null)

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		image: null,
		preview: null,
	})

	const token = localStorage.getItem("token")
	const navigate = useNavigate()

	// Refs for animations
	const gridRef = useRef(null)
	const modalRef = useRef(null)
	const navRef = useRef(null)

	// Get image URL helper
	const getImageUrl = (imagePath) => {
		if (!imagePath) return null
		if (imagePath.startsWith("http")) return imagePath
		return `${API.UPLOADS}/${imagePath}`
	}

	// Format price
	const formatPrice = (price) => {
		return new Intl.NumberFormat("uz-UZ").format(price)
	}

	// ================= FETCH =================
	const fetchProducts = async () => {
		setLoading(true)
		try {
			const res = await axios.get(API.PRODUCTS.GET_ALL)
			setProducts(res.data)
		} catch (err) {
			console.error(err)
			toast.error("Mahsulotlarni yuklashda xatolik")
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	// Navbar animation
	useEffect(() => {
		gsap.fromTo(
			navRef.current,
			{ opacity: 0, y: -20 },
			{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
		)
	}, [])

	// Products animation
	useEffect(() => {
		if (!loading && products.length > 0) {
			gsap.fromTo(
				".admin-product-card",
				{ opacity: 0, y: 40, scale: 0.95 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.5,
					stagger: 0.08,
					ease: "power3.out",
				}
			)
		}
	}, [loading, products])

	// ================= HANDLE CHANGE =================
	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleImage = (e) => {
		const file = e.target.files[0]
		if (file) {
			setFormData({
				...formData,
				image: file,
				preview: URL.createObjectURL(file),
			})
		}
	}

	// ================= CREATE =================
	const handleCreate = async (e) => {
		e.preventDefault()

		if (!formData.name || !formData.price) {
			toast.error("Nom va narx majburiy")
			return
		}

		const data = new FormData()
		data.append("name", formData.name)
		data.append("description", formData.description)
		data.append("price", formData.price)
		if (formData.image) data.append("image", formData.image)

		try {
			await axios.post(API.PRODUCTS.CREATE, data, {
				headers: { Authorization: `Bearer ${token}` },
			})

			toast.success("Mahsulot qo'shildi!")
			closeModal()
			fetchProducts()
		} catch (err) {
			toast.error(err.response?.data?.message || "Xatolik yuz berdi")
		}
	}

	// ================= EDIT OPEN =================
	const openEdit = (product) => {
		setIsEditing(true)
		setIsModalOpen(true)
		setCurrentId(product._id)
		setFormData({
			name: product.name,
			description: product.description || "",
			price: product.price,
			image: null,
			preview: product.image ? getImageUrl(product.image) : null,
		})

		setTimeout(() => animateModal(), 10)
	}

	// ================= UPDATE =================
	const handleUpdate = async (e) => {
		e.preventDefault()

		const data = new FormData()
		data.append("name", formData.name)
		data.append("description", formData.description)
		data.append("price", formData.price)
		if (formData.image) data.append("image", formData.image)

		try {
			await axios.put(API.PRODUCTS.UPDATE(currentId), data, {
				headers: { Authorization: `Bearer ${token}` },
			})

			toast.success("Mahsulot yangilandi!")
			closeModal()
			fetchProducts()
		} catch (err) {
			toast.error(err.response?.data?.message || "Xatolik yuz berdi")
		}
	}

	// ================= DELETE =================
	const deleteProduct = async (id) => {
		try {
			await axios.delete(API.PRODUCTS.DELETE(id), {
				headers: { Authorization: `Bearer ${token}` },
			})

			// Animate out
			gsap.to(`[data-product-id="${id}"]`, {
				opacity: 0,
				scale: 0.8,
				duration: 0.3,
				onComplete: () => {
					fetchProducts()
					toast.success("Mahsulot o'chirildi!")
				},
			})

			setDeleteConfirm(null)
		} catch (err) {
			toast.error("O'chirishda xatolik")
		}
	}

	// ================= MODAL ANIMATIONS =================
	const animateModal = () => {
		gsap.fromTo(
			modalRef.current,
			{ opacity: 0, scale: 0.9, y: 30 },
			{ opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
		)
	}

	const openModal = () => {
		setIsModalOpen(true)
		setTimeout(() => animateModal(), 10)
	}

	const closeModal = () => {
		gsap.to(modalRef.current, {
			opacity: 0,
			scale: 0.9,
			duration: 0.2,
			onComplete: () => {
				setIsModalOpen(false)
				setIsEditing(false)
				setCurrentId(null)
				setFormData({
					name: "",
					description: "",
					price: "",
					image: null,
					preview: null,
				})
			},
		})
	}

	// Logout
	const handleLogout = () => {
		localStorage.removeItem("token")
		toast.success("Tizimdan chiqdingiz")
		navigate("/login")
	}

	// Total revenue (demo)
	const totalRevenue = products.reduce((sum, p) => sum + Number(p.price), 0)

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/20'>
			{/* Background Decorations */}
			<div className='fixed inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-0 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl' />
				<div className='absolute bottom-0 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl' />
			</div>

			{/* Admin Navbar */}
			<nav
				ref={navRef}
				className='sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200'
			>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						{/* Logo */}
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 bg-gradient-to-br from-purple-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20'>
								<Sparkles className='w-5 h-5 text-white' />
							</div>
							<div>
								<h1 className='font-bold text-slate-800'>Admin Panel</h1>
								<p className='text-xs text-slate-500'>Uzum Market</p>
							</div>
						</div>

						{/* Actions */}
						<div className='flex items-center gap-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='outline'
										onClick={() => window.open("/", "_blank")}
										className='flex items-center gap-2'
									>
										<Store className='w-4 h-4' />
										<span className='hidden sm:inline'>Do'kon</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Do'konni ko'rish</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='destructive'
										onClick={handleLogout}
										className='flex items-center gap-2'
									>
										<LogOut className='w-4 h-4' />
										<span className='hidden sm:inline'>Chiqish</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Tizimdan chiqish</TooltipContent>
							</Tooltip>
						</div>
					</div>
				</div>
			</nav>

			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Stats Cards */}
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
					{[
						{
							icon: Package,
							label: "Mahsulotlar",
							value: products.length,
							bgColor: "bg-purple-100",
							textColor: "text-purple-600",
						},
						{
							icon: TrendingUp,
							label: "Umumiy qiymat",
							value: `${formatPrice(totalRevenue)} so'm`,
							bgColor: "bg-emerald-100",
							textColor: "text-emerald-600",
						},
						{
							icon: Users,
							label: "Mijozlar",
							value: "1,234",
							bgColor: "bg-amber-100",
							textColor: "text-amber-600",
						},
						{
							icon: ShoppingBag,
							label: "Buyurtmalar",
							value: "56",
							bgColor: "bg-rose-100",
							textColor: "text-rose-600",
						},
					].map((stat, i) => (
						<Card
							key={i}
							className='hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300'
						>
							<CardContent className='p-5'>
								<div className='flex items-center gap-3'>
									<div
										className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
									>
										<stat.icon className={`w-6 h-6 ${stat.textColor}`} />
									</div>
									<div>
										<p className='text-sm text-slate-500'>{stat.label}</p>
										<p className={`text-xl font-bold ${stat.textColor}`}>
											{stat.value}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Header */}
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
					<div>
						<h2 className='text-2xl font-bold text-slate-800 flex items-center gap-3'>
							<Package className='w-7 h-7 text-purple-600' />
							Mahsulotlar ro'yxati
						</h2>
						<p className='text-slate-500 mt-1'>
							Barcha mahsulotlarni boshqarish
						</p>
					</div>

					<Button
						onClick={openModal}
						className='flex items-center gap-2 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all'
					>
						<Plus className='w-5 h-5' />
						Yangi mahsulot
					</Button>
				</div>

				{/* Loading */}
				{loading && (
					<div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{[...Array(8)].map((_, i) => (
							<Card key={i} className='overflow-hidden'>
								<Skeleton className='aspect-square w-full' />
								<CardContent className='p-5 space-y-3'>
									<Skeleton className='h-5 w-3/4' />
									<Skeleton className='h-4 w-1/2' />
									<Skeleton className='h-8 w-1/3' />
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* Empty State */}
				{!loading && products.length === 0 && (
					<Card className='text-center py-20 border-dashed'>
						<CardContent className='pt-6'>
							<Package className='w-24 h-24 mx-auto text-slate-300 mb-4' />
							<h3 className='text-xl font-semibold text-slate-600 mb-2'>
								Mahsulotlar yo'q
							</h3>
							<p className='text-slate-500 mb-6'>
								Birinchi mahsulotingizni qo'shing
							</p>
							<Button
								onClick={openModal}
								className='bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600'
							>
								<Plus className='w-5 h-5 mr-2' />
								Mahsulot qo'shish
							</Button>
						</CardContent>
					</Card>
				)}

				{/* Products Grid */}
				{!loading && products.length > 0 && (
					<div
						ref={gridRef}
						className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
					>
						{products.map((product) => (
							<Card
								key={product._id}
								data-product-id={product._id}
								className='admin-product-card overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-300 group'
							>
								{/* Image */}
								<div className='relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100'>
									{product.image ? (
										<img
											src={getImageUrl(product.image)}
											alt={product.name}
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
											onError={(e) => {
												e.target.src =
													"https://via.placeholder.com/300x300?text=No+Image"
											}}
										/>
									) : (
										<div className='w-full h-full flex items-center justify-center'>
											<ImageIcon className='w-16 h-16 text-slate-300' />
										</div>
									)}

									{/* Overlay Actions */}
									<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3'>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant='secondary'
													size='icon'
													onClick={() => openEdit(product)}
													className='w-12 h-12 bg-white text-amber-600 hover:bg-amber-50 shadow-lg'
												>
													<Edit3 className='w-5 h-5' />
												</Button>
											</TooltipTrigger>
											<TooltipContent>Tahrirlash</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant='secondary'
													size='icon'
													onClick={() => setDeleteConfirm(product._id)}
													className='w-12 h-12 bg-white text-red-600 hover:bg-red-50 shadow-lg'
												>
													<Trash2 className='w-5 h-5' />
												</Button>
											</TooltipTrigger>
											<TooltipContent>O'chirish</TooltipContent>
										</Tooltip>
									</div>
								</div>

								{/* Info */}
								<CardContent className='p-5'>
									<h3 className='font-semibold text-slate-800 mb-2 line-clamp-1'>
										{product.name}
									</h3>
									<p className='text-slate-500 text-sm line-clamp-2 mb-4 min-h-[40px]'>
										{product.description || "Tavsif yo'q"}
									</p>

									<Separator className='my-4' />

									<div className='flex items-center justify-between'>
										<span className='text-xl font-bold text-purple-600'>
											{formatPrice(product.price)}{" "}
											<span className='text-sm font-normal'>so'm</span>
										</span>

										<Button
											variant='outline'
											size='sm'
											onClick={() => openEdit(product)}
											className='hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
										>
											<Edit3 className='w-4 h-4 mr-1' />
											Tahrirlash
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={!!deleteConfirm}
				onOpenChange={() => setDeleteConfirm(null)}
			>
				<DialogContent className='max-w-sm text-center'>
					<DialogHeader>
						<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<AlertCircle className='w-8 h-8 text-red-500' />
						</div>
						<DialogTitle>O'chirishni tasdiqlang</DialogTitle>
					</DialogHeader>
					<p className='text-slate-500'>Bu amalni ortga qaytarib bo'lmaydi</p>
					<DialogFooter className='flex gap-3 sm:justify-center mt-4'>
						<Button
							variant='outline'
							onClick={() => setDeleteConfirm(null)}
							className='flex-1'
						>
							Bekor qilish
						</Button>
						<Button
							variant='destructive'
							onClick={() => deleteProduct(deleteConfirm)}
							className='flex-1'
						>
							O'chirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Create/Edit Dialog */}
			<Dialog open={isModalOpen} onOpenChange={closeModal}>
				<DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2'>
							{isEditing ? (
								<>
									<Edit3 className='w-5 h-5 text-amber-500' />
									Mahsulotni tahrirlash
								</>
							) : (
								<>
									<Plus className='w-5 h-5 text-purple-600' />
									Yangi mahsulot
								</>
							)}
						</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={isEditing ? handleUpdate : handleCreate}
						className='space-y-5'
					>
						{/* Name */}
						<div className='space-y-2'>
							<Label htmlFor='name' className='flex items-center gap-2'>
								<Tag className='w-4 h-4' /> Nomi
							</Label>
							<Input
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								placeholder='Mahsulot nomi'
								required
							/>
						</div>

						{/* Description */}
						<div className='space-y-2'>
							<Label htmlFor='description' className='flex items-center gap-2'>
								<FileText className='w-4 h-4' /> Tavsif
							</Label>
							<Textarea
								id='description'
								name='description'
								value={formData.description}
								onChange={handleChange}
								placeholder='Mahsulot haqida...'
								rows={3}
							/>
						</div>

						{/* Price */}
						<div className='space-y-2'>
							<Label htmlFor='price' className='flex items-center gap-2'>
								<DollarSign className='w-4 h-4' /> Narxi (so'm)
							</Label>
							<Input
								id='price'
								type='number'
								name='price'
								value={formData.price}
								onChange={handleChange}
								placeholder='0'
								required
							/>
						</div>

						{/* Image Upload */}
						<div className='space-y-2'>
							<Label className='flex items-center gap-2'>
								<ImageIcon className='w-4 h-4' /> Rasm
							</Label>

							<div className='relative'>
								<input
									type='file'
									accept='image/*'
									onChange={handleImage}
									className='hidden'
									id='image-upload'
								/>
								<label
									htmlFor='image-upload'
									className='flex flex-col items-center justify-center w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/30 transition'
								>
									{formData.preview ? (
										<img
											src={formData.preview}
											alt='Preview'
											className='w-full h-full object-cover rounded-xl'
										/>
									) : (
										<>
											<Upload className='w-10 h-10 text-slate-400 mb-2' />
											<span className='text-slate-500'>
												Rasm yuklash uchun bosing
											</span>
											<span className='text-xs text-slate-400 mt-1'>
												PNG, JPG, WEBP (max 5MB)
											</span>
										</>
									)}
								</label>
							</div>
						</div>

						{/* Submit Button */}
						<Button
							type='submit'
							className='w-full bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-700 hover:to-emerald-600'
						>
							{isEditing ? (
								<>
									<CheckCircle className='w-5 h-5 mr-2' /> Yangilash
								</>
							) : (
								<>
									<Save className='w-5 h-5 mr-2' /> Saqlash
								</>
							)}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default Admin
