import type { Agent } from "@atproto/api";
import { Route, Routes } from "react-router-dom";
import { Header } from "./Header";

const pages: Record<string, React.ReactElement> = { app1: <>app1</>, app2: <>app2</> };
const pathes = Object.keys(pages);

export function App({
	agent,
	login,
	logout,
}: {
	agent: Agent | null;
	login: (handle: string) => Promise<never>;
	logout: () => Promise<void>;
}) {
	return (
		<>
			<Header {...{ agent, pathes, login, logout }} />

			<Routes>
				{Object.entries(pages).map(([path, elem]) => (
					<Route path={path} element={elem} key={path} />
				))}
				<Route path="/app1/*" element={<>app1</>} />
				<Route path="/app2/*" element={<>app2</>} />
				<Route path="*" element={<>not found</>} />
			</Routes>
		</>
	);
}
