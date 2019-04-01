import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;

  constructor(
    private postsService: PostsService,
    // ActivatedRoute allow us to read the dynamic part of the url (postId)
    private route: ActivatedRoute) {}

  ngOnInit() {
    // check if we have postId or not
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // show spinner when we start fetching...
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          // hide spinner once we got our result
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // show spinner after created...
    // no need to reset to false because we're going out of the page
    this.isLoading = true;
    // const post: Post = { id: null, title: form.value.title, content: form.value.content };
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content);
    }
    form.resetForm();
  }
}
