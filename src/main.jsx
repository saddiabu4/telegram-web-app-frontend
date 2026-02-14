import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast"
import AppRouter from "./AppRouter"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
	<>
		<AppRouter />
		<Toaster
			position='top-center'
			toastOptions={{
				duration: 3000,
				style: {
					background: "#1a1a1a",
					color: "#fff",
					borderRadius: "12px",
					padding: "12px 20px",
				},
				success: {
					iconTheme: {
						primary: "#10b981",
						secondary: "#fff",
					},
				},
				error: {
					iconTheme: {
						primary: "#ef4444",
						secondary: "#fff",
					},
				},
			}}
		/>
	</>
)
