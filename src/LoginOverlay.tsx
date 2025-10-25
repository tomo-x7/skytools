import { AlternateEmail } from "@mui/icons-material";
import { Box, Button, Dialog, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { createCallable } from "react-call";

type Response = string | null;
export const LoginOverlay = createCallable<void, Response>(({ call }) => {
	const [handle, setHandle] = useState<string>("");
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => setHandle(e.target.value);
	const handleLogin = () => {
		call.end(handle);
	};
	return (
		<Dialog onClose={() => call.end(null)} open={!call.ended}>
			<DialogTitle>Login</DialogTitle>

			<Box sx={{ p: 3, pt: 0 }}>
				<TextField
					variant="standard"
					label="Bluesky handle"
					placeholder="example.bsky.social"
					onInput={handleInput}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<AlternateEmail />
								</InputAdornment>
							),
						},
					}}
					sx={{ pb: 2 }}
				/>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Button variant="contained" onClick={handleLogin} disabled={handle === ""}>
						Login
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
}, 500);
