import { Component, input, output } from '@angular/core';
import { RolesAddEditComponent } from '../roles-add-edit/roles-add-edit.component';
import { angularModule } from '@app/core/modules';

@Component({
  selector: 'roles-sidebar-wrapper',
  standalone: true,
  imports: [RolesAddEditComponent, angularModule],
  templateUrl: './roles-sidebar-wrapper.component.html',
  styleUrl: './roles-sidebar-wrapper.component.scss',
})
export class RolesSidebarWrapperComponent {
  public pageType = input<string>();
  public selectedRole = input<IRoleList | null>();
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  onCloseSidebar(event: Event) {
    this.closeSidebar.emit(event);
  }
}
