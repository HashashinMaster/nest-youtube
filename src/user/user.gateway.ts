import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { rm } from "fs/promises";
import { access } from "fs";
import { join } from "path";
@WebSocketGateway()
export class UserGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage("userDisconnect")
  async handleUserDisconnect(@MessageBody("uuid") uuid: string) {
    const folderPath = join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "temp",
      uuid,
    );
    access(folderPath, (error) => {
      if (!error) {
        (async () => {
          await rm(folderPath, { recursive: true });
        })();
      } else {
        console.log("b9i madawonloada walu");
      }
    });
  }
}
