"use client";

import Navbar from "./_sections/Navbar";
import Main from "./_sections/Main";
import About from "./_sections/About";
import Projects from "./_sections/Projects";
import Work from "./_sections/Work";
import Footer from "./_sections/Footer";

export default function Home() {
  return (
    // `relative` is load-bearing: the trail will mount as the first child of this
    // element and measures its sections against this element's box.
    <main className="relative flex min-h-screen max-w-full flex-col items-center justify-between overflow-x-clip">
      <Navbar />
      <Main />
      <About />
      <Projects />
      <Work />
      <Footer />
    </main>
  )
}
