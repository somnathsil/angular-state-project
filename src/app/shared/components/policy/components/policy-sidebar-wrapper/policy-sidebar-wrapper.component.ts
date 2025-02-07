import { Component, input, output } from '@angular/core';
import { PolicyAddEditComponent } from '../policy-add-edit/policy-add-edit.component';
import { angularModule } from '@app/core/modules';

@Component({
  selector: 'app-policy-sidebar-wrapper',
  standalone: true,
  imports: [PolicyAddEditComponent, angularModule],
  templateUrl: './policy-sidebar-wrapper.component.html',
  styleUrl: './policy-sidebar-wrapper.component.scss',
})
export class PolicySidebarWrapperComponent {
  public pageType = input<string>();
  public selectedPolicy = input<IPolicyList | null>();
  closeSidebar = output<Event>({ alias: 'closeSidebar' });

  onCloseSidebar(event: Event) {
    this.closeSidebar.emit(event);
  }
}
