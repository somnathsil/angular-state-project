import { Component, output } from '@angular/core';
import { DepartmentAddEditComponent } from '../department-add-edit/department-add-edit.component';
import { angularModule } from '@app/core/modules';

@Component({
  selector: 'department-sidebar-wrapper',
  standalone: true,
  imports: [DepartmentAddEditComponent, angularModule],
  templateUrl: './department-sidebar-wrapper.component.html',
  styleUrl: './department-sidebar-wrapper.component.scss',
})
export class DepartmentSidebarWrapperComponent {
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  onCloseSidebar(event: Event) {
    this.closeSidebar.emit(event);
  }
}
