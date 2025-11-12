import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import githubLogo from "./assets/github-mark.png";

function AboutMe() {
  return (
    <button className="text-shadow-xs px-5 py-2 border-1 border-solid rounded-xs transition ease-in-out duration-20 hover:text-orange-800 ">
      Who Am I?
    </button>
  )
}

function Portfolio() {
  const [clicked, setClick] = useState(false);
  return (
    <button onClick={()=>setClick(true)}className="text-shadow-xs px-5 py-2 border-1 border-solid rounded-xs transition ease-in-out duration-20 hover:text-orange-800">
      Portfolio
    {clicked &&
    <div>
    </div>
    }
    </button>
  );
}

function MySkills() {
  const [clicked, setClick] = useState(false);
  return (
    <button onClick={()=>setClick(true)}className="text-shadow-xs px-5 py-2 border-1 border-solid rounded-xs transition ease-in-out duration-20 hover:text-orange-800">
      Skills
    {clicked &&
    <div>
    </div>
    }
    </button>
  );
}

function NavBar() {
  return (
    <nav className="flex text-orange-400 pt-20 gap-10">
      <Portfolio />
      <AboutMe />
      <MySkills />
    </nav>
  );
}

function RecentPushes() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://api.github.com/users/Hienomekaanikko/events/public")
      .then((res) => res.json())
      .then((data) => {
        const pushes = data.filter(event => event.type === "PushEvent");
        setEvents(pushes.slice(0, 5)); // show latest 5 pushes
      });
  }, []);

  return (
    <div className="mt-10">
      <ul className="flex">
        {events.map((event, idx) => (
          <li key={idx} className="text-orange-500 text-xs px-10">
            <strong>{event.repo.name}</strong> {new Date(event.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkBar() {
  return (
    <div className="flex justify-center mt-10 py-10">
      <a
        href="https://github.com/Hienomekaanikko"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={githubLogo}
          alt="GitHub"
          className="w-10 h-10 transition-transform duration-300 hover:scale-110 hover:rotate-20 hover:opacity-100"
        />
      </a>
    </div>
  );
}

export default function App() {
  const [site, setSite] = useState(0);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-100 text-orange-700 text-shadow-2xs text-5xl font-bold">
      Mikko Suokas | Junior Developer
      <NavBar />
      <LinkBar />
      <RecentPushes />
    </div>
  );
}
