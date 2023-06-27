import Image from "next/image";
import UserAuthentication from "./UserAuthentication";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserAuthentication />
    </main>
  );
}
