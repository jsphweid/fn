import { v4 } from "uuid";

export namespace Utils {
  export const getUniqueId = (): string => v4();
}
