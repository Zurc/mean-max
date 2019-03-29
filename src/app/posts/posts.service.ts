import { Post } from './post.model';

export class PostsService {
  // add private so you cannot edit from the outside of this service
  private posts: Post[] = [];

  // retrieve posts
  getPosts() {
    // I don't want to return the original array
    return [...this.posts];
  }

  addPost(post: Post) {
    const newPost: Post = post;
    this.posts.push(newPost);
  }
}
