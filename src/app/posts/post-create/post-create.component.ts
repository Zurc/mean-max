import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

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
  // create a form programatically
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  constructor(
    private postsService: PostsService,
    // ActivatedRoute allow us to read the dynamic part of the url (postId)
    private route: ActivatedRoute) {}

  ngOnInit() {
    // initialize the form
    this.form = new FormGroup({
      // create a form control
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      // I don't synchronize this with the HTML (I'll manage all from typescript)
      // I don't want to display anything on start
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })
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
          this.post = {
            id: postData._id,
            title: postData.title,
						content: postData.content,
						imagePath: null
          };
          // setValue: override your initial values if you have values on a post
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content
          })
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // passing the event object of that element we have access to all its properties
  onImagePicked(event: Event) {
    // type convertion: tell Typescript event.target is an input
    // which has files property
    // (files is an array of files (object) but we are only selecting one, the first one)
    const file = (event.target as HTMLInputElement).files[0];
    // we want to store this in a form control here
    // patchValue allows you to target a single control
    // we pass an objectwith: the name of the control and the value (file object)
    this.form.patchValue({ image: file });
    // inform angular the value has changed
    this.form.get('image').updateValueAndValidity();
    // convert my image to a data URL (readable by the img HTML tag)
    // to create the URL we'll use a feature provided by JS called the file reader
    const reader = new FileReader();
    // what we do once it's done loading (async) the file
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    // show spinner after created...
    // no need to reset to false because we're going out of the page
    this.isLoading = true;
    // const post: Post = { id: null, title: form.value.title, content: form.value.content };
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content);
    }
    this.form.reset();
  }
}
