import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type TFunction =
  | {
      id: string;
      appid: string;
      name: string;
      source: { code: string; compiled: string; uri: any; version: number; hash: any; lang: any };
      desc: string;
      tags: any[];
      websocket: boolean;
      methods: string[];
      createdAt: string;
      updatedAt: string;
      createdBy: string;
      isEdit?: boolean;
      isCurrent?: boolean;
    }
  | undefined;

type State = {
  allFunctionList: TFunction[];
  currentFunction: TFunction | undefined;
  setAllFunctionList: (funcionList: TFunction[]) => void;
  setCurrentFunction: (currentFunction: TFunction) => void;

  functionCodes: { [key: string]: string };
  updateFunctionCode: (current: TFunction, codes: string) => void;
};

const useFunctionStore = create<State>()(
  devtools(
    immer((set) => ({
      allFunctionList: [],

      currentFunction: undefined,

      functionCodes: {},

      setAllFunctionList: (allFunctionList) => {
        set((state) => {
          state.allFunctionList = allFunctionList;
        });
      },

      setCurrentFunction: (currentFunction) => {
        set((state) => {
          state.currentFunction = currentFunction;
          if (currentFunction?.id && !state.functionCodes[currentFunction?.id]) {
            state.functionCodes[currentFunction!.id] = currentFunction!.source.code;
          }
        });
      },

      updateFunctionCode: async (currentFunction, codes) => {
        set((state) => {
          state.functionCodes[currentFunction!.id] = codes;
        });
      },
    })),
  ),
);

export default useFunctionStore;
