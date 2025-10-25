export function ClientMetaSchema() {
	const schemaUrl = `${new URL("/oauth-client-metadata-schema.json", location.href).toString()}`;
	return (
		<div>
			schema url:
			<pre>
				{schemaUrl}
				<button type="button" onClick={() => navigator.clipboard.writeText(schemaUrl)}>
					copy
				</button>
			</pre>
		</div>
	);
}
