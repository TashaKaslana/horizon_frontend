import HomeSidebar from "@/app/home/(sidebar)/HomeSidebar";
import {ReactNode} from "react";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

const Layout = ({children} : {children: ReactNode}) => {
  return (
      <SidebarProvider>
          <HomeSidebar/>
          <main className={'w-full relative'}>
              <span className={'absolute z-10'}>
                  <SidebarTrigger/>
              </span>
              {children}
          </main>
      </SidebarProvider>
  )
}

export default Layout