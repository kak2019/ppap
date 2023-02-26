import { useState } from "react";


export const useForceUpdate = ():Readonly<[boolean,()=>void]> => {
    const [value, setState] = useState(true);
    return [value,() => setState(!value)];
}

