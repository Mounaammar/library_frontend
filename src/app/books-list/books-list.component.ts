import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Author } from '../services/data/Author';
import { Book } from '../services/data/Book';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { tap, debounce, switchMap } from 'rxjs/operators'
import { Observable, of, interval } from 'rxjs'
import { BookServiceService } from '../book-service.service';
@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit {
 
  index = 8;
  authors: any = [];
  addOrEdit = '';
  book_edit: any;
  closeResult = '';
  emptyAuthor = "";
  addBookForm: any;

  //  for uploading image

  @ViewChild('fileInput')
  el!: ElementRef;
  imageUrl: any = "";
  editFile: boolean = true;
  removeUpload: boolean = false;
  files!: FileList | null;
  // for searching 
  search_book = new FormControl();
  isLoading = false;
  result_list: any;
  listBooks_filter: any = [];
  listBooks: Array<Book> = [];
  errorMsg: any;
  selectedAuth: any;

  constructor(private modalService: NgbModal, public fb: FormBuilder, private cd: ChangeDetectorRef, private service: BookServiceService) { }



  ngOnInit(): void {
    this.service.getAllBooks().subscribe((data) => {
      this.listBooks = data;

      this.listBooks_filter = this.listBooks;
      this.getAuthors();

      this.addBookForm = this.fb.group({
        title_book: ['', Validators.required],
        descr_book: ['', Validators.required],
        selectedAuthor: [null, [Validators.required]],
        file: [null],
        id__book: ['',]
      });
      //  search a book
      this.search_book.valueChanges.pipe(
        tap(() => this.isLoading = true),
        debounce(() => interval(1000)),
        switchMap(value => this.search(value))
      ).subscribe(res => {
        this.result_list = res;
        this.isLoading = false;
        this.listBooks_filter = this.result_list;
      },
        err => {
          console.error(err.error);
        });
    })
  }

  //function for searching a book by author name or title (in real time)
  search(keyword: string): Observable<any> {
    const result_title = this.listBooks.filter(e => e.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
    const result_author = this.listBooks.filter(e => e.author.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
    let result = result_author.concat(result_title);
    result = [...new Set([...result_author, ...result_title])];
    return of(result)
  }


  getAuthors() {
    this.service.getAllAuthors().subscribe((data) => {
      this.authors = data;
    })
  }
  // CRUD operations
  getBook(id: Number) {
    return this.listBooks.find(e => e.id === id);
  }

  addBook(title: String, cover: String, author: Author, descrption: String) {
    let book = new Book(title, cover, author, descrption);
    let authors = [author]
    this.service.saveAuthor(authors).subscribe((data) => {
      this.service.saveBook(book).subscribe((data2) => {
        alert('This book has successfully been added!')
        window.location.reload();
      });
    });

  }

  removeBook(data: any) {
    this.service.suppBook(data.id__book).subscribe((data) => {
      alert("This book has been successfully deleted")
      window.location.reload();
    });
  }

  //when open the modal 
  open(content: any, addOrEdit: string, id_book: Number) {
    if (id_book != 0) {
      this.book_edit = this.getBook(id_book);
      this.addBookForm.patchValue({
        id__book: id_book,
        title_book: this.book_edit.title,
        descr_book: this.book_edit.description
      }); this.imageUrl = this.book_edit.cover;
      this.selectedAuth = this.authors.find((e: { name: any; }) => e.name == this.book_edit.author.name)
    } else {
      this.addBookForm.reset(); this.addBookForm.patchValue({ selectedAuthor: "" }); this.imageUrl = null;
    }
    this.addOrEdit = addOrEdit;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  //when submitting the form to add, update or delete a book
  onClickSubmit(data: any) {
    if (this.imageUrl == null) {
      alert('Please add an image to this book!')
      return false;
    } else {
      let book = this.addBookForm.value;
      let book_value: any;
      if (data.id__book != null) {
        let book_value = new Book(book.title_book, this.imageUrl, book.selectedAuthor, book.descr_book);
        book_value.id = book.id__book;
        this.service.updateBook(book_value).subscribe(
          (data) => {
            alert('This book has successfully been updated!');
            window.location.reload();
          },
          (error) => {
            this.errorMsg = error;
          }
        );
      } else {
        this.addBook(book.title_book, this.imageUrl, book.selectedAuthor, book.descr_book);
      }
      this.modalService.dismissAll();
      return true;
    }
  }

  /*########################## File Upload ########################*/


  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.addBookForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }


}


