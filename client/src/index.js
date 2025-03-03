import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./hooks/useAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<AuthProvider>
			<Header />
			<App />
			<Footer />
		</AuthProvider>
	</React.StrictMode>
);
