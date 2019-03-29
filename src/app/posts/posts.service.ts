import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// this is another way of provide a service on the whole app, instead of in the app.module
@Injectable({providedIn: 'root'})
export class PostsService {
  // add private so you cannot edit from the outside of this service
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  // retrieve posts
  getPosts() {
    // I don't want to return the original array
    return [...this.posts];
  }

  // listen to the subject (after we add any new post with addPost method)
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    const newPost: Post = post;
    this.posts.push(newPost);
    this.postsUpdated.next([...this.posts]);  // how Subjects emit in this case a new copy of my posts after I updated them
  }
}
