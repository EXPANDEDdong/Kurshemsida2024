import { atom } from "nanostores";

export const commentState = atom(0);

export const mainFeedState = atom(0);

export const initialFeedDidLoad = atom(false);

export const newComment = atom<{
  content: string | null;
  targetId: string | null;
}>({ content: null, targetId: null });
