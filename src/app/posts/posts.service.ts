import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// this is another way of provide a service on the whole app, instead of in the app.module
@Injectable({providedIn: 'root'})
export class PostsService {
  // add private so you cannot edit from the outside of this service
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  // retrieve posts from the backend
  getPosts() {
    // http on angular uses observables
    // because the id coming is _id then we use any instead of Post[] on the type
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
      // convert the data coming from the server before using on subscribe
      // observables offer operators (functions) to apply to the data coming from the observable stream
      // pipe allows as to add operators
      .pipe(map((postData) => {
        // convert every post, we use the normal JS map method, return this new array
        return postData.posts.map(post => {
          // transforming response data, return a new JS obj for every element on the array of posts
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transformedPosts=> {
        this.posts = transformedPosts;
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

  deletePost(postId: string) {
   this.http.delete('http://localhost:3000/api/posts/' + postId)
     .subscribe(() => {
       // filter returns a subset (pass a function, if return true that elem will be kept into the array)
       // condition: keep all entries where the id is not equal to the one we want to delete (delete the one that is equal)
       const updatedPosts = this.posts.filter(post => post.id !== postId);
       this.posts = updatedPosts;
       this.postsUpdated.next([...this.posts]);
     });
  }
}
