import * as React from "react";
import { ChevronRight, MessageCircle, Hash, MessageSquare } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import type { ActiveModel, GuildModel, ThreadModel } from "@/types";
import type { Dispatch, SetStateAction } from "react";

export function NavItem({
  item,
  guildId,
  activeId,
  setActiveId
}: {
  item: GuildModel,
  guildId: string,
  activeId: ActiveModel | undefined,
  setActiveId: Dispatch<SetStateAction<ActiveModel | undefined>>;
}) {
  if (Object.keys(item.channels).length === 0) {
    return (
      <SidebarMenuButton
        key={guildId}
        isActive={activeId?.selectedId === guildId}
        onClick={() =>
          setActiveId({ guildId, channelId: "", threadId: "", selectedId: guildId })
        }
      >
        {item.meta.url ? <img src={item.meta.url} alt="Logo" /> : <MessageCircle />}
        {item.meta.name}
      </SidebarMenuButton>
    );
  }

  const categories: Record<string, string[]> = {};
  Object.keys(item.channels).forEach((channelId) => {
    const category = item.channels[channelId]?.meta.category || "Uncategorized";
    if (!categories[category]) categories[category] = [];
    categories[category].push(channelId);
  });

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            key={guildId}
            isActive={activeId?.selectedId === guildId}
            onClick={() =>
              setActiveId({ guildId, channelId: "", threadId: "", selectedId: guildId })
            }
          >
            <ChevronRight className="transition-transform" />
            {item.meta.url ? <img src={item.meta.url} alt="Logo" /> : <MessageCircle />}
            {item.meta.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {Object.keys(categories).map((category) => (
              <React.Fragment key={category}>
                {/* Category label */}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {category}
                </div>
                {categories[category]?.map((channelId) => {
                  const channel = item.channels[channelId];
                  
                  // Collect threads from messages
                  const threads: Record<string, ThreadModel> = {};
                  channel?.messages.forEach((msg) => {
                    if (msg.thread?.id) {
                      threads[msg.thread.id] = msg.thread;
                    }
                  });

                  return (
                    <React.Fragment key={channelId}>
                      <SidebarMenuButton
                        key={channelId}
                        isActive={activeId?.selectedId === channelId}
                        onClick={() =>
                          setActiveId({
                            guildId,
                            channelId,
                            threadId: "",
                            selectedId: channelId,
                          })
                        }
                      >
                        <Hash />
                        {channel?.meta.name}
                      </SidebarMenuButton>

                      {/* Render threads nested under channel */}
                      {Object.values(threads).map((thread) => (
                        <div key={thread.id} className="pl-6">
                          <SidebarMenuButton
                            isActive={activeId?.selectedId === thread.id}
                            onClick={() =>
                              setActiveId({
                                guildId,
                                channelId,
                                threadId: thread.id,
                                selectedId: thread.id,
                              })
                            }
                          >
                            <MessageSquare className="w-4 h-4" />
                            {thread.name}
                          </SidebarMenuButton>
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default NavItem;