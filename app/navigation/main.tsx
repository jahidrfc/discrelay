"use client";
import { useState } from "react";
import { useImmer } from "use-immer";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSocket } from "@/hooks/socket";
import MessageList from "@/components/messages";
import { type ActiveModel, type DataModel } from "@/types";

export function Main() {
  const [activeId, setActiveId] = useState<ActiveModel>();
  const [data, setData] = useImmer<DataModel>({});
  useSocket(setData);

  return (
    <SidebarProvider>
      <AppSidebar data={data} activeId={activeId} setActiveId={setActiveId} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {activeId?.guildId ? data[activeId.guildId]?.meta.name : "Select a server"}
                </BreadcrumbPage>
              </BreadcrumbItem>

              {activeId?.guildId && activeId.channelId && (
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink>
                      {data[activeId.guildId]?.channels[activeId.channelId]?.meta.category}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      {data[activeId.guildId]?.channels[activeId.channelId]?.meta.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {activeId.threadId && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {
                            data[activeId.guildId]?.channels[activeId.channelId]?.messages.find(
                              (msg) => msg.thread?.id === activeId.threadId
                            )?.thread?.name
                          }
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              )}
            </Breadcrumb>

          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {activeId?.guildId && activeId.channelId ? (
            <MessageList
              messages={
                activeId.threadId
                  ? 
                  data[activeId.guildId]?.channels[activeId.channelId]?.messages.filter(
                    (msg) => msg.thread?.id === activeId.threadId
                  ) || []
                  :
                  data[activeId.guildId]?.channels[activeId.channelId]?.messages.filter(
                    (msg) => !msg.thread?.id
                  ) || []
              }
            />
          ) : (
            <div className="text-gray-400">Select a channel to view messages</div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Main;
