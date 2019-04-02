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

  getPosts() {
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
						id: post._id,
						imagePath: post.imagePath
          };
        });
      }))
      .subscribe(transformedPosts=> {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
		return this.http
		.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);

  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
		const postData = new FormData();
		// usit appending files to it
		postData.append("title", title);
		postData.append("content", content);
		postData.append("image", image, title)
		this.http
		// angular http client adapts and send the right headers the data we send
      .post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
				const post:Post = {
					id: responseData.post.id, 
					title, 
					content,
					imagePath: responseData.imagePath
				};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id, title, content, imagePath: null } ;
    this.http.put('http://localhost:3000/api/posts/' + post.id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const odlPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[odlPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
   this.http.delete('http://localhost:3000/api/posts/' + postId)
     .subscribe(() => {
       const updatedPosts = this.posts.filter(post => post.id !== postId);
       this.posts = updatedPosts;
       this.postsUpdated.next([...this.posts]);
     });
  }
}
