import { PingCommand, AvatarCommand, AboutCommand } from "./basic.ts"
import { CVM_VMPreview, CVMChatCommand } from "./calubvm.ts";
import { Command } from "./command.ts";

export const commands : Command[] = [
  new PingCommand(),
  new AvatarCommand(),
  new CVM_VMPreview(),
  new AboutCommand()
  // does not work vvvvv
  //new CVMChatCommand()
]