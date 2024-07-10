import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-required-field-warning',
  templateUrl: './required-field-warning.component.html',
  styleUrls: ['./required-field-warning.component.css'],
})
export class RequiredFieldWarningComponent {
  @Input() isInput!: boolean;
  @Input() form!: FormGroup;
  @Input() field!: string;

  canValidateRequiredField() {
    return (
      this.form.controls[this.field] &&
      this.form.controls[this.field].invalid &&
      (this.form.controls[this.field].dirty ||
        this.form.controls[this.field].touched)
    );
  }
}
