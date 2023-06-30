import Image from "next/image";
import UserAuthentication from "./UserAuthentication";
import MainPage from "./MainPage/page";

export default function Home() {
  return (
    <main>
      <UserAuthentication />
    </main>
  );
}
