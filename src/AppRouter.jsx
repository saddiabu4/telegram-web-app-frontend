import { BrowserRouter, Route, Routes } from "react-router-dom"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Shop from "./pages/Shop"
import ProtectedRoute from "./routes/ProtectedRoute"

function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				{/* USER SHOP - Asosiy sahifa */}
				<Route path='/' element={<Shop />} />
				<Route path='/shop' element={<Shop />} />

				{/* LOGIN */}
				<Route path='/login' element={<Login />} />

				{/* ADMIN (PROTECTED) */}
				<Route
					path='/admin'
					element={
						<ProtectedRoute>
							<Admin />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRouter
