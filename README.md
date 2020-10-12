# summernote-video-trim-plugin

A plugin for [Summernote](https://github.com/summernote/summernote/) WYSIWYG editor.

Video toolbar plugin which will open a video from you computer then will trim as your desired start and end time with double slide video time selection

## Dependencies
- [Summernote](https://summernote.org/): Summernote WYSIWYG editor.
- [Bootstrap](http://getbootstrap.com/): `HTML` markup in the code depends on Bootstrap 3's styling.
- [Font Awesome](http://fontawesome.io/): Use some icons for button 


## Installation

### 1. Include `CSS` & `JS` files

Include the following code:
```html
   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
   <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.13.0/css/all.css" crossorigin="anonymous">
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css">
   <link rel="stylesheet" href="assets/css/video-ext-plugin.css">
   <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/flick/jquery-ui.css">
```

and

```html
   <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
   <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
   <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
   <script src="assets/js/summernote-ext-video.js"></script>
```

### 2. Customize Summernote options

Basic customization of the options:

```javascript
$(document).ready(function() {
            $('#summernote').summernote({
                height: 300,
                toolbar:[
                    ['font', ['bold', 'underline', 'clear']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'videoPlugin']],
                    ['view', ['fullscreen', 'codeview', 'help']]
                ],
                videoPlugin: {
                    icon: '<i class="note-icon-video"/>',
                    tooltip: 'Insert Video',
                    insertToBodySelector: 'videocontainer', // Insert video at body
                    ffmpegScriptPath: '/assets/js/ffmpeg-worker-mp4.js' // ffmpeg script location path(mandatory)
                }
            });
});
```
## Demo
https://mdkamrulcse.github.io/summernote-video-trimmer/

## License

This plugin may be freely distributed and is licensed under the MIT license.
