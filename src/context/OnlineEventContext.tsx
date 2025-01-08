import { createContext, useReducer, ReactNode } from "react";

export interface OnlineEventData {
    formSubmittedId: string;
    level: number;
}

type Action = 
    | { type: "SET_FORM_SUBMITTED_ID"; payload: string }
    | { type: "SET_FORM_LEVEL"; payload: number }; 

const initialState: OnlineEventData = {
    formSubmittedId: "",
    level: 0, 
};

function onlineEventReducer(state: OnlineEventData, action: Action): OnlineEventData {
    switch (action.type) {
        case "SET_FORM_SUBMITTED_ID":
            return {
                ...state,
                formSubmittedId: action.payload,
            };
        case "SET_FORM_LEVEL":
            return {
                ...state,
                level: action.payload,
            };
        default:
            return state;
    }
}

interface OnlineEventContextProps {
    onlineEventState: OnlineEventData; 
    onlineEventDispatch: React.Dispatch<Action>; 
}

const OnlineEventContext = createContext<OnlineEventContextProps | undefined>(undefined);

interface OnlineEventProviderProps {
    children: ReactNode;
}

const OnlineEventProvider = ({ children }: OnlineEventProviderProps) => {
    const [onlineEventState, onlineEventDispatch] = useReducer(onlineEventReducer, initialState); 
    return (
        <OnlineEventContext.Provider value={{ onlineEventState, onlineEventDispatch }}> 
            {children}
        </OnlineEventContext.Provider>
    );
};

export { OnlineEventContext, OnlineEventProvider };
