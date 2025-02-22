import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser";
import { Index } from "./Index.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { LoginOverlay } from "./LoginOverlay.tsx";
import { Agent } from "@atproto/api";
const init = async () => {
	const client = await BrowserOAuthClient.load({
		clientId: "https://skytools.tomo-x.win/client-metadata.json",
		handleResolver: "https://public.api.bsky.app",
	});
	const { session, agent } = await (async (): Promise<{ session?: OAuthSession; agent?: Agent }> => {
		const result: undefined | { session: OAuthSession; state?: string | null } = await client.init();
		if (result != null) {
			const { session, state } = result;
			const agent = new Agent(session);
			return { session, agent };
		}
		const lastDid = localStorage.getItem("did");
		if (lastDid == null) return {};
		try {
			const session = await client.restore(lastDid);
			const agent = new Agent(session);
			localStorage.setItem("did", session.did);
			return { session, agent };
		} catch (e) {
			return {};
		}
	})();
	const login = (handle: string) => client.signIn(handle);
	const logout = async () => {
		await session?.signOut();
		localStorage.removeItem("did");
		location.href = "/";
	};
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<BrowserRouter>
				<CssBaseline />
				<Routes>
					<Route index element={<Index />} />
					<Route path="*" element={<App {...{ agent: agent ?? null, login, logout }} />} />
				</Routes>
				<LoginOverlay.Root />
			</BrowserRouter>
		</StrictMode>,
	);
};
init();
