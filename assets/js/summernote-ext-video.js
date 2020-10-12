(function(factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function($) {

    /**
     * @class plugin.videoPlugin
     *
     * Initialize in the toolbar like so:
     *   toolbar: ['insert', ['videoPlugin']]
     *
     * Getweb Custom video trim Plugin for summernote
     */

    $.extend($.summernote.options, {
        videoPlugin: {
            icon: '<i class="note-icon-video"/>',
            tooltip: 'Insert Video',
            insertToBodySelector: '',
            ffmpegScriptPath: ''
            
        }
    });

    $.extend($.summernote.plugins, {
           'videoPlugin': function (context) {
               var self      = this,

                   // ui has renders to build ui elements
                   // for e.g. you can create a button with 'ui.button'
                   ui        = $.summernote.ui,
                   $note     = context.layoutInfo.note,

                   // contentEditable element
                   $editor   = context.layoutInfo.editor,
                   $editable = context.layoutInfo.editable,
                   $toolbar  = context.layoutInfo.toolbar,

                   // options holds the Options Information from Summernote and what we extended above.
                   options   = context.options,

                   // lang holds the Language Information from Summernote and what we extended above.
                   lang      = options.langInfo;
                   let fileInput;
                   let startTimeEl;
                   let endTimeEl;
                   let trimBtn = document.getElementById('trim');
                   let currentFile;
                   let currentFileName;
                   let inputVideo;
                   let videoholder = document.getElementById('vholder');
                   let vidProp = {};
                   let modalFile = '';


               context.memo('button.videoPlugin', function () {

                   // Here we create a button
                   var button = ui.button({

                       // icon for button
                       contents: options.videoPlugin.icon,

                       // tooltip for button
                       tooltip: options.videoPlugin.tooltip,

                       // Keep button from being disabled when in CodeView
                       codeviewKeepButton: true,

                       click:function (e) {
                           context.invoke('videoPlugin.show');

                       }
                   });
                   return button.render();
               });

               this.initialize = function() {
                   var $container = $('body') ;

                   // Build the Body HTML of the Dialog.
                   var body = '';
                   // Build the Footer HTML of the Dialog.
                   var footer = ''
               }

               this.$dialog = ui.dialog({

                   // Set the title for the Dialog. Note: We don't need to build the markup for the Modal
                   // Header, we only need to set the Title.
                   title: "Insert Video",

                   // Set the Body of the Dialog.
                   body: '<div class="loader" style="display: none;"><div class="fa-3x"><i class="fas fa-circle-notch fa-spin"></i></div><br><h3>Please wait video in proccesing</h3></div> ' +
                         '<div class="video-holder" id="vholder" style="min-height: 300px;width:100%;background: #000"></div>',

                   // Set the Footer of the Dialog.
                   //footer: '<input type="button" href="#" class="btn btn-primary note-btn note-btn-primary note-image-btn" value="Insert Image">'
                   footer: '<label style="margin-right: 3px">Start Time</label><input style="padding: 5px;" type="text" id="startTime" value="00:00:00">\n' +
                       '<label style="margin-right: 3px">End Time</label><input style="padding: 5px;" type="text" id="endTime" value="00:00:00">' +
                       '        <div class="btn-group">\n' +
                       '          <button disabled type="button" class="btn btn-primary" data-method="trim"  id="trim">\n' +
                       '            <span class="docs-tooltip" data-toggle="tooltip" title="Trim">\n' +
                       '              <span class="fa fa-cut"></span>\n' +
                       '            </span>\n' +
                       '          </button>\n' +
                       '        </div>\n'+
                       '<div class="btn-group">' +
                       '<label class="btn btn-primary btn-upload" for="inputImage" title="Upload image file">' +
                       '<input type="file" class="sr-only" id="inputImage" name="file" accept="video/*">'+
                       '<span class="docs-tooltip" data-toggle="tooltip" title="Upload image file">' +
                       '<span class="fa fa-upload"></span>'+
                       '</span>'+
                       '</label>'+
                       '</div>'

                   // This adds the Modal to the DOM.
               }).render();

               this.destroy = function () {
                   ui.hideDialog(this.$dialog);
                   this.$dialog.remove();
                   //self.destoryVideo();
               }

               this.show = function () {
                   var $img = $($editable.data('target'));
                   var editorInfo = {

                   };
                   this.showvideoPluginDialog(editorInfo).then(function (editorInfo) {
                       ui.hideDialog(self.$dialog);
                       $note.val(context.invoke('code'));
                       $note.change();
                   });
               };
               this.showvideoPluginDialog = function(editorInfo) {
                   return $.Deferred(function (deferred) {
                       ui.onDialogShown(self.$dialog, function () {
                           context.triggerEvent('dialog.shown');
                       });
                       ui.onDialogHidden(self.$dialog, function () {
                           self.destoryVideo();
                           self.destoryVideoInit();
                       });
                       self.$dialog.modal({backdrop: 'static', keyboard: false});
                       //let video = RP("tbk");
                       //self.videoInit();
                       $('#inputImage').on('change',function (e) {
                           currentFile = e.target.files[0];
                           currentFileName = e.target.files[0].name;
                           modalFile = currentFile.name.split('.').slice(0, -1).join('.').replace(/\s+/g, '');
                           self.prepare(currentFile)
                           //console.log(currentFile);
                           inputVideo = document.getElementById('tbk')
                           inputVideo.onloadeddata = function(){
                               self.videoInit();
                           }

                       });
                       $('body').on('click', '.del-video', function () {
                           var video_id = $(this).attr('id');
                           $(this).closest('.video_wrap').remove();
                           $('.' + video_id).remove();
                       });
                       $('body').on('click', '.fa-play', function () {
                           // var modalo = $(this).attr("id");
                           // console.log(modalo);
                           $('#trimmModal').modal();
                       });

                   });

               };
               this.prepare = function (file) {
                   let urlToVideo = URL.createObjectURL(file);
                   videoholder = document.getElementById('vholder');
                   videoholder.innerHTML = '<video width="500" height="300" id="tbk" controls style="display:none;">\n' +
                       '<source src="'+ urlToVideo +'" type="video/mp4" />\n' +
                       'Your browser does not support HTML5 video.\n' +
                       '</video>';

                   document.body.classList.add('picking');

                   //inputVideo = document.getElementById('tbk');
                   // inputVideo.onloadedmetadata = function() {
                   //     endTimeEl.value = secondsToTimeCode(inputVideo.duration);
                   // };
                   // inputVideo.ondurationchange = function() {
                   //     endTimeEl.value = secondsToTimeCode(inputVideo.duration);
                   // };
                   console.log('before');

                   //inputVideo.src = urlToVideo;
                   //console.log(inputVideo)
               }
               this.destoryVideo = function () {
                  if(currentFile) {
                      videoholder.innerHTML = '';
                      currentFile = '';
                      $('#inputImage').val("");
                      document.getElementById('trim').disabled = true;
                      document.getElementById('startTime').value = "";
                      document.getElementById('endTime').value = "";
                  }
               }
               this.destoryVideoInit = function () {
                   $("#tbk").hide();
                   $("#tbk").removeClass("video-dom");

                   vidProp = {
                       start: 0.00,
                       end: 0.00,
                       mode: 'off'
                   };
                   var vid_range_option = $('#vid-range').slider('option');
                   var vrange_option = $('#v-range').slider('option');
                   $('#vid-range').slider("values", [vid_range_option.min,vid_range_option.max]);
                   $('#v-range').slider("values", [vrange_option.min,vrange_option.max]);
               }

               this.videoInit = function () {
                   document.getElementById('trim').disabled = false;

                   $("#tbk").wrap(`<div id="video-box">
                                    <div class="ctrl-box">
                                        <div class="controler">
                                            <i class="fas fa-play-circle" id="playVid"></i>
                                            <div class="dragger-case">
                                                <div id="vid-range"><div id="v-range"></div></div>
                                                
                                            </div>
                                            <div>
                                                <i class="fas fa-volume-up" id="ctrl-sound"></i>
                                                <div id="vid-volume" style="display:none;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                    
                                `)
                   $("#tbk").addClass("video-dom");
                   vid = document.getElementById("tbk");

                   vid.controls = false;
                   vid.volume = .4;

                   vid.ontimeupdate = function () {
                       // if (vidProp.start !== 0) {
                       if (vidPos() >= vidProp.end) {
                           vid.pause();
                           vid.currentTime = vidProp.end;
                           $('#playVid').removeClass('fa-pause-circle');
                           $('#playVid').addClass('fa-play-circle');
                           vidProp.mode = 'off';

                           $('#v-range').slider("value", vidProp.start);
                           /*  $('#playVid').addClass('fa-play-circle');
                             $('#playVid').removeClass('fa-pause-circle');
                             */
                       }
                       $('#v-range').slider("value", vid.currentTime)
                       /*  if (vidPos() <= vidProp.start) {
                            vid.currentTime = vidProp.start;
                           $('#playVid').removeClass('fa-play-circle');
                            $('#playVid').addClass('fa-pause-circle');

                        }*/
                       // }
                   };

                   function vidPos() {
                       return vid.currentTime;
                   }

                   $('#ctrl-sound').click(() => {
                       $('#vid-volume').toggle()
                   })

                   $('#trim').click(function () {
                       startTimeEl = document.getElementById('startTime').value;
                       endTimeEl = document.getElementById('endTime').value;
                       start(currentFile,startTimeEl,endTimeEl);
                   })
                   $('#playVid').click(() => {
                       if (vidProp.mode === 'off') {
                           vidProp.mode = 'on';
                           $('#v-range').slider("value", vidProp.start);
                           vid.currentTime = vidProp.start
                           vid.play()
                           $('#playVid').toggleClass('fa-play-circle fa-pause-circle');
                       } else if (vidProp.mode === 'on') {
                           vid.pause();
                           vidProp.mode = 'pause'
                           $('#playVid').toggleClass('fa-play-circle fa-pause-circle');
                       } else if (vidProp.mode === 'pause') {
                           vid.play();
                           vidProp.mode = 'on'
                           $('#playVid').toggleClass('fa-play-circle fa-pause-circle');
                       }
                   });


                       $("#tbk").show()
                       vidProp = {
                           start: 0.01,
                           end: vid.duration,
                           mode: 'off'
                       };



                       $('#vid-range').slider({
                           orientation: 'horizontal',
                           range: true,
                           min: 0,
                           max: vid.duration,
                           step: 0.01,
                           values: [0, vid.duration],
                           slide: function (event, ui) {
                               $("#RPvidStart").val(ui.values[0])
                               $("#RPvidEnd").val(ui.values[1])

                               vidProp.start = ui.values[0];
                               vidProp.end = ui.values[1];
                               if (ui.handleIndex === 0) {
                                   vid.currentTime = ui.values[0];
                               }else if(ui.handleIndex === 1) {
                                   vid.currentTime = ui.values[1];
                               }
                               $('#v-range').slider("option", {
                                   max: vidProp.end,
                                   min: vidProp.start,
                               })

                           },
                           change: function (event, ui) {
                               vid.pause();
                               vid.currentTime = ui.value;
                               $('#startTime').val(toHHMMSS(vidProp.start));
                               $('#endTime').val(toHHMMSS(vidProp.end));
                               $('#playVid').removeClass('fa-pause-circle');
                               $('#playVid').addClass('fa-play-circle');
                               vidProp.mode = 'off'
                               $('#v-range').slider("option", {
                                   max: vidProp.end,
                                   min: vidProp.start,
                               })
                               /* if (ui.handleIndex === 0) {
                                    vid.play();
                                }
                                */
                           },
                       });




                       $('#v-range').slider({
                           orientation: 'horizontal',
                           value: vidProp.start,
                           max: vidProp.end,
                           min: vidProp.start,
                           step: 0.01,
                           slide: function (event, ui) {
                               vidProp.mode = 'pause';
                               vid.currentTime = ui.value;
                           }
                       })
                       $('#v-range').appendTo($('#vid-range .ui-slider-range.ui-corner-all.ui-widget-header'))
                       $('#vid-volume').slider({
                           orientation: 'vertical',
                           min: 0,
                           max: 1,
                           step: 0.01,
                           value: .4,
                           slide: function (event, ui) {
                               vid.volume = ui.value;
                           },
                           change: function (event, ui) {

                           },
                       });

                       const toHHMMSS = function(val) {
                           var sec_num = parseInt(val, 10);
                           var hours   = Math.floor(sec_num / 3600);
                           var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                           var seconds = sec_num - (hours * 3600) - (minutes * 60);

                           if (hours   < 10) {hours   = "0"+hours;}
                           if (minutes < 10) {minutes = "0"+minutes;}
                           if (seconds < 10) {seconds = "0"+seconds;}

                           // only mm:ss
                           if (hours == "00"){
                               var time = minutes+':'+seconds;
                           }
                           else{
                               var time = hours+':'+minutes+':'+seconds;
                           }

                           return time;
                       }

                       const start = function(file, startTime, endTime) {

                           const ffmpeg = new ffmpegEncoder();
                           ffmpeg.reset();
                           document.body.classList.add('working');
                           $('.loader').show();
                           document.getElementById('trim').disabled = true;
                           ffmpeg.videoReady.then(function(data) {
                               // the video has completed processing
                               document.body.classList.remove('working');
                               var buffer = data.MEMFS[0].data;
                               $('.loader').hide();
                               download(new Blob( [ buffer ], { type: "video/mp4" } ));
                           });

                           //const logEl = document.getElementById('log');
                           //logEl.innerText = '';

                           /*ffmpeg.stderr = function(msg) {
                               logEl.innerText += msg.data + "\n";
                               logEl.scrollTop = logEl.scrollHeight;
                           };*/

                           ffmpeg.ready.then(function() {
                               //the framework is ready
                               console.log('getting ready');
                               return loadFile(file);
                           })
                               .then(function(arrayBuffer) {
                                   // We have the file that the user has input, now load the
                                   console.log('ready to run');
                                   ffmpeg.run([
                                           {name: file.name, data: arrayBuffer}
                                       ],
                                       startTime,
                                       endTime
                                   );
                               });
                       };

                       let ffmpegEncoder = function(encoderArgs, files) {
                           let stdout = "";
                           let stderr = "";
                           let worker = new Worker("." + options.videoPlugin.ffmpegScriptPath);
                           
                           let globalResolve;
                           let videoResolve;

                           this.ready = new Promise(function(resolve, reject) {
                               globalResolve = resolve;
                           });

                           this.videoReady = new Promise(function(resolve, reject) {
                               videoResolve = resolve;
                           });

                           this.reset = function() {
                               this.videoReady = new Promise(function(resolve, reject) {
                                   videoResolve = resolve;
                               });
                           }.bind(this);

                           this.run = function(files, startTime, endTime) {

                               let args = ['-i']
                                   .concat((encoderArgs || []))
                                   .concat([files[0].name])
                                   .concat((startTime !== undefined) ? ['-ss', startTime] : [])
                                   .concat(['-c','copy'])
                                   .concat((endTime !== undefined) ? ['-to', endTime] : [])
                                   .concat(['output.mp4']);
                               // let args = ['-i']
                               //     .concat((encoderArgs || []))
                               //     .concat([files[0].name])
                               //     .concat((startTime !== undefined) ? ['-ss', startTime] : [])
                               //     .concat((endTime !== undefined) ? ['-to', endTime] : [])
                               //     .concat(['-c:v','copy','-c:a','copy'])
                               //     .concat(['output.mp4']);

                                console.log(args);

                               var idealheap = 0;
                               if( navigator.userAgent.match(/Android/i)
                                   || navigator.userAgent.match(/webOS/i)
                                   || navigator.userAgent.match(/iPhone/i)
                                   || navigator.userAgent.match(/iPad/i)
                                   || navigator.userAgent.match(/iPod/i)
                                   || navigator.userAgent.match(/BlackBerry/i)
                                   || navigator.userAgent.match(/Windows Phone/i))
                               {
                                   idealheap = 2024;
                               }else{
                                   idealheap = 2024 * 1024 * 1024;
                               }

                               worker.postMessage({
                                   type: "run",
                                   arguments: args,
                                   TOTAL_MEMORY: idealheap,
                                   MEMFS: files
                               });
                           };

                           worker.onmessage = function(e) {
                               var msg = e.data;
                               console.log(msg.type, msg.data)
                               switch (msg.type) {
                                   case "ready":
                                       globalResolve();
                                       break;
                                   case "stdout":
                                       if(this.stderr) this.stderr(msg);
                                       stdout += msg.data + "\n";
                                       break;
                                   case "stderr":
                                       if(this.stderr) this.stderr(msg);
                                       stderr += msg.data + "\n";
                                       break;
                                   case "done":
                                       videoResolve(msg.data);
                                       worker.terminate();
                                       console.log("done");
                                       break;
                                   case "exit":
                                       console.log("Process exited with code " + msg.data);
                                       console.log(stderr);
                                       console.log(stdout);
                                       break;
                               }
                           }.bind(this);
                   };

                   let loadFile = function(file) {
                       return new Promise(function(resolve, reject) {
                           const fileReader = new FileReader();
                           fileReader.onload = function(e) {
                               resolve(this.result);
                           };
                           fileReader.readAsArrayBuffer(file);
                       });
                   };

                       function download(blob) {
                       var url = window.URL.createObjectURL(blob);
                       /*var a = document.createElement('a');
                       a.style.display = 'none';
                       a.href = url;
                       a.download = currentFileName;
                       document.body.appendChild(a);
                       a.click();
                       setTimeout(function() {
                           document.body.removeChild(a);
                           window.URL.revokeObjectURL(url);
                       }, 100);*/
                       var rand = Math.floor((Math.random() * 100) + 1);
                       context.invoke('editor.pasteHTML', '<video class="video_'+ rand +'" width="500" height="300" id="trimmed_video" controls>\n' +
                       '<source src="'+ url +'" type="video/mp4" />\n' +
                       'Your browser does not support HTML5 video.\n' +
                       '</video>');

                       $('.'+options.videoPlugin.insertToBodySelector).
                           append("<div class='video_wrap'>" +
                               "<div class='video-preview'><video src='" + url + "' width='200' height='128'></video>" +
                               "</div>" +
                               "<div class='video-info'><span>"+ currentFile.name +"</span>" +
                               "<a href='"+ url +"' id='download' download='"+ currentFile.name +"'>" +
                                "<i class=\"fa fa-download\" aria-hidden=\"true\"></i></a><a id='video_"+ rand +"' class='del-video' href='#'>" +
                                "<i class='fa fa-trash-alt' aria-hidden='true'></i></a> " +
                                "<i class='fa fa-play' id='trimmModal_ "+ modalFile +"' aria-hidden='true'></i>"+
                                "</div> "+
                               "</div>" +
                               "<div class=\"modal fade docs-cropped\" id=\"trimmModal\" role=\"dialog\" aria-hidden=\"true\" aria-labelledby=\"getCroppedCanvasTitle\" tabindex=\"-1\">\n" +
                               "          <div class=\"modal-dialog\">\n" +
                               "            <div class=\"modal-content\">\n" +
                               "              <div class=\"modal-header\">\n" +
                               "                <h5 class=\"modal-title\" id=\"getCroppedCanvasTitle\">Trimmed video</h5>\n" +
                               "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
                               "                  <span aria-hidden=\"true\">&times;</span>\n" +
                               "                </button>\n" +
                               "              </div>\n" +
                               "              <div class=\"modal-body\">" +
                               "                <video controls src='" + url + "' width='500' height='300'></video>" +
                               "              </div>\n" +
                               "            </div>\n" +
                               "          </div>\n" +
                               "        </div>");
                           self.destroy();

                   }
               }


           }

    });

}));


(function ($) {

    // Detect touch support
    $.support.touch = 'ontouchend' in document;

    // Ignore browsers without touch support
    if (!$.support.touch) {
        return;
    }

    var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        _mouseDestroy = mouseProto._mouseDestroy,
        touchHandled;

    /**
     * Simulate a mouse event based on a corresponding touch event
     * @param {Object} event A touch event
     * @param {String} simulatedType The corresponding mouse event
     */
    function simulateMouseEvent (event, simulatedType) {

        // Ignore multi-touch events
        if (event.originalEvent.touches.length > 1) {
            return;
        }

        event.preventDefault();

        var touch = event.originalEvent.changedTouches[0],
            simulatedEvent = document.createEvent('MouseEvents');

        // Initialize the simulated mouse event using the touch event's coordinates
        simulatedEvent.initMouseEvent(
            simulatedType,    // type
            true,             // bubbles
            true,             // cancelable
            window,           // view
            1,                // detail
            touch.screenX,    // screenX
            touch.screenY,    // screenY
            touch.clientX,    // clientX
            touch.clientY,    // clientY
            false,            // ctrlKey
            false,            // altKey
            false,            // shiftKey
            false,            // metaKey
            0,                // button
            null              // relatedTarget
        );

        // Dispatch the simulated event to the target element
        event.target.dispatchEvent(simulatedEvent);
    }

    /**
     * Handle the jQuery UI widget's touchstart events
     * @param {Object} event The widget element's touchstart event
     */
    mouseProto._touchStart = function (event) {

        var self = this;

        // Ignore the event if another widget is already being handled
        if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
            return;
        }

        // Set the flag to prevent other widgets from inheriting the touch event
        touchHandled = true;

        // Track movement to determine if interaction was a click
        self._touchMoved = false;

        // Simulate the mouseover event
        simulateMouseEvent(event, 'mouseover');

        // Simulate the mousemove event
        simulateMouseEvent(event, 'mousemove');

        // Simulate the mousedown event
        simulateMouseEvent(event, 'mousedown');
    };

    /**
     * Handle the jQuery UI widget's touchmove events
     * @param {Object} event The document's touchmove event
     */
    mouseProto._touchMove = function (event) {

        // Ignore event if not handled
        if (!touchHandled) {
            return;
        }

        // Interaction was not a click
        this._touchMoved = true;

        // Simulate the mousemove event
        simulateMouseEvent(event, 'mousemove');
    };

    /**
     * Handle the jQuery UI widget's touchend events
     * @param {Object} event The document's touchend event
     */
    mouseProto._touchEnd = function (event) {

        // Ignore event if not handled
        if (!touchHandled) {
            return;
        }

        // Simulate the mouseup event
        simulateMouseEvent(event, 'mouseup');

        // Simulate the mouseout event
        simulateMouseEvent(event, 'mouseout');

        // If the touch interaction did not move, it should trigger a click
        if (!this._touchMoved) {

            // Simulate the click event
            simulateMouseEvent(event, 'click');
        }

        // Unset the flag to allow other widgets to inherit the touch event
        touchHandled = false;
    };

    /**
     * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
     * This method extends the widget with bound touch event handlers that
     * translate touch events to mouse events and pass them to the widget's
     * original mouse event handling methods.
     */
    mouseProto._mouseInit = function () {

        var self = this;

        // Delegate the touch handlers to the widget's element
        self.element.bind({
            touchstart: $.proxy(self, '_touchStart'),
            touchmove: $.proxy(self, '_touchMove'),
            touchend: $.proxy(self, '_touchEnd')
        });

        // Call the original $.ui.mouse init method
        _mouseInit.call(self);
    };

    /**
     * Remove the touch event handlers
     */
    mouseProto._mouseDestroy = function () {

        var self = this;

        // Delegate the touch handlers to the widget's element
        self.element.unbind({
            touchstart: $.proxy(self, '_touchStart'),
            touchmove: $.proxy(self, '_touchMove'),
            touchend: $.proxy(self, '_touchEnd')
        });

        // Call the original $.ui.mouse destroy method
        _mouseDestroy.call(self);
    };

})(jQuery);







