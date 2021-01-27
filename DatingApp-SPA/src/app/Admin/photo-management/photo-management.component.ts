import { Component, OnInit } from '@angular/core';
import { error } from 'protractor';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.scss']
})
export class PhotoManagementComponent implements OnInit {
  photos: any;

  constructor(private adminServices: AdminService) { }

  ngOnInit() {
    this.getPhotoForApproval();
  }

  getPhotoForApproval(){
    this.adminServices.getPhotosForApproval().subscribe((photos) => {
      this.photos = photos;
    }, error =>{
      console.log(error);
    });
  }

  approvePhoto(photoId){
    this.adminServices.approvePhoto(photoId).subscribe((photos) => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId),1);
    }, error =>{
      console.log(error);
    });
  }

  rejectPhoto(photoId){
    this.adminServices.rejectPhoto(photoId).subscribe((photos) => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId),1);
    }, error =>{
      console.log(error);
    });
  }

}
