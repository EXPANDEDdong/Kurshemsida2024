export type PostData = {
  id: string;
  title: string;
  content: string;
  postedDate: Date;
  user: Pick<UserData, "username" | "permissions">;
  comments: Array<Omit<CommentData, "post">>;
};

export type SinglePostData = {
  id: string;
  title: string;
  content: string;
  postedDate: Date;
  user: Pick<UserData, "username" | "permissions">;
  comments: Array<CommentData>;
};

export type CommentData = {
  id: string;
  content: string;
  postedDate: Date;
  post: Omit<PostData, "comments">;
  user: Pick<UserData, "username" | "permissions">;
};

export type UserData = {
  username: string;
  description: string | null;
  posts: Array<PostData>;
  comments: Array<CommentData>;
  permissions: {
    role: userRole;
  };
};

export type userRole = "user" | "admin";

export type searchType = "Posts" | "Users";

export type PostProps = {
  id: string;
  username: string;
  role: userRole;
  title: string;
  content: string;
  date: Date;
  onFeed: boolean;
  currentUser: string;
  commentCount: number;
};

export type CommentProps = Omit<
  PostProps,
  "title" | "onFeed" | "commentCount"
> & {
  targetId: string;
  onUserPage: boolean;
};

export type UserProps = {
  username: string;
  description: string | null;
  id: string;
  email: string;
  role: userRole;
};
