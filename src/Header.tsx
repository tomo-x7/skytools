import { Agent } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { OAuthSession as Session } from "@atproto/oauth-client-browser";
import { useEffect, useRef, useState } from "react";
import {
	AppBar,
	Container,
	Toolbar,
	Typography,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Button,
	Tooltip,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Drawer,
} from "@mui/material";
import { Adb as AdbIcon, Menu as MenuIcon, Login, Error as ErrorIcon, AccountCircle } from "@mui/icons-material";
import { LoginOverlay } from "./LoginOverlay";
import { Link, useNavigate } from "react-router-dom";

type comProps = { login: (handle: string) => Promise<never>; logout: () => Promise<void>; pathes: string[] };
export function Header({ agent, login, pathes, logout }: { agent: Agent | null } & comProps) {
	const profile = agent ? useProfile(agent) : null;
	const [mobileOpen, setMobileOpen] = useState(false);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
	const handleCloseUserMenu = () => setAnchorElUser(null);
	const handleLogin = async () => {
		handleCloseUserMenu();
		const handle = await LoginOverlay.call();
		if (handle) login(handle);
	};
	const handleLogout = logout;
	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
			<Typography variant="h6" sx={{ my: 2 }}>
				SKYTOOLS
			</Typography>
			<Divider />
			<List>
				{pathes.map((path) => (
					<ListItem key={path} disablePadding>
						<ListItemButton sx={{ textAlign: "center" }}>
							<ListItemText
								primary={
									<Link to={`/${path}`} style={{ all: "inherit" }}>
										{path}
									</Link>
								}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<>
			{/* main */}
			<AppBar component="nav">
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
					<AdbIcon sx={{ display: "flex", mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						sx={{
							mr: 2,
							display: "flex",
							flexGrow: { xs: 1, sm: 0 },
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						<Link to="/" style={{ all: "inherit" }}>
							SKYTOOLS
						</Link>
					</Typography>
					<Box sx={{ display: { xs: "none", sm: "block" }, flexGrow: 1 }}>
						{pathes.map((path) => (
							<Button key={path} sx={{ color: "#fff" }}>
								<Link to={`/${path}`} style={{ all: "inherit" }}>
									{path}
								</Link>
							</Button>
						))}
					</Box>
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={profile == null ? handleLogin : handleOpenUserMenu} sx={{ p: 0 }}>
								{profile === "error" ? (
									<ErrorIcon color="error" />
								) : (
									<>
										{profile == null ? (
											<Login sx={{ color: "white" }} />
										) : (
											<>
												{profile.avatar ? (
													<Avatar alt="Remy Sharp" src={profile.avatar} />
												) : (
													<AccountCircle />
												)}
											</>
										)}
									</>
								)}
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							<MenuItem onClick={(profile != null && profile !== "error" && handleLogout) || undefined}>
								{profile === "error" && (
									<Typography color="error" sx={{ textAlign: "center" }}>
										error
									</Typography>
								)}
								{profile != null && profile !== "error" && (
									<Typography sx={{ textAlign: "center" }}>signout</Typography>
								)}
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
			{/* for sp */}
			<nav>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
					}}
				>
					{drawer}
				</Drawer>
			</nav>
			<Toolbar />
		</>
	);
}

function useProfile(agent: Agent) {
	const [data, setData] = useState<ProfileViewDetailed | null | "error">(null);
	useEffect(() => {
		const ac = new AbortController();
		agent
			.getProfile({ actor: agent.assertDid }, { signal: ac.signal })
			.then((res) => setData(res.data))
			.catch((e) => {
				if (e instanceof DOMException && e.name === "AbortError") {
				} else {
					console.error(e);
					setData("error");
				}
			});
		return () => ac.abort();
	}, [agent]);
	return data;
}
