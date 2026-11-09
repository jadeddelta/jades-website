/**
 * year site was built, inlined by next.config.ts
 */
const BUILD_YEAR = process.env.BUILD_YEAR;

export default function Footer() {
    return (
        <footer className="w-full px-[10%] py-10 font-mono text-[12px] tracking-[0.1em] text-footer">
            built by jade &middot; {BUILD_YEAR}
        </footer>
    );
}
