import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',

})
export class SearchComponent {
  @Input() placeholder = 'Search'
  @Output() queryEmitter = new EventEmitter<string>();

  _: string = ''

  debounceTimer?: ReturnType<typeof setTimeout>

  onInputChange(query: string) {
    clearTimeout(this.debounceTimer)

    this.debounceTimer = setTimeout(() => {
      const sanitizedQuery = query.trim()
      if (sanitizedQuery)
        this.queryEmitter.emit(sanitizedQuery)
    }, 500);
  }

}
