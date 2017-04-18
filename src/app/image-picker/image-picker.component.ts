import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.css']
})
export class ImagePickerComponent implements OnInit {
  @Input() image: string;
  @Input() editable: boolean = true;

  @Output() imageChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  updateImage() {
    this.imageChange.emit(this.image);
  }

  ngOnInit() {
  }

  handleFilePaste(evt) {
		this._processItems(evt.clipboardData.items);
  }

  _processItems(items) {
    if (!items) return;

    for (let item of items) {
       if (item.kind == 'string') {
         item.getAsString(function (s){
           this.setImage(s);
         });
       } else if ((item.kind == 'file') &&
                  (item.type.match('^image/'))) {
         // Drag data item is an image file
         var f = item.getAsFile();
         this.readFile(f);
       }
     }
  }

  handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this._processItems(evt.dataTransfer.items);
  }

  readFile(file) {
    let reader = new FileReader();
    console.log(file);
    reader.onload = ((theFile) => {
      return (e) => {
        this.image = e.target.result;
        this.imageChange.emit(this.image);
      };
    })(file);
    reader.readAsDataURL(file);
  }

  setImage(src) {
    this.image = src;
    this.imageChange.emit(this.image);
  }

  handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }
}
