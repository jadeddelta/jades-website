import Link from "next/link";

export default function Navbar() {
    return (
        <header className="flex justify-center items-center w-full h-[7.5vh] z-50 sticky top-[6px]">
            <nav className="border-2 border-emerald-500 bg-gray-950 rounded-lg px-4 py-2">
                <Link className="hover:text-blue-400" href="#main">home</Link>{` // `}
                <Link className="hover:text-blue-400" href="#about">about</Link>{` // `}
                <Link className="hover:text-blue-400" href="#projects">projects</Link>{` // `} 
                <Link className="hover:text-blue-400" href="#work">work</Link>
            </nav>
        </header>
    );
}