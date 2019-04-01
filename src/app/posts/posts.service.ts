import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// this is another way of provide a service on the whole app, instead of in the app.module
@Injectable({providedIn: 'root'})
export class PostsService {
  // add private so you cannot edit from the outside of this service
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

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

  getPost(id: string) {
    // get the post from our local array of posts (this way if we refresh the edit page
    // all it's gone, because we start with an empty array)
    // return {...this.posts.find(p => p.id === id)};

    // instead we'll keep our id from the info on the server
    // return the observable we get from our angular http client
    // we will subscribe in the post-create component
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);

  }

  // listen to the subject (after we add any new post with addPost method)
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title  , content};
    this.http
      .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        // id updated. remember post is an object (reference value)
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    // we have all the data to update the post on the frontend
    // in our case we got that covered on the backend (app.js) but this is to show
    // how to update if needed on the frontend
    const post: Post = {id, title, content} ;
    this.http.put('http://localhost:3000/api/posts/' + post.id, post)
    // how to locally update the posts once I've got my success response from the server
    // replace the current version of the post in our posts array with that version
      .subscribe(response => {
        // clone our post array and store it on this updatedPosts constant
        const updatedPosts = [...this.posts];
        // search old version by its id
        // findIndex takes a function that will return if we find the post we are looking for
        // check if the id of the post we are looking in that array is equal to the id of the post we updated
        const odlPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        // if it's equal, then I found the id of the post I want to replace with my new post
        updatedPosts[odlPostIndex] = post;
        // this is the immutable way for updating the old posts
        this.posts = updatedPosts;
        // now tell the app about it (sending this event from our Subject)
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
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
