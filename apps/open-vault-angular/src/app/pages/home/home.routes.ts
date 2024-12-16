import { Route } from "@angular/router";
import { BooksListComponent } from "./pages/books-list/books-list.component";
import { ManageBooksComponent } from "./pages/manage-books/manage-books.component";

export const HomeRoutes: Route[] = [
    {
        path: '', component: BooksListComponent,
    },
    {
        path: 'manage', component: ManageBooksComponent
    }
]