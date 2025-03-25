import { PingCommand, AvatarCommand, AboutCommand, PrayCommand } from "./basic.ts"
import { CVM_VMPreview, CVMChatCommand } from "./calubvm.ts";
import { Command } from "./command.ts";

export const commands : Command[] = [
  new PingCommand(),
  new AvatarCommand(),
  new CVM_VMPreview(),
  new AboutCommand(),
  new PrayCommand()
  // does not work vvvvv
  //new CVMChatCommand()
]