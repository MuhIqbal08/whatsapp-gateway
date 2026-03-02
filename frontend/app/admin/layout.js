import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayout from "./LayoutClient";

export default async function UserLayout({ children }) {
  // const cookieStore = await cookies();
  // const token = cookieStore.get("access_token");

  // if (!token) {
  //   redirect("/login");
  // }

  return <AdminLayout>{children}</AdminLayout>;
}
