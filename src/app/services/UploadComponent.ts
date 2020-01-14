export class UploadComponent {
    public imagePath;
    imgURL: any;//uploaded image url to be displayed
    public message: string;//used to display the error output
    file:File
    preview(files) {
      console.log(files);
      console.log(files.length);
      if (files.length === 0)
        return;
      this.file=files[0];
      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }
   
      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
      }
    }
  }