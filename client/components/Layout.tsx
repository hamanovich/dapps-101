import { NextPage } from "next";
import { PropsWithChildren } from "react";
import Navbar from "./Navbar";

const Layout: NextPage<PropsWithChildren> = ({ children }) => (
  <>
    <Navbar />
    <main className="mx-auto my-8 px-2 container">{children}</main>
  </>
);

export default Layout;
