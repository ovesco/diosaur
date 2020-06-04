"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTag = (tag, parameterBag) => {
    if (tag !== null && tag.charAt(0) === '@') {
        return parameterBag.get(tag.slice(1));
    }
    else {
        return tag;
    }
};
exports.uniqid = () => {
    return `${Math.floor(Math.random() * 10000)}${Date.now()}`;
};
