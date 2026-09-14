export default function Footer() {
  return (
    <footer className="w-full px-[10%] py-10 font-mono text-[12px] tracking-[0.1em] text-footer">
      built by jade &middot; {new Date().getFullYear()}
    </footer>
  );
}
