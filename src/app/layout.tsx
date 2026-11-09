import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import PageTrail from "./_components/layout/PageTrail";
import TopNav from "./_components/layout/TopNav";
import Footer from "./_components/layout/Footer";
import { notes } from "./_content/notes";
import "./globals.css";

/** big jadeddelta, section titles, job titles, and headers */
const bagnard = localFont({
    src: "../../public/fonts/Bagnard.otf",
    variable: "--font-bagnard",
    display: "swap",
    weight: "400",
    fallback: ["Iowan Old Style", "Georgia", "serif"],
});

/** texts */
const chivo = localFont({
    src: "../../public/fonts/Chivo-Variable.woff2",
    variable: "--font-chivo",
    display: "swap",
    weight: "300 700",
    style: "normal",
    fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** navigation, section numbers, dates, tags, footer, sometimes secondary text */
const jetbrainsMono = localFont({
    src: "../../public/fonts/JetBrainsMono-Variable.woff2",
    variable: "--font-jetbrains-mono",
    display: "swap",
    weight: "100 800",
    style: "normal",
    fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

// TODO: remove this when we got notes >:D
const hasNotes = notes.length > 0;
if (hasNotes) {
    console.warn("notes exist now: delete the hasNotes guard in layout.tsx and TopNav's showNotes prop");
}

export const metadata: Metadata = {
    title: {
        default: "jade's code",
        template: "%s // jade's code",
    },
    description: "portfolio for jadeddelta, a budding developer",
};

/**
 * frame that every page shares: note the `relative` inside the first div as the
 * trail measures its sections against it, absolutely positioned at z-index 0,
 * everything else z-10.
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" className={`${bagnard.variable} ${chivo.variable} ${jetbrainsMono.variable}`}>
            <body>
                <div className="relative flex min-h-screen max-w-full flex-col overflow-x-clip">
                    <PageTrail />
                    <div className="relative z-10 flex min-h-screen w-full flex-col items-center">
                        <TopNav showNotes={hasNotes} />
                        {/* grows so a short page still pushes the footer to the bottom */}
                        <main className="flex w-full flex-1 flex-col items-center">{children}</main>
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
