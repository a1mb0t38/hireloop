

import { Bars, Bell, Envelope, Gear, House, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";

export function DashboardSideBar() {
  const navItems = [
    { icon: House, label: "Home", link: "/dashboard/recruiter" },
    { icon: Magnifier, label: "Search", link: "/search" },
    { icon: Bell, label: "Notifications", link: "/notifications" },
    { icon: Envelope, label: "Messages", link: "/messages" },
    { icon: Person, label: "Profile", link: "/profile" },
    { icon: Gear, label: "Settings", link: "/settings" },
  ];

  const navcontent = <nav className="flex flex-col gap-1">
    {navItems.map((item) => (
      <button
        key={item.label}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
        type="button"
      >
        <item.icon className="size-5 text-muted" />
        <Link href={item.link}>
          {item.label}
        </Link>
      </button>
    ))}
  </nav>

  return (
    <div>
      <aside className="hidden w-64 shrink-0 border-r p-4 lg:block" >
        {navcontent}
      </aside>
      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <Bars />
          Menu
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                {navcontent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </div>
  );
}