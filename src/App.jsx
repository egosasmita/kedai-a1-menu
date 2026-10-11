import { useEffect, useMemo, useState } from "react";
import {
	BrowserRouter,
	Link,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";
import axios from "axios";
import {
	ArrowRight,
	ChevronDown,
	Instagram,
	MapPin,
	Moon,
	Search,
	Sun,
	X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const API = `${import.meta.env.VITE_API_URL}/api`;

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80";

const money = (value) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(value);

function useShopData() {
	const [data, setData] = useState({
		settings: null,
		categories: [],
		menus: [],
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			axios.get(`${API}/settings`),
			axios.get(`${API}/categories`),
			axios.get(`${API}/menus`),
		])
			.then(([settings, categories, menus]) => {
				setData({
					settings: settings.data,
					categories: categories.data,
					menus: menus.data,
				});
			})
			.catch((error) => {
				console.error("Failed to load menu data:", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return {
		...data,
		loading,
	};
}

function Header({ dark, setDark }) {
	return (
		<header className="site-header" data-testid="site-header">
			<Link
				to="/"
				className="brand-mark"
				data-testid="home-logo-link"
			>
				<img
					src="/logo.png"
					alt="Logo Kedai Kopi A1"
					onError={(event) => {
						event.currentTarget.src =
							FALLBACK_IMAGE;
					}}
				/>
				<span>A1</span>
			</Link>

			<nav>
				<Link to="/menu" data-testid="header-menu-link">
					Menu
				</Link>

				<button
					className="icon-button"
					onClick={() => setDark(!dark)}
					aria-label="Ubah tema"
					data-testid="theme-toggle-button"
				>
					{dark ? <Sun size={18} /> : <Moon size={18} />}
				</button>
			</nav>
		</header>
	);
}

function Footer({ settings }) {
	const shop = settings || {
		shop_name: "Kedai Kopi A1",
		address: "Kediri, Jawa Timur",
		open_hour: "08:00",
		close_hour: "22:00",
	};

	return (
		<footer className="footer" data-testid="shop-footer">
			<div>
				<div className="footer-name">{shop.shop_name}</div>
				<p>Tempat singgah untuk rasa yang tinggal.</p>
			</div>

			<div className="footer-links">
				<a
					href="https://www.instagram.com/kedai.asatoe/"
					data-testid="instagram-link"
					target="_blank"
					rel="noreferrer"
				>
					<Instagram size={16} />
					Instagram
				</a>

				<a
					href="https://maps.app.goo.gl/RGygM1xEzQynBsLL7"
					data-testid="address-link"
					target="_blank"
					rel="noreferrer"
				>
					<MapPin size={16} />
					{shop.address}
				</a>

				<span data-testid="hours-text">
					Setiap hari · {shop.open_hour}–{shop.close_hour}
				</span>
			</div>
		</footer>
	);
}

function Home({ settings }) {
	const navigate = useNavigate();

	const shop = settings || {
		shop_name: "Kedai Kopi A1",
		tagline: "Secangkir hangat, cerita yang dekat.",
	};

	return (
		<main>
			<section className="hero" data-testid="home-hero">
				<div className="hero-copy">
					<div className="eyebrow">EST. KEDIRI · 2026</div>

					<h1>{shop.shop_name}</h1>

					<p>{shop.tagline}</p>

					<button
						className="primary-button"
						onClick={() => navigate("/menu")}
						data-testid="view-menu-button"
					>
						Lihat Menu
						<ArrowRight size={18} />
					</button>
				</div>

				<div className="hero-art">
					<div className="hero-ring">
						<img
							src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"
							alt="Secangkir kopi hangat"
							data-testid="hero-coffee-image"
						/>
					</div>

					<span className="stamp">
						A1
						<br />
						<small>COFFEE & EATS</small>
					</span>
				</div>
			</section>

			<section className="home-note" data-testid="home-note">
				<span>01</span>

				<div>
					<h2>
						Diracik pelan,
						<br />
						dinikmati sepenuh hati.
					</h2>

					<p>
						Temukan kopi, minuman segar, dan hidangan sederhana yang dibuat
						untuk menemani harimu.
					</p>
				</div>
			</section>
		</main>
	);
}

function Skeletons() {
	return (
		<div className="menu-grid" data-testid="menu-loading-skeleton">
			{[1, 2, 3, 4].map((item) => (
				<div className="skeleton-card" key={item}>
					<div className="skeleton-image" />
					<div className="skeleton-line" />
					<div className="skeleton-line short" />
				</div>
			))}
		</div>
	);
}

function MenuCard({ item, onSelect }) {
	return (
		<motion.button
			layout
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			className={`menu-card ${!item.is_available ? "sold-out" : ""}`}
			onClick={() => onSelect(item)}
			data-testid={`menu-card-${item.id}`}
		>
			<div className="card-image">
				<img
					src={item.image_url || FALLBACK_IMAGE}
					alt={item.name}
					loading="lazy"
				/>

				<div className="card-category">
					{item.category?.name}
				</div>

				{!item.is_available && (
					<div className="sold-overlay">
						<span>Habis</span>
					</div>
				)}
			</div>

			<div className="card-content">
				<div>
					<h3>{item.name}</h3>
					<p>{item.description}</p>
				</div>

				<div className="card-bottom">
					<strong>{money(item.price)}</strong>

					<span
						className={
							item.is_available ? "available" : "unavailable"
						}
					>
						{item.is_available ? "Tersedia" : "Habis"}
					</span>
				</div>
			</div>
		</motion.button>
	);
}

function DetailModal({ item, onClose }) {
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	return (
		<AnimatePresence>
			<motion.div
				className="modal-backdrop"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
				data-testid="menu-detail-modal"
			>
				<motion.div
					className="detail-modal"
					initial={{ y: 30, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					onClick={(event) => event.stopPropagation()}
				>
					<button
						className="close-button"
						onClick={onClose}
						aria-label="Tutup detail"
						data-testid="close-detail-button"
					>
						<X size={20} />
					</button>

					<img
						src={item.image_url || FALLBACK_IMAGE}
						alt={item.name}
						data-testid="detail-image"
					/>

					<div className="detail-body">
						<span className="eyebrow">{item.category?.name}</span>

						<h2 data-testid="detail-name">{item.name}</h2>

						<p data-testid="detail-description">
							{item.long_description || item.description}
						</p>

						<div className="detail-price">
							<strong data-testid="detail-price">
								{money(item.price)}
							</strong>

							<span
								className={
									item.is_available ? "available" : "unavailable"
								}
								data-testid="detail-status"
							>
								{item.is_available ? "Tersedia" : "Habis"}
							</span>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

function MenuPage({ categories, menus, loading }) {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("Semua");
	const [sort, setSort] = useState("default");
	const [selected, setSelected] = useState(null);

	const shown = useMemo(() => {
		let list = menus.filter((menu) => {
			const matchesCategory =
				category === "Semua" ||
				menu.category?.name === category;

			const searchableText =
				`${menu.name} ${menu.description}`.toLowerCase();

			const matchesSearch = searchableText.includes(
				query.toLowerCase()
			);

			return matchesCategory && matchesSearch;
		});

		if (sort === "low") {
			list.sort((a, b) => a.price - b.price);
		}

		if (sort === "high") {
			list.sort((a, b) => b.price - a.price);
		}

		return list;
	}, [menus, category, query, sort]);

	return (
		<main className="menu-page">
			<div className="menu-heading">
				<div>
					<div className="eyebrow">MENU HARI INI</div>

					<h1>
						Pilih teman
						<br />
						<em>untuk harimu.</em>
					</h1>
				</div>

				<p className="menu-intro">
					Dari seduhan klasik hingga hidangan kecil, semua dibuat segar
					untukmu.
				</p>
			</div>

			<div className="menu-toolbar">
				<label className="search-box">
					<Search size={18} />

					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Cari menu..."
						aria-label="Cari menu"
						data-testid="menu-search-input"
					/>
				</label>

				<div
					className="category-list"
					data-testid="category-filter-list"
				>
					<button
						className={category === "Semua" ? "active" : ""}
						onClick={() => setCategory("Semua")}
						data-testid="category-filter-all"
					>
						Semua
					</button>

					{categories.map((item) => (
						<button
							key={item.id}
							className={category === item.name ? "active" : ""}
							onClick={() => setCategory(item.name)}
							data-testid={`category-filter-${item.name
								.toLowerCase()
								.replaceAll(" ", "-")}`}
						>
							{item.name}
						</button>
					))}
				</div>

				<label className="sort-box">
					<span>Urutkan</span>

					<select
						value={sort}
						onChange={(event) => setSort(event.target.value)}
						data-testid="price-sort-select"
					>
						<option value="default">Pilihan kami</option>
						<option value="low">Harga terendah</option>
						<option value="high">Harga tertinggi</option>
					</select>

					<ChevronDown size={15} />
				</label>
			</div>

			{loading ? (
				<Skeletons />
			) : shown.length ? (
				<div className="menu-grid" data-testid="menu-grid">
					{shown.map((item) => (
						<MenuCard
							key={item.id}
							item={item}
							onSelect={setSelected}
						/>
					))}
				</div>
			) : (
				<div className="empty-state" data-testid="empty-menu-state">
					Tidak ada menu yang cocok. Coba kata kunci lain.
				</div>
			)}

			{selected && (
				<DetailModal
					item={selected}
					onClose={() => setSelected(null)}
				/>
			)}
		</main>
	);
}

function App() {
	const [dark, setDark] = useState(
		() => localStorage.getItem("a1-theme") === "dark"
	);

	const shop = useShopData();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
		localStorage.setItem("a1-theme", dark ? "dark" : "light");
	}, [dark]);

	return (
		<BrowserRouter>
			<div className="app-shell">
				<Header dark={dark} setDark={setDark} />

				<Routes>
					<Route
						path="/"
						element={<Home settings={shop.settings} />}
					/>

					<Route
						path="/menu"
						element={
							<MenuPage
								categories={shop.categories}
								menus={shop.menus}
								loading={shop.loading}
							/>
						}
					/>
				</Routes>

				<Footer settings={shop.settings} />
			</div>
		</BrowserRouter>
	);
}

export default App;
