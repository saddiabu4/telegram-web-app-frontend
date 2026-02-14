import axios from "axios"
import gsap from "gsap"
import {
	AlertCircle,
	CheckCircle,
	DollarSign,
	Edit3,
	FileText,
	Image as ImageIcon,
	Package,
	Plus,
	Save,
	Tag,
	Trash2,
	Upload,
	X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import Navbar from "../components/Navbar"
import { API, getImageUrl } from "../config/api"

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

	// Refs for animations
	const gridRef = useRef(null)
	const modalRef = useRef(null)

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

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-black text-white'>
			<Navbar />

			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
					<div>
						<h1 className='text-3xl font-bold flex items-center gap-3'>
							<Package className='w-8 h-8 text-pink-500' />
							Mahsulotlar
						</h1>
						<p className='text-gray-400 mt-1'>{products.length} ta mahsulot</p>
					</div>

					<button
						onClick={openModal}
						className='flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all btn-shine active:scale-95'
					>
						<Plus className='w-5 h-5' />
						Yangi mahsulot
					</button>
				</div>

				{/* Loading */}
				{loading && (
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[...Array(6)].map((_, i) => (
							<div key={i} className='bg-zinc-800/50 rounded-2xl p-4 space-y-4'>
								<div className='h-48 shimmer rounded-xl bg-zinc-700' />
								<div className='h-4 shimmer rounded w-3/4 bg-zinc-700' />
								<div className='h-4 shimmer rounded w-1/2 bg-zinc-700' />
							</div>
						))}
					</div>
				)}

				{/* Empty State */}
				{!loading && products.length === 0 && (
					<div className='text-center py-20'>
						<Package className='w-24 h-24 mx-auto text-zinc-600 mb-4' />
						<h3 className='text-xl font-semibold text-gray-400 mb-2'>
							Mahsulotlar yo'q
						</h3>
						<p className='text-gray-500 mb-6'>Birinchi mahsulotni qo'shing</p>
						<button
							onClick={openModal}
							className='inline-flex items-center gap-2 bg-pink-500 px-6 py-3 rounded-xl'
						>
							<Plus className='w-5 h-5' />
							Mahsulot qo'shish
						</button>
					</div>
				)}

				{/* Products Grid */}
				{!loading && products.length > 0 && (
					<div
						ref={gridRef}
						className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'
					>
						{products.map((product) => (
							<div
								key={product._id}
								data-product-id={product._id}
								className='admin-product-card bg-zinc-800/50 backdrop-blur rounded-2xl overflow-hidden border border-zinc-700/50 hover:border-pink-500/30 transition-all group'
							>
								{/* Image */}
								<div className='relative aspect-video overflow-hidden'>
									{product.image ? (
										<img
											src={getImageUrl(product.image)}
											alt={product.name}
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
										/>
									) : (
										<div className='w-full h-full bg-zinc-700 flex items-center justify-center'>
											<ImageIcon className='w-16 h-16 text-zinc-500' />
										</div>
									)}

									{/* Overlay Actions */}
									<div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3'>
										<button
											onClick={() => openEdit(product)}
											className='w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center hover:bg-yellow-400 transition transform hover:scale-110'
										>
											<Edit3 className='w-5 h-5 text-white' />
										</button>
										<button
											onClick={() => setDeleteConfirm(product._id)}
											className='w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center hover:bg-red-400 transition transform hover:scale-110'
										>
											<Trash2 className='w-5 h-5 text-white' />
										</button>
									</div>
								</div>

								{/* Info */}
								<div className='p-5'>
									<h3 className='text-lg font-semibold text-white mb-2'>
										{product.name}
									</h3>
									<p className='text-gray-400 text-sm line-clamp-2 mb-4'>
										{product.description || "Tavsif yo'q"}
									</p>

									<div className='flex items-center justify-between'>
										<span className='text-2xl font-bold text-pink-500'>
											${product.price}
										</span>

										<div className='flex gap-2'>
											<button
												onClick={() => openEdit(product)}
												className='px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition flex items-center gap-1'
											>
												<Edit3 className='w-4 h-4' />
												Edit
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			{deleteConfirm && (
				<div className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4'>
					<div className='bg-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4'>
						<div className='w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto'>
							<AlertCircle className='w-8 h-8 text-red-500' />
						</div>
						<h3 className='text-xl font-bold'>O'chirishni tasdiqlang</h3>
						<p className='text-gray-400'>Bu amalni ortga qaytarib bo'lmaydi</p>
						<div className='flex gap-3'>
							<button
								onClick={() => setDeleteConfirm(null)}
								className='flex-1 py-3 bg-zinc-700 rounded-xl hover:bg-zinc-600 transition'
							>
								Bekor qilish
							</button>
							<button
								onClick={() => deleteProduct(deleteConfirm)}
								className='flex-1 py-3 bg-red-500 rounded-xl hover:bg-red-400 transition'
							>
								O'chirish
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Create/Edit Modal */}
			{isModalOpen && (
				<div className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4'>
					<div
						ref={modalRef}
						className='bg-zinc-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto'
					>
						{/* Modal Header */}
						<div className='sticky top-0 bg-zinc-800 p-6 border-b border-zinc-700 flex items-center justify-between'>
							<h2 className='text-xl font-bold flex items-center gap-2'>
								{isEditing ? (
									<>
										<Edit3 className='w-5 h-5 text-yellow-500' /> Mahsulotni
										tahrirlash
									</>
								) : (
									<>
										<Plus className='w-5 h-5 text-pink-500' /> Yangi mahsulot
									</>
								)}
							</h2>
							<button
								onClick={closeModal}
								className='w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-600 transition'
							>
								<X className='w-5 h-5' />
							</button>
						</div>

						{/* Modal Form */}
						<form
							onSubmit={isEditing ? handleUpdate : handleCreate}
							className='p-6 space-y-5'
						>
							{/* Name */}
							<div className='space-y-2'>
								<label className='text-sm text-gray-400 flex items-center gap-2'>
									<Tag className='w-4 h-4' /> Nomi
								</label>
								<input
									type='text'
									name='name'
									value={formData.name}
									onChange={handleChange}
									placeholder='Mahsulot nomi'
									className='w-full bg-zinc-700 border border-zinc-600 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition'
									required
								/>
							</div>

							{/* Description */}
							<div className='space-y-2'>
								<label className='text-sm text-gray-400 flex items-center gap-2'>
									<FileText className='w-4 h-4' /> Tavsif
								</label>
								<textarea
									name='description'
									value={formData.description}
									onChange={handleChange}
									placeholder='Mahsulot haqida...'
									rows={3}
									className='w-full bg-zinc-700 border border-zinc-600 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition resize-none'
								/>
							</div>

							{/* Price */}
							<div className='space-y-2'>
								<label className='text-sm text-gray-400 flex items-center gap-2'>
									<DollarSign className='w-4 h-4' /> Narxi
								</label>
								<input
									type='number'
									name='price'
									value={formData.price}
									onChange={handleChange}
									placeholder='0.00'
									step='0.01'
									className='w-full bg-zinc-700 border border-zinc-600 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition'
									required
								/>
							</div>

							{/* Image Upload */}
							<div className='space-y-2'>
								<label className='text-sm text-gray-400 flex items-center gap-2'>
									<ImageIcon className='w-4 h-4' /> Rasm
								</label>

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
										className='flex flex-col items-center justify-center w-full h-40 bg-zinc-700 border-2 border-dashed border-zinc-600 rounded-xl cursor-pointer hover:border-pink-500 transition'
									>
										{formData.preview ? (
											<img
												src={formData.preview}
												alt='Preview'
												className='w-full h-full object-cover rounded-xl'
											/>
										) : (
											<>
												<Upload className='w-10 h-10 text-gray-500 mb-2' />
												<span className='text-gray-500'>Rasm yuklash</span>
											</>
										)}
									</label>
								</div>
							</div>

							{/* Submit Button */}
							<button
								type='submit'
								className='w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 hover:shadow-xl transition btn-shine'
							>
								{isEditing ? (
									<>
										<CheckCircle className='w-5 h-5' /> Yangilash
									</>
								) : (
									<>
										<Save className='w-5 h-5' /> Saqlash
									</>
								)}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}

export default Admin
