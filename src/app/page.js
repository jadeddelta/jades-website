"use client";

import Navbar from "./_sections/Navbar";
import Main from "./_sections/Main";
import About from "./_sections/About";
import Projects from "./_sections/Projects";
import Work from "./_sections/Work";

export default function Home() {

  return (
    <main className="flex min-h-screen max-w-full flex-col items-center justify-between">
      <Navbar />
      <Main />
      <About />
      <Projects />
      <Work />
    </main>
  )
}
