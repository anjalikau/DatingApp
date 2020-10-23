import { Injectable } from "@angular/core";
import { CanDeactivate } from '@angular/router';
import { MemberUpdateComponent } from '../members/member-update/member-update.component';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberUpdateComponent>{
    canDeactivate(component: MemberUpdateComponent) {
        if (component.editForm.dirty) {
            return confirm("Are you sure you want to continue? Any Unsaved changes will be lost");
        }
        return true;
    }
}