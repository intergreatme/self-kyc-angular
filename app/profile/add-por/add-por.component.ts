import { Component, ChangeDetectorRef, ElementRef, ViewChild, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-por',
  templateUrl: './add-por.component.html',
  styleUrls: ['./add-por.component.css']
})
export class AddPorComponent implements OnInit {
  name: '';
  url: '';
  avatarImage: any = "assets/img/proof_of_residence.png";

  constructor() {
  }

  ngOnInit() {
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        console.log(event.target.result);
        this.url = event.target.result;
      };
    }
  }
  public delete() {
    this.url = null;
  }

  uploadPersonaImage(e) {
    this.url = e.target.src;
    // Here i need to send the selected image as file because in service call it should be in file format so i cannot send the source name alone.
  }
}
