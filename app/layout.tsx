import UnifiedProvider from "@/components/providers/UnifiedProvider";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <UnifiedProvider>{children}</UnifiedProvider>;
}
