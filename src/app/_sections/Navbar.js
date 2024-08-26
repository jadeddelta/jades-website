import Link from "next/link";

export default function Navbar() {
    return (
        <header className="flex justify-center items-center w-full h-[7.5vh] z-50 sticky top-0">
            <nav className="border-2 border-emerald-500 bg-gray-950 rounded-lg px-4 py-2">
                <Link href="#main">home</Link> {"//"} <Link href="#about">about</Link> {"//"} <Link href="#projects">projects</Link> {"//"} <Link href="#work">work</Link>
            </nav>
        </header>
    );
}