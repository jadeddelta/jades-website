"use client";

import TrianglePath from "./_trail/TrianglePath";
import Navbar from "./_sections/Navbar";
import Main from "./_sections/Main";
import About from "./_sections/About";
import Projects from "./_sections/Projects";
import Work from "./_sections/Work";
import Footer from "./_sections/Footer";

export default function Home() {
  return (
    // `relative` is load-bearing: the trail measures its sections against this box.
    // trail itself is absolutely positioned and behind the website content
    // everything else is given an explicit z-10 index 
    <main className="relative flex min-h-screen max-w-full flex-col overflow-x-clip">
      <TrianglePath />
      <div className="relative z-10 flex w-full flex-col items-center">
        <Navbar />
        <Main />
        <About />
        <Projects />
        <Work />
        <Footer />
      </div>
    </main>
  );
}
