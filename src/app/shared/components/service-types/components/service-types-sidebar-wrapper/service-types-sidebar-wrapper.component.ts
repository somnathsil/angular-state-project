import { Component, input, output } from '@angular/core';
import { ServiceTypesAddEditComponent } from '../service-types-add-edit/service-types-add-edit.component';
import { angularModule } from '@app/core/modules';

@Component({
  selector: 'app-service-types-sidebar-wrapper',
  standalone: true,
  imports: [ServiceTypesAddEditComponent, angularModule],
  templateUrl: './service-types-sidebar-wrapper.component.html',
  styleUrl: './service-types-sidebar-wrapper.component.scss',
})
export class ServiceTypesSidebarWrapperComponent {
  public pageType = input<string>();
  public selectedServiceTypes = input<IPolicyList | null>();
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  onCloseSidebar(event: Event) {
    this.closeSidebar.emit(event);
  }
}
