import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function Button() {
  const [state, setState] = useState("Click");
  return (
    state === "Click" ? <button onClick={() =>setState("Clicked")} className="pt-5 pr-5">{state}</button> : <button onClick={() =>setState("Click")} className="pt-5 pr-5">{state}</button>
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

export default function App() {
  return (
    <div className="bg-blue-900">
      <div className="flex flex-col items-center min-h-screen justify-center text-white text-4xl font-bold">
        <p className="pb-20 text-white">Clicking around 🎉</p>
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
      </div>
    </div>
  );
}
