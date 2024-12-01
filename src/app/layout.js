
export const metadata = {
    applicationName: "PWA App",
    title: {
        default: "My Awesome PWA App",
        template: "%s - PWA App",
    },
    description: "Best PWA app in the world!",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "My Awesome PWA App",
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: "PWA App",
        title: {
            default: "My Awesome PWA App",
            template: "%s - PWA App",
        },
        description: "Best PWA app in the world!",
    },
    twitter: {
        card: "summary",
        title: {
            default: "My Awesome PWA App",
            template: "%s - PWA App",
        },
        description: "Best PWA app in the world!",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}