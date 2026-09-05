import { api } from "./api";
export async function createSession(): Promise<string> {
  return (await api.post("/sessions")).data.id;
}
