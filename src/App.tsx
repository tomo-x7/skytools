import type { Agent } from "@atproto/api";
import { Route, Routes } from "react-router-dom";
import { Header } from "./Header";
import { Top } from "./Top";
import { ClientMetaSchema } from "./clientMetaSchema/Index";

const pages = {
	ClientMetadataSchema: ClientMetaSchema,
} satisfies Record<string, React.FC>;
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
				{Object.entries(pages).map(([path, Com]) => (
					<Route path={path} element={<Com />} key={path} />
				))}
				<Route index element={<Top />} />
				<Route path="*" element={<>not found</>} />
			</Routes>
		</>
	);
}
