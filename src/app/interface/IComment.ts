export interface DataComments{
  message: string;
  comments: Comment;
}

export interface Comment {
    state:       boolean;
    id:          number;
    description: string;
    user_id:     number;
    movie_id:    number;
}

export interface getComments{
  id: number;
  description: string;
  state: boolean;
  movie_id: number;
  user_id: number;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
