import Image from "next/image";
import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Hero/>

    </div>
  );
}
