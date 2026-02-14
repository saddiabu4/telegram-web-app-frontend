const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
const UPLOADS_URL =
	import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000/uploads"

export const API = {
	BASE: API_URL,
	UPLOADS: UPLOADS_URL,
	AUTH: {
		LOGIN: `${API_URL}/auth/login`,
		REGISTER: `${API_URL}/auth/register`,
	},
	PRODUCTS: {
		BASE: `${API_URL}/products`,
		GET_ALL: `${API_URL}/products`,
		GET_ONE: (id) => `${API_URL}/products/${id}`,
		CREATE: `${API_URL}/products`,
		UPDATE: (id) => `${API_URL}/products/${id}`,
		DELETE: (id) => `${API_URL}/products/${id}`,
	},
}

export const getImageUrl = (imageName) => {
	if (!imageName) return null
	return `${UPLOADS_URL}/${imageName}`
}

export default API
