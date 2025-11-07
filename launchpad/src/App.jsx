import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function Button() {
  const [state, setState] = useState("Click");
  return (
    state === "Click" ? <button onClick={() =>setState("X")} className="w-30 pl-5 pb-5 pt-5 pr-5 transition delay-100 duration-300 ease-in-out hover:-rotate-2">{state}</button> : <button onClick={() =>setState("Click")} className="transition delay-100 duration-1000 rotate-360  text-red-600 w-30 pb-5 pl-5 pt-5 pr-5">{state}</button>
  );
}

function Row() {
  const buttons = [1, 2, 3, 4, 5];
  return (
    <div className="flex justify-center text-white text-3xl font-bold">
      {buttons.map((item, index) => (
         <Button key={index}/>
      ))}
    </div>
  );
}

function ClickingGame() {
  return (
    <div>
      <p className="flex justify-center pb-20 text-white">Clicking around 🎉</p>
      <div className="rounded-xl box-border border-2">
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      </div>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  return (
    <div className="bg-blue-900">
      <div className="flex flex-col items-center min-h-screen justify-center text-white text-4xl font-bold">
        {started ? (
          <ClickingGame />
        ) : (
          <button className="box-border border-3 pl-5 pr-5 pt-5 pb-5 rounded-xl transition delay-100 duration-300 ease-in-out hover:-rotate-2 hover:text-yellow-300"
          onClick={()=>setStarted(true)}>
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}
