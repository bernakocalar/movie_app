import { useEffect, useState } from "react";
import FirstLook from "./components/firstLook";
import Profile from "./components/profile";
import Projects from "./components/projects";
import Contact from "./components/contact";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = "";
    };
  }, []);

  return (
    <>
      <a id="top" />
      <FirstLook darkMode={darkMode} setDarkMode={setDarkMode} />
      <section id="about">
        <Profile />
      </section>
      <Projects />
      <Contact />
    </>
  );
}

export default App;
