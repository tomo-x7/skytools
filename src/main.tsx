import { BrowserOAuthClient, type OAuthSession } from "@atproto/oauth-client-browser";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Agent } from "@atproto/api";
import { CssBaseline } from "@mui/material";
import { LoginOverlay } from "./LoginOverlay.tsx";

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
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<BrowserRouter>
				<CssBaseline />
				<App {...{ agent: agent ?? null, login, logout }} />
				<LoginOverlay.Root />
			</BrowserRouter>
		</StrictMode>,
	);
};
init();
