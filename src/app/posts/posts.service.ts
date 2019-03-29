import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// this is another way of provide a service on the whole app, instead of in the app.module
@Injectable({providedIn: 'root'})
export class PostsService {
  // add private so you cannot edit from the outside of this service
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  // retrieve posts from the backend
  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // listen to the subject (after we add any new post with addPost method)
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    const newPost: Post = post;
    this.http
      .post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(newPost);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
