import { ParameterBag } from "./Types.ts";

export const resolveTag = (tag: string | null, parameterBag: ParameterBag) => {
    if (tag !== null && tag.charAt(0) === '@') {
        return parameterBag.get(tag.slice(1));
    } else {
        return tag;
    }
};

export const uniqid = () => {
    return `${Math.floor(Math.random() * 10000)}${Date.now()}`;
};