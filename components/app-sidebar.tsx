import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { ActiveModel, DataModel } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import { NavItem } from "@/components/nav-item";

export function AppSidebar({
  data,
  activeId,
  setActiveId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: DataModel,
  activeId: ActiveModel | undefined,
  setActiveId: Dispatch<SetStateAction<ActiveModel | undefined>>;
}) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Servers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                Object.keys(data).map((guildId: string) => (
                  <NavItem key={guildId} item={data[guildId]!} guildId={guildId} activeId={activeId} setActiveId={setActiveId} />
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
